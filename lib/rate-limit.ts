import { NextRequest, NextResponse } from 'next/server'

// Per-instance, in-memory limiter. Serverless instances don't share state, so this
// slows bursts from one IP rather than enforcing an exact global quota.
const buckets = new Map<string, number[]>()

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

export function rateLimit(
  request: NextRequest,
  name: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const key = `${name}:${clientIp(request)}`
  const now = Date.now()
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    return NextResponse.json(
      { error: 'Too many requests. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(windowMs / 1000)) } }
    )
  }
  hits.push(now)
  buckets.set(key, hits)
  if (buckets.size > 5000) {
    buckets.forEach((v, k) => {
      if (!v.some((t) => now - t < windowMs)) buckets.delete(k)
    })
  }
  return null
}
