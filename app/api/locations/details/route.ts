import { NextRequest, NextResponse } from 'next/server'
import { getValidServerAccessToken } from '@/lib/google-auth-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('id')

    if (!locationId) {
      return NextResponse.json(
        { error: 'Location ID required' },
        { status: 400 }
      )
    }

    // Get server-side access token (auto-refreshes when expired via refresh token)
    const accessToken = await getValidServerAccessToken()
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Server authentication not configured. Set GOOGLE_REFRESH_TOKEN (and run /auth once to obtain it).' },
        { status: 503 }
      )
    }

    // Extract account and location IDs from the full location path
    // Format: accounts/{accountId}/locations/{locationId}
    const accountMatch = locationId.match(/accounts\/([^\/]+)\/locations\/([^\/]+)/)
    if (!accountMatch) {
      return NextResponse.json(
        { error: 'Invalid location ID format' },
        { status: 400 }
      )
    }

    const [, accountId, locId] = accountMatch

    // Fetch location details from Google My Business API
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
      'categories'
    ].join(',')

    const apiUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locId}?readMask=${encodeURIComponent(readMask)}`
    console.log(`[Details API] Fetching location: ${apiUrl}`)

    const locationResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!locationResponse.ok) {
      const errorText = await locationResponse.text()
      console.error('[Details API] Error:', errorText)
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    const location = await locationResponse.json()
    console.log(`[Details API] Successfully fetched: ${location.title}`)

    // Format the address
    const address = location.storefrontAddress
    const formattedAddress = address ? [
      address.addressLines?.join(', '),
      address.locality,
      address.administrativeArea,
      address.postalCode,
      address.regionCode
    ].filter(Boolean).join(', ') : 'Address not available'

    // Format hours
    const regularHours = location.regularHours?.periods?.map((period: any) => ({
      day: period.openDay || 'Unknown',
      openTime: {
        hours: period.openTime?.hours || 9,
        minutes: period.openTime?.minutes || 0
      },
      closeTime: {
        hours: period.closeTime?.hours || 17,
        minutes: period.closeTime?.minutes || 0
      }
    })) || []

    // Try to fetch reviews + aggregate stats
    let reviews: any[] = []
    let rating = 0
    let reviewCount = 0

    try {
      const reviewsUrl = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locId}/reviews`
      const reviewsResponse = await fetch(reviewsUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json()
        reviews = reviewsData.reviews || []

        rating =
          typeof reviewsData.averageRating === 'number'
            ? reviewsData.averageRating
            : 0
        reviewCount =
          typeof reviewsData.totalReviewCount === 'number'
            ? reviewsData.totalReviewCount
            : reviews.length
      }
    } catch (error) {
      console.error('[Details API] Error fetching reviews:', error)
    }

    const locationData = {
      id: location.name,
      displayName: location.title || 'LotusFX Branch',
      address: {
        addressLines: address?.addressLines || [],
        locality: address?.locality || '',
        administrativeArea: address?.administrativeArea || '',
        postalCode: address?.postalCode || '',
        regionCode: address?.regionCode || '',
        formatted: formattedAddress
      },
      phoneNumbers: location.phoneNumbers?.primaryPhone ? [location.phoneNumbers.primaryPhone] : [],
      websiteUri: location.websiteUri || 'https://lotusfx.com',
      regularHours: {
        openingHours: regularHours
      },
      coordinates: {
        lat: location.latlng?.latitude || 0,
        lng: location.latlng?.longitude || 0
      },
      reviews: reviews,
      overallRating: rating,
      reviewCount: reviewCount
    }

    return NextResponse.json(locationData)
  } catch (error) {
    console.error('[Details API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location details' },
      { status: 500 }
    )
  }
}
