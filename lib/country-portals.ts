/**
 * Country-specific customer portal + app store links.
 * Fiji has no online login / app download options on the marketing site.
 */

export type PortalCountry = 'AU' | 'NZ' | 'FJ' | string

export type CountryPortalLinks = {
  web: string | null
  appStore: string | null
  playStore: string | null
  /** Show Login / Sign Up CTAs */
  showLogin: boolean
  /** Show App Store + Google Play CTAs */
  showApps: boolean
}

const AU: CountryPortalLinks = {
  web: 'https://au.web.lotusfx.com/',
  appStore: 'https://apps.apple.com/au/app/lotus-foreign-exchange/id6805316280',
  playStore: 'https://play.google.com/store/apps/details?id=com.au.lotusfx.cxr',
  showLogin: true,
  showApps: true,
}

const NZ: CountryPortalLinks = {
  web: 'https://nzcportal.lotusfx.com/login.shtml',
  appStore: 'https://apps.apple.com/nz/app/lotus-fx-online/id1575632583',
  playStore: 'https://play.google.com/store/apps/details?id=com.app.lotusfx2',
  showLogin: true,
  showApps: true,
}

const FJ: CountryPortalLinks = {
  web: null,
  appStore: null,
  playStore: null,
  showLogin: false,
  showApps: false,
}

export function getCountryPortalLinks(country?: PortalCountry | null): CountryPortalLinks {
  const code = String(country || 'AU').toUpperCase()
  if (code === 'NZ') return NZ
  if (code === 'FJ') return FJ
  return AU
}

/** Portal login URL, or null when the country has no online login. */
export function getPortalLoginUrl(country?: PortalCountry | null): string | null {
  return getCountryPortalLinks(country).web
}
