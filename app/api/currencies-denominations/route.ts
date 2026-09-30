import { NextResponse } from 'next/server'
import { readCurrenciesFile } from '@/lib/currencies-server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const data = await readCurrenciesFile()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('[currencies-denominations] GET error:', error)
    return NextResponse.json({ error: 'Failed to load currencies' }, { status: 500 })
  }
}
