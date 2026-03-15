import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { STATS } from '@/config/stats'

const CONTENT_DIR = path.join(process.cwd(), 'public', 'content')

// Ensure content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true })
}

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    const country = params.country.toUpperCase()
    const contentFile = path.join(CONTENT_DIR, `${country}.json`)

    if (!fs.existsSync(contentFile)) {
      // Return default content if file doesn't exist
      return NextResponse.json(getDefaultContent(country))
    }

    const content = fs.readFileSync(contentFile, 'utf-8')
    return NextResponse.json(JSON.parse(content))
  } catch (error) {
    console.error('Error reading content:', error)
    return NextResponse.json(
      { error: 'Failed to read content' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { country: string } }
) {
  try {
    // Check admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const adminToken = request.cookies.get('adminToken')?.value

    if (!token && !adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const country = params.country.toUpperCase()
    const content = await request.json()
    const contentFile = path.join(CONTENT_DIR, `${country}.json`)

    fs.writeFileSync(contentFile, JSON.stringify(content, null, 2))

    return NextResponse.json({
      success: true,
      message: `Content updated for ${country}`,
    })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    )
  }
}

function getDefaultContent(country: string) {
  const defaults: Record<string, any> = {
    AU: {
      country: 'Australia',
      flag: '🇦🇺',
      heroTitle: 'Best Currency Exchange Rates in Australia',
      heroSubtitle: `Get the most competitive exchange rates with no hidden fees. Exchange 25+ currencies at our ${STATS.branches.australia} branches across Australia.`,
      exchangeRates: 'Competitive rates updated in real-time',
      branches: STATS.branches.australia,
      customers: STATS.customers.australia,
      rating: '4.9★',
    },
    NZ: {
      country: 'New Zealand',
      flag: '🇳🇿',
      heroTitle: 'Best Currency Exchange Rates in New Zealand',
      heroSubtitle: `Get the most competitive exchange rates with no hidden fees. Exchange 25+ currencies at our ${STATS.branches.newZealand} branches across New Zealand.`,
      exchangeRates: 'Competitive rates updated in real-time',
      branches: STATS.branches.newZealand,
      customers: STATS.customers.newZealand,
      rating: '4.9★',
    },
    FJ: {
      country: 'Fiji',
      flag: '🇫🇯',
      heroTitle: 'Best Currency Exchange Rates in Fiji',
      heroSubtitle: `Get the most competitive exchange rates with no hidden fees. Exchange 25+ currencies at our ${STATS.branches.fiji} branches across Fiji.`,
      exchangeRates: 'Competitive rates updated in real-time',
      branches: STATS.branches.fiji,
      customers: STATS.customers.fiji,
      rating: '4.9★',
    },
  }

  return defaults[country] || defaults.AU
}

