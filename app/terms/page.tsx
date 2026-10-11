import type { Metadata } from 'next'
import TermsContent from '@/components/legal/TermsContent'
import { resolveLegalRegion } from '@/lib/legal-regions-server'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms and Conditions',
  description:
    'Lotus Foreign Exchange Limited Terms and Conditions for currency exchange, remittance, Click & Collect, website and app services.',
  path: '/terms',
})

export default function TermsPage() {
  return <TermsContent region={resolveLegalRegion().code} />
}
