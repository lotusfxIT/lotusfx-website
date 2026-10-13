/** Canonical production site URL — used by sitemap, JSON-LD, and metadata helpers. */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://lotusfx.com'
  )
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

/**
 * Host the crawler actually requested. Search Console rejects a sitemap whose
 * <loc> URLs are on a different host than the property (e.g. nz sitemap listing lotusfx.com).
 */
export function getRequestSiteUrl(hostHeader?: string | null): string {
  const host = String(hostHeader || '')
    .split(',')[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, '')
  if (!host || host.includes('localhost') || host.startsWith('127.')) return getSiteUrl()
  if (host === 'www.lotusfx.com' || host === 'lotusfx.com') return 'https://lotusfx.com'
  if (host === 'www.stafflotusfx.com' || host === 'stafflotusfx.com') return 'https://stafflotusfx.com'
  if (host.endsWith('.lotusfx.com') || host.endsWith('.stafflotusfx.com')) {
    return `https://${host.replace(/^www\./, '')}`
  }
  return getSiteUrl()
}
