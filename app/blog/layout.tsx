import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog & Travel Money Tips',
  description:
    'Currency exchange tips, travel money guides, and money transfer advice from LotusFX experts across Australia, New Zealand and Fiji.',
  path: '/blog',
  keywords: ['currency exchange blog', 'travel money tips', 'money transfer guide', 'LotusFX blog'],
})

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
