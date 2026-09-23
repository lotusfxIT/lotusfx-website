import { NextRequest, NextResponse } from 'next/server'
import { mergeSiteStats, type SiteStats } from '@/config/stats'
import { readSiteStats, writeSiteStats } from '@/lib/site-stats-server'

function isAuthed(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  const cookieToken =
    request.cookies.get('admin_token')?.value || request.cookies.get('adminToken')?.value
  return !!(token || cookieToken)
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await readSiteStats())
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const next = mergeSiteStats(body as Partial<SiteStats>)
    const result = await writeSiteStats(next)

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          persisted: false,
          stats: next,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Site stats updated',
      persisted: true,
      method: result.method,
      stats: next,
    })
  } catch (error) {
    console.error('[admin/stats] POST error:', error)
    return NextResponse.json({ error: 'Failed to update site stats' }, { status: 500 })
  }
}
