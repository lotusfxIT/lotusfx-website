/**
 * Client-side analytics helpers. Never send PII (names, emails, phones, addresses).
 * Events go to gtag (direct GA4), GTM dataLayer, and/or Meta Pixel when configured.
 */

import { canLoadAnalytics } from '@/lib/analytics-consent'

/** Allowed event names — extend as new real user actions are added. */
export type AnalyticsEventName =
  | 'page_view'
  | 'view_rates'
  | 'currency_select'
  | 'quote_type_select'
  | 'order_initiation'
  | 'cta_click'
  | 'form_submit'
  | 'location_interaction'
  | 'popup_interaction'
  | 'quick_order_step'
  | 'quick_order_complete'
  | 'purchase' // reserved for future paid checkout — see analytics-ecommerce.ts

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined | null | AnalyticsEventParams[]
>

const BLOCKED_PARAM_KEYS = /^(email|e-mail|phone|tel|mobile|name|first_name|last_name|address|street|postcode|zip|passport|ssn|password)$/i

function sanitizeParams(params: AnalyticsEventParams = {}): AnalyticsEventParams {
  const out: AnalyticsEventParams = {}
  for (const [key, value] of Object.entries(params)) {
    if (BLOCKED_PARAM_KEYS.test(key)) continue
    if (value === undefined || value === null) continue
    out[key] = value
  }
  return out
}

function pushDataLayer(event: string, params: AnalyticsEventParams): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}

/** Track a custom event. Safe to call from client components; no-ops when analytics disabled. */
export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
  if (typeof window === 'undefined') return
  if (!canLoadAnalytics()) return

  const safe = sanitizeParams(params)

  // GTM custom event (when container loads GA4/Ads tags)
  if (process.env.NEXT_PUBLIC_GTM_ID) {
    pushDataLayer(name, safe)
  }

  // Direct GA4 via gtag
  if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', name, safe)
  }

  trackMetaEvent(name, safe)
}

/** Track SPA route changes — called from AnalyticsPageView only. */
export function trackPageView(path: string, title?: string): void {
  if (!canLoadAnalytics()) return

  const params = sanitizeParams({
    page_path: path,
    page_title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
  })

  if (process.env.NEXT_PUBLIC_GTM_ID) {
    pushDataLayer('page_view', params)
  }

  // send_page_view:false on gtag config — we fire page_view manually to avoid duplicates
  if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', 'page_view', params)
  }

  if (typeof window.fbq === 'function' && process.env.NEXT_PUBLIC_META_PIXEL_ID) {
    window.fbq('track', 'PageView')
  }
}

/** Map real site actions to Meta standard events. No Purchase until checkout exists. */
function trackMetaEvent(name: AnalyticsEventName, params: AnalyticsEventParams): void {
  if (typeof window.fbq !== 'function' || !process.env.NEXT_PUBLIC_META_PIXEL_ID) return

  if (name === 'form_submit') {
    window.fbq('track', 'Contact', params)
    return
  }
  if (name === 'order_initiation') {
    window.fbq('track', 'Lead', params)
    return
  }
  if (name === 'view_rates') {
    window.fbq('track', 'ViewContent', params)
    return
  }
  if (name === 'quick_order_complete') {
    window.fbq('track', 'Lead', { ...params, content_name: 'quick_order_complete' })
  }
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}
