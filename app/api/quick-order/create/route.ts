import { NextRequest, NextResponse } from 'next/server'
import { getQuickOrderConfig, quickOrderApiPost, unwrapResult } from '@/lib/quick-order-api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const country = body?.country || 'AU'
    const config = getQuickOrderConfig(country)
    if ('error' in config) {
      return NextResponse.json({ success: false, error: config.error }, { status: 500 })
    }

    const purchase = body?.purchase
    const paymentMethod = body?.paymentMethod

    if (!purchase || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing purchase or paymentMethod' },
        { status: 400 }
      )
    }

    // Match 4dDev standalone payload shape
    const payload = {
      purchase,
      paymentMethod,
      ...(body?.payer ? { payer: body.payer } : {}),
      ...(body?.consent ? { consent: body.consent } : {}),
    }

    console.log('[Quick Order] create attempt', {
      country: config.country,
      baseUrl: config.baseUrl,
      foreignCurrency: purchase.foreignCurrency,
      foreignAmount: purchase.foreignAmount,
      totalDebitAmount: purchase.totalDebitAmount,
      paymentMethod: paymentMethod.paymentMethod || paymentMethod.type,
      branchId: paymentMethod.branchId,
      // email for ops logs only — never sent to analytics
      hasCustomerRef: !!purchase.customerReference,
    })

    const response = await quickOrderApiPost(
      '/rst/WebEWires/createPublicPurchaseOrder',
      [payload],
      country
    )
    const result = unwrapResult(response)

    if (result.success === false || String(result.success).toLowerCase() === 'false') {
      console.error('[Quick Order] create failed', {
        country: config.country,
        status: result.status,
        statusText: result.statusText,
      })
      return NextResponse.json(
        {
          success: false,
          error: String(
            result.statusText || result.message || 'Unable to create purchase order.'
          ),
          result,
        },
        { status: 400 }
      )
    }

    console.log('[Quick Order] create success', {
      country: config.country,
      orderId:
        result.WebEwireID ||
        result.orderId ||
        result.OrderID ||
        result.orderUUID,
      statusText: result.statusText,
    })

    return NextResponse.json({ success: true, result, country: config.country })
  } catch (error) {
    console.error('[Quick Order] create error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to create purchase order.',
      },
      { status: 502 }
    )
  }
}
