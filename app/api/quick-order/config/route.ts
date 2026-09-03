import { NextRequest, NextResponse } from 'next/server'
import {
  getGuestPurchaseLimit,
  getQuickOrderBaseCurrency,
  getQuickOrderConfig,
  getQuickOrderPortalLoginUrl,
  isDeliveryEnabled,
} from '@/lib/quick-order-api'

/** Public config for the wizard (no secrets). */
export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get('country') || 'AU'
  const config = getQuickOrderConfig(country)
  return NextResponse.json({
    success: true,
    country: String(country).toUpperCase(),
    configured: !('error' in config),
    configError: 'error' in config ? config.error : undefined,
    guestPurchaseLimit: getGuestPurchaseLimit(country),
    enableDelivery: isDeliveryEnabled(country),
    enablePickup: true,
    baseCurrency: getQuickOrderBaseCurrency(country),
    portalLoginUrl: getQuickOrderPortalLoginUrl(country),
    companyName: 'LotusFX',
  })
}
