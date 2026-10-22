import crypto from 'crypto'
import type { NextRequest } from 'next/server'

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

export type AdminRole = 'full' | 'au-ops'
export type AdminModule = 'orders' | 'messages'

export type AdminSession = {
  email: string
  role: AdminRole
  country: 'AU' | null
  modules: AdminModule[] | 'all'
}

const AU_OPS_EMAIL = 'online.au@lotusfx.com'

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

function passwordsMatch(given: string, expected: string): boolean {
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  if (a.length !== b.length) {
    crypto.timingSafeEqual(a.length ? a : Buffer.from('x'), a.length ? a : Buffer.from('x'))
    return false
  }
  return crypto.timingSafeEqual(a, b)
}

function emailsMatch(given: string, expected: string): boolean {
  return given.trim().toLowerCase() === expected.trim().toLowerCase()
}

function fullSession(email: string): AdminSession {
  return { email: email.trim().toLowerCase(), role: 'full', country: null, modules: 'all' }
}

function auOpsSession(email: string): AdminSession {
  return {
    email: email.trim().toLowerCase(),
    role: 'au-ops',
    country: 'AU',
    modules: ['orders', 'messages'],
  }
}

function auOpsEmail(): string {
  return (process.env.ADMIN_AU_OPS_EMAIL || AU_OPS_EMAIL).trim().toLowerCase()
}

export function publicSession(session: AdminSession): AdminSession {
  return {
    email: session.email,
    role: session.role,
    country: session.country,
    modules: session.modules,
  }
}

export function adminCredentialsConfigured(): boolean {
  return !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD)
}

export function checkAdminCredentials(email: unknown, password: unknown): boolean {
  return !!authenticateAdmin(email, password)
}

export function authenticateAdmin(email: unknown, password: unknown): AdminSession | null {
  if (typeof email !== 'string' || typeof password !== 'string') return null
  const givenEmail = email.trim().toLowerCase()
  if (!givenEmail || !password) return null

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    if (emailsMatch(givenEmail, process.env.ADMIN_EMAIL) && passwordsMatch(password, process.env.ADMIN_PASSWORD)) {
      return fullSession(process.env.ADMIN_EMAIL)
    }
  }

  const opsPassword = process.env.ADMIN_AU_OPS_PASSWORD
  if (opsPassword && emailsMatch(givenEmail, auOpsEmail()) && passwordsMatch(password, opsPassword)) {
    return auOpsSession(auOpsEmail())
  }

  return null
}

export function createAdminToken(session: AdminSession): string {
  const expires = Date.now() + SESSION_TTL_MS
  const nonce = crypto.randomBytes(9).toString('base64url')
  const emailB64 = Buffer.from(session.email, 'utf8').toString('base64url')
  const payload = `v2.${expires}.${session.email}.${session.role}.${nonce}`
  return `v2.${expires}.${emailB64}.${session.role}.${nonce}.${sign(payload)}`
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  return !!verifyAdminSession(token)
}

export function verifyAdminSession(token: string | undefined | null): AdminSession | null {
  if (!token) return null
  const parts = token.split('.')

  if (parts[0] === 'v2' && parts.length === 6) {
    const [, expires, emailB64, role, nonce, signature] = parts
    if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return null
    if (role !== 'full' && role !== 'au-ops') return null
    let email = ''
    try {
      email = Buffer.from(emailB64, 'base64url').toString('utf8').trim().toLowerCase()
    } catch {
      return null
    }
    if (!email) return null
    try {
      if (!safeEqual(signature, sign(`v2.${expires}.${email}.${role}.${nonce}`))) return null
    } catch {
      return null
    }
    return role === 'au-ops' ? auOpsSession(email) : fullSession(email)
  }

  if (parts.length === 3) {
    const [expires, nonce, signature] = parts
    if (!/^\d+$/.test(expires) || Number(expires) < Date.now()) return null
    try {
      if (!safeEqual(signature, sign(`${expires}.${nonce}`))) return null
    } catch {
      return null
    }
    return fullSession(process.env.ADMIN_EMAIL || 'admin')
  }

  return null
}

export function getAdminSession(request: NextRequest): AdminSession | null {
  const headerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  const cookieToken =
    request.cookies.get('admin_token')?.value || request.cookies.get('adminToken')?.value
  return verifyAdminSession(headerToken) || verifyAdminSession(cookieToken)
}

export function isAdminRequest(request: NextRequest): boolean {
  return !!getAdminSession(request)
}

export function isFullAdminRequest(request: NextRequest): boolean {
  return getAdminSession(request)?.role === 'full'
}

export function canAccessModule(session: AdminSession, module: AdminModule): boolean {
  return session.modules === 'all' || session.modules.includes(module)
}

export function canAccessCountry(session: AdminSession, country: string): boolean {
  return !session.country || session.country === country
}

export function filterBySessionCountry<T extends { country: string }>(items: T[], session: AdminSession): T[] {
  if (!session.country) return items
  return items.filter((item) => item.country === session.country)
}
