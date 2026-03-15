import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const ACCOUNT_MAPPING: Record<string, string> = {
  '104313690701494015090': 'AU',
  '111995429804675309959': 'FJ',
  '101281606270379913163': 'NZ',
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    // Check if this is a photos or reviews request
    const lastSegment = params.id[params.id.length - 1]
    const isPhotosRequest = lastSegment === 'photos'
    const isReviewsRequest = lastSegment === 'reviews'

    // Remove 'photos' or 'reviews' from the path if present
    const pathSegments = isPhotosRequest || isReviewsRequest
      ? params.id.slice(0, -1)
      : params.id

    const locationId = pathSegments.join('/')
    const { accessToken } = await request.json()

    console.log(`[API] Received request for location: ${locationId}`)
    console.log(`[API] Request type: ${isPhotosRequest ? 'PHOTOS' : isReviewsRequest ? 'REVIEWS' : 'LOCATION'}`)
    console.log(`[API] Params.id array:`, params.id)

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      )
    }

    // Extract account and location IDs
    const accountMatch = locationId.match(/accounts\/([^\/]+)\/locations\/([^\/]+)/)
    if (!accountMatch) {
      console.error('[API] Invalid location ID format:', locationId)
      return NextResponse.json(
        { error: 'Invalid location ID format' },
        { status: 400 }
      )
    }

    const [, accountId, locId] = accountMatch

    // Handle PHOTOS request
    if (isPhotosRequest) {
      console.log(`[Photos API] Fetching photos for account ${accountId}, location ${locId}`)
      const apiUrl = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locId}/media`
      console.log(`[Photos API] Calling: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Photos API] Error:', errorText)
        return NextResponse.json({ photos: [] })
      }

      const data = await response.json()
      console.log(`[Photos API] Successfully fetched ${data.mediaItems?.length || 0} photos`)

      const photos = (data.mediaItems || []).map((item: any) => ({
        url: item.googleUrl,
        thumbnailUrl: item.thumbnailUrl,
        description: item.description || '',
        category: item.locationAssociation?.category || 'ADDITIONAL',
        width: item.dimensions?.widthPixels || 0,
        height: item.dimensions?.heightPixels || 0,
        viewCount: item.insights?.viewCount || 0,
        createTime: item.createTime
      }))

      return NextResponse.json({ photos })
    }

    // Handle REVIEWS request
    if (isReviewsRequest) {
      console.log(`[Reviews API] Fetching reviews for account ${accountId}, location ${locId}`)
      const apiUrl = `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locId}/reviews`
      console.log(`[Reviews API] Calling: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Reviews API] Error:', errorText)
        return NextResponse.json({ reviews: [], averageRating: 0, totalReviews: 0 })
      }

      const data = await response.json()
      const reviews = data.reviews || []
      console.log(`[Reviews API] Successfully fetched ${reviews.length} reviews`)

      // Use Google's aggregate stats directly
      const averageRating =
        typeof data.averageRating === 'number' ? data.averageRating : 0
      const totalReviews =
        typeof data.totalReviewCount === 'number'
          ? data.totalReviewCount
          : reviews.length

      const transformedReviews = reviews.map((review: any) => ({
        reviewId: review.reviewId,
        reviewer: {
          displayName: review.reviewer?.displayName || 'Anonymous',
          profilePhotoUrl: review.reviewer?.profilePhotoUrl || ''
        },
        starRating: review.starRating === 'FIVE' ? 5 :
                    review.starRating === 'FOUR' ? 4 :
                    review.starRating === 'THREE' ? 3 :
                    review.starRating === 'TWO' ? 2 :
                    review.starRating === 'ONE' ? 1 : 0,
        comment: review.comment || '',
        createTime: review.createTime,
        updateTime: review.updateTime,
        reviewReply: review.reviewReply ? {
          comment: review.reviewReply.comment,
          updateTime: review.reviewReply.updateTime
        } : null
      }))

      return NextResponse.json({
        reviews: transformedReviews,
        averageRating,
        totalReviews
      })
    }

    // Handle LOCATION details request
    const locationPath = `locations/${locId}`
    console.log(`[API] Extracted location path: ${locationPath}`)

    // Fetch location details from Google My Business API
    // Using the Business Information API v1
    // According to docs: GET https://mybusinessbusinessinformation.googleapis.com/v1/{name=locations/*}
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

    const apiUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/${locationPath}?readMask=${encodeURIComponent(readMask)}`
    console.log(`[API] Calling Google API: ${apiUrl}`)

    const locationResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!locationResponse.ok) {
      const errorText = await locationResponse.text()
      console.error('Failed to fetch location:', errorText)
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    const location = await locationResponse.json()
    console.log('Location data fetched:', location.title)

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

    // Try to fetch reviews (Note: Reviews API requires additional setup)
    let reviews: any[] = []
    let rating = 0
    let reviewCount = 0

    // The reviews endpoint is different and requires the account ID
    // For now, we'll use placeholder data
    // In production, you'd need to fetch from: 
    // https://mybusiness.googleapis.com/v4/accounts/{accountId}/locations/{locationId}/reviews

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
      profile: location.profile || {},
      metadata: location.metadata || {},
      reviews: reviews,
      overallRating: rating,
      reviewCount: reviewCount
    }

    return NextResponse.json(locationData)
  } catch (error) {
    console.error('Error fetching location:', error)
    return NextResponse.json(
      { error: 'Failed to fetch location details' },
      { status: 500 }
    )
  }
}

