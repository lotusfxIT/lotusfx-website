'use client'

import { useCountry } from '@/context/CountryContext'
import {
  CurrencyDenominations,
  formatDenom,
  getDenominationsForCountry,
  currencyToCountry,
} from '@/lib/currencies'

const FLAG_CDN = 'https://flagcdn.com/w40'

type Props = {
  currency: CurrencyDenominations
  className?: string
}

export default function CurrencyDenominationsDisplay({ currency, className = '' }: Props) {
  const { selectedCountry } = useCountry()
  const { notes, coins } = getDenominationsForCountry(currency, selectedCountry)
  const flagCode = currencyToCountry[currency.code] || currency.code.toLowerCase().slice(0, 2)

  return (
    <section className={className} id="denominations">
      <div className="flex items-center gap-3 mb-6">
        <img
          src={`${FLAG_CDN}/${flagCode}.png`}
          alt=""
          className="w-10 h-7 object-cover rounded shadow-sm"
          loading="lazy"
        />
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {currency.code} denominations we stock
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Note and coin denominations available at Lotus FX branches may vary by location. Shown
            for your selected region ({selectedCountry}).
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-primary-100 bg-primary-50/40 p-6">
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wider mb-4">
            Notes
          </h3>
          {notes.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {notes.map((value) => (
                <li
                  key={`note-${value}`}
                  className="py-2.5 px-4 rounded-xl bg-white border border-primary-200 font-semibold text-primary-900 shadow-sm"
                >
                  {formatDenom(currency.symbol, value)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">Contact your branch for available note denominations.</p>
          )}
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
          <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-4">
            Coins
          </h3>
          {coins.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {coins.map((value) => (
                <li
                  key={`coin-${value}`}
                  className="py-2.5 px-4 rounded-xl bg-white border border-amber-200 font-semibold text-amber-900 shadow-sm"
                >
                  {formatDenom(currency.symbol, value)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">
              Coins are not typically stocked for {currency.name} at branch — notes are available.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
