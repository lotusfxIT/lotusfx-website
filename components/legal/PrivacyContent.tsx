import LegalDocument from '@/components/legal/LegalDocument'
import PrivacyAu from '@/components/legal/privacy/PrivacyAu'
import PrivacyFj from '@/components/legal/privacy/PrivacyFj'
import PrivacyNz from '@/components/legal/privacy/PrivacyNz'
import type { LegalRegionCode } from '@/lib/legal-regions'

const SUBTITLES: Record<LegalRegionCode, string> = {
  au: 'How Lotus Foreign Exchange Pty Ltd (ACN 108 877 050) collects, uses, discloses and protects your personal information.',
  nz: 'How Lotus Foreign Exchange Limited (NZ company number 1189567) collects, uses, discloses and protects your personal information.',
  fj: 'How Lotus Foreign Exchange Pte Ltd (FJ company number 15292) collects, uses, discloses and protects your personal information.',
}

function PrivacyBody({ region }: { region: LegalRegionCode }) {
  if (region === 'au') return <PrivacyAu />
  if (region === 'fj') return <PrivacyFj />
  return <PrivacyNz />
}

export default function PrivacyContent({ region }: { region: LegalRegionCode }) {
  return (
    <LegalDocument
      title="Privacy Policy"
      subtitle={SUBTITLES[region]}
      lastUpdated="12 October 2026"
      regions={{ basePath: '/privacy', current: region }}
    >
      <PrivacyBody region={region} />
    </LegalDocument>
  )
}
