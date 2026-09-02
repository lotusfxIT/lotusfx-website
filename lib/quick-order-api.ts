/**
 * Server-only Quick Order API client for LotusFX 4D REST endpoints.
 * Keys must never be exposed as NEXT_PUBLIC_*.
 */

export type QuickOrderApiConfig = {
  baseUrl: string
  xKey: string
  xClient: string
  timeoutMs: number
}

export function getQuickOrderConfig(): QuickOrderApiConfig | { error: string } {
  // Defaults match 4dDev public-purchase-standalone.html (test). Override via env when needed.
  const baseUrl = (
    process.env.QUICK_ORDER_API_URL ||
    'https://test.lotusfx.com'
  ).replace(/\/$/, '')

  const xKey =
    process.env.QUICK_ORDER_X_KEY ||
    process.env.EXCHANGE_RATE_X_KEY_AU ||
    process.env.EXCHANGE_RATE_X_KEY ||
    'abc123'
  const xClient =
    process.env.QUICK_ORDER_X_CLIENT ||
    process.env.EXCHANGE_RATE_X_CLIENT_AU ||
    process.env.EXCHANGE_RATE_X_CLIENT ||
    'LotusFX'

  if (!xKey || !xClient) {
    return {
      error:
        'Quick Order API credentials missing. Set QUICK_ORDER_X_KEY and QUICK_ORDER_X_CLIENT.',
    }
  }

  return {
    baseUrl,
    xKey,
    xClient,
    timeoutMs: Number(process.env.QUICK_ORDER_TIMEOUT_MS) || 15000,
  }
}

export function getGuestPurchaseLimit(): number {
  const n = Number(process.env.QUICK_ORDER_GUEST_LIMIT)
  return Number.isFinite(n) && n > 0 ? n : 1000
}

export function isDeliveryEnabled(): boolean {
  return process.env.QUICK_ORDER_ENABLE_DELIVERY === 'true'
}

export async function quickOrderApiPost(path: string, payload: unknown): Promise<unknown> {
  const config = getQuickOrderConfig()
  if ('error' in config) {
    throw new Error(config.error)
  }

  if (process.env.ALLOW_INSECURE_SSL === 'true') {
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
