import currenciesData from '@/data/currencies-denominations.json'

export type CurrencyDenominations = {
  code: string
  name: string
  symbol: string
  notes: number[]
  coins?: number[]
  countries?: string[]
  byCountry?: Record<string, { notes: number[]; coins?: number[] }>
}

export const ALL_CURRENCIES: CurrencyDenominations[] =
  currenciesData.currencies as CurrencyDenominations[]

export const currencyToCountry: Record<string, string> = {
  AED: 'ae',
  AUD: 'au',
  BDT: 'bd',
  BND: 'bn',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  DKK: 'dk',
  EGP: 'eg',
  EUR: 'eu',
  FJD: 'fj',
  GBP: 'gb',
  HKD: 'hk',
  IDR: 'id',
  INR: 'in',
  ISK: 'is',
  JPY: 'jp',
  KHR: 'kh',
  KRW: 'kr',
  LKR: 'lk',
  MXN: 'mx',
  MYR: 'my',
  NOK: 'no',
  NPR: 'np',
  NZD: 'nz',
  PGK: 'pg',
  PHP: 'ph',
  PKR: 'pk',
  PLN: 'pl',
  QAR: 'qa',
  SAR: 'sa',
  SEK: 'se',
  SGD: 'sg',
  THB: 'th',
  TOP: 'to',
  TRY: 'tr',
  TWD: 'tw',
  USD: 'us',
  VND: 'vn',
  VUV: 'vu',
  WST: 'ws',
  XPF: 'pf',
  ZAR: 'za',
}

/** Friendly country / region label for currency pickers (not ISO codes). */
export const currencyCountryName: Record<string, string> = {
  AED: 'United Arab Emirates',
  AUD: 'Australia',
  BDT: 'Bangladesh',
  BND: 'Brunei',
  CAD: 'Canada',
  CHF: 'Switzerland',
  CNY: 'China',
  DKK: 'Denmark',
  EGP: 'Egypt',
  EUR: 'Eurozone',
  FJD: 'Fiji',
  GBP: 'United Kingdom',
  HKD: 'Hong Kong',
  IDR: 'Indonesia',
  INR: 'India',
  ISK: 'Iceland',
  JPY: 'Japan',
  KHR: 'Cambodia',
  KRW: 'South Korea',
  LKR: 'Sri Lanka',
  MXN: 'Mexico',
  MYR: 'Malaysia',
  NOK: 'Norway',
  NPR: 'Nepal',
  NZD: 'New Zealand',
  PGK: 'Papua New Guinea',
  PHP: 'Philippines',
  PKR: 'Pakistan',
  PLN: 'Poland',
  QAR: 'Qatar',
  SAR: 'Saudi Arabia',
  SEK: 'Sweden',
  SGD: 'Singapore',
  THB: 'Thailand',
  TOP: 'Tonga',
  TRY: 'Turkey',
  TWD: 'Taiwan',
  USD: 'United States',
  VND: 'Vietnam',
  VUV: 'Vanuatu',
  WST: 'Samoa',
  XPF: 'French Polynesia',
  ZAR: 'South Africa',
}

export const FLAG_CDN = 'https://flagcdn.com/w40'

export function getCurrencyFlagCode(currencyCode: string): string {
  const code = currencyCode.toUpperCase()
  return currencyToCountry[code] || code.slice(0, 2).toLowerCase()
}

export function getCurrencyDisplayName(currencyCode: string, fallback = ''): string {
  const code = currencyCode.toUpperCase()
  if (currencyCountryName[code]) return currencyCountryName[code]
  const known = ALL_CURRENCIES.find((c) => c.code === code)
  if (known?.name) return known.name
  // Backend sometimes returns ISO country codes like "CA" — don't surface those as labels
  if (fallback && fallback.length > 2) return fallback
  return code
}

