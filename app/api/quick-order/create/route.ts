import { NextRequest, NextResponse } from 'next/server'
import {
  attachWalkInCustomerToWebEwire,
  bookingPaymentData,
  getQuickOrderConfig,
  quickOrderApiPost,
  unwrapResult,
} from '@/lib/quick-order-api'
import { rateLimit } from '@/lib/rate-limit'
import { mailjetConfigured } from '@/lib/mailjet'
import {
  addEvent,
  buildOrderRecord,
  saveOrder,
  sendCustomerEmail,
  sendStaffEmail,
  staffNotifyEmail,
} from '@/lib/orders'
import { CLICK_COLLECT_UNAVAILABLE_MESSAGE, publicServiceError } from '@/lib/service-availability'
import { walkInCustomerIDForBranch } from '@/lib/walk-in-customers'

/** Never throws: the order already exists in 4D, so storage/email problems must not fail it. */
async function recordAndNotify(
  body: Record<string, any>,
  result: Record<string, any>,
  country: string
): Promise<string | undefined> {
  let order
  try {
    order = buildOrderRecord(body, result, country)
  } catch (error) {
    console.error('[Quick Order] could not build order record', error)
    return undefined
  }

  if (mailjetConfigured()) {
    if (order.customer.email) {
      const sent = await sendCustomerEmail(order, 'receipt').catch((e) => ({ ok: false, error: String(e) }))
      order = addEvent(
        order,
        sent.ok ? 'Receipt emailed to customer' : 'Receipt email FAILED',
        sent.ok ? order.customer.email : sent.error
      )
    }
    const staffTo = staffNotifyEmail(country)
    const staff = await sendStaffEmail(order, staffTo).catch((e) => ({ ok: false, error: String(e) }))
    order = addEvent(
      order,
      staff.ok ? 'Staff notified' : 'Staff email FAILED',
      staff.ok ? staffTo : staff.error
    )
  }

  try {
    await saveOrder(order)
  } catch (error) {
    console.error('[Quick Order] could not save order record', order.id, error)
  }
  return order.id
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, 'quick-order-create', 5, 30 * 60 * 1000)
    if (limited) return limited

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

    const walkInCustomerID = walkInCustomerIDForBranch({
      country: config.country,
      branchName: paymentMethod.branchName || paymentMethod.branch?.BranchName,
      branchId: paymentMethod.branchId || paymentMethod.branch?.BranchID,
    })

    if (config.country === 'AU' && !walkInCustomerID) {
      return NextResponse.json(
        {
          success: false,
          error: `Walk-in customer is not configured for ${
            paymentMethod.branchName || paymentMethod.branch?.BranchName || 'this branch'
          }.`,
        },
        { status: 400 }
      )
    }

    const purchaseAllow = new Set([
      'transactionType',
      'customerReference',
      'sourceCurrency',
      'debitCurrency',
      'foreignCurrency',
      'foreignAmount',
      'exchangeRate',
      'feeAmount',
      'totalDebitAmount',
      'rateQuotedAt',
      'rateExpiresAt',
      'notes',
    ])
    const purchaseFor4d = Object.fromEntries(
      Object.entries(purchase).filter(([key, value]) => purchaseAllow.has(key) && value !== undefined)
    )

    const paymentCode = String(paymentMethod.paymentMethod || paymentMethod.type || 'PAYINSTORE')
      .trim()
      .toUpperCase() || 'PAYINSTORE'

    const branchId = String(paymentMethod.branchId || paymentMethod.branch?.BranchID || '').trim()
    const branchName = String(
      paymentMethod.branchName || paymentMethod.branch?.BranchName || ''
    ).trim()
    const amountDue = Number(purchase.totalDebitAmount) || 0
    const paymentData = bookingPaymentData({
      branchId,
      branchName,
    })

    // Match createPurchaseOrder PAYINSTORE: gateway must be set or 4D defaults to Monoova
    // and can treat the booking as already paid (amount due 0.00).
    const payload = {
      gateway: paymentCode,
      ...(walkInCustomerID ? { customerID: walkInCustomerID, CustomerID: walkInCustomerID } : {}),
      purchase: {
        ...purchaseFor4d,
        ...(walkInCustomerID ? { customerID: walkInCustomerID, CustomerID: walkInCustomerID } : {}),
      },
      paymentMethod: {
        type: paymentCode,
        paymentMethod: paymentCode,
        bookingType: 'booking',
        ...(branchId ? { branchId } : {}),
        ...(branchName ? { branchName } : {}),
        paymentData,
      },
    }

    console.log('[Quick Order] create attempt', {
      country: config.country,
      baseUrl: config.baseUrl,
      gateway: payload.gateway,
      customerID: walkInCustomerID || null,
      foreignCurrency: purchase.foreignCurrency,
      foreignAmount: purchase.foreignAmount,
      totalDebitAmount: purchase.totalDebitAmount,
      amountPaid: 0,
      paymentMethod: paymentCode,
      branchId: paymentMethod.branchId,
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

    const webEwireID = String(result.WebEwireID || result.orderId || result.OrderID || '')
    const orderUUID = String(result.orderUUID || '')

    if (walkInCustomerID && (webEwireID || orderUUID)) {
      try {
        const attached = await attachWalkInCustomerToWebEwire({
          webEwireID,
          orderUUID,
          customerID: walkInCustomerID,
          amountDue,
          branchId,
          branchName,
          country: config.country,
        })
        console.log('[Quick Order] walk-in attached', {
          webEwireID,
          customerID: attached?.CustomerID || null,
          amountPaid: attached?.AmountPaid,
        })
      } catch (error) {
        console.error('[Quick Order] walk-in attach failed', webEwireID, error)
      }
    }

    console.log('[Quick Order] create success', {
      country: config.country,
      orderId: webEwireID || orderUUID,
      statusText: result.statusText,
    })

    const orderRef = await recordAndNotify(body, result, config.country)

    return NextResponse.json({ success: true, result, country: config.country, orderRef })
  } catch (error) {
    console.error('[Quick Order] create error:', error)
    const { unavailable, message } = publicServiceError(error, CLICK_COLLECT_UNAVAILABLE_MESSAGE)
    return NextResponse.json(
      { success: false, unavailable, error: message },
      { status: unavailable ? 503 : 502 }
    )
  }
}
