import { NextRequest, NextResponse } from 'next/server'
import {
  getQuickOrderConfig,
  quickOrderApiPost,
  unwrapPayload,
  unwrapResult,
} from '@/lib/quick-order-api'

export async function POST(request: NextRequest) {
  try {
    let country = 'AU'
    try {
      const body = await request.json()
      if (body?.country) country = String(body.country)
    } catch {
      /* empty body ok */
    }

    const config = getQuickOrderConfig(country)
    if ('error' in config) {
      return NextResponse.json({ success: false, error: config.error }, { status: 500 })
    }

    const response = await quickOrderApiPost('/rst/Branches/getBranches', [{}], country)
    const payload = unwrapPayload(response) as Record<string, unknown> | null
    const result = unwrapResult(response)

    const branchesList: unknown[] = Array.isArray(result)
      ? result
      : Array.isArray(payload?.data)
        ? (payload.data as unknown[])
        : Array.isArray((result as { branches?: unknown }).branches)
          ? ((result as { branches: unknown[] }).branches)
          : Array.isArray((result as { Branches?: unknown }).Branches)
            ? ((result as { Branches: unknown[] }).Branches)
            : Array.isArray(payload?.branches)
              ? (payload.branches as unknown[])
              : Array.isArray(payload?.Branches)
                ? (payload.Branches as unknown[])
                : Array.isArray(payload)
                  ? (payload as unknown[])
                  : []

    const branches = branchesList
      .map((b) => {
        if (!b || typeof b !== 'object') return null
        const row = b as Record<string, unknown>
        const BranchID = String(row.BranchID || '').trim()
        const BranchName = String(row.BranchName || '').trim()
        if (!BranchID || !BranchName) return null
        return {
          BranchID,
          BranchName,
          Address: row.Address ? String(row.Address).trim() : undefined,
          BranchPhone: row.BranchPhone ? String(row.BranchPhone).trim() : undefined,
          City: row.City ? String(row.City).trim() : undefined,
          Province: row.Province ? String(row.Province).trim() : undefined,
          CountryCode: row.CountryCode ? String(row.CountryCode).trim() : undefined,
        }
      })
      .filter(Boolean)

    return NextResponse.json({ success: true, branches, country: config.country })
  } catch (error) {
    console.error('[Quick Order] branches error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to load branches.',
      },
      { status: 502 }
    )
  }
}
