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

async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiryTime: number } | null> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
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
 * Uses env GOOGLE_ACCESS_TOKEN/GOOGLE_TOKEN_EXPIRY if still valid, or in-memory
 * refreshed token; if expired, refreshes using GOOGLE_REFRESH_TOKEN.
 * You only need to authenticate once and set GOOGLE_REFRESH_TOKEN; after that
 * the server auto-refreshes when the access token expires (~1 hour).
 */
export async function getValidServerAccessToken(): Promise<string | null> {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (!refreshToken) {
    console.log('[google-auth-server] No GOOGLE_REFRESH_TOKEN configured')
    return null
  }

  // 1. Use in-memory token if still valid
  const mem = getMemoryToken()
  if (mem) return mem.accessToken

  // 2. Use env token if still valid (and prime memory for next time)
  const envToken = process.env.GOOGLE_ACCESS_TOKEN
  const envExpiry = process.env.GOOGLE_TOKEN_EXPIRY ? parseInt(process.env.GOOGLE_TOKEN_EXPIRY, 10) : 0
  if (envToken && envExpiry > Date.now() + BUFFER_MS) {
    setMemoryToken(envToken, envExpiry)
    return envToken
  }

  // 3. Refresh and use new token
  const refreshed = await refreshAccessToken(refreshToken)
  return refreshed ? refreshed.accessToken : null
}
