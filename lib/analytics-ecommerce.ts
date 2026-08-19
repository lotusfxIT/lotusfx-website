/**
 * FUTURE CHECKOUT — purchase / transaction tracking (NOT IMPLEMENTED)
 *
 * Do NOT call trackPurchase() until online checkout/payment exists and a server
 * confirms a successful transaction. Never fire from client-only success UI.
 *
 * Trigger point (when checkout ships):
 *   After server-verified payment success — e.g. order confirmation page loaded
 *   with a signed order token from /api/orders/confirm, or webhook-confirmed
 *   status passed to the client once.
 *
 * Duplicate protection:
 *   Use sessionStorage key `lotusfx-purchase-{transaction_id}` before firing.
 *   Only fire once per transaction_id per browser session.
 *
 * Required parameters (GA4 recommended ecommerce):
 *   transaction_id, value, currency, items[]
 *   items[].item_id, item_name, quantity, price
 *
 * Example (do not enable until checkout exists):
 *
 *   import { trackPurchaseOnce } from '@/lib/analytics-ecommerce'
 *
 *   trackPurchaseOnce({
 *     transaction_id: order.id,
 *     value: order.total,
 *     currency: order.currency,
 *     items: order.lines.map((line) => ({
 *       item_id: line.sku,
 *       item_name: line.name,
 *       quantity: line.qty,
 *       price: line.unitPrice,
 *     })),
 *   })
 */

import { trackEvent } from '@/lib/analytics'

export type PurchaseItem = {
  item_id: string
  item_name: string
  quantity: number
  price: number
}

export type PurchasePayload = {
  transaction_id: string
  value: number
  currency: string
  items: PurchaseItem[]
}

const PURCHASE_SESSION_PREFIX = 'lotusfx-purchase-fired:'

/**
 * Fire GA4 purchase event once per transaction_id. No-op until checkout is live.
 * Currently exported for architecture only — safe to import but should not be
 * called from production UI until payment flow exists.
 */
export function trackPurchaseOnce(payload: PurchasePayload): void {
  if (typeof window === 'undefined') return

  const key = `${PURCHASE_SESSION_PREFIX}${payload.transaction_id}`
  if (sessionStorage.getItem(key)) return

  trackEvent('purchase', {
    transaction_id: payload.transaction_id,
    value: payload.value,
    currency: payload.currency,
    items: payload.items,
  })

  sessionStorage.setItem(key, '1')
}
