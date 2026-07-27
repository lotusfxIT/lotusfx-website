'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { useCountry } from '@/context/CountryContext'

type CustomerReview = {
  reviewId: string
  reviewer: { displayName: string; profilePhotoUrl?: string }
  starRating: number
  comment: string
  createTime: string
  branchName: string
  slug: string
  country: 'AU' | 'NZ' | 'FJ'
}

const HOME_REVIEW_COUNT = 6

function countryLabel(code: string) {
  if (code === 'AU') return 'Australia'
  if (code === 'NZ') return 'New Zealand'
  if (code === 'FJ') return 'Fiji'
  return code
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

function truncate(text: string, max = 180) {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max).trim()}…`
}

function SkeletonCard() {
  return (
    <div className="h-full p-8 rounded-2xl border-2 border-primary-100 bg-white animate-pulse">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-5 h-5 rounded bg-gray-200" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-5/6" />
        <div className="h-3 bg-gray-100 rounded w-4/6" />
      </div>
      <div className="h-16 bg-primary-50 rounded-xl mb-6" />
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-2 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { selectedCountry } = useCountry()
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const country =
          selectedCountry === 'AU' || selectedCountry === 'NZ' || selectedCountry === 'FJ'
            ? selectedCountry
            : null
        const qs = country ? `?country=${country}` : ''
        const res = await fetch(`/api/customer-reviews${qs}`)
        const data = await res.json()
        if (cancelled) return
        const list: CustomerReview[] = Array.isArray(data.reviews) ? data.reviews : []
        // Prefer 5★, then fill with 4★ to reach HOME_REVIEW_COUNT
        const five = list.filter((r) => r.starRating >= 5)
        const four = list.filter((r) => r.starRating === 4)
        const picked = [...five, ...four].slice(0, HOME_REVIEW_COUNT)
        setReviews(picked)
      } catch {
        if (!cancelled) setReviews([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [selectedCountry])

  return (
    <section className="relative section-padding bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-20 left-10 text-7xl font-bold text-red-200 opacity-35">$</span>
        <span className="absolute top-40 right-16 text-6xl font-bold text-red-200 opacity-40">€</span>
        <span className="absolute bottom-32 left-1/4 text-8xl font-bold text-red-200 opacity-25">¥</span>
        <span className="absolute top-1/2 right-10 text-5xl font-bold text-red-200 opacity-35">£</span>
        <span className="absolute bottom-20 right-1/3 text-6xl font-bold text-red-200 opacity-30">₹</span>
      </div>
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See what clients say about LotusFX
          </h2>
          <p className="text-lg text-gray-600">
            Real Google reviews from customers across Australia, New Zealand and Fiji.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: HOME_REVIEW_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-gray-100 bg-gray-50">
            <p className="text-gray-700 font-medium mb-2">Reviews are loading in shortly</p>
            <p className="text-sm text-gray-500 mb-6">
              Visit our reviews page, or check back after the Google cache has been warmed.
            </p>
            <Link href="/customer-reviews" className="btn-primary inline-flex">
              View all reviews
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.reviewId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative card-hover h-full p-8 rounded-2xl border-2 border-primary-200 bg-white flex flex-col shadow-md hover:shadow-lg transition-shadow">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                  </motion.div>

                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.starRating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-gray-700 mb-6 italic leading-relaxed flex-grow">
                    &ldquo;{truncate(review.comment)}&rdquo;
                  </blockquote>

                  <Link
                    href={`/locations/${review.slug}`}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 mb-6 border border-primary-700 group-hover:border-primary-800 transition-colors duration-300 block"
                  >
                    <div className="text-sm font-bold text-white mb-1">{review.branchName}</div>
                    <div className="text-xs text-white/90 font-medium">
                      {countryLabel(review.country)} · Google review
                      {review.createTime ? ` · ${formatDate(review.createTime)}` : ''}
                    </div>
                  </Link>

                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    {review.reviewer.profilePhotoUrl ? (
                      <Image
                        src={review.reviewer.profilePhotoUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                        {(review.reviewer.displayName || 'C').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                        {review.reviewer.displayName}
                      </div>
                      <div className="text-sm text-gray-500">{review.branchName}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-primary-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers and start saving money on your currency
              exchange and money transfers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/locations"
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Get Started Now
              </Link>
              <Link
                href="/customer-reviews"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200"
              >
                View All Reviews
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
