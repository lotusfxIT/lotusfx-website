type Country = 'AU' | 'NZ' | 'FJ'

const CARE_EMAILS: Record<Country, string> = {
  AU: 'aucustomercare@lotusfx.com',
  NZ: 'nzcustomercare@lotusfx.com',
  FJ: 'fjcustomercare@lotusfx.com',
}

export function normalizeCountry(value: unknown): Country {
  const c = String(value || '').toUpperCase()
  return c === 'NZ' || c === 'FJ' ? c : 'AU'
}

export function mailjetConfigured(): boolean {
  return !!(process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET)
}

function authHeader(): string {
  const raw = `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`
  return `Basic ${Buffer.from(raw).toString('base64')}`
}

export function contactRecipient(country: Country): string {
  return process.env[`CONTACT_TO_EMAIL_${country}`] || process.env.CONTACT_TO_EMAIL || CARE_EMAILS[country]
}

export function newsletterListId(country: Country): string | undefined {
  return process.env[`MAILJET_LIST_ID_${country}`] || process.env.MAILJET_LIST_ID || undefined
}

export async function sendMail(opts: {
  to: string
  subject: string
  text: string
  html: string
  replyTo?: { email: string; name?: string }
}): Promise<{ ok: boolean; error?: string }> {
  const from = {
    Email: process.env.MAILJET_FROM_EMAIL || 'no-reply@lotusfx.com',
    Name: process.env.MAILJET_FROM_NAME || 'Lotus FX Website',
  }
  const res = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      Messages: [
        {
          From: from,
          To: [{ Email: opts.to }],
          ...(opts.replyTo ? { ReplyTo: { Email: opts.replyTo.email, Name: opts.replyTo.name } } : {}),
          Subject: opts.subject,
          TextPart: opts.text,
          HTMLPart: opts.html,
        },
      ],
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[mailjet] send failed', res.status, body.slice(0, 500))
    return { ok: false, error: `Mailjet ${res.status}` }
  }
  return { ok: true }
}

export async function addToList(
  listId: string,
  email: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`https://api.mailjet.com/v3/REST/contactslist/${encodeURIComponent(listId)}/managecontact`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ Email: email, Action: 'addnoforce' }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('[mailjet] list add failed', res.status, body.slice(0, 500))
    return { ok: false, error: `Mailjet ${res.status}` }
  }
  return { ok: true }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
