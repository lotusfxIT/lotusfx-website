'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'
import CurrencySymbolsBg from './CurrencySymbolsBg'

export default function Locations() {
  return (
    <section className="relative section-padding bg-primary-600 text-white overflow-hidden">
      <CurrencySymbolsBg variant="white" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12 text-center shadow-xl"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPinIcon className="w-8 h-8 text-white" />
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              Find Us Near You
            </h2>
          </div>
          <p className="text-primary-100 mb-4">
            LotusFX branches across Australia, New Zealand, and Fiji are powered by real-time Google location data. Explore every branch, live hours, reviews, and directions in one place.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center justify-center bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Open Locations Page →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

