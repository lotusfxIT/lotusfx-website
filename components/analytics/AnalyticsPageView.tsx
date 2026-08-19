'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'
import { canLoadAnalytics } from '@/lib/analytics-consent'

/** Fires page_view on App Router client navigations (not just popstate). */
export default function AnalyticsPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!canLoadAnalytics()) return

    const query = searchParams?.toString()
    const path = query ? `${pathname}?${query}` : pathname

    if (lastPath.current === path) return
    lastPath.current = path

    trackPageView(path)
  }, [pathname, searchParams])

  return null
}
