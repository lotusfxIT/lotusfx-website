import crypto from 'crypto'
import type { NextRequest } from 'next/server'

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET / ADMIN_PASSWORD not configured')
  }
  return secret
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

export function adminCredentialsConfigured(): boolean {
  return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD)
}

export function checkAdminCredentials(email: unknown, password: unknown): boolean {
  if (!adminCredentialsConfigured()) return false
  if (typeof email !== 'string' || typeof password !== 'string') return false
  return (
    safeEqual(email.trim().toLowerCase(), process.env.ADMIN_EMAIL!.trim().toLowerCase()) &&
    safeEqual(password, process.env.ADMIN_PASSWORD!)
  )
}

export function createAdminToken(): string {
  const expires = Date.now() + SESSION_TTL_MS
  const nonce = crypto.randomBytes(9).toString('base64url')
  const payload = `${expires}.${nonce}`
  return `${payload}.${sign(payload)}`
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [expires, nonce, signature] = parts
  if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return false
  try {
    return safeEqual(signature, sign(`${expires}.${nonce}`))
  } catch {
    return false
  }
}

export function isAdminRequest(request: NextRequest): boolean {
  const headerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  const cookieToken =
    request.cookies.get('admin_token')?.value || request.cookies.get('adminToken')?.value
  return verifyAdminToken(headerToken) || verifyAdminToken(cookieToken)
}
