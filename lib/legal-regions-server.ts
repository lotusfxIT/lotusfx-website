import { headers } from 'next/headers'
import { DEFAULT_LEGAL_REGION, getLegalRegion, type LegalRegion } from '@/lib/legal-regions'

/** Country subdomain wins; on the apex host fall back to Vercel geo, then NZ. */
export function resolveLegalRegion(): LegalRegion {
  const h = headers()
  const host = (h.get('host') ?? '').toLowerCase().replace(/^www\./, '')
  return (
    getLegalRegion(host.split('.')[0]) ??
    getLegalRegion(h.get('x-vercel-ip-country') ?? undefined) ??
    getLegalRegion(DEFAULT_LEGAL_REGION)!
  )
}
