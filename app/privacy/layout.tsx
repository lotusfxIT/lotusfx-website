import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'LotusFX privacy policy — how Lotus Foreign Exchange collects, uses, stores and protects personal information across Australia, New Zealand and Fiji.',
  path: '/privacy',
})

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
