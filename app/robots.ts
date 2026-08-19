import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/auth/', '/clear-tokens/', '/test-calculator/', '/test-locations/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
