import { NextRequest, NextResponse } from 'next/server'
import { canAccessModule, filterBySessionCountry, getAdminSession } from '@/lib/admin-auth'
import { listOrders } from '@/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = getAdminSession(request)
  if (!session || !canAccessModule(session, 'orders')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const orders = filterBySessionCountry(await listOrders(), session)
    return NextResponse.json({ orders, canDelete: session.role === 'full' })
  } catch (error) {
    console.error('[admin/orders] list error', error)
    return NextResponse.json({ error: 'Could not load orders' }, { status: 500 })
  }
}
