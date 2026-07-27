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

export const ALL_CURRENCIES: CurrencyDenominations[] = currenciesData.currencies

export const currencyToCountry: Record<string, string> = {
  AED: 'ae',
  AUD: 'au',
  BDT: 'bd',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  EUR: 'eu',
  FJD: 'fj',
  GBP: 'gb',
  HKD: 'hk',
  IDR: 'id',
  INR: 'in',
  JPY: 'jp',
  KRW: 'kr',
  LKR: 'lk',
  MXN: 'mx',
  MYR: 'my',
  NZD: 'nz',
  PGK: 'pg',
  PHP: 'ph',
  PKR: 'pk',
  SAR: 'sa',
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

export function currencySlug(code: string): string {
  return code.toLowerCase()
}

export function getCurrencyBySlug(slug: string): CurrencyDenominations | undefined {
  const code = slug.toUpperCase()
  return ALL_CURRENCIES.find((c) => c.code === code)
}

export function formatValue(value: number): string {
  return value >= 1 ? String(Math.round(value)) : String(value)
}

export function formatDenom(symbol: string, value: number): string {
  return `${symbol}${formatValue(value)}`
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
  if (!currency.countries || currency.countries.length === 0) return true
  return currency.countries.includes(country)
}
