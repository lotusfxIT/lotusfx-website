import { NextRequest, NextResponse } from 'next/server'
import {
  fetchAndCacheLocationDetails,
  getLocationDetailsCache,
  LOCATION_DETAILS_CACHE_TTL_MS,
} from '@/lib/location-details-cache'
import { getValidServerAccessToken } from '@/lib/google-auth-server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('id')

    if (!locationId) {
      return NextResponse.json({ error: 'Location ID required' }, { status: 400 })
    }

    const cache = getLocationDetailsCache()
    const cached = cache.get(locationId)
    const now = Date.now()

    if (cached && now - cached.fetchedAt < LOCATION_DETAILS_CACHE_TTL_MS) {
      console.log(`[Details API] Cache hit for ${locationId}`)
      return NextResponse.json({ ...cached.data, cached: true })
    }

    const accessToken = await getValidServerAccessToken()
    if (!accessToken) {
      if (cached?.data) {
        console.log(`[Details API] Auth missing — serving stale cache for ${locationId}`)
        return NextResponse.json({ ...cached.data, cached: true, stale: true })
      }
      return NextResponse.json(
        {
          error:
            'Server authentication not configured. Set GOOGLE_REFRESH_TOKEN (and run /auth once to obtain it).',
        },
        { status: 503 }
      )
    }

    try {
      const result = await fetchAndCacheLocationDetails(locationId, accessToken)
      if (!result.ok) {
        if (cached?.data) {
          console.log(`[Details API] Fetch failed — serving stale cache for ${locationId}`)
          return NextResponse.json({ ...cached.data, cached: true, stale: true })
        }
        return NextResponse.json({ error: result.error }, { status: result.status })
      }
      return NextResponse.json({ ...result.data, cached: false })
    } catch (fetchError) {
      console.error('[Details API] Fetch error:', fetchError)
      if (cached?.data) {
        return NextResponse.json({ ...cached.data, cached: true, stale: true })
      }
      throw fetchError
    }
  } catch (error) {
    console.error('[Details API] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch location details' }, { status: 500 })
  }
}
