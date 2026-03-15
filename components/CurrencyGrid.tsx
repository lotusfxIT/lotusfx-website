'use client'

import { useState, useMemo } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCountry } from '@/context/CountryContext'

export type CurrencyDenominations = {
  code: string
  name: string
  symbol: string
  notes: number[]
  coins?: number[]
  /** If set, currency only appears when selected country is in this list (e.g. ["AU", "NZ"]). Omit to show in all countries. */
  countries?: string[]
  /** Per-country override for notes/coins. Keys: AU, NZ, FJ. Use when denominations differ by country (e.g. ZAR: 5 notes in NZ, 2 in AU). */
  byCountry?: Record<string, { notes: number[]; coins?: number[] }>
}

type Props = { currencies: CurrencyDenominations[] }

// Reuse same currency → flag mapping as calculator
const currencyToCountry: Record<string, string> = {
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

const FLAG_CDN = 'https://flagcdn.com/w40'

function formatValue(value: number): string {
  return value >= 1 ? String(Math.round(value)) : String(value)
}

function formatDenom(symbol: string, value: number): string {
  return `${symbol}${formatValue(value)}`
}

function getDenominationsForCountry(currency: CurrencyDenominations, country: string): { notes: number[]; coins: number[] } {
  const override = currency.byCountry?.[country]
  return {
    notes: override?.notes ?? currency.notes,
    coins: override?.coins ?? currency.coins ?? [],
  }
}

export default function CurrencyGrid({ currencies }: Props) {
  const { selectedCountry } = useCountry()
  const [selected, setSelected] = useState<CurrencyDenominations | null>(null)

  const visibleCurrencies = useMemo(() => {
    const filtered = currencies.filter((c) => {
      if (!c.countries || c.countries.length === 0) return true
      return c.countries.includes(selectedCountry)
    })
    return [...filtered].sort((a, b) => a.code.localeCompare(b.code))
  }, [currencies, selectedCountry])

  const effectiveDenoms = selected
    ? getDenominationsForCountry(selected, selectedCountry)
    : { notes: [] as number[], coins: [] as number[] }

  const FlagImg = ({ code, className = 'w-7 h-5 object-cover rounded shrink-0' }: { code: string; className?: string }) => {
    const cc = currencyToCountry[code] || code.toLowerCase().slice(0, 2)
    return <img src={`${FLAG_CDN}/${cc}.png`} alt="" className={className} loading="lazy" />
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {visibleCurrencies.map((currency) => (
          <button
            key={currency.code}
            type="button"
            onClick={() => setSelected(currency)}
            className="bg-white rounded-xl p-4 text-center border-2 border-primary-100 hover:border-primary-400 hover:bg-primary-50/50 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <FlagImg code={currency.code} />
              <div className="font-bold text-gray-900 text-lg group-hover:text-primary-700">{currency.code}</div>
            </div>
            <div className="text-sm text-gray-600 group-hover:text-gray-800">{currency.name}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="denominations-title"
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden border-2 border-primary-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
              <h3 id="denominations-title" className="text-xl font-bold text-white">
                Denominations – {selected.code} ({selected.name})
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[60vh] space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">Notes</h4>
                <ul className="flex flex-wrap gap-2">
                  {effectiveDenoms.notes.map((value) => (
                    <li
                      key={`note-${value}`}
                      className="py-2 px-4 rounded-xl bg-primary-50 border border-primary-200 font-semibold text-primary-800"
                    >
                      {formatDenom(selected.symbol, value)}
                    </li>
                  ))}
                </ul>
              </div>
              {effectiveDenoms.coins.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">Coins</h4>
                  <ul className="flex flex-wrap gap-2">
                    {effectiveDenoms.coins.map((value) => (
                      <li
                        key={`coin-${value}`}
                        className="py-2 px-4 rounded-xl bg-amber-50 border border-amber-200 font-semibold text-amber-800"
                      >
                        {formatDenom(selected.symbol, value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
