'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const FADED_SYMBOLS = [
  { symbol: '$', className: 'top-[8%] left-[10%] text-5xl sm:text-6xl opacity-[0.18]' },
  { symbol: '€', className: 'top-[12%] right-[12%] text-4xl sm:text-5xl opacity-[0.15]' },
  { symbol: '£', className: 'bottom-[14%] left-[12%] text-4xl sm:text-5xl opacity-[0.16]' },
  { symbol: '¥', className: 'bottom-[10%] right-[10%] text-5xl sm:text-6xl opacity-[0.14]' },
  { symbol: '₹', className: 'top-[42%] left-[6%] text-3xl sm:text-4xl opacity-[0.12]' },
  { symbol: '₩', className: 'top-[38%] right-[6%] text-3xl sm:text-4xl opacity-[0.12]' },
]

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
            {/* Left Side - Red with centered 0% */}
            <div className="bg-primary-600 relative flex items-center justify-center min-h-[360px] sm:min-h-[420px] lg:min-h-[500px] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none select-none hidden md:block" aria-hidden>
                {FADED_SYMBOLS.map((item) => (
                  <span
                    key={item.symbol + item.className}
                    className={`absolute font-bold text-white leading-none ${item.className}`}
                  >
                    {item.symbol}
                  </span>
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                viewport={{ once: true }}
                className="relative z-10 flex items-end justify-center"
              >
                <span className="text-[160px] sm:text-[200px] lg:text-[240px] font-black text-white leading-none tracking-tight select-none">
                  0
                </span>
                <span className="text-[64px] sm:text-[80px] lg:text-[96px] font-black text-white leading-none mb-3 sm:mb-4 lg:mb-5 select-none">
                  %
                </span>
              </motion.div>
            </div>

            {/* Right Side - White Content */}
            <div className="p-8 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center bg-white">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                viewport={{ once: true }}
                className="space-y-5"
              >
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                  <Image
                    src="/images/lotus-flower-white.png"
                    alt=""
                    width={44}
                    height={44}
                    className="w-9 h-9 lg:w-11 lg:h-11 object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold text-gray-900 leading-tight whitespace-nowrap">
                    No Commission
                  </h2>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight">
                    on <span className="text-primary-600 font-bold">currency</span> exchange
                  </p>
                </div>

                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl">
                  Save money with commission-free currency exchange. Get the best rates with zero
                  hidden fees or commissions.
                </p>

                <div className="pt-1">
                  <Link
                    href="/currency-exchange"
                    className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <span className="text-base lg:text-lg">Check today&apos;s rates</span>
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
