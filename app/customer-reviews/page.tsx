import type { Metadata } from 'next'
import CustomerReviewsContent from '@/components/CustomerReviewsContent'

export const metadata: Metadata = {
  title: 'Customer Reviews | LotusFX',
  description:
    'Read real Google reviews from LotusFX customers across Australia, New Zealand and Fiji. Honest feedback on currency exchange and money transfers.',
  openGraph: {
    title: 'Customer Reviews | LotusFX',
    description:
      'Read what our customers say — real Google reviews from LotusFX branches across the Pacific.',
  },
}

export default function CustomerReviewsPage() {
  return <CustomerReviewsContent />
}
