'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import fs from 'fs'
import path from 'path'

interface PageData {
  title?: string
  description?: string
  hero?: any
  features?: any
  testimonials?: any
  faq?: any
  [key: string]: any
}

export default function DynamicPage({ params }: { params: { slug: string } }) {
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchPageData()
  }, [params.slug])

  const fetchPageData = async () => {
    try {
      const response = await fetch('/api/admin/pages')
      const allPages = await response.json()
      
      const page = allPages[params.slug]
      if (page) {
        setPageData(page)
      } else {
        setError(true)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn-primary">
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container-custom">
        {/* Hero Section */}
        {pageData.hero && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-16 md:py-24"
          >
            <div className="max-w-3xl">
              {pageData.hero.title && (
                <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-4">
                  {pageData.hero.title}
                </h1>
              )}
              {pageData.hero.subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {pageData.hero.subtitle}
                </p>
              )}
              {pageData.hero.cta_text && (
                <a
                  href={pageData.hero.cta_link || '#'}
                  className="btn-primary inline-block"
                >
                  {pageData.hero.cta_text}
                </a>
              )}
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        {pageData.features && pageData.features.items && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 md:py-24 border-t border-gray-200"
          >
            {pageData.features.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-12 text-center">
                {pageData.features.title}
              </h2>
            )}
            <div className="grid md:grid-cols-3 gap-8">
              {pageData.features.items.map((feature: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-lg border border-primary-200"
                >
                  {feature.icon && (
                    <div className="text-4xl mb-4">{feature.icon}</div>
                  )}
                  {feature.title && (
                    <h3 className="text-xl font-bold text-primary-700 mb-3">
                      {feature.title}
                    </h3>
                  )}
                  {feature.description && (
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Testimonials Section */}
        {pageData.testimonials && pageData.testimonials.items && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 md:py-24 border-t border-gray-200"
          >
            {pageData.testimonials.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-12 text-center">
                {pageData.testimonials.title}
              </h2>
            )}
            <div className="grid md:grid-cols-3 gap-8">
              {pageData.testimonials.items.map((testimonial: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
                >
                  {testimonial.rating && (
                    <div className="mb-3">
                      {'⭐'.repeat(testimonial.rating)}
                    </div>
                  )}
                  {testimonial.text && (
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.text}"
                    </p>
                  )}
                  {testimonial.name && (
                    <p className="font-bold text-primary-700">
                      {testimonial.name}
                    </p>
                  )}
                  {testimonial.role && (
                    <p className="text-sm text-gray-500">
                      {testimonial.role}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* FAQ Section */}
        {pageData.faq && pageData.faq.items && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="py-16 md:py-24 border-t border-gray-200"
          >
            {pageData.faq.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-primary-700 mb-12 text-center">
                {pageData.faq.title}
              </h2>
            )}
            <div className="max-w-2xl mx-auto space-y-4">
              {pageData.faq.items.map((item: any, idx: number) => (
                <motion.details
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer"
                >
                  <summary className="font-bold text-primary-700 hover:text-primary-800">
                    {item.question}
                  </summary>
                  <p className="text-gray-600 mt-3">
                    {item.answer}
                  </p>
                </motion.details>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

