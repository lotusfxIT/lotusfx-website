import { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Lotus Special eWire Transfers',
  description:
    'Send money between Australia, New Zealand and Fiji with Lotus eWire. Cash pickup, bank transfer, and Fiji mobile wallet — fast Pacific transfers.',
  path: '/ewire',
  keywords: ['eWire', 'Lotus FX', 'money transfer', 'Australia', 'New Zealand', 'Fiji', 'mobile wallet'],
})

export default function EWireLayout({ children }: { children: React.ReactNode }) {
  return children
}
