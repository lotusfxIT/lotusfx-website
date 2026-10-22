import { findStaticLocationByBranchName, normalizeBranchMatchKey } from '@/data/locations-static'

/**
 * 4D walk-in customer codes for Click & Collect.
 * Each order is booked against the branch walk-in profile (`000-<BranchID>`).
 */
const AU_WALK_IN_BY_SLUG: Record<string, string> = {
  'wetherill-park': '000-WP',
  blacktown: '000-BT',
  chinatown: '000-CT',
  parramatta: '000-PM',
  hurstville: '000-HV',
  liverpool: '000-PB',
  metcentre: '000-MT',
  miranda: '000-MB',
  'mt-druitt': '000-MD',
  penrith: '000-PC',
  'adelaide-street': '000-AS',
  'australia-fair': '000-AF',
  'brisbane-city': '000-BC',
  chermside: '000-CM',
  helensvale: '000-HE',
  'mt-gravatt': '000-MG',
  'noosa-civic': '000-NC',
  'north-lakes': '000-NL',
  'dandenong-plaza': '000-DP',
  'swanston-street': '000-SW',
}

const SKIP_BRANCH_IDS = new Set(['WEBA'])

function walkInFromBranchId(branchId?: string | null): string | null {
  const id = String(branchId || '').trim().toUpperCase()
  if (!id || SKIP_BRANCH_IDS.has(id)) return null
  if (/^000-/.test(id)) return id
  if (/^[A-Z]{2,4}$/.test(id)) return `000-${id}`
  return null
}

export function walkInCustomerIDForBranch(input: {
  country?: string | null
  branchName?: string | null
  branchId?: string | null
}): string | null {
  const country = String(input.country || 'AU').toUpperCase()
  if (country !== 'AU') return null

  const fromId = walkInFromBranchId(input.branchId)
  if (fromId) return fromId

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

  return null
}
