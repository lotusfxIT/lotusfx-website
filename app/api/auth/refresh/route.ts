import { NextRequest, NextResponse } from 'next/server'

/**
 * Token Refresh API Endpoint
 * 
 * This endpoint refreshes an expired Google OAuth access token using a refresh token.
 * 
 * Usage:
 * POST /api/auth/refresh
 * Body: { refreshToken: string }
 * 
 * Returns:
 * {
 *   access_token: string,
 *   expires_in: number,
 *   expiry_date: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json({ 
        error: 'Refresh token is required' 
      }, { status: 400 })
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ 
        error: 'OAuth credentials not configured' 
      }, { status: 500 })
    }

    // Exchange refresh token for new access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token refresh error:', errorData)
      
      // If refresh token is invalid/expired, user needs to re-authenticate
      if (tokenResponse.status === 400) {
        return NextResponse.json({ 
          error: 'Refresh token is invalid or expired. Please re-authenticate.',
          requiresReauth: true
        }, { status: 401 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to refresh access token',
        details: errorData 
      }, { status: tokenResponse.status })
    }

    const tokenData = await tokenResponse.json()

    // Calculate expiry time (access tokens typically expire in 1 hour)
    const expiryTime = Date.now() + (tokenData.expires_in * 1000)

    return NextResponse.json({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      expiry_date: expiryTime,
      // Note: Google may return a new refresh token, but usually keeps the same one
      refresh_token: tokenData.refresh_token || refreshToken,
    })

  } catch (error) {
    console.error('Error in token refresh:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
