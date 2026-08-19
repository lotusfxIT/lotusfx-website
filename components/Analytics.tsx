'use client'

import { Suspense } from 'react'
import AnalyticsScripts from '@/components/analytics/AnalyticsScripts'
import AnalyticsPageView from '@/components/analytics/AnalyticsPageView'

/** Root analytics mount — keeps tracking out of server layout body logic. */
export default function Analytics() {
  return (
    <>
      <AnalyticsScripts />
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
    </>
  )
}
