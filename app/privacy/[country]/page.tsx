import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PrivacyContent from '@/components/legal/PrivacyContent'
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
    title: `Privacy Policy (${region.name})`,
    description: `Official ${region.name} privacy policy for Lotus Foreign Exchange — how we collect, use, store and protect personal information.`,
    path: `/privacy/${region.code}`,
  })
}

export default function PrivacyCountryPage({ params }: Props) {
  const region = getLegalRegion(params.country)
  if (!region) notFound()
  return <PrivacyContent region={region.code} />
}
