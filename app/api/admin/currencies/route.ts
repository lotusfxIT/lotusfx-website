import { NextRequest, NextResponse } from 'next/server'
import { normalizeCurrenciesFile, type CurrenciesDenominationsFile } from '@/lib/currencies'
import {
  getDefaultCurrenciesFile,
  readCurrenciesFile,
  writeCurrenciesFile,
} from '@/lib/currencies-server'

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
  return NextResponse.json(await readCurrenciesFile())
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthed(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as Partial<CurrenciesDenominationsFile>
    const next = normalizeCurrenciesFile(body)
    const result = await writeCurrenciesFile(next)

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.error,
          persisted: false,
          currencies: next,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Currencies & denominations updated',
      persisted: true,
      method: result.method,
      currencies: next,
    })
  } catch (error) {
    console.error('[admin/currencies] POST error:', error)
    return NextResponse.json({ error: 'Failed to update currencies' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const defaults = getDefaultCurrenciesFile()
  const result = await writeCurrenciesFile(defaults)
  if (!result.ok) {
    return NextResponse.json({ error: result.error, currencies: defaults }, { status: 500 })
  }
  return NextResponse.json({ success: true, currencies: defaults })
}
