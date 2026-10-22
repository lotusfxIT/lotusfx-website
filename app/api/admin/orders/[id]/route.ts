import { NextRequest, NextResponse } from 'next/server'
import { canAccessCountry, canAccessModule, getAdminSession } from '@/lib/admin-auth'
import { mailjetConfigured } from '@/lib/mailjet'
import {
  addEvent,
  deleteOrder,
  getOrder,
  saveOrder,
  sendCustomerEmail,
  sendStaffEmail,
  type OrderRecord,
  type OrderStatus,
} from '@/lib/orders'
import { EMAIL_RE } from '@/lib/spam-guard'

export const dynamic = 'force-dynamic'

function deny(session: ReturnType<typeof getAdminSession>, order?: OrderRecord | null) {
  if (!session || !canAccessModule(session, 'orders')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (order && !canAccessCountry(session, order.country)) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  return null
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = getAdminSession(request)
  const order = await getOrder(params.id)
  const blocked = deny(session, order)
  if (blocked) return blocked
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ order, canDelete: session!.role === 'full' })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = getAdminSession(request)
  if (!session || session.role !== 'full') {
    return NextResponse.json({ error: 'Only the full admin can delete orders.' }, { status: 403 })
  }
  const order = await getOrder(params.id)
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  await deleteOrder(params.id)
  return NextResponse.json({ success: true })
}

/**
 * Actions: resend (receipt to customer), ready (email customer + status), forward (to any
 * email), status (collected / cancelled / received, no email).
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = getAdminSession(request)
  let order = await getOrder(params.id)
  const blocked = deny(session, order)
  if (blocked) return blocked
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const action = String(body.action || '')

  const needsEmail = action === 'resend' || action === 'ready' || action === 'forward'
  if (needsEmail && !mailjetConfigured()) {
    return NextResponse.json({ error: 'Email is not configured (Mailjet keys missing).' }, { status: 503 })
  }

  if (action === 'resend' || action === 'ready') {
    const to = String(body.to || order.customer.email || '')
      .trim()
      .toLowerCase()
    if (!EMAIL_RE.test(to)) {
      return NextResponse.json({ error: 'Enter a valid email address to send to.' }, { status: 400 })
    }
    const kind = action === 'ready' ? 'ready' : 'receipt'
    const sent = await sendCustomerEmail(order, kind, to)
    if (!sent.ok) {
      return NextResponse.json({ error: `Email failed: ${sent.error}` }, { status: 502 })
    }
    if (action === 'ready') {
      const alreadySent = !!(order.readyEmailedAt || order.status === 'ready')
      order = {
        ...addEvent(
          order,
          alreadySent ? 'Ready pickup email sent again' : 'Marked ready — customer emailed',
          to
        ),
        status: 'ready',
        readyEmailedAt: new Date().toISOString(),
        readyEmailedTo: to,
      }
    } else {
      order = addEvent(order, 'Receipt re-sent to customer', to)
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
