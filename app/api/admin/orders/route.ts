import { NextRequest, NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-auth'
import { listOrders } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json({ orders: await listOrders() })
  } catch (error) {
    console.error('[admin/orders] list error', error)
    return NextResponse.json({ error: 'Could not load orders' }, { status: 500 })
  }
}
