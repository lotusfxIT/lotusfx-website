'use client'

import Link from 'next/link'
import GoogleMyBusiness from '@/components/GoogleMyBusiness'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import { useCountry } from '@/context/CountryContext'
import { countStaticLocations } from '@/data/locations-static'

const FLAG_CDN = 'https://flagcdn.com'

function CountryFlag({
  code,
  className = 'w-8 h-5 rounded object-cover shadow-sm',
}: {
  code: string
  className?: string
}) {
  return (
    <img
      src={`${FLAG_CDN}/${(code || 'AU').toLowerCase()}.svg`}
      alt=""
      className={className}
      loading="lazy"
    />
  )
}

export default function LocationsPage() {
  const { selectedCountry, setSelectedCountry } = useCountry()

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white pt-28 sm:pt-32 lg:pt-36 pb-12 lg:pb-14">
        <CurrencySymbolsBg variant="white" />
        <div className="container-custom relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Find a branch
            </h1>
          </div>

          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
            {[
              { code: 'AU' as const, label: 'Australia', n: countStaticLocations('AU') },
              { code: 'NZ' as const, label: 'New Zealand', n: countStaticLocations('NZ') },
              { code: 'FJ' as const, label: 'Fiji', n: countStaticLocations('FJ') },
            ].map((c) => {
              const active = selectedCountry === c.code
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setSelectedCountry(c.code)}
                  className={`rounded-2xl px-3 py-5 sm:px-4 sm:py-6 text-center border transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                    active
                      ? 'bg-white text-primary-800 border-white shadow-lg'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
                  }`}
                >
                  <CountryFlag
                    code={c.code}
                    className="mx-auto mb-3 w-9 h-6 rounded object-cover shadow-sm ring-1 ring-black/5"
                  />
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                    {c.n}
                  </p>
                  <p
                    className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wide ${
                      active ? 'text-primary-500' : 'text-primary-200'
                    }`}
                  >
                    branches
                  </p>
                  <p
                    className={`mt-1 text-xs sm:text-sm font-semibold ${
                      active ? 'text-primary-600' : 'text-primary-100'
                    }`}
                  >
                    {c.label}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section
        id="branches"
        className="py-12 lg:py-16 bg-gradient-to-b from-white via-primary-50/20 to-white scroll-mt-24"
      >
        <div className="container-custom">
          <GoogleMyBusiness />
        </div>
      </section>

      <section className="py-14 lg:py-16 bg-primary-600 text-white">
        <div className="container-custom text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
            Can&apos;t find a branch near you?
          </h2>
          <p className="text-primary-100 mb-7 leading-relaxed">
            Order currency online for pickup, or contact us for help with your travel money.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quick-order"
              className="inline-flex items-center justify-center bg-white text-primary-700 hover:bg-gray-50 font-semibold py-3 px-7 rounded-xl transition"
            >
              Order currency online
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-7 rounded-xl transition"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
