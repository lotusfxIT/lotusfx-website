import { NextRequest, NextResponse } from 'next/server'
import { addToList, mailjetConfigured, newsletterListId, normalizeCountry } from '@/lib/mailjet'
import { EMAIL_RE, cleanText, guardSubmission } from '@/lib/spam-guard'

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { blocked } = guardSubmission(request, body, {
    name: 'subscribe',
    limit: 5,
    windowMs: 10 * 60 * 1000,
  })
  if (blocked) return blocked

  const email = cleanText(body.email, 254).toLowerCase()
  const country = normalizeCountry(body.country)
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const listId = newsletterListId(country)
  if (!mailjetConfigured() || !listId) {
    console.error('[subscribe] Mailjet or list ID not configured')
    return NextResponse.json(
      { error: 'Newsletter sign-up is temporarily unavailable. Please try again later.' },
      { status: 503 }
    )
  }

  try {
    const result = await addToList(listId, email)
    if (!result.ok) throw new Error(result.error)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[subscribe] error', error)
    return NextResponse.json(
      { error: 'We could not sign you up right now. Please try again shortly.' },
      { status: 502 }
    )
  }
}
