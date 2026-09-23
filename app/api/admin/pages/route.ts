import { NextRequest, NextResponse } from 'next/server'
import { readAdminJson, writeAdminJson } from '@/lib/admin-json-store'

const PAGES_RELATIVE = 'public/pages-content.json'

const DEFAULT_PAGES = {
  home: {
    title: 'Home',
    description: 'Best Currency Exchange Rates',
    hero: {
      title: 'Get more holiday out of your travel money',
      subtitle:
        'Market-leading exchange rates, no commission on currency exchange, and friendly service across Australia, New Zealand and Fiji.',
      badge: 'Trusted by 560,000+ customers',
      cta_primary: 'Quick Order',
      cta_secondary: 'Find a branch',
    },
    features: {
      title: 'Why Choose LotusFX?',
      subtitle: 'We offer the best rates and fastest service',
      items: [
        { title: 'Best Rates', description: 'Competitive exchange rates updated in real-time' },
        { title: 'Fast Service', description: 'Quick processing and instant transfers' },
        { title: '24/7 Support', description: 'Round-the-clock customer support' },
      ],
    },
  },
  'currency-exchange': {
    title: 'Currency Exchange',
    description: 'Exchange currencies at the best rates',
    hero: {
      title: 'Currency Exchange Services',
      subtitle: 'Get competitive rates for all major currencies',
    },
  },
  'money-transfer': {
    title: 'Money Transfer',
    description: 'Fast and secure international money transfers',
    hero: {
      title: 'International Money Transfer',
      subtitle: 'Send money to 50+ countries safely and quickly',
    },
  },
}

function isAuthed(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  const cookieToken =
    request.cookies.get('admin_token')?.value || request.cookies.get('adminToken')?.value
  return !!(token || cookieToken)
}

export async function GET() {
  try {
    const pages = await readAdminJson(PAGES_RELATIVE, DEFAULT_PAGES)
    return NextResponse.json(pages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized — please log in again' }, { status: 401 })
    }

    const body = await request.json()
    const { pages: updatedPages } = body

    if (!updatedPages || typeof updatedPages !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const result = await writeAdminJson(PAGES_RELATIVE, updatedPages)
    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          persisted: false,
          pages: result.data,
          filename: 'pages-content.json',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Pages updated successfully',
      persisted: true,
      method: result.method,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update pages' }, { status: 500 })
  }
}
