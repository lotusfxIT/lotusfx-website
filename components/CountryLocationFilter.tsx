'use client'

import { MapPinIcon } from '@heroicons/react/24/outline'
import { useCountry } from '@/context/CountryContext'

interface BusinessLocation {
  country: string
}

interface CountryLocationFilterProps {
  locations: BusinessLocation[]
}

const countryConfig = [
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯' },
]

export default function CountryLocationFilter({ locations }: CountryLocationFilterProps) {
  const { selectedCountry, setSelectedCountry } = useCountry()
  // Calculate actual counts from API data
  const getCountryCount = (countryCode: string) => {
    return locations.filter(location => location.country === countryCode).length
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <MapPinIcon className="w-5 h-5 mr-2 text-primary-600" />
        Select Country
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {countryConfig.map((country) => {
          const count = getCountryCount(country.code)
          return (
            <button
              key={country.code}
              onClick={() => setSelectedCountry(country.code)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedCountry === country.code
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{country.flag}</div>
                <div className="font-medium text-gray-900">{country.name}</div>
                <div className="text-sm text-gray-500">{count} branches</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
