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
  return { center: [134.0, -25.0], zoom: 3.3 } // AU default
}

export default function LocationsMap({ locations, country, activeRegion, activeLocationId }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  // Init map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return
    if (!mapboxgl.accessToken) return

    const view = getInitialView(country)
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
      center: view.center,
      zoom: view.zoom,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [country])

  // Update markers / view when locations or selection change
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear existing markers
    ;(map as any)._lotusMarkers?.forEach((m: mapboxgl.Marker) => m.remove())
    ;(map as any)._lotusMarkers = []

    if (!locations.length) return

    const bounds = new mapboxgl.LngLatBounds()

    locations.forEach((loc) => {
      if (!loc.coordinates || !loc.coordinates.lng || !loc.coordinates.lat) return
      const marker = new mapboxgl.Marker({ color: '#b01c2e' })
        .setLngLat([loc.coordinates.lng, loc.coordinates.lat])
        .addTo(map)

      marker.getElement().addEventListener('click', () => {
        new mapboxgl.Popup({ offset: 12 })
          .setLngLat([loc.coordinates.lng, loc.coordinates.lat])
          .setHTML(`<strong>${loc.name}</strong>`)
          .addTo(map)
      })

      ;(map as any)._lotusMarkers.push(marker)
      bounds.extend([loc.coordinates.lng, loc.coordinates.lat])
    })

    // Determine focus: active location > active region > all
    const activeLoc =
      (activeLocationId && locations.find((l) => l.id === activeLocationId)) || null

    if (activeLoc && activeLoc.coordinates.lng && activeLoc.coordinates.lat) {
      map.flyTo({
        center: [activeLoc.coordinates.lng, activeLoc.coordinates.lat],
        zoom: 13,
        speed: 0.8,
        curve: 1.4,
        essential: true,
      })
      return
    }

    const regionLocs =
      activeRegion && activeRegion !== 'Other'
        ? locations.filter((l) => l.city === activeRegion)
        : []

    if (regionLocs.length > 0) {
      const regionBounds = new mapboxgl.LngLatBounds()
      regionLocs.forEach((loc) => {
        if (loc.coordinates.lng && loc.coordinates.lat) {
          regionBounds.extend([loc.coordinates.lng, loc.coordinates.lat])
        }
      })
      if (!regionBounds.isEmpty()) {
        const center = regionBounds.getCenter()
        map.flyTo({
          center: [center.lng, center.lat],
          zoom: 8.8,
          speed: 0.7,
          curve: 1.5,
          essential: true,
        })
        return
      }
    }

    // If no active region/location, show the whole country view
    if (!activeRegion && !activeLocationId) {
      const view = getInitialView(country)
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        speed: 0.7,
        curve: 1.4,
        essential: true,
      })
      return
    }

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80, duration: 1100 })
    }
  }, [locations, activeRegion, activeLocationId, country])

  return (
    <div
      ref={mapContainer}
      className="w-full h-80 lg:h-[480px] rounded-2xl shadow-strong border border-primary-100 overflow-hidden"
    />
  )
}

