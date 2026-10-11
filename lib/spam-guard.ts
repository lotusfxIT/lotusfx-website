import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { HONEYPOT_FIELD } from '@/lib/spam-fields'

const MIN_FILL_MS = 2500

export const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/

/**
 * Rejects obvious bots: rate-limited IPs, a filled hidden honeypot field, or a form
 * submitted faster than a human could fill it. Bots that trip the honeypot or timing
 * check get a fake success so they don't learn to adapt.
 */
export function guardSubmission(
  request: NextRequest,
  body: Record<string, unknown>,
  opts: { name: string; limit: number; windowMs: number }
): { blocked: NextResponse | null; silent: boolean } {
  const limited = rateLimit(request, opts.name, opts.limit, opts.windowMs)
  if (limited) return { blocked: limited, silent: false }

  const honeypot = body[HONEYPOT_FIELD]
  const startedAt = Number(body.startedAt)
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS
  if ((typeof honeypot === 'string' && honeypot.trim() !== '') || tooFast) {
    return { blocked: NextResponse.json({ success: true }), silent: true }
  }
  return { blocked: null, silent: false }
}

export function cleanText(value: unknown, max: number): string {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max)
}

export function countLinks(value: string): number {
  return (value.match(/https?:\/\/|www\./gi) || []).length
}
