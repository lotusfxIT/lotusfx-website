import { NextRequest, NextResponse } from 'next/server'

/**
 * Admin Token Status Endpoint
 * 
 * Check the status of server-side Google OAuth tokens.
 * 
 * GET /api/admin/token-status
 */

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check in production
    // const authHeader = request.headers.get('authorization')
    // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const accessToken = process.env.GOOGLE_ACCESS_TOKEN
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
    const expiryDate = process.env.GOOGLE_TOKEN_EXPIRY

    const now = Date.now()
    const expiry = expiryDate ? parseInt(expiryDate) : 0
    const isExpired = expiry && expiry <= now
    const expiresIn = expiry ? Math.max(0, expiry - now) : 0
    const expiresInMinutes = Math.floor(expiresIn / 60000)
    const expiresInHours = Math.floor(expiresInMinutes / 60)

    // Test token validity
    let tokenValid = false
    if (accessToken) {
      try {
        const testResponse = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        tokenValid = testResponse.ok
      } catch (error) {
        tokenValid = false
      }
    }

    return NextResponse.json({
      configured: !!(accessToken && refreshToken),
      accessToken: accessToken ? '***configured***' : 'not set',
      refreshToken: refreshToken ? '***configured***' : 'not set',
      expiryDate: expiryDate || 'not set',
      isExpired,
      expiresIn: expiresInMinutes > 0 ? `${expiresInMinutes} minutes (${expiresInHours} hours)` : 'expired',
      tokenValid,
      status: !accessToken || !refreshToken 
        ? 'not_configured' 
        : isExpired 
          ? 'expired' 
          : tokenValid 
            ? 'valid' 
            : 'invalid'
    })

  } catch (error) {
    console.error('Error checking token status:', error)
    return NextResponse.json({
      error: 'Failed to check token status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
