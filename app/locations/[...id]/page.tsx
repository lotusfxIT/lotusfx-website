'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  GlobeAltIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useCountry } from '@/context/CountryContext'
import { STATIC_LOCATIONS } from '@/data/locations-static'

interface Location {
  id: string
  displayName: string
  address: {
    addressLines: string[]
    locality?: string
    postalCode: string
    administrativeArea: string
    regionCode: string
    formatted?: string
  }
  phoneNumbers: string[]
  websiteUri: string
  regularHours: {
    openingHours: Array<{
      day: string
      openTime: { hours: number; minutes: number }
      closeTime: { hours: number; minutes: number }
    }>
  }
  coordinates?: {
    lat: number
    lng: number
  }
  reviews: Array<{
    reviewer: { displayName: string }
    starRating: string
    comment: string
    createTime: string
  }>
  overallRating: number
  reviewCount: number
}

const ENABLE_BRANCH_PHOTOS = false

export default function LocationPage() {
  const params = useParams()
  const router = useRouter()
  const { selectedCountry } = useCountry()
  const rawId = params.id as string | string[]
  // Handle both single segment (slug) and array (catch-all, old full id) routes
  const pathSegment = Array.isArray(rawId) ? rawId.join('/') : rawId
  // If it looks like a slug (no slash), resolve to full Google location id
  const locationId =
    pathSegment.includes('/') ?
      pathSegment
    : (() => {
        const bySlug = STATIC_LOCATIONS.filter((loc) => loc.slug === pathSegment)
        const byCountry = bySlug.find((loc) => loc.country === selectedCountry)
        return (byCountry ?? bySlug[0])?.id ?? pathSegment
      })()
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [reviewsLoadedOnce, setReviewsLoadedOnce] = useState(false)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [totalReviews, setTotalReviews] = useState<number | null>(null)

  // Redirect old long URLs to clean slug URLs
  useEffect(() => {
    if (pathSegment.includes('/')) {
      const loc = STATIC_LOCATIONS.find((l) => l.id === pathSegment)
      if (loc) router.replace(`/locations/${loc.slug}`)
    }
  }, [pathSegment, router])

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Use server-side endpoint (no client-side auth needed)
        const apiUrl = `/api/locations/details?id=${encodeURIComponent(locationId)}`
        console.log('[Location Details] Fetching from server-side API:', apiUrl)

        const response = await fetch(apiUrl)

        // If server tokens are missing/expired, fall back to client-side token + details API
        if (response.status === 503) {
          console.warn(
            '[Location Details] Server auth not configured or expired; falling back to client-side Google token.'
          )

          const clientAccessToken =
            typeof window !== 'undefined'
              ? localStorage.getItem('google_access_token')
              : null

          if (!clientAccessToken) {
            throw new Error(
              'Google authentication token not found. Please authenticate on this browser first.'
            )
          }

          // Use client token with the generic locations API (LOCATION mode)
          const clientDetailsResponse = await fetch(
            `/api/locations/${encodeURIComponent(locationId)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken: clientAccessToken }),
            }
          )

          if (!clientDetailsResponse.ok) {
            const text = await clientDetailsResponse.text()
            console.error(
              '[Location Details] Client-side details API failed:',
              clientDetailsResponse.status,
              text
            )
            throw new Error('Failed to load branch details from Google.')
          }

          const clientData = await clientDetailsResponse.json()
          console.log(
            '[Location Details] Successfully fetched location data via client token'
          )
          setLocation(clientData)
          // reviews will still be fetched separately below
          return
        }

        if (!response.ok) {
          console.warn('[Location Details] API call failed, trying cached data...')

          // Fallback to cached data if API fails
          const cachedLocations = localStorage.getItem('google_locations')
          if (cachedLocations) {
            const locations = JSON.parse(cachedLocations)
            const cachedLocation = locations.find((loc: any) => loc.id === locationId)

            if (cachedLocation) {
              console.log('[Location Details] Using cached location data:', cachedLocation)

              // Use the comprehensive raw data from Google API
              const rawData = cachedLocation.rawData || {}
              const storefrontAddress = rawData.storefrontAddress || {}

              // Convert cached location format to the expected format with ALL Google data
              setLocation({
                id: cachedLocation.id,
                displayName: cachedLocation.name,
                address: {
                  addressLines: storefrontAddress.addressLines || [cachedLocation.address],
                  locality: storefrontAddress.locality || '',
                  postalCode: storefrontAddress.postalCode || '',
                  administrativeArea: storefrontAddress.administrativeArea || '',
                  regionCode: storefrontAddress.regionCode || cachedLocation.country,
                  formatted: storefrontAddress.addressLines?.join(', ') +
                            (storefrontAddress.locality ? `, ${storefrontAddress.locality}` : '') +
                            (storefrontAddress.administrativeArea ? `, ${storefrontAddress.administrativeArea}` : '') +
                            (storefrontAddress.postalCode ? ` ${storefrontAddress.postalCode}` : '') ||
                            cachedLocation.address
                },
                phoneNumbers: rawData.phoneNumbers?.primaryPhone ? [rawData.phoneNumbers.primaryPhone] : [cachedLocation.phone],
                websiteUri: rawData.websiteUri || 'https://www.lotusfx.com',
                regularHours: {
                  openingHours: rawData.regularHours?.periods?.map((period: any) => ({
                    day: period.openDay,
                    openTime: { hours: period.openTime?.hours || 9, minutes: period.openTime?.minutes || 0 },
                    closeTime: { hours: period.closeTime?.hours || 17, minutes: period.closeTime?.minutes || 0 }
                  })) || []
                },
                coordinates: cachedLocation.coordinates,
                reviews: [],
                overallRating: cachedLocation.rating,
                reviewCount: cachedLocation.reviews
              })
              setLoading(false)
              return
            }
          }

          // If no cache either, throw error
          const errorData = await response.json().catch(() => ({ error: 'Location not found' }))
          throw new Error(errorData.error || 'Location not found')
        }

        const data = await response.json()
        console.log('[Location Details] Successfully fetched location data')
        setLocation(data)

        if (typeof data.overallRating === 'number' && data.overallRating > 0) {
          setAverageRating(data.overallRating)
        }
        if (typeof data.reviewCount === 'number' && data.reviewCount > 0) {
          setTotalReviews(data.reviewCount)
        }

        // Set reviews from location data if present
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews)
        }
      } catch (err) {
        console.error('Error fetching location:', err)
        setError(err instanceof Error ? err.message : 'Failed to load location')
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [locationId])

  // Fetch photos
  useEffect(() => {
    if (!ENABLE_BRANCH_PHOTOS) {
      setLoadingPhotos(false)
      return
    }

    const fetchPhotos = async () => {
      try {
        console.log('[Location Details] Fetching photos...')
        // Photos endpoint still uses client-side tokens for now
        // TODO: Create server-side photos endpoint
        const accessToken = localStorage.getItem('google_access_token')
        if (!accessToken) {
          setLoadingPhotos(false)
          return
        }

        const response = await fetch(`/api/locations/${locationId}/photos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })

        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
          console.log(`[Location Details] Loaded ${data.photos?.length || 0} photos`)
        }
      } catch (err) {
        console.error('Error fetching photos:', err)
      } finally {
        setLoadingPhotos(false)
      }
    }

    fetchPhotos()
  }, [locationId])

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Prevent firing multiple times for the same location
        if (reviewsLoadedOnce) {
          return
        }

        // 1) If server-side endpoint already returned reviews, use them
        if (location && location.reviews && location.reviews.length > 0) {
          console.log('[Location Details] Using reviews from server-side endpoint')
          setReviews(location.reviews)
          setLoadingReviews(false)
          setReviewsLoadedOnce(true)
          return
        }

        // 2) Fallback: use client-side token (same flow as auth screen)
        const accessToken = typeof window !== 'undefined'
          ? localStorage.getItem('google_access_token')
          : null

        if (!accessToken) {
          console.log('[Location Details] No client access token, skipping reviews fetch')
          setLoadingReviews(false)
          setReviewsLoadedOnce(true)
          return
        }

        console.log('[Location Details] Fetching reviews via client-side token...')
        const response = await fetch(`/api/locations/${encodeURIComponent(locationId)}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })

        if (!response.ok) {
          console.warn('[Location Details] Reviews API call failed with status', response.status)
          setLoadingReviews(false)
          return
        }

        const data = await response.json()
        if (data.reviews && data.reviews.length > 0) {
          console.log(`[Location Details] Loaded ${data.reviews.length} reviews`)
          setReviews(data.reviews)
          setReviewsLoadedOnce(true)

          if (typeof data.averageRating === 'number' && data.averageRating > 0) {
            setAverageRating(data.averageRating)
          }
          if (typeof data.totalReviews === 'number' && data.totalReviews > 0) {
            setTotalReviews(data.totalReviews)
          }
        }

        setLoadingReviews(false)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setLoadingReviews(false)
      }
    }

    fetchReviews()
  }, [locationId, location, reviewsLoadedOnce])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Location Not Found</h1>
          <Link href="/locations" className="text-blue-500 hover:text-blue-700">
            ← Back to Locations
          </Link>
        </div>
      </div>
    )
  }

  const fullAddress = location.address.formatted || location.address.addressLines.join(', ')
  const rating =
    averageRating !== null && averageRating > 0
      ? averageRating
      : location.overallRating || 4.5
  const reviewCount =
    totalReviews !== null && totalReviews > 0
      ? totalReviews
      : location.reviewCount || 0

  const staticLoc = STATIC_LOCATIONS.find((loc) => loc.id === location.id)
  const regionHighlight =
    staticLoc?.highlight ||
    (staticLoc?.region
      ? `Serving customers across ${staticLoc.region} and nearby suburbs.`
      : 'Serving customers across the local area and nearby suburbs.')

  return (
    <>
      {/* SEO Metadata */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: location.displayName,
          address: {
            '@type': 'PostalAddress',
            streetAddress: location.address.addressLines[0] || '',
            addressLocality: location.address.locality || location.address.administrativeArea,
            postalCode: location.address.postalCode,
            addressCountry: location.address.regionCode,
          },
          telephone: location.phoneNumbers[0] || '',
          url: location.websiteUri,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            reviewCount: location.reviewCount || 0,
          },
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          {/* Back link */}
          <Link
            href="/locations"
            className="inline-flex items-center text-sm font-semibold text-primary-700 hover:text-primary-900 mb-4"
          >
            ← Back to all locations
          </Link>

            {/* Main card */}
          <motion.div
            className="bg-white rounded-3xl shadow-strong border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Map banner */}
            <div className="h-56 sm:h-64 md:h-72 bg-gray-100 relative">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={
                  location.coordinates && location.coordinates.lat !== 0
                    ? `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}&z=15&output=embed`
                    : `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`
                }
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Title + short address */}
              <div className="mb-6 space-y-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {location.displayName}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-3 rounded-full border border-yellow-100 bg-yellow-50 px-5 py-2.5 shadow-soft">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-base font-semibold text-gray-900">
                      {rating.toFixed(1)}★
                    </span>
                    <span className="text-sm text-gray-700">
                      from {reviewCount} Google reviews
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact + About stacked full width */}
              <div className="space-y-6">
                <div className="border border-gray-100 rounded-2xl p-5 sm:p-6 bg-white">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Contact information
                  </h2>
                  <div className="space-y-5 text-base">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                          <p className="font-semibold text-gray-900 mb-1">
                          Address
                        </p>
                          <p className="text-gray-800">{fullAddress}</p>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            fullAddress
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-semibold mt-2"
                        >
                          Open in Google Maps →
                        </a>
                      </div>
                    </div>

                    {location.phoneNumbers.length > 0 && (
                      <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-accent-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <PhoneIcon className="w-5 h-5 text-accent-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 mb-1">
                            Phone
                          </p>
                          {location.phoneNumbers.map((phone, idx) => (
                            <a
                              key={idx}
                              href={`tel:${phone}`}
                              className="block text-primary-600 hover:text-primary-700 font-semibold"
                            >
                              {phone}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-primary-600 to-accent-500 text-white shadow-strong border border-primary-500/30 space-y-3">
                  <h3 className="text-lg font-semibold mb-1">
                    About this branch
                  </h3>
                  <p className="text-sm text-primary-100">{regionHighlight}</p>
                </div>
              </div>

              {/* Hours + Services full-width row */}
              {location.regularHours &&
                location.regularHours.openingHours.length > 0 && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2 items-stretch">
                    <div className="border border-gray-100 rounded-2xl p-5 sm:p-6 bg-white h-full">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-primary-600" />
                        Opening hours
                      </h2>
                      <div className="space-y-2 text-sm">
                        {location.regularHours.openingHours.map(
                          (hour, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-b-0"
                            >
                              <span className="font-medium text-gray-800">
                                {hour.day}
                              </span>
                              <span className="text-gray-600">
                                {String(hour.openTime.hours).padStart(2, '0')}:
                                {String(hour.openTime.minutes).padStart(2, '0')}{' '}
                                -{' '}
                                {String(hour.closeTime.hours).padStart(2, '0')}:
                                {String(hour.closeTime.minutes).padStart(2, '0')}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="border border-gray-100 rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-primary-50 via-white to-accent-50 h-full">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Services at this branch
                      </h2>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          'Currency Exchange',
                          'Money Transfer',
                          'eWire',
                          'MoneyGram',
                          'Western Union',
                          'Cash Passport',
                        ].map((service, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 shadow-soft"
                          >
                            <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                ✓
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {service}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </motion.div>

          {/* Photos Gallery (still disabled by flag) */}
          {ENABLE_BRANCH_PHOTOS && !loadingPhotos && photos.length > 0 && (
            <motion.div
              className="mt-12 bg-white rounded-2xl shadow-strong p-8 border border-primary-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                Branch Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.slice(0, 12).map((photo, idx) => (
                  <motion.div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => window.open(photo.url, '_blank')}
                  >
                    <Image
                      src={photo.thumbnailUrl || photo.url}
                      alt={photo.description || `Branch photo ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {photo.category && (
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        {photo.category.replace('_', ' ')}
                      </div>
                    )}
                    {photo.viewCount > 0 && (
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <span>👁️</span>
                        <span>{photo.viewCount}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              {photos.length > 12 && (
                <p className="text-center text-gray-500 mt-6">
                  Showing 12 of {photos.length} photos
                </p>
              )}
            </motion.div>
          )}

          {/* Reviews Section */}
          {!loadingReviews && reviews.length > 0 && (
            <motion.div
              className="mt-12 bg-white rounded-2xl shadow-strong p-8 border border-primary-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <StarIcon className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </div>
                Latest Google reviews for this branch
              </h2>
              <div className="space-y-6">
                {reviews
                  .filter((review) => {
                    const numeric =
                      typeof review.starRating === 'number'
                        ? review.starRating
                        : review.starRating === 'FIVE'
                        ? 5
                        : review.starRating === 'FOUR'
                        ? 4
                        : review.starRating === 'THREE'
                        ? 3
                        : review.starRating === 'TWO'
                        ? 2
                        : review.starRating === 'ONE'
                        ? 1
                        : 0
                    return numeric === 5
                  })
                  .slice(0, 5)
                  .map((review, idx) => (
                  <div key={review.reviewId || idx} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      {review.reviewer.profilePhotoUrl && (
                        <Image
                          src={review.reviewer.profilePhotoUrl}
                          alt={review.reviewer.displayName}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900">{review.reviewer.displayName}</p>
                            <p className="text-gray-400 text-xs">{new Date(review.createTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                          <div className="flex gap-1">
                            {(() => {
                              const numeric =
                                review.starRating === 'FIVE' ? 5 :
                                review.starRating === 'FOUR' ? 4 :
                                review.starRating === 'THREE' ? 3 :
                                review.starRating === 'TWO' ? 2 :
                                review.starRating === 'ONE' ? 1 : 0
                              return [...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-5 h-5 ${i < numeric ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-100'}`}
                                />
                              ))
                            })()}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        )}
                        {review.reviewReply && (
                          <div className="mt-4 bg-primary-50 rounded-lg p-4 border-l-4 border-primary-600">
                            <p className="text-sm font-semibold text-primary-900 mb-1">Response from LotusFX</p>
                            <p className="text-sm text-gray-700">{review.reviewReply.comment}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(review.reviewReply.updateTime).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 mt-6 text-sm">
                These are authentic, recent reviews left by real customers on Google Maps
                for this LotusFX branch.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

