import { NextRequest, NextResponse } from 'next/server'
import { getQuickOrderConfig, quickOrderApiPost, unwrapResult } from '@/lib/quick-order-api'

export async function POST(request: NextRequest) {
  try {
    const config = getQuickOrderConfig()
    if ('error' in config) {
      return NextResponse.json({ success: false, error: config.error }, { status: 500 })
    }

    const body = await request.json()
    const {
      fromCcy,
      toCcy = 'AUD',
      toAmount,
      isBuy = true,
      transferMode = 'booking',
    } = body || {}

    if (!fromCcy || toAmount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: fromCcy, toAmount' },
        { status: 400 }
      )
    }

    const amount = Number(toAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const response = await quickOrderApiPost('/rst/Currencies/getExchangeRate', [
      {
        toCcy,
        fromCcy,
        toAmount: amount,
        isBuy,
        promoGroup: '',
        customerID: '',
        transferMode,
      },
    ])

    const result = unwrapResult(response)
    if (result.success === false || String(result.success).toLowerCase() === 'false') {
      return NextResponse.json(
        {
          success: false,
          error: String(result.statusText || result.message || 'Exchange rate request failed.'),
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      rate: result.rate,
      inverse: result.inverse,
      fee: result.fee,
      base: result.base,
      fromCcy,
      toCcy,
      toAmount: amount,
    })
  } catch (error) {
    console.error('[Quick Order] rate error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Exchange rate request failed.',
      },
      { status: 502 }
    )
  }
}
