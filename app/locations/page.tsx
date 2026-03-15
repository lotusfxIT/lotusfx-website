'use client'

import GoogleMyBusiness from '@/components/GoogleMyBusiness'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import { useCountry } from '@/context/CountryContext'
import { MapPinIcon } from '@heroicons/react/24/outline'

const countryInfo = {
  AU: {
    name: 'Australia',
    description:
      'Find your nearest LotusFX branch in Australia for expert currency exchange and international money transfers.',
    branchCount: '20 branches',
  },
  NZ: {
    name: 'New Zealand',
    description:
      'Find your nearest LotusFX branch in New Zealand for convenient currency exchange and international money transfers.',
    branchCount: '18 branches',
  },
  FJ: {
    name: 'Fiji',
    description:
      'Visit our branches across Fiji for reliable currency exchange and money transfer services.',
    branchCount: '16 branches',
  },
}

const FLAG_CDN = 'https://flagcdn.com'

function CountryFlag({
  code,
  className = 'w-10 h-6 rounded-md object-cover shadow-sm border border-white/40',
}: {
  code: string
  className?: string
}) {
  const cc = (code || 'AU').toLowerCase()
  return <img src={`${FLAG_CDN}/${cc}.svg`} alt={code} className={className} loading="lazy" />
}

export default function LocationsPage() {
  const { selectedCountry } = useCountry()
  const country = countryInfo[selectedCountry as keyof typeof countryInfo] || countryInfo.AU

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <CurrencySymbolsBg variant="white" />
        <div className="container-custom relative z-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)] gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6 border border-white/20">
                <CountryFlag code={selectedCountry} />
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-50">
                    Locations
                  </span>
                  <span className="text-sm font-medium">
                    {country.name} · {country.branchCount}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5 leading-tight">
                Find a Branch in {country.name}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-primary-100 mb-6 max-w-2xl">
                {country.description} Browse branches by region, see live hours and reviews, and get
                directions in one click.
              </p>

              {/* Removed extra chips under header per design request */}
            </div>

            {/* Right column intentionally left empty on desktop to keep hero clean */}
          </div>
        </div>
      </section>

      {/* Google My Business Integration */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container-custom">
          <GoogleMyBusiness />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Can't Find a Branch Near You?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            No problem! Use our online platform to exchange currency and have it 
            delivered to your door, or visit any of our partner locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-50 font-bold text-lg py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Exchange Online
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold text-lg py-4 px-8 rounded-lg transition-all duration-200">
              Find Partner Locations
            </button>
          </div>
        </div>
      </section>
    </>
  )
}