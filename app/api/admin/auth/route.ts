import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if admin is authenticated via cookie or header
    const cookieToken = request.cookies.get('admin_token')?.value
    const authHeader = request.headers.get('authorization')
    const headerToken = authHeader?.replace('Bearer ', '')

    if (!cookieToken && !headerToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Accept any valid token (in production, validate against your auth system)
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Default admin credentials
    const ADMIN_EMAIL = 'admin@lotusfx.com'
    const ADMIN_PASSWORD = 'LotusFX@2024'

    // Validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a session/token
      const token = 'admin-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      const response = NextResponse.json({
        success: true,
        token: token,
      })

      // Set secure cookie
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}

