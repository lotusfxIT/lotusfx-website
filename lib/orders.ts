import crypto from 'crypto'
import { sendMail } from '@/lib/mailjet'
import { getRecord, listRecords, saveRecord } from '@/lib/records-store'
import {
  buildClickCollectReceiptHtml,
  buildClickCollectStaffHtml,
  clickCollectMapsUrl,
  clickCollectSiteBase,
} from '@/lib/click-collect-receipt'

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

function receiptData(order: OrderRecord, kind: 'receipt' | 'ready' = 'receipt') {
  const p = order.purchase
  const care = customerCareEmail(order.country)
  const siteBase = clickCollectSiteBase(order.country)
  return {
    orderRef: order.id,
    firstName: order.customer.name.split(' ')[0] || '',
    buyAmount: String(p.foreignAmount),
    buyCurrency: p.foreignCurrency,
    exchangeRate: p.exchangeRate ? String(p.exchangeRate) : '',
    totalAmount: String(p.totalDebitAmount),
    payCurrency: p.baseCurrency,
    branchName: order.branch.name || '',
    branchAddress: order.branch.address || '',
    mapsUrl: clickCollectMapsUrl(order.branch.name, order.branch.address),
    careEmail: care,
    siteBase,
    country: order.country,
    kind,
  }
}

const WHAT_TO_BRING_TEXT =
  'When you come in:\n- Bring valid photo ID in the same name as this order.\n- Pay in store by cash or EFTPOS when you collect.\n- Quote your order reference at the counter.'

function orderText(order: OrderRecord) {
  const p = order.purchase
  return [
    `Order reference: ${order.id}`,
    `You're buying: ${money(p.foreignAmount, p.foreignCurrency)}`,
    p.exchangeRate ? `Exchange rate: ${p.exchangeRate}` : '',
    `Total to pay in store: ${money(p.totalDebitAmount, p.baseCurrency)}`,
    order.branch.name ? `Collect from: ${order.branch.name}` : '',
    order.branch.address ? `Branch address: ${order.branch.address}` : '',
    order.branch.phone ? `Branch phone: ${order.branch.phone}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export function receiptEmail(order: OrderRecord) {
  const first = order.customer.name.split(' ')[0] || 'there'
  const care = customerCareEmail(order.country)
  return {
    subject: `Your Lotus Foreign Exchange order ${order.id} — ${money(order.purchase.foreignAmount, order.purchase.foreignCurrency)}`,
    html: buildClickCollectReceiptHtml(receiptData(order, 'receipt')),
    text: `Hi ${first},\n\nThanks for your ${ORDER_PRODUCT_NAME} order. We've received it and our team is getting your currency ready. We'll email you when it's ready to collect.\n\n${orderText(order)}\n\n${WHAT_TO_BRING_TEXT}\n\nQuestions? Reply to this email or contact ${care}.`,
    replyTo: care,
  }
}

export function readyEmail(order: OrderRecord) {
  const first = order.customer.name.split(' ')[0] || 'there'
  const care = customerCareEmail(order.country)
  return {
    subject: `Your currency is ready to collect — order ${order.id}`,
    html: buildClickCollectReceiptHtml(receiptData(order, 'ready')),
    text: `Hi ${first},\n\nGood news — your currency is ready to collect. Pop into the branch below during opening hours.\n\n${orderText(order)}\n\n${WHAT_TO_BRING_TEXT}\n\nQuestions? Reply to this email or contact ${care}.`,
    replyTo: care,
  }
}

export function staffEmail(order: OrderRecord, heading = `New ${ORDER_PRODUCT_NAME} order`) {
  const siteBase = clickCollectSiteBase(order.country)
  const adminUrl = `${siteBase}/admin/orders?id=${encodeURIComponent(order.id)}`
  const p = order.purchase
  return {
    subject: `[${ORDER_PRODUCT_NAME} ${order.country}] ${order.id} — ${money(
      p.foreignAmount,
      p.foreignCurrency
    )} — ${order.customer.name}`,
    html: buildClickCollectStaffHtml({
      orderRef: order.id,
      country: order.country,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone || '',
      placed: formatDate(order.createdAt, order.country),
      buyAmount: String(p.foreignAmount),
      buyCurrency: p.foreignCurrency,
      exchangeRate: p.exchangeRate ? String(p.exchangeRate) : '',
      totalAmount: String(p.totalDebitAmount),
      payCurrency: p.baseCurrency,
      branchName: order.branch.name || '',
      branchAddress: order.branch.address || '',
      notes: p.notes,
      adminUrl,
    }),
    text: `${heading}\n\nCustomer: ${order.customer.name}\nEmail: ${order.customer.email}\nPhone: ${order.customer.phone || ''}\n${orderText(order)}\n\nOpen in admin: ${adminUrl}`,
  }
}

export async function sendCustomerEmail(order: OrderRecord, kind: 'receipt' | 'ready') {
  const mail = kind === 'ready' ? readyEmail(order) : receiptEmail(order)
  return sendMail({
    to: order.customer.email,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: { email: mail.replyTo, name: 'Lotus Foreign Exchange' },
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
