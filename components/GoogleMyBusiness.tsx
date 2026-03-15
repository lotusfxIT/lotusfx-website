'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useCountry } from '@/context/CountryContext'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { STATIC_LOCATIONS, StaticLocation } from '@/data/locations-static'

const LocationsMap = dynamic(() => import('./LocationsMap'), { ssr: false })

interface MapLocation {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  city?: string
}

export default function GoogleMyBusiness() {
  const { selectedCountry } = useCountry()
  const [search, setSearch] = useState('')
  const [openRegion, setOpenRegion] = useState<string | null>(null)
  const [selectedLocationId, setSelectedLocationId] =
    useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const countryNames: { [key: string]: string } = {
    AU: 'Australia',
    NZ: 'New Zealand',
    FJ: 'Fiji',
  }
  const countryName = countryNames[selectedCountry] || 'Your Country'

  const locationsForCountry: StaticLocation[] = useMemo(
    () => STATIC_LOCATIONS.filter((loc) => loc.country === selectedCountry),
    [selectedCountry]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return locationsForCountry
    return locationsForCountry.filter((loc) =>
      loc.name.toLowerCase().includes(q)
    )
  }, [locationsForCountry, search])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, StaticLocation[]>>((acc, loc) => {
      const key = loc.region
      if (!acc[key]) acc[key] = []
      acc[key].push(loc)
      return acc
    }, {})
  }, [filtered])

  const mapLocations: MapLocation[] = useMemo(
    () =>
      filtered.map((loc) => ({
        id: loc.id,
        name: loc.name,
        coordinates: { lat: loc.lat, lng: loc.lng },
        city: loc.region,
      })),
    [filtered]
  )

  return (
    <div className="space-y-8">
      {/* Header – keep only subtle label + description */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            Browse all LotusFX branches. Choose a state or region to see its
            branches, then hover or click a branch to focus it on the map and view
            full details.
          </p>
        </div>
        {filtered.length > 0 && (
          <div className="text-xs md:text-sm text-gray-500 md:text-right">
            Showing{' '}
            <span className="font-semibold text-gray-800 text-sm md:text-base">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'branch' : 'branches'}
            </span>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="w-full md:max-w-sm">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Search branches
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by branch name"
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-start">
          {/* List grouped by region */}
          <div className="space-y-5">
            {Object.entries(grouped).map(([region, items]) => (
              <div key={region} className="space-y-3">
                <button
                  type="button"
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() =>
                    setOpenRegion((prev) => (prev === region ? null : region))
                  }
                  className="w-full flex items-center justify-between text-left px-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 hover:bg-white hover:border-primary-200 transition-colors shadow-soft"
                >
                  <span className="text-base md:text-lg font-semibold text-gray-900">
                    {region}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] md:text-xs text-gray-500 uppercase tracking-wide">
                    {items.length} {items.length === 1 ? 'branch' : 'branches'}
                  </span>
                </button>
                {openRegion === region && (
                  <ul className="space-y-1.5 pl-3 border-l border-gray-100 ml-2 mt-2">
                    {items.map((loc) => (
                      <li key={loc.id}>
                        <Link
                          href={`/locations/${loc.id}`}
                          onMouseEnter={() => setSelectedLocationId(loc.id)}
                          onFocus={() => setSelectedLocationId(loc.id)}
                          className="inline-flex items-center gap-2 py-1.5 text-sm md:text-base text-primary-700 hover:text-primary-900 font-semibold"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                          {loc.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Map column (desktop only) */}
          <div className="hidden lg:block lg:sticky lg:top-24">
            <LocationsMap
              locations={mapLocations}
              country={selectedCountry as 'AU' | 'NZ' | 'FJ'}
              activeRegion={hoveredRegion || openRegion}
              activeLocationId={selectedLocationId}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPinIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No branches found for {countryName}
          </p>
        </div>
      )}
    </div>
  )
}