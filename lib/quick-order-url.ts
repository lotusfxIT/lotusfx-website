export type QuickOrderParams = {
  to?: string
  amount?: string | number
  isBuy?: boolean
}

/** Countries where guest Click & Collect is shown. Empty = hidden (bring AU back with `['AU']`). */
const QUICK_ORDER_LIVE_COUNTRIES: readonly string[] = []

/** Unlinked staff test path. Not in nav, sitemap, or calculator CTAs. */
export const CLICK_COLLECT_PREVIEW_PATH = '/click-and-collect-preview'

export function isQuickOrderEnabled(country?: string | null): boolean {
  return QUICK_ORDER_LIVE_COUNTRIES.includes(String(country || '').toUpperCase())
}

/** Build in-site Quick Order URL with optional calculator prefill. */
export function buildQuickOrderUrl(params: QuickOrderParams = {}): string {
  const q = new URLSearchParams()
  if (params.to) q.set('to', params.to.toUpperCase())
  if (params.amount != null && params.amount !== '') q.set('amount', String(params.amount))
  if (params.isBuy !== undefined) q.set('isBuy', params.isBuy ? '1' : '0')
  const query = q.toString()
  return query ? `/click-and-collect?${query}` : '/click-and-collect'
}
