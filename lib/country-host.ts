const COUNTRY_SITE_BASES = ['stafflotusfx.com', 'lotusfx.com']

/**
 * URL of the same page on the country subdomain (au./nz./fj.) when we're on a
 * Lotus FX domain; null on localhost / vercel.app previews or when already there.
 */
export function countrySiteUrl(country: string, loc: Location = window.location): string | null {
  const host = loc.hostname.toLowerCase().replace(/^www\./, '')
  const base = COUNTRY_SITE_BASES.find((b) => host === b || host.endsWith(`.${b}`))
  if (!base) return null
  const target = `${country.toLowerCase()}.${base}`
  if (host === target) return null
  return `${loc.protocol}//${target}${loc.pathname}${loc.search}${loc.hash}`
}
