import {
  getValidServerAccessToken,
  invalidateServerAccessToken,
} from '@/lib/google-auth-server'

export const LOCATION_DETAILS_CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 1 day

declare global {
  // eslint-disable-next-line no-var
  var __locationDetailsCache: Map<string, { data: any; fetchedAt: number }> | undefined
}

export function getLocationDetailsCache(): Map<string, { data: any; fetchedAt: number }> {
  if (!globalThis.__locationDetailsCache) {
    globalThis.__locationDetailsCache = new Map()
  }
  return globalThis.__locationDetailsCache
}

function summarizeGoogleError(status: number, errorText: string): string {
  try {
    const parsed = JSON.parse(errorText) as {
      error?: { message?: string; status?: string }
    }
    const msg = parsed.error?.message || parsed.error?.status
    if (msg) return `Google ${status}: ${msg}`
  } catch {
    // ignore
  }
  const clipped = errorText.replace(/\s+/g, ' ').slice(0, 180)
  return clipped ? `Google ${status}: ${clipped}` : `Google ${status}`
}

async function fetchLocationFromGoogle(locId: string, token: string, readMask: string) {
  const apiUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locId}?readMask=${encodeURIComponent(readMask)}`
  return fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
}

export async function fetchAndCacheLocationDetails(
  locationId: string,
  accessToken?: string | null
): Promise<{ ok: true; data: any; cached: boolean } | { ok: false; error: string; status: number }> {
  const cache = getLocationDetailsCache()
  let token = accessToken ?? (await getValidServerAccessToken())
  if (!token) {
    return { ok: false, error: 'Server authentication not configured', status: 503 }
  }

  const accountMatch = locationId.match(/accounts\/([^/]+)\/locations\/([^/]+)/)
  if (!accountMatch) {
    return { ok: false, error: 'Invalid location ID format', status: 400 }
  }

  const [, accountId, locId] = accountMatch

  const readMask = [
    'name',
    'title',
    'storefrontAddress',
    'phoneNumbers',
    'websiteUri',
    'regularHours',
    'specialHours',
    'latlng',
    'profile',
    'metadata',
    'openInfo',
    'moreHours',
    'serviceArea',
    'labels',
    'categories',
  ].join(',')

  let locationResponse = await fetchLocationFromGoogle(locId, token, readMask)

  // Stale access token → force refresh once and retry
  if (locationResponse.status === 401 || locationResponse.status === 403) {
    invalidateServerAccessToken()
    const fresh = await getValidServerAccessToken({ forceRefresh: true })
    if (fresh) {
      token = fresh
      locationResponse = await fetchLocationFromGoogle(locId, token, readMask)
    }
  }

  if (!locationResponse.ok) {
    const errorText = await locationResponse.text()
    console.error('[location-details-cache] Error:', locationResponse.status, errorText)
    return {
      ok: false,
      error: summarizeGoogleError(locationResponse.status, errorText),
      status: locationResponse.status === 404 ? 404 : 502,
    }
  }

  const location = await locationResponse.json()

  const address = location.storefrontAddress
  const formattedAddress = address
    ? [
        address.addressLines?.join(', '),
        address.locality,
        address.administrativeArea,
        address.postalCode,
        address.regionCode,
      ]
        .filter(Boolean)
        .join(', ')
    : 'Address not available'

  const regularHours =
    location.regularHours?.periods?.map((period: any) => ({
      day: period.openDay || 'Unknown',
      openTime: {
        hours: period.openTime?.hours || 9,
        minutes: period.openTime?.minutes || 0,
      },
      closeTime: {
        hours: period.closeTime?.hours || 17,
        minutes: period.closeTime?.minutes || 0,
      },
    })) || []

  let reviews: any[] = []
  let rating = 0
  let reviewCount = 0

  try {
    const reviewsUrl = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locId}/reviews`
    const reviewsResponse = await fetch(reviewsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (reviewsResponse.ok) {
      const reviewsData = await reviewsResponse.json()
      reviews = reviewsData.reviews || []
      rating = typeof reviewsData.averageRating === 'number' ? reviewsData.averageRating : 0
      reviewCount =
        typeof reviewsData.totalReviewCount === 'number'
          ? reviewsData.totalReviewCount
          : reviews.length
    }
  } catch (error) {
    console.error('[location-details-cache] Reviews error:', error)
  }

  const data = {
    id: location.name || locationId,
    displayName: location.title || 'LotusFX Branch',
    address: {
      addressLines: address?.addressLines || [],
      locality: address?.locality || '',
      administrativeArea: address?.administrativeArea || '',
      postalCode: address?.postalCode || '',
      regionCode: address?.regionCode || '',
      formatted: formattedAddress,
    },
    phoneNumbers: location.phoneNumbers?.primaryPhone ? [location.phoneNumbers.primaryPhone] : [],
    websiteUri: location.websiteUri || 'https://lotusfx.com',
    regularHours: {
      openingHours: regularHours,
    },
    coordinates: {
      lat: location.latlng?.latitude || 0,
      lng: location.latlng?.longitude || 0,
    },
    reviews,
    overallRating: rating,
    reviewCount,
  }

  // Cache under both the static full id and Google's short name
  cache.set(locationId, { data, fetchedAt: Date.now() })
  if (typeof location.name === 'string' && location.name !== locationId) {
    cache.set(location.name, { data, fetchedAt: Date.now() })
  }
  return { ok: true, data, cached: false }
}
