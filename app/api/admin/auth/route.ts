import { NextRequest, NextResponse } from 'next/server'
import {
  adminCredentialsConfigured,
  checkAdminCredentials,
  createAdminToken,
  isAdminRequest,
} from '@/lib/admin-auth'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true })
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, 'admin-login', 5, 15 * 60 * 1000)
    if (limited) return limited

    if (!adminCredentialsConfigured()) {
      return NextResponse.json(
        { error: 'Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.' },
        { status: 503 }
      )
    }

    const { email, password } = await request.json()
    if (!checkAdminCredentials(email, password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = createAdminToken()
    const response = NextResponse.json({ success: true, token })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
