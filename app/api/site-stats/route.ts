import { NextResponse } from 'next/server'
import { mergeSiteStats } from '@/config/stats'
import { readSiteStats } from '@/lib/site-stats-server'

/** Public read — used by the live site. */
export async function GET() {
  try {
    return NextResponse.json(await readSiteStats(), {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('[site-stats] GET error:', error)
    return NextResponse.json(mergeSiteStats(null), { status: 200 })
  }
}
