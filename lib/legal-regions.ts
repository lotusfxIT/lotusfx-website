export type LegalRegionCode = 'au' | 'nz' | 'fj'

export type LegalRegion = {
  code: LegalRegionCode
  name: string
  adjective: string
  email: string
}

export const LEGAL_REGIONS: readonly LegalRegion[] = [
  { code: 'au', name: 'Australia', adjective: 'Australian', email: 'aucustomercare@lotusfx.com' },
  { code: 'nz', name: 'New Zealand', adjective: 'New Zealand', email: 'nzcustomercare@lotusfx.com' },
  { code: 'fj', name: 'Fiji', adjective: 'Fijian', email: 'fjcustomercare@lotusfx.com' },
]

export const DEFAULT_LEGAL_REGION: LegalRegionCode = 'nz'

export function getLegalRegion(code: string | undefined): LegalRegion | undefined {
  return LEGAL_REGIONS.find((r) => r.code === code?.toLowerCase())
}

/** Current region first, so contact lists lead with the visitor's own team. */
export function regionsFirst(code: LegalRegionCode): LegalRegion[] {
  return [...LEGAL_REGIONS].sort((a, b) => Number(b.code === code) - Number(a.code === code))
}