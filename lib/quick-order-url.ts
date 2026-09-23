export type QuickOrderParams = {
  to?: string
  amount?: string | number
  isBuy?: boolean
}

/** Guest Quick Order is AU-only for now (NZ/FJ hidden until go-live). */
export function isQuickOrderEnabled(country?: string | null): boolean {
  return String(country || '').toUpperCase() === 'AU'
}

/** Build in-site Quick Order URL with optional calculator prefill. */
export function buildQuickOrderUrl(params: QuickOrderParams = {}): string {
  const q = new URLSearchParams()
  if (params.to) q.set('to', params.to.toUpperCase())
  if (params.amount != null && params.amount !== '') q.set('amount', String(params.amount))
  if (params.isBuy !== undefined) q.set('isBuy', params.isBuy ? '1' : '0')
  const query = q.toString()
  return query ? `/quick-order?${query}` : '/quick-order'
}
