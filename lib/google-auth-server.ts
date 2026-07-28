/**
 * Server-side Google OAuth token helper.
 * Uses GOOGLE_REFRESH_TOKEN to get a new access token when the current one expires,
 * so you only need to authenticate once; the server refreshes automatically.
 */

const BUFFER_MS = 5 * 60 * 1000 // consider "expired" 5 minutes before actual expiry

// In-memory cache (per Node process). Survives across API calls; lost on server restart.
declare global {
  // eslint-disable-next-line no-var
  var __googleServerToken: { accessToken: string; expiryTime: number } | undefined
}

function getMemoryToken(): { accessToken: string; expiryTime: number } | null {
  if (typeof globalThis.__googleServerToken !== 'undefined') {
    const t = globalThis.__googleServerToken
    if (t.expiryTime > Date.now() + BUFFER_MS) return t
  }
  return null
}

function setMemoryToken(accessToken: string, expiryTime: number): void {
  globalThis.__googleServerToken = { accessToken, expiryTime }
}

/** Drop cached access token so the next call refreshes from GOOGLE_REFRESH_TOKEN. */
export function invalidateServerAccessToken(): void {
  globalThis.__googleServerToken = undefined
}

async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; expiryTime: number } | null> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    console.error(
      '[google-auth-server] Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET'
    )
    return null
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[google-auth-server] Refresh failed:', res.status, err)
    return null
  }

  const data = (await res.json()) as { access_token: string; expires_in: number }
  const expiryTime = Date.now() + data.expires_in * 1000
  setMemoryToken(data.access_token, expiryTime)
  console.log('[google-auth-server] Token refreshed successfully; valid for ~1 hour.')
  return { accessToken: data.access_token, expiryTime }
}

/**
 * Returns a valid Google access token for server-side API calls (e.g. My Business).
 *
 * Prefers in-memory tokens from a successful refresh. Does NOT reuse a long-lived
 * GOOGLE_ACCESS_TOKEN from env (those go stale while GOOGLE_TOKEN_EXPIRY can still
 * look "valid" and break every Google Business call with 401/404).
 *
 * Keep GOOGLE_REFRESH_TOKEN (+ client id/secret) in env; the server refreshes as needed.
 */
export async function getValidServerAccessToken(options?: {
  forceRefresh?: boolean
}): Promise<string | null> {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (!refreshToken) {
    console.log('[google-auth-server] No GOOGLE_REFRESH_TOKEN configured')
    return null
  }

  if (!options?.forceRefresh) {
    const mem = getMemoryToken()
    if (mem) return mem.accessToken
  } else {
    invalidateServerAccessToken()
  }

  const refreshed = await refreshAccessToken(refreshToken)
  return refreshed ? refreshed.accessToken : null
}
