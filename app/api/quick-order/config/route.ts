import { NextResponse } from 'next/server'
import {
  getGuestPurchaseLimit,
  getQuickOrderConfig,
  isDeliveryEnabled,
} from '@/lib/quick-order-api'

/** Public config for the wizard (no secrets). */
export async function GET() {
  const config = getQuickOrderConfig()
  return NextResponse.json({
    success: true,
    configured: !('error' in config),
    guestPurchaseLimit: getGuestPurchaseLimit(),
    enableDelivery: isDeliveryEnabled(),
    enablePickup: true,
    baseCurrency: { code: 'AUD', name: 'Australia', flag: 'AU' },
    companyName: 'LotusFX',
  })
}
