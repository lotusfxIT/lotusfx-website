import PrivacyContent from '@/components/legal/PrivacyContent'
import { resolveLegalRegion } from '@/lib/legal-regions-server'

export default function PrivacyPage() {
  return <PrivacyContent region={resolveLegalRegion().code} />
}
