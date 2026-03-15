import { NextRequest, NextResponse } from 'next/server'

/**
 * Admin Cache Refresh Endpoint
 * 
 * Manually refresh the location cache.
 * Can be called by admin or background job.
 * 
 * POST /api/admin/refresh-cache
 * 
 * Optional: Add authentication middleware here for production
 */

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check in production
    // const authHeader = request.headers.get('authorization')
    // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    console.log('Manual cache refresh triggered')

    // Clear cache by calling the cached endpoint
    // This will force a fresh fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    request.headers.get('origin') || 
                    'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/locations/cached`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to refresh cache')
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: `Cache refreshed successfully. ${data.locations.length} locations loaded.`,
      locationsCount: data.locations.length,
      cached: data.cached,
      timestamp: data.timestamp
    })

  } catch (error) {
    console.error('Error refreshing cache:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to refresh cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
