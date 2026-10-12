export type TransferDestination = {
  country: string
  currency: string
  countryCode: string
}

export type TransferModeFlags = {
  allowEWire: boolean
  allowWire: boolean
  allowMoneygram: boolean
  allowWesternUnion: boolean
  allowWallet: boolean
}

/** Send-money destination list. Expand when a 4D country API exists or a manual list is supplied. */
export const TRANSFER_DESTINATIONS: readonly TransferDestination[] = [
  { country: 'Australia', currency: 'AUD', countryCode: 'au' },
  { country: 'New Zealand', currency: 'NZD', countryCode: 'nz' },
  { country: 'Fiji', currency: 'FJD', countryCode: 'fj' },
  { country: 'United States', currency: 'USD', countryCode: 'us' },
  { country: 'India', currency: 'INR', countryCode: 'in' },
  { country: 'China', currency: 'CNY', countryCode: 'cn' },
  { country: 'Nepal', currency: 'NPR', countryCode: 'np' },
  { country: 'Bangladesh', currency: 'BDT', countryCode: 'bd' },
  { country: 'United Kingdom', currency: 'GBP', countryCode: 'gb' },
  { country: 'Eurozone', currency: 'EUR', countryCode: 'eu' },
  { country: 'Japan', currency: 'JPY', countryCode: 'jp' },
  { country: 'Canada', currency: 'CAD', countryCode: 'ca' },
  { country: 'Switzerland', currency: 'CHF', countryCode: 'ch' },
  { country: 'Singapore', currency: 'SGD', countryCode: 'sg' },
]

const NZ_EWIRE = new Set(['AUD', 'FJD'])
const NZ_WIRE = new Set(['INR', 'USD', 'CNY', 'NPR', 'BDT'])

export function getTransferDestinations(fromCountry: string): TransferDestination[] {
  const base = fromCountry === 'NZ' ? 'NZD' : fromCountry === 'FJ' ? 'FJD' : 'AUD'
  return TRANSFER_DESTINATIONS.filter((c) => c.currency !== base)
}

export function getTransferModeFlags(fromCountry: string, toCurrency: string): TransferModeFlags {
  if (fromCountry === 'NZ') {
    if (NZ_EWIRE.has(toCurrency)) {
      return {
        allowEWire: true,
        allowWire: false,
        allowMoneygram: false,
        allowWesternUnion: false,
        allowWallet: false,
      }
    }
    if (NZ_WIRE.has(toCurrency)) {
      return {
        allowEWire: false,
        allowWire: true,
        allowMoneygram: false,
        allowWesternUnion: false,
        allowWallet: false,
      }
    }
    return {
      allowEWire: false,
      allowWire: false,
      allowMoneygram: true,
      allowWesternUnion: true,
      allowWallet: false,
    }
  }

  return {
    allowEWire: toCurrency === 'NZD' || toCurrency === 'FJD' || toCurrency === 'AUD',
    allowWire: !['AUD', 'NZD', 'FJD'].includes(toCurrency),
    allowMoneygram: toCurrency !== 'NZD' && toCurrency !== 'FJD',
    allowWesternUnion: toCurrency !== 'NZD' && toCurrency !== 'FJD',
    allowWallet: toCurrency === 'FJD',
  }
}
