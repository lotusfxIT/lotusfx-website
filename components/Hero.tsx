'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/outline'
import CurrencyCalculator from './CurrencyCalculator'
import { useCountryContent } from '@/hooks/useCountryContent'
import { useState, useEffect } from 'react'
import { STATS } from '@/config/stats'
import { useCountry } from '@/context/CountryContext'

const statsTemplate = [
  { label: 'Customer Rating', value: '4.9★', subtext: '{customers}' },
  { label: 'Branches', value: '{branchValue}', subtext: 'Branches in {countryName}' },
  { label: 'Currencies', value: '25+', subtext: 'Currencies available' },
  { label: 'Years', value: '15+', subtext: 'Experience' },
]

const features = [
  'Best exchange rates guaranteed',
  'No hidden fees or commissions',
  'Fast & secure transfers',
  'Expert customer support',
]

export default function Hero() {
  const { content, loading } = useCountryContent()
  const { selectedCountry } = useCountry()
  const [showLogo, setShowLogo] = useState(true)
  const [showQuoteHeading, setShowQuoteHeading] = useState(true)

  // Animation cycle: Logo (7s) -> Content (7s) -> Logo (7s) -> repeat
  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo(prev => !prev)
    }, 7000)

    return () => clearInterval(interval)
  }, [showLogo])

  // Determine branch count per selected country
  const countryNames: Record<string, string> = {
    AU: 'Australia',
    NZ: 'New Zealand',
    FJ: 'Fiji',
  }

  const branchValues: Record<string, string> = {
    AU: `${STATS.branches.australia}+`,
    NZ: `${STATS.branches.newZealand}+`,
    FJ: `${STATS.branches.fiji}+`,
  }

  const currentCountryName = countryNames[selectedCountry] || 'Australia'
  const currentBranchValue = branchValues[selectedCountry] || `${STATS.branches.australia}+`

  // Build stats with country-specific data
  const stats = statsTemplate.map(stat => ({
    ...stat,
    value: stat.value
      .replace('{branches}', content?.branches || STATS.branches.total)
      .replace('{branchValue}', currentBranchValue)
      .replace('{customers}', content?.customers || STATS.customers.total),
    subtext: stat.subtext
      .replace('{customers}', 'satisfied customers')
      .replace('{countryName}', currentCountryName),
  }))

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12">
      {/* Background with red gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800"></div>

      {/* Animated Background Elements - Red/Wooden tones */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 sm:gap-10 lg:gap-16 xl:gap-24 items-stretch">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6 relative"
          >
            <div className="relative z-10" style={{ height: '520px' }}>
              <AnimatePresence mode="sync">
                {showLogo ? (
                  // Beautiful Company Name Display
                  <motion.div
                    key="logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 flex flex-col items-center lg:items-start justify-center overflow-visible space-y-1"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-7xl sm:text-8xl lg:text-8.5xl font-semibold leading-tight tracking-widest uppercase"
                      style={{
                        letterSpacing: '0.25em',
                        lineHeight: 1.15,
                        background: 'linear-gradient(180deg, #ffffff 0%, #f5f0e8 45%, #ebe4d9 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        filter: 'drop-shadow(0 2px 20px rgba(0,0,0,0.12))',
                      }}
                    >
                      Lotus
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="text-7xl sm:text-8xl lg:text-8.5xl font-semibold leading-tight tracking-widest uppercase"
                      style={{
                        letterSpacing: '0.35em',
                        lineHeight: 1.15,
                        background: 'linear-gradient(180deg, #ffffff 0%, #f5f0e8 45%, #ebe4d9 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        filter: 'drop-shadow(0 2px 20px rgba(0,0,0,0.12))',
                      }}
                    >
                      Foreign
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-7xl sm:text-8xl lg:text-8.5xl font-semibold leading-tight tracking-widest uppercase"
                      style={{
                        letterSpacing: '0.35em',
                        lineHeight: 1.15,
                        background: 'linear-gradient(180deg, #ffffff 0%, #f5f0e8 45%, #ebe4d9 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        filter: 'drop-shadow(0 2px 20px rgba(0,0,0,0.12))',
                      }}
                    >
                      Exchange
                    </motion.div>
                  </motion.div>
                ) : (
                  // Content Display
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0 space-y-6"
                  >
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30"
                      >
                        <StarIcon className="w-4 h-4" />
                        <span>Trusted by {content?.customers || '6,000+ customers'}</span>
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                      >
                        {content?.heroTitle || 'Best Currency Exchange Rates in Australia'}
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-base sm:text-lg lg:text-xl text-accent-100 max-w-2xl"
                      >
                        {content?.heroSubtitle || 'Get the best exchange rates with no hidden fees. Fast, secure money transfers across Australia, New Zealand & Fiji.'}
                      </motion.p>
                    </div>

                    {/* Features List - shown with content */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="space-y-3"
                    >
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-white flex-shrink-0" />
                          <span className="text-white font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                className="text-base lg:text-lg px-7 py-3 flex items-center justify-center space-x-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-white"
                style={{
                  background: 'linear-gradient(135deg, #E0C9A6 0%, #D4B896 50%, #C8AA84 100%)'
                }}
              >
                <span>Get Best Rates Now</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
              <button
                className="text-base lg:text-lg px-7 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-white flex items-center justify-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #E0C9A6 0%, #D4B896 50%, #C8AA84 100%)'
                }}
              >
                <span>Find Nearest Branch</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-4 sm:pt-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                  className="text-center p-3 sm:p-4 rounded-lg bg-white border border-gray-200"
                >
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-500">
                    {stat.subtext}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full flex flex-col min-h-0"
          >
            <div className="bg-white rounded-2xl shadow-strong p-4 sm:p-6 border border-gray-100 relative z-10 w-full max-w-lg mx-auto lg:mx-auto lg:mr-8 flex-1 min-h-0 flex flex-col">
              {/* Currency symbols - LEFT side of calculator - Distributed */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none hidden lg:block overflow-visible"
                style={{
                  right: '100%',
                  width: '120px',
                  height: '100%',
                  zIndex: -1,
                  marginRight: '20px',
                }}
                aria-hidden="true"
              >
                {/* Wooden currency symbols - distributed */}
                <span
                  className="absolute top-[10%] right-[20%] text-4xl lg:text-5xl font-bold"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(212,184,150,0.95), rgba(200,170,132,0.8)), url(/wood.jpg)',
                    backgroundSize: 'cover',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    opacity: 0.6,
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  ₹
                </span>
                <span
                  className="absolute top-[30%] right-0 text-5xl lg:text-6xl font-bold text-white opacity-70"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  ₽
                </span>
                <span
                  className="absolute top-[50%] right-[30%] text-4xl lg:text-5xl font-bold"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(212,184,150,0.95), rgba(200,170,132,0.8)), url(/wood.jpg)',
                    backgroundSize: 'cover',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    opacity: 0.6,
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  ₩
                </span>
                <span
                  className="absolute top-[70%] right-[10%] text-5xl lg:text-6xl font-bold text-white opacity-75"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  ₿
                </span>
                <span
                  className="absolute top-[85%] right-[25%] text-4xl lg:text-5xl font-bold"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(212,184,150,0.95), rgba(200,170,132,0.8)), url(/wood.jpg)',
                    backgroundSize: 'cover',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    opacity: 0.6,
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  ₪
                </span>
              </div>

              {/* Currency symbols - RIGHT side of calculator - Distributed */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none hidden lg:block overflow-visible"
                style={{
                  left: '100%',
                  width: '120px',
                  height: '100%',
                  zIndex: -1,
                  marginLeft: '20px',
                }}
                aria-hidden="true"
              >
                {/* Currency symbols - distributed */}
                <span
                  className="absolute top-[8%] left-[15%] text-5xl lg:text-6xl font-bold text-white opacity-70"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  ¥
                </span>
                <span
                  className="absolute top-[25%] left-0 text-4xl lg:text-5xl font-bold"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(212,184,150,0.95), rgba(200,170,132,0.8)), url(/wood.jpg)',
                    backgroundSize: 'cover',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    opacity: 0.6,
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  €
                </span>
                <span
                  className="absolute top-[45%] left-[25%] text-5xl lg:text-6xl font-bold text-white opacity-75"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  $
                </span>
                <span
                  className="absolute top-[65%] left-[5%] text-4xl lg:text-5xl font-bold"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(212,184,150,0.95), rgba(200,170,132,0.8)), url(/wood.jpg)',
                    backgroundSize: 'cover',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    opacity: 0.6,
                    textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  }}
                >
                  £
                </span>
                <span
                  className="absolute top-[82%] left-[20%] text-5xl lg:text-6xl font-bold text-white opacity-70"
                  style={{
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  ₦
                </span>
              </div>
              {showQuoteHeading && (
                <div className="text-center mb-5 sm:mb-6 shrink-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Get Instant Quote
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Compare rates and get the best deal
                  </p>
                </div>
              )}
              <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-y-auto overflow-x-hidden w-full">
                <CurrencyCalculator onOptionChosen={() => setShowQuoteHeading(false)} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
