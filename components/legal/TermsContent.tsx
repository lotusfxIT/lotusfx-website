import LegalDocument from '@/components/legal/LegalDocument'
import TermsAu from '@/components/legal/terms/TermsAu'
import TermsFj from '@/components/legal/terms/TermsFj'
import TermsNz from '@/components/legal/terms/TermsNz'
import type { LegalRegionCode } from '@/lib/legal-regions'

const SUBTITLES: Record<LegalRegionCode, string> = {
  au: 'These Terms and Conditions govern your use of the goods and services provided by Lotus Foreign Exchange Pty Ltd, including Foreign Exchange Services and Remittance Services.',
  nz: 'These Terms and Conditions govern your use of the goods and services provided by Lotus Foreign Exchange Limited, including Foreign Exchange Services and Remittance Services.',
  fj: 'These Terms and Conditions govern your use of the goods and services provided by Lotus Foreign Exchange Pte Ltd, including Foreign Exchange Services and Remittance Services.',
}

function TermsBody({ region }: { region: LegalRegionCode }) {
  if (region === 'au') return <TermsAu />
  if (region === 'fj') return <TermsFj />
  return <TermsNz />
}

export default function TermsContent({ region }: { region: LegalRegionCode }) {
  return (
    <LegalDocument
      title="Terms and Conditions"
      subtitle={SUBTITLES[region]}
      lastUpdated="12 October 2026"
      regions={{ basePath: '/terms', current: region }}
    >
      <TermsBody region={region} />
    </LegalDocument>
  )
}
