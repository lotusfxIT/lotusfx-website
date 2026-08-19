import type { Metadata } from 'next'
import { absoluteUrl, getSiteUrl } from '@/lib/site-url'

const DEFAULT_OG_IMAGE = '/images/og-image.jpg'

type PageMetaInput = {
  /** Plain title without brand suffix — template adds "| LotusFX" */
  title: string
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
      title: ogTitle ?? title,
      description,
      siteName: 'LotusFX',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogTitle ?? title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle ?? title,
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
