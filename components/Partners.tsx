'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const partners = [
  {
    name: 'Western Union',
    image: '/images/partners/western-union.png',
    link: '/western-union',
    description: 'Send money worldwide with Western Union',
  },
  {
    name: 'MoneyGram',
    image: '/images/partners/moneygram.png',
    link: '/moneygram',
    description: 'Fast and reliable money transfers globally',
  },
  {
    name: 'Cash Passport',
    image: '/images/partners/cash-passport.png',
    link: '/cash-passport',
    description: 'Prepaid travel money card for your journeys',
  },
]

export default function Partners() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-custom px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We work with trusted global partners to provide you with the best money transfer and travel money solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={partner.link}
                className="block group"
              >
                <div className="bg-white rounded-xl shadow-soft hover:shadow-strong border border-gray-200 p-8 h-full flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 hover:border-primary-500">
                  <div className="relative w-full h-32 mb-6 flex items-center justify-center">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {partner.description}
                  </p>
                  <div className="mt-4 text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                    Learn more →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
