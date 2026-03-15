import { NextRequest, NextResponse } from 'next/server'
import { getValidServerAccessToken } from '@/lib/google-auth-server'

/**
 * Cached Locations API Endpoint
 *
 * Uses server-side Google token (auto-refreshed when expired via GOOGLE_REFRESH_TOKEN).
 * GET /api/locations/cached
 */

// In-memory cache (for single server deployment)
let locationCache: {
  data: any[] | null
  timestamp: number
  country?: string
} | null = null

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

// Explicit branch-title → region label mapping
const REGION_BY_TITLE: Record<string, string> = {
  // Australia - New South Wales
  'Lotus Foreign Exchange - Wetherill Park': 'New South Wales',
  'Lotus Foreign Exchange - Blacktown': 'New South Wales',
  'Lotus Foreign Exchange - Chinatown': 'New South Wales',
  'Lotus Foreign Exchange - Parramatta': 'New South Wales',
  'Lotus Foreign Exchange - Hurstville': 'New South Wales',
  'Lotus Foreign Exchange - Liverpool': 'New South Wales',
  'Lotus Foreign Exchange - MetCentre': 'New South Wales',
  'Lotus Foreign Exchange - Miranda': 'New South Wales',
  'Lotus Foreign Exchange - Mt Druitt': 'New South Wales',
  'Lotus Foreign Exchange - Penrith': 'New South Wales',

  // Australia - Queensland
  'Lotus Foreign Exchange - Adelaide Street': 'Queensland',
  'Lotus Foreign Exchange - Australia Fair': 'Queensland',
  'Lotus Foreign Exchange - Brisbane City': 'Queensland',
  'Lotus Foreign Exchange - Chermside': 'Queensland',
  'Lotus Foreign Exchange - Helensvale': 'Queensland',
  'Lotus Foreign Exchange - Mt. Gravatt': 'Queensland',
  'Lotus Foreign Exchange - Noosa Civic': 'Queensland',
  'Lotus Foreign Exchange - North lakes': 'Queensland',

  // Australia - Victoria
  'Lotus Foreign Exchange - Dandenong Plaza': 'Victoria',
  'Lotus Foreign Exchange - Swanston Street': 'Victoria',

  // New Zealand - Auckland region
  'Lotus Foreign Exchange - 32 Queen Street': 'Auckland Region',
  'Lotus Foreign Exchange - 115 Queen Street': 'Auckland Region',
  'Lotus Foreign Exchange - 210 Queen Street': 'Auckland Region',
  'Lotus Foreign Exchange - 220 Queen Street': 'Auckland Region',
  'Lotus Foreign Exchange - Browns Bay': 'Auckland Region',
  'Lotus Foreign Exchange - Hunters Corner': 'Auckland Region',
  'Lotus Foreign Exchange - Lynn Mall': 'Auckland Region',
  'Lotus Foreign Exchange - Manukau Mall': 'Auckland Region',
  'Lotus Foreign Exchange - Mt Roskill': 'Auckland Region',
  'Lotus Foreign Exchange - Pakuranga': 'Auckland Region',
  'Lotus Foreign Exchange - St Lukes Mall': 'Auckland Region',
  'Lotus Foreign Exchange - Sylvia Park': 'Auckland Region',

  // New Zealand - Christchurch
  'Lotus Foreign Exchange - Northlands Mall': 'Christchurch Region',
  'Lotus Foreign Exchange - Riccarton': 'Christchurch Region',

  // New Zealand - other cities
  'Lotus Foreign Exchange - Hamilton': 'Hamilton',
  'Lotus Foreign Exchange - Rotorua': 'Rotorua',
  'Lotus Foreign Exchange - Papamoa': 'Tauranga / Papamoa',
  'Lotus Foreign Exchange - Porirua': 'Wellington & Porirua',

  // Fiji - Northern
  'Lotus Foreign Exchange - Savusavu': 'Northern Fiji (Labasa & Savusavu)',
  'Lotus Foreign Exchange - Labasa': 'Northern Fiji (Labasa & Savusavu)',

  // Fiji - Central around Suva
  'Lotus Foreign Exchange - Cumming Street': 'Central Fiji (Suva & surrounds)',
  'Lotus Foreign Exchange - Navua Town': 'Central Fiji (Suva & surrounds)',
  'Lotus Foreign Exchange - Tailevu': 'Central Fiji (Suva & surrounds)',
  'Lotus Foreign Exchange - Nausori': 'Central Fiji (Suva & surrounds)',
  'Lotus Foreign Exchange - Marks Street': 'Central Fiji (Suva & surrounds)',
  'Lotus Foreign Exchange - Thompson Street': 'Central Fiji (Suva & surrounds)',

  // Fiji - Western around Nadi / Lautoka
  'Lotus Foreign Exchange - Lautoka': 'Western Fiji (Nadi & Lautoka)',
  'Lotus Foreign Exchange - Ba': 'Western Fiji (Nadi & Lautoka)',
  'Lotus Foreign Exchange - Vitogo Parade': 'Western Fiji (Nadi & Lautoka)',
  'Lotus Foreign Exchange - Sigatoka': 'Western Fiji (Nadi & Lautoka)',
  'Lotus Foreign Exchange - Namaka': 'Western Fiji (Nadi & Lautoka)',
  'Lotus Foreign Exchange - Tavua': 'Western Fiji (Nadi & Lautoka)',
  'Lotus Foreign Exchange - Hansons Supermarket': 'Western Fiji (Nadi & Lautoka)',
  'Lotus Foreign Exchange - Nadi Town': 'Western Fiji (Nadi & Lautoka)',
}

