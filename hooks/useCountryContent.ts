'use client'

import { useState, useEffect } from 'react'
import { useCountry } from '@/context/CountryContext'

export function useCountryContent() {
  const { selectedCountry } = useCountry()
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/content/${selectedCountry}`)
        if (!response.ok) throw new Error('Failed to fetch content')
        const data = await response.json()
        setContent(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [selectedCountry])

  return { content, loading, error, selectedCountry }
}

