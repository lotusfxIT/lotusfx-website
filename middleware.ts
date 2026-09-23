import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'NEXT_COUNTRY'
const VALID_COUNTRIES = ['AU', 'NZ', 'FJ'] as const

// Host → country. Production: lotusfx.com. Testing: stafflotusfx.com.
const HOST_TO_COUNTRY: Record<string, (typeof VALID_COUNTRIES)[number]> = {
  // Production
  'au.lotusfx.com': 'AU',
  'www.au.lotusfx.com': 'AU',
  'fj.lotusfx.com': 'FJ',
  'www.fj.lotusfx.com': 'FJ',
  'nz.lotusfx.com': 'NZ',
  'www.nz.lotusfx.com': 'NZ',
  'lotusfx.com': 'NZ',
  'www.lotusfx.com': 'NZ',
  // Testing (stafflotusfx.com)
  'au.stafflotusfx.com': 'AU',
  'www.au.stafflotusfx.com': 'AU',
  'fj.stafflotusfx.com': 'FJ',
  'www.fj.stafflotusfx.com': 'FJ',
  'nz.stafflotusfx.com': 'NZ',
  'www.nz.stafflotusfx.com': 'NZ',
  'stafflotusfx.com': 'NZ',
  'www.stafflotusfx.com': 'NZ',
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
    // Readable on the client so the country switcher / Quick Order gate can sync.
    response.cookies.set(COOKIE_NAME, country, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false,
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
