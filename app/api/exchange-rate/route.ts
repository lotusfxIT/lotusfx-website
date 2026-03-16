import { NextRequest, NextResponse } from 'next/server'

// When the backend (au/nz/fj.app.lotusfx.com) has an invalid or self-signed SSL cert,
// Node on Vercel cannot verify it. Set ALLOW_INSECURE_SSL=true to skip verification
// for outbound requests from this route only. Prefer fixing the backend certificate.
if (process.env.ALLOW_INSECURE_SSL === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  if (process.env.NODE_ENV === 'production') {
    console.warn('[Exchange Rate API] SSL verification disabled (ALLOW_INSECURE_SSL). Fix backend certificate when possible.')
  }
}

/**
 * Exchange Rate API Proxy
 * 
 * Proxies requests to the external exchange rate API
 * POST /api/exchange-rate
 * 
 * Body: {
 *   fromCcy: string (e.g., "NZD")
 *   toCcy: string (e.g., "AUD")
 *   toAmount: number (e.g., 100)
 *   isBuy?: boolean (optional)
 *   promoGroup?: string (optional)
 *   customerID?: string (optional)
 *   transferMode?: "Wire" | "eWire" | "Booking" | "Wallet" (optional)
 * }
 */

// Country-specific API configurations
function getCountryApiConfig(country: string) {
  const configs: Record<string, {
    url: string
    xKey: string
    xClient: string
  }> = {
    AU: {
      url: process.env.EXCHANGE_RATE_API_URL_AU || 'https://au.app.lotusfx.com/rst/Currencies/getExchangeRate',
      xKey: process.env.EXCHANGE_RATE_X_KEY_AU || process.env.EXCHANGE_RATE_X_KEY || '',
      xClient: process.env.EXCHANGE_RATE_X_CLIENT_AU || process.env.EXCHANGE_RATE_X_CLIENT || '',
    },
    NZ: {
      url: process.env.EXCHANGE_RATE_API_URL_NZ || 'https://nz.app.lotusfx.com/rst/Currencies/getExchangeRate',
      xKey: process.env.EXCHANGE_RATE_X_KEY_NZ || '',
      xClient: process.env.EXCHANGE_RATE_X_CLIENT_NZ || '',
    },
    FJ: {
      url: process.env.EXCHANGE_RATE_API_URL_FJ || 'https://fj.app.lotusfx.com/rst/Currencies/getExchangeRate',
      xKey: process.env.EXCHANGE_RATE_X_KEY_FJ || '',
      xClient: process.env.EXCHANGE_RATE_X_CLIENT_FJ || '',
    },
  }

  return configs[country] || configs['AU'] // Default to AU if country not found
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromCcy, toCcy, toAmount, isBuy, promoGroup, customerID, transferMode, _apiKey, _bearerToken, country } = body

    // Get country-specific API configuration
    const selectedCountry = country || 'AU' // Default to AU
    const apiConfig = getCountryApiConfig(selectedCountry)
    
    console.log(`[Exchange Rate API] Using config for country: ${selectedCountry}`, {
      url: apiConfig.url,
      hasXKey: !!apiConfig.xKey,
      hasXClient: !!apiConfig.xClient,
      xKeyLength: apiConfig.xKey?.length || 0,
      xClientLength: apiConfig.xClient?.length || 0
    })

    // Validate API configuration
    if (!apiConfig.xKey || !apiConfig.xClient) {
      console.error(`[Exchange Rate API] Missing credentials for ${selectedCountry}`, {
        hasXKey: !!apiConfig.xKey,
        hasXClient: !!apiConfig.xClient,
        envVars: {
          AU_KEY: !!process.env.EXCHANGE_RATE_X_KEY_AU,
          AU_CLIENT: !!process.env.EXCHANGE_RATE_X_CLIENT_AU,
          NZ_KEY: !!process.env.EXCHANGE_RATE_X_KEY_NZ,
          NZ_CLIENT: !!process.env.EXCHANGE_RATE_X_CLIENT_NZ,
          FJ_KEY: !!process.env.EXCHANGE_RATE_X_KEY_FJ,
          FJ_CLIENT: !!process.env.EXCHANGE_RATE_X_CLIENT_FJ,
        }
      })
      return NextResponse.json(
        { 
          error: `API credentials not configured for ${selectedCountry}. Please set EXCHANGE_RATE_X_KEY_${selectedCountry} and EXCHANGE_RATE_X_CLIENT_${selectedCountry} in .env.local`,
          success: false
        },
        { status: 500 }
      )
    }

    // Validate required fields
    if (!fromCcy || !toCcy || toAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: fromCcy, toCcy, toAmount' },
        { status: 400 }
      )
    }

    // Build request payload for external API
    const requestPayload: any = {
      toCcy,
      fromCcy,
      toAmount: Number(toAmount)
    }

    // Add optional parameters if provided
    if (isBuy !== undefined) requestPayload.isBuy = isBuy
    if (promoGroup) requestPayload.promoGroup = promoGroup
    if (customerID) requestPayload.customerID = customerID
    if (transferMode) requestPayload.transferMode = transferMode

    // Build headers with authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add required authentication headers: X-KEY and X-CLIENT
    // Test values (from test page) take precedence over env vars
    if (_apiKey) {
      // Test mode: use provided key as X-KEY
      headers['X-KEY'] = _apiKey
      // If _bearerToken is provided, use it as X-CLIENT
      if (_bearerToken) {
        headers['X-CLIENT'] = _bearerToken
      }
    } else {
      // Production mode: use country-specific environment variables
      if (apiConfig.xKey) {
        headers['X-KEY'] = apiConfig.xKey
      }
      if (apiConfig.xClient) {
        headers['X-CLIENT'] = apiConfig.xClient
      }
    }

    console.log('[Exchange Rate API] Request:', {
      country: selectedCountry,
      url: apiConfig.url,
      payload: requestPayload,
      hasXKey: !!headers['X-KEY'],
      hasXClient: !!headers['X-CLIENT'],
      hasAuth: !!(headers['X-KEY'] && headers['X-CLIENT'])
    })

    // Call external API with error handling
    let response: Response
    try {
      // Use fetch with explicit options for Node.js compatibility
      // Note: Node.js fetch may have different behavior than browser fetch
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          ...headers,
          'User-Agent': 'LotusFX-Website/1.0',
        },
        body: JSON.stringify([requestPayload]), // API expects an array
        cache: 'no-store', // Don't cache API responses
      }

      console.log('[Exchange Rate API] Making fetch request:', {
        url: apiConfig.url,
        method: 'POST',
        headers: Object.keys(headers),
        bodyLength: JSON.stringify([requestPayload]).length
      })
      
      // Try the fetch
      response = await fetch(apiConfig.url, fetchOptions)
      
      console.log('[Exchange Rate API] Fetch completed, status:', response.status)
    } catch (fetchError: any) {
      console.error('[Exchange Rate API] Fetch error details:', {
        url: apiConfig.url,
        error: fetchError.message,
        code: fetchError.code,
        cause: fetchError.cause,
        name: fetchError.name
      })
      
      // Provide more specific error messages
      if (fetchError.code === 'ENOTFOUND' || fetchError.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { 
            error: `Cannot connect to API server. Please check if ${apiConfig.url} is accessible.`,
            details: fetchError.message,
            success: false
          },
          { status: 503 }
        )
      }
      
      if (fetchError.name === 'AbortError' || fetchError.code === 'ETIMEDOUT') {
        return NextResponse.json(
          { 
            error: 'API request timed out. The server may be slow or unreachable.',
            details: fetchError.message,
            success: false
          },
          { status: 504 }
        )
      }
      
      // Re-throw to be caught by outer catch
      throw fetchError
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Exchange Rate API] Error:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch exchange rate', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[Exchange Rate API] Success:', data)

    // API response format: { result: { success, rate, inverse, base, fee, ... } }
    // The request body is an array, but response is an object with result property
    const result = data.result || (Array.isArray(data) ? data[0] : data)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: result.statusText || 'Failed to get exchange rate',
          status: result.status,
          success: false
        },
        { status: 400 }
      )
    }

    // Return the rate data
    return NextResponse.json({
      success: true,
      rate: result.rate,
      inverse: result.inverse,
      base: result.base,
      fee: result.fee,
      margin: result.margin,
      group: result.group,
      // Calculate converted amount
      fromAmount: toAmount,
      toAmount: toAmount * (result.rate || 0),
      fromCcy,
      toCcy
    })

  } catch (error) {
    console.error('[Exchange Rate API] Exception:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('[Exchange Rate API] Full error details:', {
      message: errorMessage,
      stack: errorStack,
      type: error?.constructor?.name
    })
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: errorMessage,
        success: false
      },
      { status: 500 }
    )
  }
}
