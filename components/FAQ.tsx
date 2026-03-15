'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: 'What are your exchange rates?',
    answer: 'Our exchange rates are updated in real-time and are among the most competitive in the market. We offer rates that are typically 2-3% better than banks, with no hidden fees or commissions. You can check our current rates on our website or by calling any of our branches.',
  },
  {
    question: 'How do I exchange currency with LotusFX?',
    answer: 'You can exchange currency with us in three ways: 1) Visit any of our 50+ branches across Australia, New Zealand, and Fiji, 2) Use our online platform to order currency and pick it up at a branch, or 3) Use our mobile app for instant quotes and branch booking. All methods offer the same competitive rates.',
  },
  {
    question: 'Is it safe to exchange currency with LotusFX?',
    answer: 'Yes, absolutely. LotusFX is licensed by ASIC (Australian Securities and Investments Commission) and is a member of AFMA (Australian Financial Markets Association). We use bank-grade security for all transactions and are PCI DSS compliant. Your funds are protected with enterprise-level security measures.',
  },
  {
    question: 'Do you charge any fees or commissions?',
    answer: 'No, we don\'t charge any hidden fees or commissions. Our rates are transparent and include all costs. The rate you see is the rate you get. We make our money from the spread between buy and sell rates, which is how all legitimate currency exchange businesses operate.',
  },
  {
    question: 'How long does a money transfer take?',
    answer: 'Transfer times vary depending on the destination and method: Same-day transfers to major countries, 1-2 business days for most international transfers, and 2-3 business days for less common destinations. We\'ll provide you with an estimated delivery time when you initiate the transfer.',
  },
  {
    question: 'What currencies do you support?',
    answer: 'We support 25+ currencies including all major currencies (USD, EUR, GBP, JPY, CAD, CHF, SGD) and many exotic currencies. We can source almost any currency with advance notice. Check our website for the complete list of supported currencies.',
  },
  {
    question: 'Can I track my money transfer?',
    answer: 'Yes, you can track your transfer in real-time through our online platform or mobile app. You\'ll receive a tracking number and regular updates via SMS and email. You can also call our customer service team for assistance with tracking.',
  },
  {
    question: 'What documents do I need for large transactions?',
    answer: 'For transactions over $10,000 AUD, we need to verify your identity as per AML (Anti-Money Laundering) regulations. Please bring a valid photo ID (driver\'s license or passport) and proof of address (utility bill or bank statement). For business transactions, additional documentation may be required.',
  },
  {
    question: 'Do you offer business currency exchange services?',
    answer: 'Yes, we offer specialized business services including regular currency exchange, forward contracts, and risk management solutions. Our business clients benefit from preferential rates and dedicated account management. Contact our business team for more information.',
  },
  {
    question: 'What if I\'m not satisfied with the service?',
    answer: 'We\'re committed to customer satisfaction and offer a 100% satisfaction guarantee. If you\'re not happy with our service, please contact our customer service team immediately. We\'ll work to resolve any issues and ensure you\'re completely satisfied with your experience.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative section-padding bg-white overflow-hidden">
      {/* Currency symbol decorations - light red/pink color */}
      <div className="absolute inset-0 pointer-events-none">
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
