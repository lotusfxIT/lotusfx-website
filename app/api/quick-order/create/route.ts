import { NextRequest, NextResponse } from 'next/server'
import { getQuickOrderConfig, quickOrderApiPost, unwrapResult } from '@/lib/quick-order-api'

export async function POST(request: NextRequest) {
  try {
    const config = getQuickOrderConfig()
    if ('error' in config) {
      return NextResponse.json({ success: false, error: config.error }, { status: 500 })
    }

    const body = await request.json()
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
      foreignCurrency: purchase.foreignCurrency,
      foreignAmount: purchase.foreignAmount,
      totalDebitAmount: purchase.totalDebitAmount,
      paymentMethod: paymentMethod.paymentMethod || paymentMethod.type,
      branchId: paymentMethod.branchId,
      // email for ops logs only — never sent to analytics
      hasCustomerRef: !!purchase.customerReference,
    })

    const response = await quickOrderApiPost('/rst/WebEWires/createPublicPurchaseOrder', [
      payload,
    ])
    const result = unwrapResult(response)

    if (result.success === false || String(result.success).toLowerCase() === 'false') {
      console.error('[Quick Order] create failed', {
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
      orderId: result.orderId || result.OrderID,
      statusText: result.statusText,
    })

    return NextResponse.json({ success: true, result })
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
