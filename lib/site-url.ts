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
