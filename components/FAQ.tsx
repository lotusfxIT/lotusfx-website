'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useCountry } from '@/context/CountryContext'
import { getSiteFaqs } from '@/data/faqs'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { selectedCountry } = useCountry()
  const faqs = getSiteFaqs(selectedCountry)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Get answers to common questions about our currency exchange and money transfer services.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl overflow-hidden transition-all duration-300 border-l-4 ${
                  openIndex === index
                    ? 'bg-white border-2 border-primary-300 border-l-primary-600 shadow-lg'
                    : 'bg-white border border-gray-200 border-l-primary-400 shadow-soft hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full px-6 py-5 text-left flex items-center justify-between transition-all duration-200 ${
                    openIndex === index
                      ? 'bg-white/50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-lg font-semibold pr-4 transition-colors duration-200 ${
                    openIndex === index
                      ? 'text-primary-700'
                      : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDownIcon
                      className={`w-6 h-6 flex-shrink-0 transition-colors duration-200 ${
                        openIndex === index ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-primary-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our customer service team is here to help. Get in touch with us for 
              personalized assistance with your currency exchange needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Contact Support
              </button>
              <button className="btn-secondary">
                Call Us Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
