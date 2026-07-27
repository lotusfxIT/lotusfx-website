import { NextRequest, NextResponse } from 'next/server'
import {
  CUSTOMER_REVIEWS_MAX_RETURN,
  getCachedCustomerReviewsPool,
} from '@/lib/customer-reviews-cache'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryParam = searchParams.get('country')?.toUpperCase()
    const country =
      countryParam === 'AU' || countryParam === 'NZ' || countryParam === 'FJ'
        ? countryParam
        : null

    const { reviews: pool, stale, error } = await getCachedCustomerReviewsPool()
    const filtered = country ? pool.filter((r) => r.country === country) : pool
    const reviews = filtered.slice(0, CUSTOMER_REVIEWS_MAX_RETURN)

    return NextResponse.json({
      reviews,
      total: reviews.length,
      poolSize: pool.length,
      country: country || 'ALL',
      stale: !!stale,
      ...(error ? { error } : {}),
    })
  } catch (error) {
    console.error('[customer-reviews] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch customer reviews', reviews: [] }, { status: 500 })
  }
}