// Fallback: derive a coarse region label from country + admin area
function getFallbackRegion(country: string, administrativeArea: string): string {
  const admin = (administrativeArea || '').toUpperCase()

  if (country === 'AU') {
    if (admin === 'NSW') return 'New South Wales'
    if (admin === 'QLD') return 'Queensland'
    if (admin === 'VIC') return 'Victoria'
    return admin || 'Other Australia'
  }

  if (country === 'NZ') {
    return admin || 'New Zealand'
  }

  if (country === 'FJ') {
    return admin || 'Fiji'
  }

  return country
}

// Fetch locations from Google API
async function fetchLocationsFromGoogle(accessToken: string): Promise<any[]> {
  // Use the same logic as /api/google-my-business
  const accountsResponse = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })

  if (!accountsResponse.ok) {
    throw new Error('Failed to fetch accounts')
  }

  const accountsData = await accountsResponse.json()
  const allLocations: any[] = []

  const accountCountryMap: { [key: string]: string } = {
    'accounts/104313690701494015090': 'AU',
    'accounts/111995429804675309959': 'FJ',
    'accounts/101281606270379913163': 'NZ'
  }

  // Only process the three known country accounts (skip ungrouped/unused accounts)
  const allowedAccounts = new Set(Object.keys(accountCountryMap))

  for (const account of accountsData.accounts || []) {
    if (!allowedAccounts.has(account.name)) {
      // Skip accounts we don't explicitly map to a country
      console.log('Skipping unmapped account:', account.name)
      continue
    }
    let pageToken = ''
    
    do {
      const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
      const readMask = 'name,title,storefrontAddress,phoneNumbers,websiteUri,regularHours,specialHours,latlng,profile,metadata,openInfo,moreHours,serviceArea,labels,adWordsLocationExtensions,categories'
      
      const locationsResponse = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=${encodeURIComponent(readMask)}&pageSize=100${pageParam}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json()
        
        for (const location of locationsData.locations || []) {
          const country = accountCountryMap[account.name] || 'AU'
          const addressObj = location.storefrontAddress
          const street = addressObj?.addressLines?.join(', ') || ''
          const locality = addressObj?.locality || ''
          const administrativeArea = addressObj?.administrativeArea || ''
          const address = [street, locality, administrativeArea].filter(Boolean).join(', ')
          const title = location.title || 'LotusFX Branch'
          let fullLocationName = location.name
          if (!fullLocationName.includes('accounts/')) {
            fullLocationName = `${account.name}/${location.name}`
          }

          allLocations.push({
            id: fullLocationName,
            name: title,
            address: address,
            phone: location.phoneNumbers?.primaryPhone || '',
            hours: location.regularHours?.periods?.map((period: any) =>
              `${period.openDay}: ${period.openTime?.hours || 9}:${String(period.openTime?.minutes || 0).padStart(2, '0')} - ${period.closeTime?.hours || 18}:${String(period.closeTime?.minutes || 0).padStart(2, '0')}`
            ).join(', ') || 'Mon-Fri: 9AM-6PM',
            services: ['Currency Exchange', 'Money Transfer', 'Travel Money'],
            // Ratings & reviews are fetched in detail view from the reviews API.
            // For the listing grid we avoid hard-coding a fake rating.
            rating: 0,
            reviews: 0,
            coordinates: {
              lat: location.latlng?.latitude || 0,
              lng: location.latlng?.longitude || 0
            },
            country: country,
            city: REGION_BY_TITLE[title] || getFallbackRegion(country, administrativeArea),
            accountName: account.name
          })
        }

        pageToken = locationsData.nextPageToken || ''
      } else {
        break
      }
    } while (pageToken)
  }

  return allLocations
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const country = searchParams.get('country') || null
    
    // Note: GET requests don't have body, so we can't accept client tokens via GET
    // For local testing without server tokens, use the old endpoint or set env vars

    // Check cache
    const now = Date.now()
    const cacheKey = country || 'all'
    
    // Simple cache check (for production, use Redis)
    if (locationCache && 
        locationCache.timestamp + CACHE_TTL > now &&
        (!country || locationCache.country === country || !locationCache.country)) {
      console.log('Serving from cache')
      let data = locationCache.data || []
      
      // Filter by country if requested
      if (country) {
        data = data.filter((loc: any) => loc.country === country)
      }
      
      return NextResponse.json({
        locations: data,
        cached: true,
        timestamp: locationCache.timestamp
      })
    }

    // Cache miss or expired - fetch from Google API
    console.log('Cache miss/expired, fetching from Google API...')
    
    const accessToken = await getValidServerAccessToken()
    if (!accessToken) {
      // Server-side tokens not configured
      // For local testing, user should authenticate first to get client-side tokens
      // The frontend will fall back to the old method automatically
      return NextResponse.json({
        error: 'Server authentication not configured. For production, set GOOGLE_ACCESS_TOKEN and GOOGLE_REFRESH_TOKEN in environment variables. For local testing, authenticate at /locations first.',
        locations: [],
        requiresAuth: true
      }, { status: 503 })
    }

    const locations = await fetchLocationsFromGoogle(accessToken)
    
    // Update cache
    locationCache = {
      data: locations,
      timestamp: now,
      country: country || undefined
    }

    // Filter by country if requested
    let filteredLocations = locations
    if (country) {
      filteredLocations = locations.filter((loc: any) => loc.country === country)
    }

    return NextResponse.json({
      locations: filteredLocations,
      cached: false,
      timestamp: now
    })

  } catch (error) {
    console.error('Error in cached locations API:', error)
    
    // If cache exists but expired, serve stale data
    if (locationCache && locationCache.data) {
      console.log('Serving stale cache data due to error')
      let data = locationCache.data
      const country = request.nextUrl.searchParams.get('country')
      if (country) {
        data = data.filter((loc: any) => loc.country === country)
      }
      return NextResponse.json({
        locations: data,
        cached: true,
        stale: true,
        error: 'Using stale cache due to API error'
      })
    }

    return NextResponse.json({
      error: 'Failed to fetch locations',
      details: error instanceof Error ? error.message : 'Unknown error',
      locations: []
    }, { status: 500 })
  }
}
