import crypto from 'crypto'
import { escapeHtml, sendMail } from '@/lib/mailjet'
import { getRecord, listRecords, saveRecord } from '@/lib/records-store'
import { getSiteUrl } from '@/lib/site-url'

export const ORDER_PRODUCT_NAME = 'Click & Collect'

const PREFIX = 'orders'

export type OrderStatus = 'received' | 'ready' | 'collected' | 'cancelled'

export type OrderEvent = {
  at: string
  action: string
  detail?: string
}

export type OrderRecord = {
  id: string
  backendId?: string
  createdAt: string
  country: string
  status: OrderStatus
  customer: { name: string; email: string; phone?: string; dateOfBirth?: string }
  purchase: {
    foreignCurrency: string
    foreignAmount: number
    baseCurrency: string
    exchangeRate: number
    feeAmount: number
    totalDebitAmount: number
    rateExpiresAt?: string
    notes?: string
  }
  branch: { id?: string; name?: string; address?: string; phone?: string }
  backendStatusText?: string
  events: OrderEvent[]
}

const TIMEZONES: Record<string, string> = {
  AU: 'Australia/Sydney',
  NZ: 'Pacific/Auckland',
  FJ: 'Pacific/Fiji',
}

export function staffNotifyEmail(country: string): string {
  return (
    process.env[`QUICK_ORDER_NOTIFY_EMAIL_${country}`] ||
    process.env.QUICK_ORDER_NOTIFY_EMAIL ||
    'aucustomercare@lotusfx.com'
  )
}

function customerCareEmail(country: string): string {
  if (country === 'NZ') return 'nzcustomercare@lotusfx.com'
  if (country === 'FJ') return 'fjcustomercare@lotusfx.com'
  return 'aucustomercare@lotusfx.com'
}

function str(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim()
}

