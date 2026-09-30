'use client'

import { useEffect, useState } from 'react'
import { useCountry } from '@/context/CountryContext'
import {
  CurrencyDenominations,
  formatDenom,
  formatValue,
  getDenominationsForCountry,
  currencyToCountry,
  normalizeCurrenciesFile,
} from '@/lib/currencies'

const FLAG_CDN = 'https://flagcdn.com/w80'

type Props = {
  currency: CurrencyDenominations
  className?: string
  /** Tighter layout for hero sidebar */
  compact?: boolean
}

export default function CurrencyDenominationsDisplay({
  currency: initial,
  className = '',
  compact = false,
}: Props) {
  const { selectedCountry } = useCountry()
  const [currency, setCurrency] = useState(initial)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`/api/currencies-denominations?t=${Date.now()}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = normalizeCurrenciesFile(await res.json())
        const match = data.currencies.find((c) => c.code === initial.code)
        if (!cancelled && match) setCurrency(match)
      } catch {
        // keep prop fallback
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [initial.code])

  const { notes, coins } = getDenominationsForCountry(currency, selectedCountry)
  const flagCode = currencyToCountry[currency.code] || currency.code.toLowerCase().slice(0, 2)
  const hasCoins = coins.length > 0

  // Fixed card width so incomplete last rows stay centered
  const cardWidth =
    notes.length <= 2
      ? 'w-[calc(50%-0.4rem)]'
      : notes.length === 3
        ? 'w-[calc(33.333%-0.5rem)]'
        : 'w-[calc(33.333%-0.5rem)] sm:w-[calc(33.333%-0.55rem)]'

  return (
    <section className={`h-full ${className}`} id="denominations">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white shadow-strong h-full flex flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.35), transparent 42%), radial-gradient(circle at 88% 12%, rgba(255,255,255,0.18), transparent 36%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/15"
          aria-hidden
        />

        <div
          className={`relative flex flex-col flex-1 ${
            compact ? 'justify-start p-6 sm:p-7 lg:p-8' : 'justify-center px-6 py-10 sm:px-10 sm:py-12'
          }`}
        >
          <div className={`${compact ? 'mb-5' : 'text-center mb-10 max-w-3xl mx-auto'}`}>
            <div
              className={`flex items-center gap-3 ${
                compact
                  ? 'mb-3 min-h-[2.5rem] sm:min-h-[2.75rem]'
                  : 'justify-center gap-4 mb-3'
              }`}
            >
              <img
                src={`${FLAG_CDN}/${flagCode}.png`}
                alt=""
                className={`${compact ? 'h-8 w-11' : 'h-10 w-14'} rounded-md object-cover shadow-md ring-2 ring-white/25 shrink-0`}
                loading="lazy"
              />
              <h2
                className={`font-bold tracking-tight leading-tight ${
                  compact ? 'text-2xl sm:text-3xl lg:text-[2rem]' : 'text-3xl sm:text-4xl lg:text-5xl'
                }`}
              >
                {currency.code} denominations
              </h2>
            </div>
            <p
              className={`${
                compact
                  ? 'text-sm text-primary-100/90 leading-snug'
                  : 'text-base sm:text-lg text-primary-100/95 leading-relaxed'
              }`}
            >
              {compact
                ? `Notes we typically stock for ${currency.name}.`
                : `Notes we typically stock for ${currency.name}. Ask in branch if you need a specific mix for your trip.`}
            </p>
          </div>

          {notes.length > 0 ? (
            <ul className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {notes.map((value) => (
                <li
                  key={`note-${value}`}
                  className={`${cardWidth} group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white text-primary-950 shadow-md ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />
                  <div
                    className={`text-center ${
                      compact ? 'px-2 py-3.5 sm:px-3 sm:py-4' : 'px-4 py-6 sm:px-5 sm:py-8'
                    }`}
                  >
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-500 mb-1">
                      Note
                    </p>
                    <p
                      className={`font-bold tracking-tight text-gray-900 leading-none ${
                        compact ? 'text-base sm:text-lg' : 'text-2xl sm:text-3xl lg:text-4xl'
                      }`}
                    >
                      <span className="text-primary-600 mr-0.5">{currency.symbol}</span>
                      {formatValue(value)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl bg-white/10 border border-white/15 px-5 py-6 text-center text-sm text-primary-50">
              Contact your branch for available note denominations.
            </div>
          )}

          {hasCoins ? (
            <div className={`${compact ? 'mt-4 pt-4' : 'mt-10 pt-8'} border-t border-white/15`}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-100 mb-3">
                Coins
              </h3>
              <ul className="flex flex-wrap justify-center gap-2">
                {coins.map((value) => (
                  <li
                    key={`coin-${value}`}
                    className="rounded-xl bg-white/95 px-3 py-2 text-sm font-semibold text-primary-900 shadow-sm"
                  >
                    {formatDenom(currency.symbol, value)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
