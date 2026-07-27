import { getValidServerAccessToken } from '@/lib/google-auth-server'

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

export async function fetchAndCacheLocationDetails(
  locationId: string,
  accessToken?: string | null
): Promise<{ ok: true; data: any; cached: boolean } | { ok: false; error: string; status: number }> {
  const cache = getLocationDetailsCache()
  const token = accessToken ?? (await getValidServerAccessToken())
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

  const apiUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locId}?readMask=${encodeURIComponent(readMask)}`

  const locationResponse = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!locationResponse.ok) {
    const errorText = await locationResponse.text()
    console.error('[location-details-cache] Error:', errorText)
    return { ok: false, error: 'Location not found', status: 404 }
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

  cache.set(locationId, { data, fetchedAt: Date.now() })
  return { ok: true, data, cached: false }
}
