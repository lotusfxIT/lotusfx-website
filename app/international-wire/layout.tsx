import { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Lotus International Wire Transfers',
  description:
    'Secure bank-to-bank international wire transfers with Lotus FX. Partnered with international banks for competitive send rates worldwide.',
  path: '/international-wire',
  keywords: ['wire transfer', 'international wire', 'bank transfer', 'Lotus FX', 'overseas payment'],
})

export default function InternationalWireLayout({ children }: { children: React.ReactNode }) {
  return children
}
