import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const VALID = new Set(['AU', 'NZ', 'FJ'])

function mapToSupported(code: string | null | undefined): 'AU' | 'NZ' | 'FJ' | null {
  const c = (code || '').toUpperCase()
  if (VALID.has(c)) return c as 'AU' | 'NZ' | 'FJ'
  return null
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    ''
  )
}

async function lookupIpApi(ip: string): Promise<string | null> {
  if (!ip || ip === '0.0.0.0' || ip === '::1' || ip.startsWith('127.')) return null
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return mapToSupported(data.country_code)
  } catch {
    return null
  }
}

async function lookupIpWho(ip: string): Promise<string | null> {
  if (!ip || ip === '0.0.0.0' || ip === '::1' || ip.startsWith('127.')) return null
  try {
    const res = await fetch(`https://ipwho.is/${ip}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data.success === false) return null
    return mapToSupported(data.country_code)
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const ip = clientIp(request)

    // 1) Vercel edge geo (no external call; most reliable on production)
    const vercelCountry =
      mapToSupported(request.headers.get('x-vercel-ip-country')) ||
      mapToSupported(request.geo?.country)

    if (vercelCountry) {
      return NextResponse.json({
        country: vercelCountry,
        countryCode: vercelCountry,
        source: 'vercel',
        ip: ip || undefined,
      })
    }

    // 2) External IP lookups (fallback for local / non-Vercel)
    const fromIpApi = await lookupIpApi(ip)
    if (fromIpApi) {
      return NextResponse.json({
        country: fromIpApi,
        countryCode: fromIpApi,
        source: 'ipapi',
        ip,
      })
    }

    const fromIpWho = await lookupIpWho(ip)
    if (fromIpWho) {
      return NextResponse.json({
        country: fromIpWho,
        countryCode: fromIpWho,
        source: 'ipwho',
        ip,
      })
    }

    // Unknown region → AU as neutral default among supported markets
    return NextResponse.json({
      country: 'AU',
      countryCode: null,
      source: 'default',
      ip: ip || undefined,
    })
  } catch (error) {
    console.error('Error detecting country:', error)
    return NextResponse.json({
      country: 'AU',
      error: 'Could not detect country',
      source: 'error',
    })
  }
}
