import { NextRequest, NextResponse } from 'next/server'
import {
  getQuickOrderConfig,
  quickOrderApiPost,
  unwrapPayload,
  unwrapResult,
} from '@/lib/quick-order-api'
import { enrichSoldCurrency } from '@/lib/currencies'

export async function POST(request: NextRequest) {
  try {
    let country = 'AU'
    try {
      const body = await request.json()
      if (body?.country) country = String(body.country)
    } catch {
      /* empty body ok */
    }

    const config = getQuickOrderConfig(country)
    if ('error' in config) {
      return NextResponse.json({ success: false, error: config.error }, { status: 500 })
    }

    const response = await quickOrderApiPost('/rst/Currencies/getCurrenciesSold', [{}], country)
    const payload = unwrapPayload(response)
    const result = unwrapResult(response)

    if (
      result.success === false ||
      String(result.success).toLowerCase() === 'false'
    ) {
      return NextResponse.json(
        {
          success: false,
          error: String(result.statusText || result.message || 'Unable to load currencies.'),
        },
        { status: 400 }
      )
    }

    const listCandidate =
      (result.currencies as unknown) ||
      result.data ||
      result.countries ||
      (payload && typeof payload === 'object' && (payload as { data?: unknown }).data) ||
      result

    const list = Array.isArray(listCandidate) ? listCandidate : []

    const currencies = list
      .map((item) => {
        if (!item || typeof item !== 'object') return null
        const row = item as Record<string, unknown>
        const currency = String(row.currency || row.ccy || '').trim()
        if (!currency) return null
        return enrichSoldCurrency({
          currency,
          country: String(row.country || '').trim(),
          flag: String(row.flag || '').trim(),
        })
      })
      .filter(Boolean)

    return NextResponse.json({ success: true, currencies, country: config.country })
  } catch (error) {
    console.error('[Quick Order] currencies error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to load currencies.',
      },
      { status: 502 }
    )
  }
}
