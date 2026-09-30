'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useCountry } from '@/context/CountryContext'
import {
  ALL_CURRENCIES,
  CurrencyDenominations,
  currencySlug,
  currencyToCountry,
  isCurrencyVisibleInCountry,
  normalizeCurrenciesFile,
} from '@/lib/currencies'

type Props = { currencies?: CurrencyDenominations[] }

const FLAG_CDN = 'https://flagcdn.com/w40'

export default function CurrencyGrid({ currencies: initial }: Props) {
  const { selectedCountry } = useCountry()
  const [currencies, setCurrencies] = useState<CurrencyDenominations[]>(
    initial?.length ? initial : ALL_CURRENCIES
  )

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`/api/currencies-denominations?t=${Date.now()}`, {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = normalizeCurrenciesFile(await res.json())
        if (!cancelled && data.currencies.length) setCurrencies(data.currencies)
      } catch {
        // keep bundled fallback
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

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
          <div className="text-sm text-gray-600 group-hover:text-gray-800">{currency.name}</div>
        </Link>
      ))}
    </div>
  )
}
