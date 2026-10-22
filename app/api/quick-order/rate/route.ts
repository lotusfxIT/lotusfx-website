import { NextRequest, NextResponse } from 'next/server'
import {
  getQuickOrderBaseCurrency,
  getQuickOrderConfig,
  quickOrderApiPost,
  unwrapResult,
} from '@/lib/quick-order-api'
import { CLICK_COLLECT_UNAVAILABLE_MESSAGE, publicServiceError } from '@/lib/service-availability'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const country = body?.country || 'AU'
    const config = getQuickOrderConfig(country)
    if ('error' in config) {
      return NextResponse.json({ success: false, error: config.error }, { status: 500 })
    }

    const base = getQuickOrderBaseCurrency(country)
    const { fromCcy, toCcy = base.code, toAmount, isBuy, transferMode = 'booking', customerID, promoGroup } =
      body || {}

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

    // Same shape as calculator You Buy: booking only. Do not send isBuy unless
    // the caller explicitly asks for a sell quote (isBuy: true).
    const requestPayload: Record<string, unknown> = {
      toCcy,
      fromCcy,
      toAmount: amount,
    }
    if (transferMode) requestPayload.transferMode = transferMode
    if (isBuy === true) requestPayload.isBuy = true
    if (promoGroup) requestPayload.promoGroup = promoGroup
    if (customerID) requestPayload.customerID = customerID

    const response = await quickOrderApiPost(
      '/rst/Currencies/getExchangeRate',
      [requestPayload],
      country
    )

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
      country: config.country,
    })
  } catch (error) {
    console.error('[Quick Order] rate error:', error)
    const { unavailable, message } = publicServiceError(error, CLICK_COLLECT_UNAVAILABLE_MESSAGE)
    return NextResponse.json(
      { success: false, unavailable, error: message },
      { status: unavailable ? 503 : 502 }
    )
  }
}
