import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import TermsContent from '@/components/legal/TermsContent'
import { LEGAL_REGIONS, getLegalRegion } from '@/lib/legal-regions'
import { buildPageMetadata } from '@/lib/seo'

type Props = { params: { country: string } }

export const dynamicParams = false

export function generateStaticParams() {
  return LEGAL_REGIONS.map((r) => ({ country: r.code }))
}

export function generateMetadata({ params }: Props): Metadata {
  const region = getLegalRegion(params.country)
  if (!region) return {}
  return buildPageMetadata({
    title: `Terms and Conditions (${region.name})`,
    description: `Lotus Foreign Exchange Terms and Conditions for ${region.name} — currency exchange, remittance, Click & Collect, website and app services.`,
    path: `/terms/${region.code}`,
  })
}

export default function TermsCountryPage({ params }: Props) {
  const region = getLegalRegion(params.country)
  if (!region) notFound()
  return <TermsContent region={region.code} />
}
