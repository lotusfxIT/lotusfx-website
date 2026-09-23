import { NextRequest, NextResponse } from 'next/server'
import { readSiteStatsFile } from '@/lib/site-stats-server'
import { readAdminJson, writeAdminJson } from '@/lib/admin-json-store'

function isAuthed(request: NextRequest) {
  const headerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  const cookieToken =
    request.cookies.get('admin_token')?.value || request.cookies.get('adminToken')?.value
  return !!(headerToken || cookieToken)
}

function contentPath(country: string) {
  return `public/content/${country}.json`
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const country = params.country.toUpperCase()
    const content = await readAdminJson(contentPath(country), getDefaultContent(country))
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error reading content:', error)
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    if (!isAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized — please log in again' }, { status: 401 })
    }

    const country = params.country.toUpperCase()
    const content = await request.json()
    const result = await writeAdminJson(contentPath(country), content)

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          persisted: false,
          content: result.data,
          filename: `${country}.json`,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Content updated for ${country}`,
      persisted: true,
      method: result.method,
    })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}

function getDefaultContent(country: string) {
  const stats = readSiteStatsFile()
  const defaults: Record<string, any> = {
    AU: {
      country: 'Australia',
      flag: '🇦🇺',
      heroTitle: 'Get more holiday out of your travel money',
      heroSubtitle:
        'Market-leading exchange rates, no commission on currency exchange, and 50+ locations across Australia, New Zealand and Fiji.',
      exchangeRates: 'Competitive rates updated in real-time',
      branches: stats.branches.australia,
      customers: stats.customers.australia,
      rating: stats.customerRating,
    },
    NZ: {
      country: 'New Zealand',
      flag: '🇳🇿',
      heroTitle: 'Get more holiday out of your travel money',
      heroSubtitle:
        'Market-leading exchange rates, no commission on currency exchange, and 50+ locations across Australia, New Zealand and Fiji.',
      exchangeRates: 'Competitive rates updated in real-time',
      branches: stats.branches.newZealand,
      customers: stats.customers.newZealand,
      rating: stats.customerRating,
    },
    FJ: {
      country: 'Fiji',
      flag: '🇫🇯',
      heroTitle: 'Get more holiday out of your travel money',
      heroSubtitle:
        'Market-leading exchange rates, no commission on currency exchange, and 50+ locations across Australia, New Zealand and Fiji.',
      exchangeRates: 'Competitive rates updated in real-time',
      branches: stats.branches.fiji,
      customers: stats.customers.fiji,
      rating: stats.customerRating,
    },
  }

  return defaults[country] || defaults.AU
}
