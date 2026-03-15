'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const VALID_COUNTRIES = ['AU', 'NZ', 'FJ']

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
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState('NZ')
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Priority: subdomain cookie (from middleware) → localStorage → IP detection. Default NZ (lotusfx.com).
  useEffect(() => {
    setIsClient(true)
    const fromSubdomain = getCountryFromCookie()
    const savedCountry = localStorage.getItem('selectedCountry')

    if (fromSubdomain) {
      setSelectedCountry(fromSubdomain)
      setDetectedCountry(fromSubdomain)
      localStorage.setItem('selectedCountry', fromSubdomain)
    } else if (savedCountry && VALID_COUNTRIES.includes(savedCountry)) {
      setSelectedCountry(savedCountry)
    } else {
      detectCountryFromIP()
    }
  }, [])

  const detectCountryFromIP = async () => {
    try {
      const response = await fetch('/api/detect-country')
      const data = await response.json()
      if (data.country && VALID_COUNTRIES.includes(data.country)) {
        setDetectedCountry(data.country)
        setSelectedCountry(data.country)
        localStorage.setItem('selectedCountry', data.country)
      }
    } catch (error) {
      console.log('Could not detect country, using default NZ')
      setSelectedCountry('NZ')
    }
  }

  // Save to localStorage whenever country changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('selectedCountry', selectedCountry)
      // Dispatch event for components that need to react to country changes
      window.dispatchEvent(new CustomEvent('countryChange', { detail: { country: selectedCountry } }))
    }
  }, [selectedCountry, isClient])

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry, detectedCountry }}>
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

