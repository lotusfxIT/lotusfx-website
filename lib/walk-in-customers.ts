import { findStaticLocationByBranchName, normalizeBranchMatchKey } from '@/data/locations-static'

/**
 * 4D walk-in customer codes for Click & Collect.
 * Each order is booked against the branch walk-in profile, not the guest’s name.
 * Remaining AU codes are filled when the branch list is supplied.
 */
const AU_WALK_IN_BY_SLUG: Record<string, string> = {
  'wetherill-park': '',
  blacktown: '',
  chinatown: '',
  parramatta: '000-PM',
  hurstville: '',
  liverpool: '',
  metcentre: '',
  miranda: '',
  'mt-druitt': '',
  penrith: '',
  'adelaide-street': '',
  'australia-fair': '',
  'brisbane-city': '',
  chermside: '',
  helensvale: '',
  'mt-gravatt': '',
  'noosa-civic': '',
  'north-lakes': '',
  'dandenong-plaza': '',
  'swanston-street': '',
}

export function walkInCustomerIDForBranch(input: {
  country?: string | null
  branchName?: string | null
  branchId?: string | null
}): string | null {
  const country = String(input.country || 'AU').toUpperCase()
  if (country !== 'AU') return null

  const loc = findStaticLocationByBranchName(input.branchName, 'AU')
  const fromSlug = loc ? String(AU_WALK_IN_BY_SLUG[loc.slug] || '').trim() : ''
  if (fromSlug) return fromSlug

  const key = normalizeBranchMatchKey(input.branchName || '')
  if (key) {
    for (const [slug, customerID] of Object.entries(AU_WALK_IN_BY_SLUG)) {
      const code = String(customerID || '').trim()
      if (!code) continue
      if (normalizeBranchMatchKey(slug) === key) return code
    }
  }

  const branchId = String(input.branchId || '').trim()
  if (branchId && AU_WALK_IN_BY_SLUG[branchId]) {
    const code = String(AU_WALK_IN_BY_SLUG[branchId] || '').trim()
    if (code) return code
  }

  return null
}
