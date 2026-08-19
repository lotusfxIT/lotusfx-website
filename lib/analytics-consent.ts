const CONSENT_STORAGE_KEY = 'lotusfx-analytics-consent'

export type AnalyticsConsentState = 'granted' | 'denied' | 'unknown'

/** When true, analytics scripts load only after explicit consent (future banner). */
export function isAnalyticsConsentRequired(): boolean {
  return process.env.NEXT_PUBLIC_ANALYTICS_CONSENT_REQUIRED === 'true'
}

export function getAnalyticsConsent(): AnalyticsConsentState {
  if (typeof window === 'undefined') return 'unknown'
  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY)
  if (stored === 'granted' || stored === 'denied') return stored
  return 'unknown'
}

export function setAnalyticsConsent(state: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CONSENT_STORAGE_KEY, state)
  window.dispatchEvent(new CustomEvent('lotusfx-analytics-consent', { detail: state }))
}

/** Whether analytics/GTM may load in the browser. */
export function canLoadAnalytics(): boolean {
  if (process.env.NODE_ENV !== 'production') return false
  if (!isAnalyticsConsentRequired()) return true
  return getAnalyticsConsent() === 'granted'
}
