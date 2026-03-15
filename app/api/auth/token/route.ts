import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 })
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'OAuth credentials not configured' }, { status: 500 })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange error:', errorData)
      console.error('Request details:', {
        clientId: clientId ? 'Present' : 'Missing',
        clientSecret: clientSecret ? 'Present' : 'Missing',
        redirectUri,
        code: code ? 'Present' : 'Missing'
      })
      return NextResponse.json({ 
        error: 'Failed to exchange code for token',
        details: errorData 
      }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()

    // Calculate expiry time
    const expiryTime = Date.now() + (tokenData.expires_in * 1000)

    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      expiry_date: expiryTime,
    })

  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
