'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline'
import { useCountry } from '@/context/CountryContext'
import { STATIC_LOCATIONS, StaticLocation } from '@/data/locations-static'

const LocationsMap = dynamic(() => import('./LocationsMap'), { ssr: false })

interface MapLocation {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  city?: string
}

function branchShortName(name: string) {
  return name.replace(/^Lotus Foreign Exchange\s*[-–—]\s*/i, '').trim() || name
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function hasCoords(loc: StaticLocation) {
  return Number.isFinite(loc.lat) && Number.isFinite(loc.lng) && !(loc.lat === 0 && loc.lng === 0)
}

function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

export default function GoogleMyBusiness() {
  const { selectedCountry, setSelectedCountry } = useCountry()
  const [search, setSearch] = useState('')
  const [activeRegion, setActiveRegion] = useState<string>('All')
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [nearestId, setNearestId] = useState<string | null>(null)
  const [nearestDistanceKm, setNearestDistanceKm] = useState<number | null>(null)
  const [locating, setLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)
  const nearestCardRef = useRef<HTMLLIElement | null>(null)

  const countryNames: Record<string, string> = {
    AU: 'Australia',
    NZ: 'New Zealand',
    FJ: 'Fiji',
  }
  const countryName = countryNames[selectedCountry] || 'Your Country'

  const locationsForCountry: StaticLocation[] = useMemo(
    () => STATIC_LOCATIONS.filter((loc) => loc.country === selectedCountry),
    [selectedCountry]
  )

  const regions = useMemo(() => {
    const set = new Set(locationsForCountry.map((l) => l.region))
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [locationsForCountry])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return locationsForCountry.filter((loc) => {
      const matchesRegion = activeRegion === 'All' || loc.region === activeRegion
      const matchesSearch =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.region.toLowerCase().includes(q) ||
        branchShortName(loc.name).toLowerCase().includes(q)
      return matchesRegion && matchesSearch
    })
  }, [locationsForCountry, search, activeRegion])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, StaticLocation[]>>((acc, loc) => {
      if (!acc[loc.region]) acc[loc.region] = []
      acc[loc.region].push(loc)
      return acc
    }, {})
  }, [filtered])

  const mapLocations: MapLocation[] = useMemo(
    () =>
      filtered.filter(hasCoords).map((loc) => ({
        id: loc.id,
        name: loc.name,
        coordinates: { lat: loc.lat, lng: loc.lng },
        city: loc.region,
      })),
    [filtered]
  )

  useEffect(() => {
    setActiveRegion('All')
    setSearch('')
    setSelectedLocationId(null)
    setNearestId(null)
    setNearestDistanceKm(null)
    setLocateError(null)
  }, [selectedCountry])

  useEffect(() => {
    if (!nearestId) return
    const t = window.setTimeout(() => {
      nearestCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    return () => window.clearTimeout(t)
  }, [nearestId, selectedCountry, activeRegion])

  const findNearest = () => {
    setLocateError(null)
    if (!navigator.geolocation) {
      setLocateError('Location is not supported in this browser.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const withCoords = STATIC_LOCATIONS.filter(hasCoords)
        if (withCoords.length === 0) {
          setLocateError('Branch coordinates are not available yet.')
          setLocating(false)
          return
        }
        let best = withCoords[0]
        let bestKm = haversineKm(latitude, longitude, best.lat, best.lng)
        for (let i = 1; i < withCoords.length; i++) {
          const loc = withCoords[i]
          const km = haversineKm(latitude, longitude, loc.lat, loc.lng)
          if (km < bestKm) {
            best = loc
            bestKm = km
          }
        }
        setSearch('')
        setActiveRegion('All')
        setNearestId(best.id)
        setNearestDistanceKm(bestKm)
        setSelectedLocationId(best.id)
        if (best.country !== selectedCountry) {
          setSelectedCountry(best.country)
        }
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setLocateError('Location permission denied. Allow location access and try again.')
        } else {
          setLocateError('Could not get your location. Please try again.')
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  }

  const nearestLoc = nearestId
    ? STATIC_LOCATIONS.find((l) => l.id === nearestId) || null
    : null

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="relative flex-1 min-w-0">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by branch or suburb…"
            className="w-full h-12 rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <button
          type="button"
          onClick={findNearest}
          disabled={locating}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-wait disabled:opacity-70"
        >
          <PaperAirplaneIcon className={`h-4 w-4 ${locating ? 'animate-pulse' : ''}`} />
          {locating ? 'Finding…' : 'Find nearest to you'}
        </button>
      </div>

      {locateError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {locateError}
        </p>
      ) : null}

      {nearestLoc && nearestDistanceKm != null ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-primary-200 bg-primary-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Nearest branch · {formatDistance(nearestDistanceKm)} away
            </p>
            <p className="mt-0.5 truncate font-bold text-gray-900">
              {branchShortName(nearestLoc.name)}
            </p>
            <p className="text-sm text-gray-600">{nearestLoc.region}</p>
          </div>
          <Link
            href={`/locations/${nearestLoc.slug}`}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Open branch
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {regions.map((region) => {
          const count =
            region === 'All'
              ? locationsForCountry.length
              : locationsForCountry.filter((l) => l.region === region).length
          const active = activeRegion === region
          return (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              onMouseEnter={() => setHoveredRegion(region === 'All' ? null : region)}
              onMouseLeave={() => setHoveredRegion(null)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-700'
              }`}
            >
              {region}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                  active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] items-start">
          <div className="space-y-10">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([region, items]) => (
                <section key={region}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">{region}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {items.length} {items.length === 1 ? 'branch' : 'branches'}
                    </span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {items
                      .slice()
                      .sort((a, b) => {
                        if (nearestId) {
                          if (a.id === nearestId) return -1
                          if (b.id === nearestId) return 1
                        }
                        return branchShortName(a.name).localeCompare(branchShortName(b.name))
                      })
                      .map((loc) => {
                        const short = branchShortName(loc.name)
                        const isActive = selectedLocationId === loc.id
                        const isNearest = nearestId === loc.id
                        return (
                          <li
                            key={loc.id}
                            ref={isNearest ? nearestCardRef : undefined}
                          >
                            <Link
                              href={`/locations/${loc.slug}`}
                              onMouseEnter={() => {
                                setSelectedLocationId(loc.id)
                                setHoveredRegion(loc.region)
                              }}
                              onFocus={() => setSelectedLocationId(loc.id)}
                              onMouseLeave={() => setHoveredRegion(null)}
                              className={`group flex h-full flex-col rounded-2xl border bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                                isNearest
                                  ? 'border-primary-500 ring-2 ring-primary-200'
                                  : isActive
                                    ? 'border-primary-400 ring-2 ring-primary-100'
                                    : 'border-gray-200 hover:border-primary-300'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white">
                                  <MapPinIcon className="h-5 w-5" />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-gray-900 leading-snug group-hover:text-primary-700">
                                    {short}
                                  </p>
                                  <p className="mt-1 text-xs font-medium text-gray-500">
                                    {loc.region}
                                    {isNearest && nearestDistanceKm != null
                                      ? ` · ${formatDistance(nearestDistanceKm)}`
                                      : ''}
                                  </p>
                                </div>
                              </div>
                              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                                {isNearest ? 'Nearest · View branch' : 'View branch'}
                              </span>
                            </Link>
                          </li>
                        )
                      })}
                  </ul>
                </section>
              ))}
          </div>

          <div className="hidden lg:block lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-soft bg-white">
              <LocationsMap
                locations={mapLocations}
                country={selectedCountry as 'AU' | 'NZ' | 'FJ'}
                activeRegion={hoveredRegion || (activeRegion === 'All' ? null : activeRegion)}
                activeLocationId={selectedLocationId}
              />
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Hover a branch tile to highlight it on the map
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <MapPinIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-lg font-semibold text-gray-700">No branches match your search</p>
          <p className="mt-1 text-sm text-gray-500">
            Try another name, or clear filters for {countryName}.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setActiveRegion('All')
            }}
            className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
