import { NextRequest, NextResponse } from 'next/server'

// Helper function to validate and potentially refresh token
async function validateAccessToken(accessToken: string): Promise<string> {
  try {
    // Test if token is valid by making a simple API call
    const testResponse = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (testResponse.status === 401) {
      throw new Error('Access token is invalid or expired')
    }

    return accessToken
  } catch (error) {
    console.error('Token validation error:', error)
    throw new Error('Invalid or expired access token. Please re-authenticate.')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is required' }, { status: 400 })
    }

    console.log('Fetching REAL data from Google My Business API...')

    // Validate token before proceeding
    await validateAccessToken(accessToken)

    // Use the current working Google My Business API endpoints
    const accountsResponse = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text()
      console.error('Failed to fetch accounts:', errorText)
      return NextResponse.json({ 
        error: 'Failed to fetch accounts from Google My Business API',
        details: errorText,
        status: accountsResponse.status
      }, { status: accountsResponse.status })
    }

    const accountsData = await accountsResponse.json()
    console.log('Successfully connected to Google My Business API!')
    console.log('Accounts found:', accountsData.accounts?.length || 0)

    // Get all locations from all accounts
    const allLocations: any[] = []

    // Map account IDs to countries
    // Account 2 (104313690701494015090) = Australia (20 locations)
    // Account 3 (111995429804675309959) = Fiji (16 locations)
    // Account 4 (101281606270379913163) = New Zealand (18 locations)
    const accountCountryMap: { [key: string]: string } = {
      'accounts/104313690701494015090': 'AU',
      'accounts/111995429804675309959': 'FJ',
      'accounts/101281606270379913163': 'NZ'
    }

    const allowedAccounts = new Set(Object.keys(accountCountryMap))

    for (const account of accountsData.accounts || []) {
      if (!allowedAccounts.has(account.name)) {
        console.log(`Skipping unmapped account: ${account.name}`)
        continue
      }
      console.log(`Processing account: ${account.name}`)
      
      try {
        // Get all locations for this account with pagination
        // readMask is required and must be URL-encoded
        let pageToken = ''
        let totalLocationsInAccount = 0

        do {
          const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
          // Fetch ALL available fields in the list call so we don't need separate detail calls
          const readMask = 'name,title,storefrontAddress,phoneNumbers,websiteUri,regularHours,specialHours,latlng,profile,metadata,openInfo,moreHours,serviceArea,labels,adWordsLocationExtensions,categories'
          const locationsResponse = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=${encodeURIComponent(readMask)}&pageSize=100${pageParam}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })

          if (locationsResponse.ok) {
            const locationsData = await locationsResponse.json()
            const locationsInPage = locationsData.locations?.length || 0
            totalLocationsInAccount += locationsInPage
            console.log(`Found ${locationsInPage} locations in this page (total so far: ${totalLocationsInAccount})`)

            for (const location of locationsData.locations || []) {
              // Use data from the locations list
              // Note: averageRating and reviewCount are not available in the locations list endpoint
              // They would need to be fetched from a different API or Reviews endpoint

              // Determine country based on account mapping
              let country = accountCountryMap[account.name] || 'AU'
              const address = location.storefrontAddress?.addressLines?.join(', ') || ''

              // Google's API returns location.name - let's check what format it's in
              // If it doesn't include 'accounts/', we need to prepend the account name
              let fullLocationName = location.name
              if (!fullLocationName.includes('accounts/')) {
                // Construct the full resource name: accounts/{accountId}/locations/{locationId}
                fullLocationName = `${account.name}/${location.name}`
              }

              console.log(`Location: ${location.title}`)
              console.log(`  - Raw name from API: ${location.name}`)
              console.log(`  - Full resource name: ${fullLocationName}`)

              allLocations.push({
                id: fullLocationName, // Full location name: accounts/{accountId}/locations/{locationId}
                name: location.title || 'LotusFX Branch',
                address: address,
                phone: location.phoneNumbers?.primaryPhone || '',
                hours: location.regularHours?.periods?.map((period: any) =>
                  `${period.openDay}: ${period.openTime?.hours || 9}:${String(period.openTime?.minutes || 0).padStart(2, '0')} - ${period.closeTime?.hours || 18}:${String(period.closeTime?.minutes || 0).padStart(2, '0')}`
                ).join(', ') || 'Mon-Fri: 9AM-6PM',
                services: ['Currency Exchange', 'Money Transfer', 'Travel Money'],
                rating: 4.5, // Default rating - would need to fetch from reviews API
                reviews: 0, // Default reviews - would need to fetch from reviews API
                coordinates: {
                  lat: location.latlng?.latitude || 0,
                  lng: location.latlng?.longitude || 0
                },
                country: country,
                accountName: account.name, // Store the account name for reference
                photos: [], // TODO: Fetch photos from Google My Business Media API (accounts.locations.media.list)
                recentReviews: [], // TODO: Fetch reviews from Google My Business Reviews API
                // Store ALL raw data from Google for the details page
                rawData: {
                  storefrontAddress: location.storefrontAddress,
                  phoneNumbers: location.phoneNumbers,
                  websiteUri: location.websiteUri,
                  regularHours: location.regularHours,
                  specialHours: location.specialHours,
                  moreHours: location.moreHours,
                  profile: location.profile,
                  metadata: location.metadata,
                  openInfo: location.openInfo,
                  labels: location.labels,
                  categories: location.categories,
                  serviceArea: location.serviceArea
                }
              })
            }

            // Check if there are more pages
            pageToken = locationsData.nextPageToken || ''
          } else {
            const errorText = await locationsResponse.text()
            console.error(`Failed to get locations for account ${account.name}:`, errorText)

            // Check if it's a permissions issue or no locations
            if (locationsResponse.status === 403) {
              console.log(`Account ${account.name} may not have locations or insufficient permissions`)
            }
            break
          }
        } while (pageToken)
      } catch (error) {
        console.error('Error fetching locations for account:', error)
      }
    }

    if (allLocations.length === 0) {
      return NextResponse.json({ 
        error: 'No locations found in your Google My Business account. Please check your account setup and ensure you have locations configured.',
        locations: [],
        accountsFound: accountsData.accounts?.length || 0
      }, { status: 404 })
    }

    console.log(`Successfully fetched ${allLocations.length} REAL locations from Google My Business API`)
    return NextResponse.json({ 
      locations: allLocations,
      message: `Successfully loaded ${allLocations.length} real locations from your Google My Business account`,
      apiConnected: true
    })

  } catch (error) {
    console.error('Error in Google My Business API route:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}