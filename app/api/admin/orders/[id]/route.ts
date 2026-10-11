import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { mailjetConfigured } from '@/lib/mailjet'
import {
  addEvent,
  getOrder,
  saveOrder,
  sendCustomerEmail,
  sendStaffEmail,
  type OrderStatus,
} from '@/lib/orders'
import { EMAIL_RE } from '@/lib/spam-guard'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const order = await getOrder(params.id)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ order })
}

/**
 * Actions: resend (receipt to customer), ready (email customer + status), forward (to any
 * email), status (collected / cancelled / received, no email).
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let order = await getOrder(params.id)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const action = String(body.action || '')

  const needsEmail = action === 'resend' || action === 'ready' || action === 'forward'
  if (needsEmail && !mailjetConfigured()) {
    return NextResponse.json({ error: 'Email is not configured (Mailjet keys missing).' }, { status: 503 })
  }

  if (action === 'resend' || action === 'ready') {
    if (!order.customer.email) {
      return NextResponse.json({ error: 'This order has no customer email.' }, { status: 400 })
    }
    const kind = action === 'ready' ? 'ready' : 'receipt'
    const sent = await sendCustomerEmail(order, kind)
    if (!sent.ok) {
      return NextResponse.json({ error: `Email failed: ${sent.error}` }, { status: 502 })
    }
    if (action === 'ready') {
      order = { ...addEvent(order, 'Marked ready — customer emailed', order.customer.email), status: 'ready' }
    } else {
      order = addEvent(order, 'Receipt re-sent to customer', order.customer.email)
    }
  } else if (action === 'forward') {
    const to = String(body.to || '').trim().toLowerCase()
    if (!EMAIL_RE.test(to)) {
      return NextResponse.json({ error: 'Enter a valid email address to forward to.' }, { status: 400 })
    }
    const note = String(body.note || '').trim().slice(0, 500)
    const sent = await sendStaffEmail(order, to, note ? `Forwarded order — ${note}` : 'Forwarded order')
    if (!sent.ok) {
      return NextResponse.json({ error: `Email failed: ${sent.error}` }, { status: 502 })
    }
    order = addEvent(order, 'Forwarded', note ? `${to} — ${note}` : to)
  } else if (action === 'status') {
    const status = String(body.status || '') as OrderStatus
    if (!['received', 'ready', 'collected', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    const labels: Record<OrderStatus, string> = {
      received: 'Status reset to received',
      ready: 'Marked ready (no email)',
      collected: 'Marked collected',
      cancelled: 'Marked cancelled',
    }
    order = { ...addEvent(order, labels[status]), status }
  } else {
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  }

  await saveOrder(order)
  return NextResponse.json({ success: true, order })
}
