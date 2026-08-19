import type { Metadata } from 'next'
import { STATIC_LOCATIONS } from '@/data/locations-static'
import { buildPageMetadata } from '@/lib/seo'

type Props = {
  params: { id: string[] }
}

function branchTitle(slug: string): string {
  const loc = STATIC_LOCATIONS.find((l) => l.slug === slug)
  if (!loc) return 'Branch Details'
  return loc.name.replace(/^Lotus Foreign Exchange\s*-\s*/i, '').trim()
}

export function generateMetadata({ params }: Props): Metadata {
  const slug = params.id?.length === 1 ? params.id[0] : null
  if (!slug || slug.includes('/')) {
    return buildPageMetadata({
      title: 'Find a Branch',
      description: 'LotusFX branch location details, hours, reviews, and directions.',
      path: '/locations',
      ogImage: '/images/locations-og.jpg',
    })
  }

  const name = branchTitle(slug)
  return buildPageMetadata({
    title: `${name} Branch`,
    description: `Visit LotusFX ${name} for currency exchange and money transfers. View branch hours, contact details, reviews, and directions.`,
    path: `/locations/${slug}`,
    ogImage: '/images/locations-og.jpg',
    keywords: [`LotusFX ${name}`, 'currency exchange', 'money transfer', 'branch location'],
  })
}

export default function LocationDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