function num(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function money(amount: number, currency: string): string {
  const formatted = amount.toLocaleString('en-AU', {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return `${formatted} ${currency}`
}

function formatDate(iso: string | undefined, country: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString('en-AU', {
    timeZone: TIMEZONES[country] || TIMEZONES.AU,
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function buildOrderRecord(
  body: Record<string, any>,
  result: Record<string, any>,
  country: string
): OrderRecord {
  const purchase = body.purchase || {}
  const payment = body.paymentMethod || {}
  const branch = payment.branch || {}
  const backendId = str(result.WebEwireID || result.orderId || result.OrderID || result.orderUUID)
  const createdAt = new Date().toISOString()
  const id =
    backendId ||
    `QO-${createdAt.slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

  return {
    id,
    backendId: backendId || undefined,
    createdAt,
    country,
    status: 'received',
    customer: {
      name: str(purchase.guestName),
      email: str(purchase.customerReference).toLowerCase(),
      phone: str(purchase.guestPhone) || undefined,
      dateOfBirth: str(purchase.guestDateOfBirth) || undefined,
    },
    purchase: {
      foreignCurrency: str(purchase.foreignCurrency),
      foreignAmount: num(purchase.foreignAmount),
      baseCurrency: str(purchase.debitCurrency || purchase.sourceCurrency),
      exchangeRate: num(purchase.exchangeRate),
      feeAmount: num(purchase.feeAmount),
      totalDebitAmount: num(purchase.totalDebitAmount),
      rateExpiresAt: str(purchase.rateExpiresAt) || undefined,
      notes: str(purchase.notes) || undefined,
    },
    branch: {
      id: str(payment.branchId || branch.BranchID) || undefined,
      name: str(payment.branchName || branch.BranchName) || undefined,
      address:
        [branch.Address, branch.City, branch.Province].map(str).filter(Boolean).join(', ') ||
        undefined,
      phone: str(branch.BranchPhone) || undefined,
    },
    backendStatusText: str(result.statusText) || undefined,
    events: [{ at: createdAt, action: 'Order received' }],
  }
}

export const saveOrder = (order: OrderRecord) => saveRecord(PREFIX, order.id, order)
export const getOrder = (id: string) => getRecord<OrderRecord>(PREFIX, id)
export const listOrders = () => listRecords<OrderRecord>(PREFIX)

export function addEvent(order: OrderRecord, action: string, detail?: string): OrderRecord {
  return { ...order, events: [...order.events, { at: new Date().toISOString(), action, detail }] }
}

// ---------- Emails ----------

const WRAP_START =
  '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1f2937;line-height:1.5;max-width:600px;margin:0 auto">' +
  '<div style="background:#d7262e;padding:18px 24px;border-radius:12px 12px 0 0"><span style="color:#fff;font-size:20px;font-weight:bold">Lotus Foreign Exchange</span></div>' +
  '<div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;padding:24px">'
const WRAP_END = '</div></div>'

function detailRows(rows: Array<[string, string]>): { html: string; text: string } {
  const filtered = rows.filter(([, v]) => v)
  return {
    html: `<table cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse;margin:12px 0">${filtered
      .map(
        ([k, v]) =>
          `<tr><td style="color:#6b7280;border-bottom:1px solid #f3f4f6;width:40%">${escapeHtml(
            k
          )}</td><td style="font-weight:bold;border-bottom:1px solid #f3f4f6">${escapeHtml(v)}</td></tr>`
      )
      .join('')}</table>`,
    text: filtered.map(([k, v]) => `${k}: ${v}`).join('\n'),
  }
}

function orderRows(order: OrderRecord): Array<[string, string]> {
  const p = order.purchase
  return [
    ['Order reference', order.id],
    ["You're buying", money(p.foreignAmount, p.foreignCurrency)],
    ['Exchange rate', p.exchangeRate ? String(p.exchangeRate) : ''],
    ['Fee', p.feeAmount ? money(p.feeAmount, p.baseCurrency) : ''],
    ['Total to pay in store', money(p.totalDebitAmount, p.baseCurrency)],
    ['Collect from', order.branch.name || ''],
    ['Branch address', order.branch.address || ''],
    ['Branch phone', order.branch.phone || ''],
    ['Rate held until', formatDate(p.rateExpiresAt, order.country)],
  ]
}

const WHAT_TO_BRING_HTML =
  '<p style="margin:16px 0 4px"><strong>When you come in</strong></p>' +
  '<ul style="margin:0 0 12px;padding-left:20px"><li>Bring valid photo ID in the same name as this order.</li>' +
  '<li>Pay in store by cash or Eftpos when you collect.</li>' +
  '<li>Quote your order reference at the counter.</li></ul>'
const WHAT_TO_BRING_TEXT =
  'When you come in:\n- Bring valid photo ID in the same name as this order.\n- Pay in store by cash or Eftpos when you collect.\n- Quote your order reference at the counter.'

export function receiptEmail(order: OrderRecord) {
  const first = order.customer.name.split(' ')[0] || 'there'
  const rows = detailRows(orderRows(order))
  const care = customerCareEmail(order.country)
  return {
    subject: `Your Lotus FX order ${order.id} — ${money(order.purchase.foreignAmount, order.purchase.foreignCurrency)}`,
    html:
      WRAP_START +
      `<p>Hi ${escapeHtml(first)},</p><p>Thanks for your ${ORDER_PRODUCT_NAME} order. We've received it and our team is getting your currency ready. We'll email you when it's ready to collect.</p>` +
      rows.html +
      WHAT_TO_BRING_HTML +
      `<p>Questions? Just reply to this email or contact <a href="mailto:${care}">${care}</a>.</p>` +
      WRAP_END,
    text: `Hi ${first},\n\nThanks for your ${ORDER_PRODUCT_NAME} order. We've received it and our team is getting your currency ready. We'll email you when it's ready to collect.\n\n${rows.text}\n\n${WHAT_TO_BRING_TEXT}\n\nQuestions? Reply to this email or contact ${care}.`,
    replyTo: care,
  }
}

export function readyEmail(order: OrderRecord) {
  const first = order.customer.name.split(' ')[0] || 'there'
  const rows = detailRows([
    ['Order reference', order.id],
    ['Currency', money(order.purchase.foreignAmount, order.purchase.foreignCurrency)],
    ['Total to pay in store', money(order.purchase.totalDebitAmount, order.purchase.baseCurrency)],
    ['Collect from', order.branch.name || ''],
    ['Branch address', order.branch.address || ''],
    ['Branch phone', order.branch.phone || ''],
  ])
  const care = customerCareEmail(order.country)
  return {
    subject: `Your currency is ready to collect — order ${order.id}`,
    html:
      WRAP_START +
      `<p>Hi ${escapeHtml(first)},</p><p><strong>Good news — your currency is ready to collect.</strong> Pop into the branch below during opening hours.</p>` +
      rows.html +
      WHAT_TO_BRING_HTML +
      `<p>Questions? Reply to this email or contact <a href="mailto:${care}">${care}</a>.</p>` +
      WRAP_END,
    text: `Hi ${first},\n\nGood news — your currency is ready to collect. Pop into the branch below during opening hours.\n\n${rows.text}\n\n${WHAT_TO_BRING_TEXT}\n\nQuestions? Reply to this email or contact ${care}.`,
    replyTo: care,
  }
}

export function staffEmail(order: OrderRecord, heading = `New ${ORDER_PRODUCT_NAME} order`) {
  const rows = detailRows([
    ['Customer', order.customer.name],
    ['Email', order.customer.email],
    ['Phone', order.customer.phone || ''],
    ['Country', order.country],
    ...orderRows(order),
    ['Customer notes', order.purchase.notes || ''],
    ['Backend status', order.backendStatusText || ''],
    ['Placed', formatDate(order.createdAt, order.country)],
  ])
  const adminUrl = `${getSiteUrl()}/admin/orders?id=${encodeURIComponent(order.id)}`
  return {
    subject: `[${ORDER_PRODUCT_NAME} ${order.country}] ${order.id} — ${money(
      order.purchase.foreignAmount,
      order.purchase.foreignCurrency
    )} — ${order.customer.name}`,
    html:
      WRAP_START +
      `<p><strong>${escapeHtml(heading)}</strong></p>` +
      rows.html +
      `<p><a href="${adminUrl}">Open in admin</a></p>` +
      WRAP_END,
    text: `${heading}\n\n${rows.text}\n\nOpen in admin: ${adminUrl}`,
  }
}

export async function sendCustomerEmail(order: OrderRecord, kind: 'receipt' | 'ready') {
  const mail = kind === 'ready' ? readyEmail(order) : receiptEmail(order)
  return sendMail({
    to: order.customer.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: { email: mail.replyTo, name: 'Lotus FX' },
  })
}

export async function sendStaffEmail(order: OrderRecord, to: string, heading?: string) {
  const mail = staffEmail(order, heading)
  return sendMail({
    to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: order.customer.email ? { email: order.customer.email, name: order.customer.name } : undefined,
  })
}
