import { NextRequest, NextResponse } from 'next/server'
import { STATIC_LOCATIONS } from '@/data/locations-static'
import { getValidServerAccessToken } from '@/lib/google-auth-server'
import { fetchAndCacheLocationDetails, getLocationDetailsCache } from '@/lib/location-details-cache'
import type { CustomerReview } from '@/lib/customer-reviews-cache'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const BATCH_SIZE = 5

declare global {
  // eslint-disable-next-line no-var
  var __customerReviewsCache:
    | { reviews: CustomerReview[]; fetchedAt: number }
    | undefined
}

/**
 * Hidden warmup endpoint — visit once to pre-cache all branch details + reviews for ~1 day.
 *
 *   /api/cache-it-all?key=YOUR_CACHE_WARM_SECRET
 *
 * Set CACHE_WARM_SECRET in env. Not linked in the site nav.
 */
function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CACHE_WARM_SECRET
  if (!secret) {
    // Dev-friendly fallback if secret not set yet
    return process.env.NODE_ENV !== 'production'
  }
  const key = request.nextUrl.searchParams.get('key')
  const header = request.headers.get('x-cache-warm-key')
  return key === secret || header === secret
}

function starToNumber(starRating: unknown): number {
  if (typeof starRating === 'number') return starRating
  switch (starRating) {
    case 'FIVE':
      return 5
    case 'FOUR':
      return 4
    case 'THREE':
      return 3
    case 'TWO':
      return 2
    case 'ONE':
      return 1
    default:
      return 0
  }
}

function branchDisplayName(name: string): string {
  return name.replace(/^Lotus Foreign Exchange\s*-\s*/i, '').trim() || name
}

/** Build customer-reviews pool from already-warmed branch detail caches (no extra Google calls). */
function buildReviewsPoolFromBranchCache(): number {
  const cache = getLocationDetailsCache()
  const all: CustomerReview[] = []

  for (const loc of STATIC_LOCATIONS) {
    const entry = cache.get(loc.id)
    const reviews = entry?.data?.reviews
    if (!Array.isArray(reviews)) continue

    for (const r of reviews) {
      const starRating = starToNumber(r.starRating)
      if (starRating < 4) continue
      const comment = typeof r.comment === 'string' ? r.comment.trim() : ''
      if (!comment) continue

      all.push({
        reviewId: r.reviewId || `${loc.slug}-${r.createTime}`,
        reviewer: {
          displayName: r.reviewer?.displayName || 'LotusFX customer',
          profilePhotoUrl: r.reviewer?.profilePhotoUrl || undefined,
        },
        starRating,
        comment,
        createTime: r.createTime || r.updateTime || new Date(0).toISOString(),
        reviewReply: r.reviewReply
          ? {
              comment: r.reviewReply.comment || '',
              updateTime: r.reviewReply.updateTime || '',
            }
          : null,
        branchName: branchDisplayName(loc.name),
        slug: loc.slug,
        country: loc.country,
      })
    }
  }

  all.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  const seen = new Set<string>()
  const deduped = all.filter((r) => {
    if (seen.has(r.reviewId)) return false
    seen.add(r.reviewId)
    return true
  })

  globalThis.__customerReviewsCache = { reviews: deduped, fetchedAt: Date.now() }
  return deduped.length
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const started = Date.now()
  const accessToken = await getValidServerAccessToken()
  if (!accessToken) {
    return NextResponse.json(
      {
        ok: false,
        error: 'GOOGLE_REFRESH_TOKEN not configured — cannot warm Google caches.',
      },
      { status: 503 }
    )
  }

  const branchResults: { slug: string; ok: boolean; error?: string }[] = []
  let branchesOk = 0
  let branchesFailed = 0

  for (let i = 0; i < STATIC_LOCATIONS.length; i += BATCH_SIZE) {
    const batch = STATIC_LOCATIONS.slice(i, i + BATCH_SIZE)
    const settled = await Promise.all(
      batch.map(async (loc) => {
        try {
          const result = await fetchAndCacheLocationDetails(loc.id, accessToken)
          if (result.ok) {
            branchesOk++
            return { slug: loc.slug, ok: true as const }
          }
          branchesFailed++
          return { slug: loc.slug, ok: false as const, error: result.error }
        } catch (err) {
          branchesFailed++
          return {
            slug: loc.slug,
            ok: false as const,
            error: err instanceof Error ? err.message : 'Unknown error',
          }
        }
      })
    )
    branchResults.push(...settled)
  }

  const reviewsCount = buildReviewsPoolFromBranchCache()
  const cache = getLocationDetailsCache()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Cache warmed</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 48px auto; padding: 0 16px; color: #111; }
    h1 { font-size: 1.5rem; }
    .ok { color: #15803d; }
    .bad { color: #b91c1c; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
    ul { font-size: 0.875rem; color: #4b5563; max-height: 240px; overflow: auto; }
  </style>
</head>
<body>
  <h1 class="${branchesFailed === 0 ? 'ok' : 'bad'}">Cache warm complete</h1>
  <p>Branch details cached: <strong>${branchesOk}</strong> ok, <strong>${branchesFailed}</strong> failed (of ${STATIC_LOCATIONS.length}).</p>
  <p>Customer reviews pool: <strong class="ok">${reviewsCount}</strong> reviews cached (from branch data, no extra Google calls).</p>
  <p>In-memory branch cache size: <code>${cache.size}</code></p>
  <p>Took <strong>${((Date.now() - started) / 1000).toFixed(1)}s</strong>. Fresh for ~1 day on this server instance.</p>
  <p style="color:#6b7280;font-size:0.875rem">This page is not linked in the site. Bookmark <code>/api/cache-it-all?key=…</code> for daily warmup.</p>
  ${
    branchesFailed > 0
      ? `<h2>Failures</h2><ul>${branchResults
          .filter((r) => !r.ok)
          .map((r) => `<li>${r.slug}: ${r.error || 'failed'}</li>`)
          .join('')}</ul>`
      : ''
  }
</body>
</html>`

  const wantsJson = request.nextUrl.searchParams.get('format') === 'json'
  if (wantsJson) {
    return NextResponse.json({
      ok: branchesFailed === 0,
      branchesOk,
      branchesFailed,
      branchesTotal: STATIC_LOCATIONS.length,
      reviewsCount,
      cacheSize: cache.size,
      durationMs: Date.now() - started,
      failures: branchResults.filter((r) => !r.ok),
    })
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
