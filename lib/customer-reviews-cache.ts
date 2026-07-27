import { getValidServerAccessToken } from '@/lib/google-auth-server'
import { STATIC_LOCATIONS, type StaticLocation } from '@/data/locations-static'

export const CUSTOMER_REVIEWS_CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 1 day
export const CUSTOMER_REVIEWS_MAX_RETURN = 50
const FETCH_BATCH_SIZE = 8

export type CustomerReview = {
  reviewId: string
  reviewer: { displayName: string; profilePhotoUrl?: string }
  starRating: number
  comment: string
  createTime: string
  reviewReply?: { comment: string; updateTime: string } | null
  branchName: string
  slug: string
  country: 'AU' | 'NZ' | 'FJ'
}

declare global {
  // eslint-disable-next-line no-var
  var __customerReviewsCache:
    | { reviews: CustomerReview[]; fetchedAt: number }
    | undefined
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

async function fetchBranchReviews(
  loc: StaticLocation,
  accessToken: string
): Promise<CustomerReview[]> {
  const match = loc.id.match(/accounts\/([^/]+)\/locations\/([^/]+)/)
  if (!match) return []
  const [, accountId, locId] = match

  const reviewsUrl = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locId}/reviews`
  try {
    const res = await fetch(reviewsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 },
    })
    if (!res.ok) {
      console.error(`[customer-reviews] ${loc.slug} failed:`, res.status)
      return []
    }
    const data = (await res.json()) as { reviews?: any[] }
    const reviews = data.reviews || []
    const out: CustomerReview[] = []

    for (const r of reviews) {
      const starRating = starToNumber(r.starRating)
      if (starRating < 4) continue
      const comment = typeof r.comment === 'string' ? r.comment.trim() : ''
      if (!comment) continue

      out.push({
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
    return out
  } catch (err) {
    console.error(`[customer-reviews] Error for ${loc.slug}:`, err)
    return []
  }
}

export async function buildCustomerReviewsPool(accessToken: string): Promise<CustomerReview[]> {
  const all: CustomerReview[] = []

  for (let i = 0; i < STATIC_LOCATIONS.length; i += FETCH_BATCH_SIZE) {
    const batch = STATIC_LOCATIONS.slice(i, i + FETCH_BATCH_SIZE)
    const results = await Promise.all(batch.map((loc) => fetchBranchReviews(loc, accessToken)))
    for (const list of results) all.push(...list)
  }

  all.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())

  const seen = new Set<string>()
  return all.filter((r) => {
    if (seen.has(r.reviewId)) return false
    seen.add(r.reviewId)
    return true
  })
}

/** Force rebuild of the customer-reviews pool (ignores TTL). */
export async function warmCustomerReviewsCache(
  accessToken?: string | null
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  const token = accessToken ?? (await getValidServerAccessToken())
  if (!token) return { ok: false, error: 'Server authentication not configured' }

  const reviews = await buildCustomerReviewsPool(token)
  globalThis.__customerReviewsCache = { reviews, fetchedAt: Date.now() }
  return { ok: true, count: reviews.length }
}

export async function getCachedCustomerReviewsPool(): Promise<{
  reviews: CustomerReview[]
  stale: boolean
  error?: string
}> {
  const cached = globalThis.__customerReviewsCache
  if (cached && Date.now() - cached.fetchedAt < CUSTOMER_REVIEWS_CACHE_TTL_MS) {
    return { reviews: cached.reviews, stale: false }
  }

  const accessToken = await getValidServerAccessToken()
  if (!accessToken) {
    if (cached?.reviews?.length) {
      return { reviews: cached.reviews, stale: true, error: 'Using cached reviews; auth not configured.' }
    }
    return {
      reviews: [],
      stale: true,
      error: 'Server authentication not configured. Set GOOGLE_REFRESH_TOKEN.',
    }
  }

  try {
    const reviews = await buildCustomerReviewsPool(accessToken)
    globalThis.__customerReviewsCache = { reviews, fetchedAt: Date.now() }
    return { reviews, stale: false }
  } catch (err) {
    console.error('[customer-reviews] Build failed:', err)
    if (cached?.reviews?.length) {
      return { reviews: cached.reviews, stale: true, error: 'Using cached reviews after fetch error.' }
    }
    return { reviews: [], stale: true, error: 'Failed to fetch reviews.' }
  }
}
