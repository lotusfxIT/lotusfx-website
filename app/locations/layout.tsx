import { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Find a Branch',
  description:
    'Choose from over 50+ convenient Lotus FX locations across Australia, New Zealand and Fiji. Market-leading exchange rates and no commission fees.',
  path: '/locations',
  ogImage: '/images/locations-og.jpg',
  keywords: [
    'LotusFX locations',
    'currency exchange near me',
    'money transfer branches',
    'branch finder',
  ],
})

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
