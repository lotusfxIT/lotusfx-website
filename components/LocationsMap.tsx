'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

type MapLocation = {
  id: string
  name: string
  coordinates: { lat: number; lng: number }
  city?: string
}

type Props = {
  locations: MapLocation[]
  country: 'AU' | 'NZ' | 'FJ'
  activeRegion: string | null
  activeLocationId: string | null
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

function getInitialView(country: 'AU' | 'NZ' | 'FJ'): { center: [number, number]; zoom: number } {
  if (country === 'NZ') return { center: [174.7633, -41.0], zoom: 4.2 }
  if (country === 'FJ') return { center: [178.0, -17.8], zoom: 5 }
  return { center: [134.0, -25.0], zoom: 3.3 }
}

function hasValidCoords(loc: MapLocation) {
  const { lat, lng } = loc.coordinates || { lat: 0, lng: 0 }
  return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)
}

export default function LocationsMap({ locations, country, activeRegion, activeLocationId }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const readyRef = useRef(false)

  // Init map once per country
  useEffect(() => {
    if (!mapContainer.current) return
    if (!mapboxgl.accessToken) return

    readyRef.current = false
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const view = getInitialView(country)
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
      center: view.center,
      zoom: view.zoom,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => {
      readyRef.current = true
      map.resize()
    })
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      readyRef.current = false
    }
  }, [country])

  // Update markers / view when locations or selection change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const apply = () => {
      ;(map as any)._lotusMarkers?.forEach((m: mapboxgl.Marker) => m.remove())
      ;(map as any)._lotusMarkers = []

      const plottable = locations.filter(hasValidCoords)
      if (!plottable.length) return

      const bounds = new mapboxgl.LngLatBounds()

      plottable.forEach((loc) => {
        const el = document.createElement('div')
        el.className = 'lotus-map-pin'
        el.style.cssText = [
          'width:18px',
          'height:18px',
          'border-radius:50% 50% 50% 0',
          'background:#b01c2e',
          'border:2px solid #fff',
          'box-shadow:0 2px 8px rgba(0,0,0,0.35)',
          'transform:rotate(-45deg)',
          'cursor:pointer',
        ].join(';')

        const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([loc.coordinates.lng, loc.coordinates.lat])
          .addTo(map)

        marker.getElement().addEventListener('click', () => {
          new mapboxgl.Popup({ offset: 16 })
            .setLngLat([loc.coordinates.lng, loc.coordinates.lat])
            .setHTML(`<strong style="color:#111">${loc.name.replace(/^Lotus Foreign Exchange\s*[-–—]\s*/i, '')}</strong>`)
            .addTo(map)
        })

        ;(map as any)._lotusMarkers.push(marker)
        bounds.extend([loc.coordinates.lng, loc.coordinates.lat])
      })

      const activeLoc =
        (activeLocationId && plottable.find((l) => l.id === activeLocationId)) || null

      if (activeLoc) {
        map.flyTo({
          center: [activeLoc.coordinates.lng, activeLoc.coordinates.lat],
          zoom: 13,
          speed: 0.85,
          curve: 1.4,
          essential: true,
        })
        return
      }

      const regionLocs =
        activeRegion && activeRegion !== 'Other'
          ? plottable.filter((l) => l.city === activeRegion)
          : []

      if (regionLocs.length > 0) {
        const regionBounds = new mapboxgl.LngLatBounds()
        regionLocs.forEach((loc) => {
          regionBounds.extend([loc.coordinates.lng, loc.coordinates.lat])
        })
        if (!regionBounds.isEmpty()) {
          map.fitBounds(regionBounds, {
            padding: 70,
            maxZoom: 11,
            duration: 1100,
            essential: true,
          })
          return
        }
      }

      // Default: animate to fit all pins for the current country/filter
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 80,
          maxZoom: country === 'FJ' ? 9 : country === 'NZ' ? 6.5 : 5.2,
          duration: 1200,
          essential: true,
        })
      }
    }

    if (readyRef.current || map.isStyleLoaded()) {
      apply()
    } else {
      map.once('load', apply)
    }
  }, [locations, activeRegion, activeLocationId, country])

  if (!mapboxgl.accessToken) {
    return (
      <div className="w-full h-80 lg:h-[480px] rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
        Map unavailable
      </div>
    )
  }

  return (
    <div
      ref={mapContainer}
      className="w-full h-80 lg:h-[480px] rounded-2xl shadow-strong border border-primary-100 overflow-hidden"
    />
  )
}
