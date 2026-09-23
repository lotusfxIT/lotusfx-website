/**
 * Site-wide marketing stats & contact details.
 * Defaults live here; admin edits persist to public/site-stats.json.
 */

export type SiteStats = {
  customerRating: string
  currenciesAvailable: string
  yearsOfExcellence: string
  totalTransferred: string
  customers: {
    fiji: string
    australia: string
    newZealand: string
    total: string
  }
  branches: {
    fiji: string
    australia: string
    newZealand: string
    total: string
  }
  emails: {
    fiji: string
    australia: string
    newZealand: string
  }
  businessHours: {
    fiji: string
    australia: string
    newZealand: string
  }
  hero: {
    trustedPrefix: string
    featureCompetitiveRates: string
    featureNoCommission: string
    featureLocations: string
    featureCurrencies: string
  }
  /** Marketing blurbs — use {placeholders} so numbers stay in sync when counts change. */
  copy: {
    featuresLocationsDescription: string
    aboutGrowth: string
    aboutPacificIntro: string
    contactVisitBranch: string
    fijiBranchesLabel: string
  }
}

export const DEFAULT_SITE_STATS: SiteStats = {
  customerRating: '4.9★',
  currenciesAvailable: '40+',
  yearsOfExcellence: '20+',
  totalTransferred: '$2.4B+',
  customers: {
    fiji: '260,000+',
    australia: '100,000+',
    newZealand: '200,000+',
    total: '560,000+',
  },
  branches: {
    fiji: '16',
    australia: '20',
    newZealand: '18',
    total: '54',
  },
  emails: {
    fiji: 'fjcustomercare@lotusfx.com',
    australia: 'aucustomercare@lotusfx.com',
    newZealand: 'nzcustomercare@lotusfx.com',
  },
  businessHours: {
    fiji: 'Mon-Fri: 9am-5pm FJT',
    australia: 'Mon-Fri: 9am-5pm AEST',
    newZealand: 'Mon-Fri: 9am-5pm NZST',
  },
  hero: {
    trustedPrefix: 'Trusted by',
    featureCompetitiveRates: 'The most competitive exchange rates',
    featureNoCommission: 'No commission on currency exchange',
    featureLocations: '50+ locations across Australia, New Zealand & Fiji',
    featureCurrencies: '40+ currencies available',
  },
  copy: {
    featuresLocationsDescription:
      "With {branches.total} branches across Australia, New Zealand and Fiji, it's easy to sort your travel money somewhere familiar, convenient and close to where you already are.",
    aboutGrowth:
      "Starting with a single branch, we've grown to over {branches.total} locations across Australia, New Zealand, and Fiji. Our success comes from our commitment to competitive rates, transparent pricing, and exceptional customer service.",
    aboutPacificIntro:
      "With {branches.total} branches across three countries, we're always nearby when you need us",
    contactVisitBranch:
      'Visit any of our {branches.total} branches across Australia, New Zealand, and Fiji for face-to-face service.',
    fijiBranchesLabel: 'Branches across Fiji',
  },
}

/** Deep-merge partial stats onto defaults (safe for admin saves / missing keys). */
export function mergeSiteStats(partial?: Partial<SiteStats> | null): SiteStats {
  const p = partial || {}
  const merged = {
    ...DEFAULT_SITE_STATS,
    ...p,
    customers: { ...DEFAULT_SITE_STATS.customers, ...(p.customers || {}) },
    branches: { ...DEFAULT_SITE_STATS.branches, ...(p.branches || {}) },
    emails: { ...DEFAULT_SITE_STATS.emails, ...(p.emails || {}) },
    businessHours: { ...DEFAULT_SITE_STATS.businessHours, ...(p.businessHours || {}) },
    hero: { ...DEFAULT_SITE_STATS.hero, ...(p.hero || {}) },
    copy: { ...DEFAULT_SITE_STATS.copy, ...(p.copy || {}) },
  }
  // Repair encoding corruption (★ → ?) from older saves / non-UTF pipelines
  if (typeof merged.customerRating === 'string') {
    merged.customerRating = merged.customerRating.replace(/\?/g, '★')
  }
  return merged
}

/** Replace {branches.total}, {customers.total}, etc. in admin-editable copy. */
export function fillStatsTemplate(template: string, stats: SiteStats = DEFAULT_SITE_STATS): string {
  const map: Record<string, string> = {
    'branches.total': stats.branches.total,
    'branches.australia': stats.branches.australia,
    'branches.newZealand': stats.branches.newZealand,
    'branches.fiji': stats.branches.fiji,
    'customers.total': stats.customers.total,
    'customers.australia': stats.customers.australia,
    'customers.newZealand': stats.customers.newZealand,
    'customers.fiji': stats.customers.fiji,
    totalTransferred: stats.totalTransferred,
    yearsOfExcellence: stats.yearsOfExcellence,
    currenciesAvailable: stats.currenciesAvailable,
    customerRating: stats.customerRating,
  }
  return template.replace(/\{([a-zA-Z.]+)\}/g, (match, key: string) =>
    key in map ? map[key] : match
  )
}

/**
 * @deprecated Prefer useSiteStats() in client components.
 * Kept as sync defaults for modules that cannot await.
 */
export const STATS = DEFAULT_SITE_STATS

export function getCountryStats(country: 'fiji' | 'australia' | 'newZealand', stats: SiteStats = DEFAULT_SITE_STATS) {
  return {
    customers: stats.customers[country],
    branches: stats.branches[country],
    email: stats.emails[country],
    businessHours: stats.businessHours[country],
  }
}
