'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ZeroCommission() {
  return (
    <section className="relative section-padding bg-gray-50 overflow-hidden">
      <div className="container-custom relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-[2fr_3fr] gap-0">
            {/* Left Side - Red with 0% */}
            <div className="bg-primary-600 relative overflow-hidden flex items-center justify-center min-h-[450px] lg:min-h-[550px]">
              {/* Subtle decorative circles */}
              <div className="absolute top-12 left-12 w-40 h-40 border-2 border-primary-400/50 rounded-full"></div>
              <div className="absolute bottom-12 right-12 w-32 h-32 border-2 border-primary-400/50 rounded-full"></div>
              
              {/* Large 0 with % tag */}
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Large 0 */}
                  <div className="text-[200px] lg:text-[280px] xl:text-[320px] font-black text-white leading-none tracking-tight">
                    0
                  </div>
                  
                  {/* % Tag - positioned below the 0 */}
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
                    viewport={{ once: true }}
                    className="absolute -bottom-8 left-8 lg:-bottom-12 lg:left-12"
                  >
                    <div className="bg-gray-800 rounded-lg px-4 py-3 lg:px-5 lg:py-4 shadow-2xl relative">
                      <span className="text-white text-5xl lg:text-6xl xl:text-7xl font-black block">%</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Right Side - White Content */}
            <div className="p-12 lg:p-16 xl:p-20 flex flex-col justify-center bg-white">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Lotus Icon */}
                <div>
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">L</span>
                  </div>
                </div>

                {/* Headline */}
                <div className="space-y-1">
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                    No Commission
                  </h2>
                  <p className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 leading-tight">
                    on <span className="text-primary-600 font-bold">currency</span> exchange
                  </p>
                </div>

                {/* Description */}
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
                  Save money with commission-free currency exchange. Get the best rates with zero hidden fees or commissions.
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <Link
                    href="/currency-exchange"
                    className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-base lg:text-lg">Check out exchange rates</span>
                    <ArrowRightIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
