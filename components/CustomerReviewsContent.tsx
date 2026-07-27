'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid'
import { useCountry } from '@/context/CountryContext'
import { STATS } from '@/config/stats'
import MotionWrapper from '@/components/MotionWrapper'

type CountryFilter = 'ALL' | 'AU' | 'NZ' | 'FJ'

type CustomerReview = {
  reviewId: string
  reviewer: { displayName: string; profilePhotoUrl?: string }
  starRating: number
  comment: string
  createTime: string
  reviewReply?: { comment: string; updateTime: string } | null
  branchName: string
  slug: string
  country: 'AU' | 'NZ' | 'FJ'
}

const FILTERS: { id: CountryFilter; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'AU', label: 'Australia' },
  { id: 'NZ', label: 'New Zealand' },
  { id: 'FJ', label: 'Fiji' },
]

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

function ReviewCard({ review }: { review: CustomerReview }) {
  const [expanded, setExpanded] = useState(false)
  const long = review.comment.length > 220
  const text = !expanded && long ? `${review.comment.slice(0, 220).trim()}…` : review.comment

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-soft"
    >
      <div className="flex items-start gap-3 mb-4">
        {review.reviewer.profilePhotoUrl ? (
          <Image
            src={review.reviewer.profilePhotoUrl}
            alt=""
            width={48}
            height={48}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold shrink-0">
            {(review.reviewer.displayName || 'C').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 truncate">{review.reviewer.displayName}</p>
          <p className="text-xs text-gray-400">{formatDate(review.createTime)}</p>
        </div>
        <div className="flex gap-0.5 shrink-0" aria-label={`${review.starRating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 ${i < review.starRating ? 'text-yellow-400' : 'text-gray-200'}`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed flex-1">{text}</p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700 self-start"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      {review.reviewReply?.comment && (
        <div className="mt-4 rounded-xl bg-primary-50/80 border-l-4 border-primary-600 p-3">
          <p className="text-xs font-semibold text-primary-900 mb-1">Response from LotusFX</p>
          <p className="text-sm text-gray-700 leading-relaxed">{review.reviewReply.comment}</p>
        </div>
      )}

      <Link
        href={`/locations/${review.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        <MapPinIcon className="w-4 h-4" />
        {review.branchName}
      </Link>
    </motion.article>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 animate-pulse">
      <div className="flex gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
    </div>
  )
}

export default function CustomerReviewsContent() {
  const { selectedCountry } = useCountry()
  const [filter, setFilter] = useState<CountryFilter>('ALL')
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Default filter to selected country once, but keep All available
  useEffect(() => {
    if (initialized) return
    if (selectedCountry === 'AU' || selectedCountry === 'NZ' || selectedCountry === 'FJ') {
      setFilter(selectedCountry)
    }
    setInitialized(true)
  }, [selectedCountry, initialized])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const qs = filter === 'ALL' ? '' : `?country=${filter}`
        const res = await fetch(`/api/customer-reviews${qs}`)
        const data = await res.json()
        if (cancelled) return
        setReviews(Array.isArray(data.reviews) ? data.reviews : [])
        if (data.error && (!data.reviews || data.reviews.length === 0)) {
          setError(data.error)
        }
      } catch {
        if (!cancelled) {
          setReviews([])
          setError('We could not load reviews right now. Please try again shortly.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [filter])

  const countryLabel = useMemo(() => {
    if (filter === 'AU') return 'Australia'
    if (filter === 'NZ') return 'New Zealand'
    if (filter === 'FJ') return 'Fiji'
    return 'Australia, New Zealand and Fiji'
  }, [filter])

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-16 bg-gradient-to-br from-primary-50 via-white to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden>
          <span className="absolute top-24 left-[8%] text-7xl font-bold text-primary-200">★</span>
          <span className="absolute bottom-10 right-[12%] text-6xl font-bold text-primary-100">★</span>
        </div>
        <div className="container-custom relative z-10">
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <ChatBubbleBottomCenterTextIcon className="w-4 h-4" />
              Real Google reviews
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
              Read what our customers say
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              Honest feedback from people who exchanged currency and sent money with LotusFX —
              real stories from branches across Australia, New Zealand and Fiji.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-gray-100 bg-white">
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-primary-600">4–5★</p>
              <p className="text-sm text-gray-500 mt-1">Hand-picked Google reviews</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{STATS.branches.total}+</p>
              <p className="text-sm text-gray-500 mt-1">Branches across the Pacific</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{STATS.customers.total}</p>
              <p className="text-sm text-gray-500 mt-1">Customers who trust LotusFX</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Latest customer stories</h2>
              <p className="text-gray-600 mt-2">
                Showing recent 4 &amp; 5 star reviews from {countryLabel}.
              </p>
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Filter reviews by country"
            >
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    filter === f.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300 hover:text-primary-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error && reviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-700 font-medium mb-2">Reviews are taking a short break</p>
              <p className="text-gray-500 text-sm max-w-md mx-auto">{error}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-700 font-medium mb-2">No reviews for this filter yet</p>
              <p className="text-gray-500 text-sm">
                Try another country, or check back soon — fresh Google reviews arrive regularly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review.reviewId} review={review} />
              ))}
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-10">
            These are authentic reviews left by real customers on Google for LotusFX branches.
            Ratings shown are 4 and 5 stars only.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-primary-600 px-8 py-12 lg:px-12 lg:py-14 text-center text-white"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Ready to experience it yourself?</h2>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Visit a branch near you for competitive rates, friendly service, and the same care
              our customers write about every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/locations"
                className="inline-flex items-center justify-center bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md"
              >
                Find a branch
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                Contact us
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>
    </>
  )
}
