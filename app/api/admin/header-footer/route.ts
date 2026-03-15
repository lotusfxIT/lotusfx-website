import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'public', 'header-footer-config.json')

const DEFAULT_CONFIG = {
  header: {
    logo_text: 'LotusFX',
    nav_items: [
      { name: 'Currency Exchange', href: '/currency-exchange' },
      { name: 'Money Transfer', href: '/money-transfer' },
      { name: 'Locations', href: '/locations' },
      { name: 'Rates', href: '/rates' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  footer: {
    company_name: 'LotusFX',
    description: 'Your trusted partner for currency exchange and money transfers across Australia, New Zealand, and Fiji.',
    contact_phone: '+61 2 1234 5678',
    contact_email: 'info@lotusfx.com',
    social_links: [
      { name: 'Facebook', url: 'https://facebook.com/lotusfx' },
      { name: 'Instagram', url: 'https://instagram.com/lotusfx' },
      { name: 'LinkedIn', url: 'https://linkedin.com/company/lotusfx' },
    ],
    sections: {
      'Services': [
        { name: 'Currency Exchange', href: '/currency-exchange' },
        { name: 'Money Transfer', href: '/money-transfer' },
        { name: 'Travel Money', href: '/travel-money' },
        { name: 'Business FX', href: '/business-fx' },
      ],
      'Locations': [
        { name: 'Australia', href: '/au' },
        { name: 'New Zealand', href: '/nz' },
        { name: 'Fiji', href: '/fj' },
        { name: 'Find a Branch', href: '/locations' },
      ],
      'Support': [
        { name: 'Complaints', href: '/complaints' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
      ],
      'Company': [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    legal_links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security', href: '/security' },
    ],
  },
}

function getConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error reading config file:', error)
  }
  return DEFAULT_CONFIG
}

function saveConfig(config: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    return true
  } catch (error) {
    console.error('Error saving config file:', error)
    return false
  }
}

export async function GET() {
  try {
    const config = getConfig()
    return NextResponse.json(config)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
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

    if (body && typeof body === 'object') {
      if (saveConfig(body)) {
        return NextResponse.json({
          success: true,
          message: 'Configuration updated successfully',
        })
      }
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}

