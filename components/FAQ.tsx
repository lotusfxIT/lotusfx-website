'use client'

import Link from 'next/link'
import { useCountry } from '@/context/CountryContext'
import { getSiteFaqs } from '@/data/faqs'
import FaqAccordion from '@/components/FaqAccordion'

export default function FAQ() {
  const { selectedCountry } = useCountry()
  const faqs = getSiteFaqs(selectedCountry)

  return (
    <section className="relative section-padding bg-white overflow-hidden">
      {/* Currency symbol decorations - desktop only */}
      <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden>
        <span className="absolute top-10 right-20 text-8xl font-bold text-red-200 opacity-25">
          €
        </span>
        <span className="absolute top-1/3 left-16 text-7xl font-bold text-red-200 opacity-30">
          $
        </span>
        <span className="absolute bottom-24 right-1/4 text-6xl font-bold text-red-200 opacity-35">
          ¥
        </span>
        <span className="absolute top-2/3 right-12 text-5xl font-bold text-red-200 opacity-40">
          £
        </span>
      </div>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Get answers to common questions about our currency exchange and money transfer services.
          </p>
        </div>

        <FaqAccordion items={faqs} className="max-w-4xl mx-auto" />

        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help. Get in touch with us for personalized
              assistance with your currency exchange needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                Contact Support
              </Link>
              <Link href="/locations" className="btn-secondary">
                Find a Branch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
