import type { Metadata } from 'next'
import CustomerReviewsContent from '@/components/CustomerReviewsContent'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Customer Reviews',
  description:
    'Read real Google reviews from LotusFX customers across Australia, New Zealand and Fiji. Honest feedback on currency exchange and money transfers.',
  path: '/customer-reviews',
})

export default function CustomerReviewsPage() {
  return <CustomerReviewsContent />
}
