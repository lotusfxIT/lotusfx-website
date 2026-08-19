import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'About LotusFX',
  description:
    'Learn about LotusFX — trusted currency exchange and money transfer services across Australia, New Zealand and Fiji since 2002.',
  path: '/about',
  keywords: ['about LotusFX', 'Lotus Foreign Exchange', 'currency exchange company', 'money transfer'],
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
