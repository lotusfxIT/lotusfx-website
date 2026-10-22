import { getPortalLoginUrl } from './country-portals'
import {
  BACKEND_FETCH_TIMEOUT_MS,
  BackendUnavailableError,
  isBackendUnavailable,
} from './service-availability'

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
  return getPortalLoginUrl(country) || ''
}

export function getQuickOrderConfig(
  country?: string | null
): QuickOrderApiConfig | { error: string } {
  const selected = normalizeCountry(country)
  const timeoutMs = Number(process.env.QUICK_ORDER_TIMEOUT_MS) || BACKEND_FETCH_TIMEOUT_MS

  if (selected === 'NZ') {
    const baseUrl = (
      process.env.QUICK_ORDER_API_URL_NZ ||
      process.env.EXCHANGE_RATE_API_BASE_NZ ||
      'https://nzcportal.lotusfx.com'
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
    return {
      error: 'Fiji Click & Collect is not available. Please visit a branch.',
    }
  }

  // AU → au.portal.lotusfx.com (public-purchase keys abc123 / LotusFX).
  const baseUrl = (
    process.env.QUICK_ORDER_API_URL_AU ||
    process.env.QUICK_ORDER_API_URL ||
    'https://au.portal.lotusfx.com'
  ).replace(/\/$/, '')
  const xKey =
    process.env.QUICK_ORDER_X_KEY_AU ||
    process.env.QUICK_ORDER_X_KEY ||
    'abc123'
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
      if (response.status >= 500) throw new BackendUnavailableError()
      const detail =
        body && typeof body === 'object' ? JSON.stringify(body) : String(body || '')
      throw new Error(`HTTP ${response.status} ${response.statusText}${detail ? ` - ${detail}` : ''}`)
    }

    return body
  } catch (error) {
    if (error instanceof BackendUnavailableError) throw error
    if (isBackendUnavailable(error)) throw new BackendUnavailableError()
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

type WebEwireRecord = {
  __KEY?: string
  __STAMP?: number
  WebEwireID?: string
  CustomerID?: string
  fromAmount?: number
  paymentInfo?: Record<string, unknown>
}

async function quickOrderApiGet(
  path: string,
  country?: string | null
): Promise<unknown> {
  const config = getQuickOrderConfig(country)
  if ('error' in config) {
    throw new Error(config.error)
  }

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
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-KEY': config.xKey,
        'X-CLIENT': config.xClient,
        'User-Agent': 'LotusFX-Website/1.0',
      },
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
      if (response.status >= 500) throw new BackendUnavailableError()
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }
    return body
  } catch (error) {
    if (error instanceof BackendUnavailableError) throw error
    if (isBackendUnavailable(error)) throw new BackendUnavailableError()
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * createPublicPurchaseOrder does not copy customerID onto the WebEwire.
 * Head Office then books it with a blank customer and treats PAYINSTORE as paid.
 * Stamp CustomerID + AmountPaid=0 immediately after create.
 */
export function bookingPaymentData(input: {
  branchId?: string | null
  branchName?: string | null
}): Record<string, unknown> {
  return {
    deliveryLocation: String(input.branchId || ''),
    deliveryLocationName: String(input.branchName || ''),
    promotionCode: '',
    payInFull: false,
    payInFullDeposit: 0,
  }
}

/** WEBAWEB143 (test J): unpaid booking. Deposit 0, no AmountPaid/PaymentAmount. */
function unpaidStorePaymentInfo(input: {
  existing?: Record<string, unknown>
  branchId?: string | null
  branchName?: string | null
}): Record<string, unknown> {
  const existing = input.existing && typeof input.existing === 'object' ? input.existing : {}
  const {
    AmountPaid: _amountPaid,
    PaymentAmount: _paymentAmount,
    ...rest
  } = existing
  const branchId = String(input.branchId || rest.deliveryLocation || '')
  const branchName = String(input.branchName || rest.deliveryLocationName || '')
  return {
    ...rest,
    bookingType: 'booking',
    gateway: 'transfer',
    status: 'NEW',
    deliveryMethod: 'D',
    deliveryMethod2: '',
    paymentMethod: 'transfer',
    payinfull: 'off',
    payInFull: false,
    payInFullDeposit: 0,
    deliveryLocation: branchId,
    deliveryLocationName: branchName,
    paymentData: {
      deliveryLocation: branchId,
      deliveryLocationName: branchName,
      promotionCode: '',
      payInFull: false,
      payInFullDeposit: 0,
    },
  }
}

export async function attachWalkInCustomerToWebEwire(input: {
  webEwireID?: string | null
  orderUUID?: string | null
  customerID: string
  amountDue?: number
  branchId?: string | null
  branchName?: string | null
  country?: string | null
}): Promise<{ CustomerID?: string; AmountPaid?: unknown } | null> {
  const webEwireID = String(input.webEwireID || '').trim()
  const orderUUID = String(input.orderUUID || '').trim()
  if (!webEwireID && !orderUUID) return null

  const filter = webEwireID
    ? `"WebEwireID='${webEwireID.replace(/'/g, "''")}'"`
    : `"UUID='${orderUUID.replace(/'/g, "''")}'"`
  const listed = await quickOrderApiGet(
    `/rst/WebEWires?$filter=${encodeURIComponent(filter)}`,
    input.country
  )
  const entities =
    listed && typeof listed === 'object' && Array.isArray((listed as { __ENTITIES?: unknown }).__ENTITIES)
      ? ((listed as { __ENTITIES: WebEwireRecord[] }).__ENTITIES)
      : []
  const rec = entities[0]
  if (!rec?.__KEY || rec.__STAMP == null) {
    if (!orderUUID) return null
    const fallback = await quickOrderApiPost(
      '/rst/WebEWires?$method=update',
      [
        {
          __KEY: orderUUID,
          __STAMP: 1,
          CustomerID: input.customerID,
          paymentInfo: unpaidStorePaymentInfo({
            branchId: input.branchId,
            branchName: input.branchName,
          }),
        },
      ],
      input.country
    )
    const updated = unwrapPayload(fallback) as WebEwireRecord
    return { CustomerID: updated?.CustomerID, AmountPaid: updated?.paymentInfo?.AmountPaid }
  }

  const paymentInfo = unpaidStorePaymentInfo({
    existing: rec.paymentInfo && typeof rec.paymentInfo === 'object' ? rec.paymentInfo : {},
    branchId: input.branchId,
    branchName: input.branchName,
  })

  const saved = await quickOrderApiPost(
    '/rst/WebEWires?$method=update',
    [
      {
        __KEY: rec.__KEY,
        __STAMP: rec.__STAMP,
        CustomerID: input.customerID,
        paymentInfo,
      },
    ],
    input.country
  )
  const updated = unwrapPayload(saved) as WebEwireRecord
  return { CustomerID: updated?.CustomerID, AmountPaid: updated?.paymentInfo?.AmountPaid }
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