export function enrichSoldCurrency(row: {
  currency: string
  country?: string
  flag?: string
}): { currency: string; country: string; flag: string; name: string } {
  const currency = row.currency.toUpperCase()
  const country = getCurrencyDisplayName(currency, row.country || '')
  // Always map from currency code — backend flag values are often wrong (e.g. "USD", "CA")
  const flag = getCurrencyFlagCode(currency)
  const known = ALL_CURRENCIES.find((c) => c.code === currency)
  return {
    currency,
    country,
    flag,
    name: known?.name || `${country} (${currency})`,
  }
}

export function currencySlug(code: string): string {
  return code.toLowerCase()
}

export function getCurrencyBySlug(slug: string): CurrencyDenominations | undefined {
  const code = slug.toUpperCase()
  return ALL_CURRENCIES.find((c) => c.code === code)
}

export function formatValue(value: number): string {
  if (value >= 1) {
    return Math.round(value).toLocaleString('en-US')
  }
  return String(value)
}

export function formatDenom(symbol: string, value: number): string {
  return `${symbol}${formatValue(value)}`
}

/** Parse admin input like "100, 50, 20" or "100K, 50K, 5". */
export function parseDenomList(input: string): number[] {
  if (!input.trim()) return []
  return input
    .split(/[,;\s]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const upper = part.toUpperCase().replace(/,/g, '')
      if (upper.endsWith('K')) {
        const n = Number(upper.slice(0, -1))
        return Number.isFinite(n) ? n * 1000 : NaN
      }
      return Number(upper)
    })
    .filter((n) => Number.isFinite(n) && n > 0)
}

export function formatDenomList(values: number[]): string {
  return values.map(formatValue).join(', ')
}

export function getDenominationsForCountry(
  currency: CurrencyDenominations,
  country: string
): { notes: number[]; coins: number[] } {
  const override = currency.byCountry?.[country]
  return {
    notes: override?.notes ?? currency.notes,
    coins: override?.coins ?? currency.coins ?? [],
  }
}

export function isCurrencyVisibleInCountry(
  currency: CurrencyDenominations,
  country: string
): boolean {
  if (currency.countries && currency.countries.length > 0) {
    if (!currency.countries.includes(country)) return false
  }
  // If an explicit country stock list exists, hide currencies with no notes there
  if (currency.byCountry && country in currency.byCountry) {
    const notes = currency.byCountry[country]?.notes ?? []
    return notes.length > 0
  }
  // Markets with byCountry stock: only show currencies that declare stock for that market
  if (
    currency.byCountry &&
    (country === 'AU' || country === 'NZ' || country === 'FJ')
  ) {
    return false
  }
  return true
}

export type CurrenciesDenominationsFile = {
  currencies: CurrencyDenominations[]
}

export function normalizeCurrenciesFile(
  data: Partial<CurrenciesDenominationsFile> | null | undefined
): CurrenciesDenominationsFile {
  const list = Array.isArray(data?.currencies) ? data!.currencies : []
  return {
    currencies: list
      .filter((c) => c && typeof c.code === 'string' && c.code.trim())
      .map((c) => ({
        code: String(c.code).toUpperCase().trim(),
        name: String(c.name || c.code).trim(),
        symbol: String(c.symbol || '').trim() || String(c.code).toUpperCase(),
        notes: Array.isArray(c.notes) ? c.notes.map(Number).filter((n) => Number.isFinite(n) && n > 0) : [],
        ...(Array.isArray(c.coins)
          ? { coins: c.coins.map(Number).filter((n) => Number.isFinite(n) && n > 0) }
          : {}),
        ...(Array.isArray(c.countries) ? { countries: c.countries.map(String) } : {}),
        ...(c.byCountry && typeof c.byCountry === 'object'
          ? {
              byCountry: Object.fromEntries(
                Object.entries(c.byCountry).map(([cc, stock]) => [
                  cc,
                  {
                    notes: Array.isArray(stock?.notes)
                      ? stock.notes.map(Number).filter((n) => Number.isFinite(n) && n > 0)
                      : [],
                    ...(Array.isArray(stock?.coins)
                      ? {
                          coins: stock.coins
                            .map(Number)
                            .filter((n) => Number.isFinite(n) && n > 0),
                        }
                      : {}),
                  },
                ])
              ),
            }
          : {}),
      })),
  }
}
