'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

const VALID_COUNTRIES = ['AU', 'NZ', 'FJ']
const STORAGE_COUNTRY = 'selectedCountry'
const STORAGE_MANUAL = 'countryManual'

function getCountryFromCookie(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.split('; ').find((row) => row.startsWith('NEXT_COUNTRY='))
  const value = match?.split('=')[1]?.toUpperCase()
  return value && VALID_COUNTRIES.includes(value) ? value : null
}

interface CountryContextType {
  selectedCountry: string
  setSelectedCountry: (country: string) => void
  detectedCountry: string | null
  /** True after cookie / localStorage / IP init has run (client only). */
  countryReady: boolean
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountryState] = useState('AU')
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [countryReady, setCountryReady] = useState(false)

  // Header / UI: explicit user choice — sticky until they change it again.
  const setSelectedCountry = useCallback((country: string) => {
    if (!VALID_COUNTRIES.includes(country)) return
    setSelectedCountryState(country)
    try {
      localStorage.setItem(STORAGE_COUNTRY, country)
      localStorage.setItem(STORAGE_MANUAL, '1')
    } catch {
      /* ignore */
    }
  }, [])

  // Priority: manual switcher → country subdomain cookie → IP/Vercel geo.
  useEffect(() => {
    setIsClient(true)
    let cancelled = false

    const init = async () => {
      const fromSubdomain = getCountryFromCookie()
      const savedCountry = localStorage.getItem(STORAGE_COUNTRY)
      const isManual = localStorage.getItem(STORAGE_MANUAL) === '1'

      if (isManual && savedCountry && VALID_COUNTRIES.includes(savedCountry)) {
        setSelectedCountryState(savedCountry)
        if (fromSubdomain) setDetectedCountry(fromSubdomain)
        setCountryReady(true)
        return
      }

      if (fromSubdomain) {
        setSelectedCountryState(fromSubdomain)
        setDetectedCountry(fromSubdomain)
        try {
          localStorage.setItem(STORAGE_COUNTRY, fromSubdomain)
          localStorage.removeItem(STORAGE_MANUAL)
        } catch {
          /* ignore */
        }
        setCountryReady(true)
        return
      }

      try {
        const response = await fetch('/api/detect-country')
        const data = await response.json()
        if (cancelled) return
        if (data.country && VALID_COUNTRIES.includes(data.country)) {
          setDetectedCountry(data.country)
          setSelectedCountryState(data.country)
          try {
            localStorage.setItem(STORAGE_COUNTRY, data.country)
            localStorage.removeItem(STORAGE_MANUAL)
          } catch {
            /* ignore */
          }
        }
      } catch {
        if (!cancelled) {
          console.log('Could not detect country, using default AU')
          setSelectedCountryState('AU')
        }
      } finally {
        if (!cancelled) setCountryReady(true)
      }
    }

    void init()
    return () => {
      cancelled = true
    }
  }, [])

  // Keep localStorage in sync for non-manual updates (geo / subdomain).
  useEffect(() => {
    if (!isClient || !countryReady) return
    try {
      localStorage.setItem(STORAGE_COUNTRY, selectedCountry)
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new CustomEvent('countryChange', { detail: { country: selectedCountry } }))
  }, [selectedCountry, isClient, countryReady])

  return (
    <CountryContext.Provider
      value={{ selectedCountry, setSelectedCountry, detectedCountry, countryReady }}
    >
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}
