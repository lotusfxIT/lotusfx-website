'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { DEFAULT_SITE_STATS, mergeSiteStats, type SiteStats } from '@/config/stats'

type SiteStatsContextType = {
  stats: SiteStats
  loading: boolean
  refresh: () => Promise<void>
}

const SiteStatsContext = createContext<SiteStatsContextType | undefined>(undefined)

export function SiteStatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<SiteStats>(DEFAULT_SITE_STATS)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await fetch(`/api/site-stats?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setStats(mergeSiteStats(data))
      }
    } catch (error) {
      console.error('[SiteStats] fetch failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refresh()
    const onFocus = () => {
      void refresh()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  return (
    <SiteStatsContext.Provider value={{ stats, loading, refresh }}>
      {children}
    </SiteStatsContext.Provider>
  )
}

export function useSiteStats() {
  const ctx = useContext(SiteStatsContext)
  if (!ctx) {
    // Fallback if provider missing — still render with defaults
    return { stats: DEFAULT_SITE_STATS, loading: false, refresh: async () => {} }
  }
  return ctx
}
