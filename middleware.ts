import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'NEXT_COUNTRY'
const VALID_COUNTRIES = ['AU', 'NZ', 'FJ'] as const

// Subdomain (or root) → country. Configure your production domain here.
const HOST_TO_COUNTRY: Record<string, (typeof VALID_COUNTRIES)[number]> = {
  'au.lotusfx.com': 'AU',
  'fj.lotusfx.com': 'FJ',
  'nz.lotusfx.com': 'NZ',
  'lotusfx.com': 'NZ', // root = default NZ
}

function getCountryFromHost(hostname: string): (typeof VALID_COUNTRIES)[number] | null {
  const normalized = hostname.toLowerCase()
  return HOST_TO_COUNTRY[normalized] ?? null
}

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname
  const country = getCountryFromHost(hostname)

  const response = NextResponse.next()

  if (country && VALID_COUNTRIES.includes(country)) {
    response.cookies.set(COOKIE_NAME, country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and API routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
