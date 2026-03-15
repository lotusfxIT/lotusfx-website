import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               request.ip || 
               '0.0.0.0'

    // Use IP geolocation service (free tier)
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()

    // Map country codes to our supported countries
    const countryCode = data.country_code
    let detectedCountry = 'AU' // Default to AU

    if (countryCode === 'NZ') {
      detectedCountry = 'NZ'
    } else if (countryCode === 'FJ') {
      detectedCountry = 'FJ'
    } else if (countryCode === 'AU') {
      detectedCountry = 'AU'
    }

    return NextResponse.json({
      country: detectedCountry,
      countryCode: countryCode,
      ip: ip,
    })
  } catch (error) {
    console.error('Error detecting country:', error)
    // Default to AU if detection fails
    return NextResponse.json({
      country: 'AU',
      error: 'Could not detect country',
    })
  }
}

