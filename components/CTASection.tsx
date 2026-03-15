'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'

const ctaItems = [
  {
    icon: PhoneIcon,
    title: 'Call Us Now',
    description: 'Speak with our currency experts',
    action: 'Call +61 2 1234 5678',
    color: 'bg-primary-600',
  },
  {
    icon: MapPinIcon,
    title: 'Visit a Branch',
    description: 'Find your nearest location',
    action: 'Find Branches',
    color: 'bg-accent-500',
  },
  {
    icon: ClockIcon,
    title: 'Get Instant Quote',
    description: 'Check rates in real-time',
    action: 'Get Quote',
    color: 'bg-success-500',
  },
]

export default function CTASection() {
  return (
    <section className="relative section-padding bg-primary-600 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Single currency symbol decoration */}
        <div className="absolute right-24 top-16 pointer-events-none text-white/8 text-7xl font-bold">
          €
        </div>
        <div className="absolute left-16 top-1/4 pointer-events-none text-white/6 text-6xl font-bold">
          $
        </div>
        <div className="absolute left-1/4 bottom-20 pointer-events-none text-white/5 text-8xl font-bold">
          ¥
        </div>
        <div className="absolute right-1/3 bottom-1/3 pointer-events-none text-white/7 text-5xl font-bold">
          £
        </div>
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers and start saving money on your 
            currency exchange and money transfers today. Get the best rates 
            with no hidden fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="bg-white text-primary-600 hover:bg-gray-50 font-bold text-lg py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2">
              <span>Get Best Rates Now</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold text-lg py-4 px-8 rounded-lg transition-all duration-200">
              Find Nearest Branch
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <div className="text-primary-200 text-sm">Average customer rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">20+</div>
              <div className="text-primary-200 text-sm">Branches across AU / NZ / FJ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">25+</div>
              <div className="text-primary-200 text-sm">Currencies available</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {ctaItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-200"
            >
              <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {item.title}
              </h3>
              <p className="text-primary-100 mb-4">
                {item.description}
              </p>
              <button className="w-full bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-all duration-200">
                {item.action}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Don't Wait - Start Saving Today
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Every day you wait is money lost to poor exchange rates. 
              Get started with LotusFX today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started Now
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold text-lg py-4 px-8 rounded-lg transition-all duration-200">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
