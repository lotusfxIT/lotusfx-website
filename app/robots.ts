import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { getRequestSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  const headerStore = headers()
  const baseUrl = getRequestSiteUrl(headerStore.get('x-forwarded-host') || headerStore.get('host'))

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/auth/', '/clear-tokens/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
