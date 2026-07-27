'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useCountry } from '@/context/CountryContext'
import {
  CurrencyDenominations,
  currencySlug,
  currencyToCountry,
  isCurrencyVisibleInCountry,
} from '@/lib/currencies'

type Props = { currencies: CurrencyDenominations[] }

const FLAG_CDN = 'https://flagcdn.com/w40'

export default function CurrencyGrid({ currencies }: Props) {
  const { selectedCountry } = useCountry()

  const visibleCurrencies = useMemo(() => {
    const filtered = currencies.filter((c) => isCurrencyVisibleInCountry(c, selectedCountry))
    return [...filtered].sort((a, b) => a.code.localeCompare(b.code))
  }, [currencies, selectedCountry])

  const FlagImg = ({ code, className = 'w-7 h-5 object-cover rounded shrink-0' }: { code: string; className?: string }) => {
    const cc = currencyToCountry[code] || code.toLowerCase().slice(0, 2)
    return <img src={`${FLAG_CDN}/${cc}.png`} alt="" className={className} loading="lazy" />
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {visibleCurrencies.map((currency) => (
        <Link
          key={currency.code}
          href={`/currency-exchange/${currencySlug(currency.code)}`}
          className="bg-white rounded-xl p-4 text-center border-2 border-primary-100 hover:border-primary-400 hover:bg-primary-50/50 hover:shadow-md transition-all group block"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <FlagImg code={currency.code} />
            <div className="font-bold text-gray-900 text-lg group-hover:text-primary-700">
              {currency.code}
            </div>
          </div>
          <div className="text-sm text-gray-600 group-hover:text-gray-800 mb-2">{currency.name}</div>
          <span className="text-xs font-semibold text-primary-600 group-hover:text-primary-700">
            Rates & denominations →
          </span>
        </Link>
      ))}
    </div>
  )
}
