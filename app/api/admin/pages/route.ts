import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PAGES_FILE = path.join(process.cwd(), 'public', 'pages-content.json')

// Default pages structure
const DEFAULT_PAGES = {
  home: {
    title: 'Home',
    description: 'Best Currency Exchange Rates',
    hero: {
      title: 'Best Currency Exchange Rates in Australia',
      subtitle: 'Get the best rates for international money transfers and currency exchange',
      badge: 'Trusted by 6,000+ customers',
      cta_primary: 'Get Started',
      cta_secondary: 'Learn More',
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

function getPages() {
  try {
    if (fs.existsSync(PAGES_FILE)) {
      const data = fs.readFileSync(PAGES_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading pages file:', error)
  }
  return DEFAULT_PAGES
}

function savePages(pages: any) {
  try {
    fs.writeFileSync(PAGES_FILE, JSON.stringify(pages, null, 2))
    return true
  } catch (error) {
    console.error('Error saving pages file:', error)
    return false
  }
}

export async function GET() {
  try {
    const pages = getPages()
    return NextResponse.json(pages)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const cookieToken = request.cookies.get('admin_token')?.value

    if (!token && !cookieToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { pages: updatedPages } = body

    if (updatedPages && typeof updatedPages === 'object') {
      if (savePages(updatedPages)) {
        return NextResponse.json({
          success: true,
          message: 'Pages updated successfully',
        })
      }
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update pages' },
      { status: 500 }
    )
  }
}

