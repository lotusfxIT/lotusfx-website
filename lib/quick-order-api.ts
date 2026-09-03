/**
 * Server-only Quick Order API client for LotusFX 4D REST endpoints.
 * Keys must never be exposed as NEXT_PUBLIC_*.
 */

export type QuickOrderCountry = 'AU' | 'NZ' | 'FJ'

export type QuickOrderApiConfig = {
  country: QuickOrderCountry
  baseUrl: string
  xKey: string
  xClient: string
  timeoutMs: number
}

export type QuickOrderBaseCurrency = {
  code: string
  name: string
  flag: string
}

function normalizeCountry(country?: string | null): QuickOrderCountry {
  const c = String(country || 'AU').toUpperCase()
  if (c === 'NZ' || c === 'FJ' || c === 'AU') return c
  return 'AU'
}

export function getQuickOrderBaseCurrency(country?: string | null): QuickOrderBaseCurrency {
  const c = normalizeCountry(country)
  if (c === 'NZ') return { code: 'NZD', name: 'New Zealand', flag: 'NZ' }
  if (c === 'FJ') return { code: 'FJD', name: 'Fiji', flag: 'FJ' }
  return { code: 'AUD', name: 'Australia', flag: 'AU' }
}

export function getQuickOrderPortalLoginUrl(country?: string | null): string {
  const c = normalizeCountry(country)
  if (c === 'NZ') return 'https://nzcportal.lotusfx.com/customers/login.shtml'
  if (c === 'FJ') return 'https://nzcportal.lotusfx.com/customers/login.shtml'
  return 'https://auportal.lotusfx.com/customers/login.shtml'
}

export function getQuickOrderConfig(
  country?: string | null
): QuickOrderApiConfig | { error: string } {
  const selected = normalizeCountry(country)
  const timeoutMs = Number(process.env.QUICK_ORDER_TIMEOUT_MS) || 15000

  if (selected === 'NZ') {
    const baseUrl = (
      process.env.QUICK_ORDER_API_URL_NZ ||
      process.env.EXCHANGE_RATE_API_BASE_NZ ||
      'https://nz.app.lotusfx.com'
    ).replace(/\/$/, '')
    const xKey =
      process.env.QUICK_ORDER_X_KEY_NZ || process.env.EXCHANGE_RATE_X_KEY_NZ || ''
    const xClient =
      process.env.QUICK_ORDER_X_CLIENT_NZ || process.env.EXCHANGE_RATE_X_CLIENT_NZ || ''

    if (!xKey || !xClient) {
      return {
        error:
          'NZ Quick Order credentials are not configured. Set QUICK_ORDER_X_KEY_NZ / QUICK_ORDER_X_CLIENT_NZ (or EXCHANGE_RATE_X_KEY_NZ / EXCHANGE_RATE_X_CLIENT_NZ).',
      }
    }

    return { country: selected, baseUrl, xKey, xClient, timeoutMs }
  }

  if (selected === 'FJ') {
    const baseUrl = (
      process.env.QUICK_ORDER_API_URL_FJ ||
      process.env.EXCHANGE_RATE_API_BASE_FJ ||
      'https://fj.app.lotusfx.com'
    ).replace(/\/$/, '')
    const xKey =
      process.env.QUICK_ORDER_X_KEY_FJ || process.env.EXCHANGE_RATE_X_KEY_FJ || ''
    const xClient =
      process.env.QUICK_ORDER_X_CLIENT_FJ || process.env.EXCHANGE_RATE_X_CLIENT_FJ || ''

    if (!xKey || !xClient) {
      return {
        error:
          'FJ Quick Order credentials are not configured. Set QUICK_ORDER_X_KEY_FJ / QUICK_ORDER_X_CLIENT_FJ (or EXCHANGE_RATE_X_KEY_FJ / EXCHANGE_RATE_X_CLIENT_FJ).',
      }
    }

    return { country: selected, baseUrl, xKey, xClient, timeoutMs }
  }

  // AU stays on the 4dDev public-purchase test server for now.
  // Do NOT fall back to AU exchange-rate keys — those are for au.app.lotusfx.com
  // and return 401 on test.lotusfx.com.
  const baseUrl = (
    process.env.QUICK_ORDER_API_URL_AU ||
    process.env.QUICK_ORDER_API_URL ||
    'https://test.lotusfx.com'
  ).replace(/\/$/, '')
  const xKey =
    process.env.QUICK_ORDER_X_KEY_AU || process.env.QUICK_ORDER_X_KEY || 'abc123'
  const xClient =
    process.env.QUICK_ORDER_X_CLIENT_AU ||
    process.env.QUICK_ORDER_X_CLIENT ||
    'LotusFX'

  return {
    country: 'AU',
    baseUrl,
    xKey,
    xClient,
    timeoutMs,
  }
}

export function getGuestPurchaseLimit(country?: string | null): number {
  const selected = normalizeCountry(country)
  const byCountry =
    selected === 'NZ'
      ? process.env.QUICK_ORDER_GUEST_LIMIT_NZ
      : selected === 'FJ'
        ? process.env.QUICK_ORDER_GUEST_LIMIT_FJ
        : process.env.QUICK_ORDER_GUEST_LIMIT_AU
  const n = Number(byCountry || process.env.QUICK_ORDER_GUEST_LIMIT)
  return Number.isFinite(n) && n > 0 ? n : 1000
}

export function isDeliveryEnabled(country?: string | null): boolean {
  const selected = normalizeCountry(country)
  const byCountry =
    selected === 'NZ'
      ? process.env.QUICK_ORDER_ENABLE_DELIVERY_NZ
      : selected === 'FJ'
        ? process.env.QUICK_ORDER_ENABLE_DELIVERY_FJ
        : process.env.QUICK_ORDER_ENABLE_DELIVERY_AU
  const raw = byCountry || process.env.QUICK_ORDER_ENABLE_DELIVERY
  return raw === 'true'
}

export async function quickOrderApiPost(
  path: string,
  payload: unknown,
  country?: string | null
): Promise<unknown> {
  const config = getQuickOrderConfig(country)
  if ('error' in config) {
    throw new Error(config.error)
  }

  // test.lotusfx.com often uses a cert Node cannot verify — same as exchange-rate route
  if (
    process.env.ALLOW_INSECURE_SSL === 'true' ||
    config.baseUrl.includes('test.lotusfx.com')
  ) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs)

  try {
    const response = await fetch(`${config.baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-KEY': config.xKey,
        'X-CLIENT': config.xClient,
        'User-Agent': 'LotusFX-Website/1.0',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: controller.signal,
    })

    const text = await response.text()
    let body: unknown = null
    if (text.trim()) {
      try {
        body = JSON.parse(text)
      } catch {
        body = text
      }
    }

    if (!response.ok) {
      const detail =
        body && typeof body === 'object' ? JSON.stringify(body) : String(body || '')
      throw new Error(`HTTP ${response.status} ${response.statusText}${detail ? ` - ${detail}` : ''}`)
    }

    return body
  } finally {
    clearTimeout(timeout)
  }
}

export function unwrapPayload(response: unknown): unknown {
  return Array.isArray(response) ? response[0] : response
}

export function unwrapResult(response: unknown): Record<string, unknown> {
  const payload = unwrapPayload(response)
  if (payload && typeof payload === 'object' && 'result' in payload) {
    const result = (payload as { result: unknown }).result
    if (result && typeof result === 'object') return result as Record<string, unknown>
  }
  if (payload && typeof payload === 'object') return payload as Record<string, unknown>
  return {}
}
