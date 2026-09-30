import type { Metadata } from 'next'
import { absoluteUrl, getSiteUrl } from '@/lib/site-url'

const DEFAULT_OG_IMAGE = '/images/og-image.jpg'

type PageMetaInput = {
  /** Plain title without brand suffix — template adds "| LotusFX". Pass absolute to skip template. */
  title: string | { absolute: string }
  description: string
  path: string
  keywords?: string[]
  ogImage?: string
  ogTitle?: string
  noIndex?: boolean
}

/** Build consistent per-page metadata with canonical, OG, and Twitter tags. */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  ogImage = DEFAULT_OG_IMAGE,
  ogTitle,
  noIndex = false,
}: PageMetaInput): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const url = absoluteUrl(canonicalPath)
  const resolvedTitle = typeof title === 'string' ? title : title.absolute
  const displayTitle = ogTitle ?? resolvedTitle

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      url,
      title: displayTitle,
      description,
      siteName: 'LotusFX',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: displayTitle,
      description,
      images: [ogImage],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  }
}

export { getSiteUrl, absoluteUrl, DEFAULT_OG_IMAGE }
