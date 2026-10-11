import { NextRequest, NextResponse } from 'next/server'
import {
  contactRecipient,
  escapeHtml,
  mailjetConfigured,
  normalizeCountry,
  sendMail,
} from '@/lib/mailjet'
import { EMAIL_RE, cleanText, countLinks, guardSubmission } from '@/lib/spam-guard'
import { newMessageId, saveMessage, type MessageRecord } from '@/lib/messages'

const SUBJECTS: Record<string, string> = {
  'currency-exchange': 'Currency Exchange',
  'money-transfer': 'Money Transfer',
  rates: 'Exchange Rates',
  account: 'Account Support',
  business: 'Business Services',
  complaint: 'Complaint',
  other: 'Other',
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { blocked } = guardSubmission(request, body, {
    name: 'contact',
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (blocked) return blocked

  const name = cleanText(body.name, 120)
  const email = cleanText(body.email, 254).toLowerCase()
  const phone = cleanText(body.phone, 40)
  const subjectKey = cleanText(body.subject, 40)
  const message = cleanText(body.message, 5000)
  const country = normalizeCountry(body.country)

  if (!name || !EMAIL_RE.test(email) || !SUBJECTS[subjectKey] || message.length < 5) {
    return NextResponse.json(
      { error: 'Please fill in your name, a valid email, a subject and your message.' },
      { status: 400 }
    )
  }
  if (countLinks(message) > 3) {
    return NextResponse.json(
      { error: 'Please remove some links from your message and try again.' },
      { status: 400 }
    )
  }

  const subjectLabel = SUBJECTS[subjectKey]
  const record: MessageRecord = {
    id: newMessageId(),
    createdAt: new Date().toISOString(),
    country,
    name,
    email,
    phone: phone || undefined,
    subject: subjectLabel,
    message,
    emailStatus: 'not-configured',
    status: 'new',
  }
  const stored = await saveMessage(record).then(
    () => true,
    (error) => {
      console.error('[contact] could not store message', error)
      return false
    }
  )

  if (!mailjetConfigured()) {
    console.error('[contact] Mailjet not configured; message stored only:', stored)
    if (stored) return NextResponse.json({ success: true })
    return NextResponse.json(
      { error: 'Our contact form is temporarily unavailable. Please email us directly.' },
      { status: 503 }
    )
  }

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Country', country],
    ['Subject', subjectLabel],
  ]
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${message}`
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join('')}</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
    message
  )}</p>`

  const to = contactRecipient(country)
  try {
    const result = await sendMail({
      to,
      subject: `[Website ${country}] ${subjectLabel} — ${name}`,
      text,
      html,
      replyTo: { email, name },
    })
    if (!result.ok) throw new Error(result.error)
    if (stored) await saveMessage({ ...record, emailStatus: 'sent', emailedTo: to }).catch(() => {})
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[contact] send error', error)
    if (stored) {
      await saveMessage({ ...record, emailStatus: 'failed', emailedTo: to }).catch(() => {})
      return NextResponse.json({ success: true })
    }
    return NextResponse.json(
      { error: 'We could not send your message right now. Please try again or email us directly.' },
      { status: 502 }
    )
  }
}
