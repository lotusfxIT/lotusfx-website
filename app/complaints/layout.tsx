import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Complaints',
  description:
    'How to make a complaint to LotusFX. Clear steps, contact details and expected response times for customer complaints across Australia, New Zealand and Fiji.',
  path: '/complaints',
})

export default function ComplaintsLayout({ children }: { children: React.ReactNode }) {
  return children
}
