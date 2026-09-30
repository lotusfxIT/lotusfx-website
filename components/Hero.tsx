'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import CurrencyCalculator from './CurrencyCalculator'
import { useCountryContent } from '@/hooks/useCountryContent'
import { useState } from 'react'
import { useCountry } from '@/context/CountryContext'
import { useSiteStats } from '@/context/SiteStatsContext'
import { trackEvent } from '@/lib/analytics'
import { buildQuickOrderUrl, isQuickOrderEnabled } from '@/lib/quick-order-url'

const statsTemplate = [
  {
    label: 'Customer Rating',
    valueKey: 'customerRating' as const,
    subtext: '{customers}',
    href: '/customer-reviews',
  },
  {
    label: 'Branches',
    value: '{branchValue}',
    subtext: 'in {countryName}',
    href: '/locations',
  },
  {
    label: 'Currencies',
    valueKey: 'currenciesAvailable' as const,
    subtext: 'available',
    href: '/currency-exchange',
  },
  {
    label: 'Years',
    value: '{years}',
    subtext: 'Legacy',
    href: '/about',
  },
]

export default function Hero() {
  const { content, loading } = useCountryContent()
  const { selectedCountry } = useCountry()
  const { stats: siteStats } = useSiteStats()
  const [showQuoteHeading, setShowQuoteHeading] = useState(true)

  // Determine branch count per selected country
  const countryNames: Record<string, string> = {
    AU: 'Australia',
    NZ: 'New Zealand',
    FJ: 'Fiji',
  }

  const branchValues: Record<string, string> = {
    AU: siteStats.branches.australia,
    NZ: siteStats.branches.newZealand,
    FJ: siteStats.branches.fiji,
  }

  const currentCountryName = countryNames[selectedCountry] || 'Australia'
  // Prefer country content (Admin → Country Content) when set; else site stats
  const contentBranches = content?.branches != null && String(content.branches).trim() !== ''
    ? String(content.branches).trim().replace(/\+$/, '')
    : ''
  const currentBranchValue =
    contentBranches ||
    branchValues[selectedCountry] ||
    siteStats.branches.australia

  const features = [
    siteStats.hero.featureCompetitiveRates,
    siteStats.hero.featureNoCommission,
    siteStats.hero.featureLocations,
    siteStats.hero.featureCurrencies,
  ].filter(Boolean)

  // Stable short copy — avoid long fallback flash while CMS content loads
  const defaultHeroSubtitle =
    'Market-leading exchange rates, no commission on currency exchange, and 50+ locations across Australia, New Zealand and Fiji.'
  const heroTitle =
    (!loading && content?.heroTitle) ||
    'Get more holiday out of your travel money'
  const rawSubtitle = (
    (!loading && content?.heroSubtitle) ||
    defaultHeroSubtitle
  ).replace(/\sand\sFiji\.?/gi, ' and Fiji.')
  // Break after "across" on tablet+; mobile keeps normal spaces so lines can wrap
  const acrossSplit = rawSubtitle.match(/^(.*?across)\s+(.*)$/i)
  const subtitleBefore = acrossSplit?.[1] ?? rawSubtitle
  const subtitleAfter = acrossSplit?.[2] ?? ''

  // Build stats with country-specific data
  const stats = statsTemplate.map((stat) => {
    const rawValue =
      'valueKey' in stat && stat.valueKey
        ? siteStats[stat.valueKey]
        : (stat as { value?: string }).value || ''
    return {
      label: stat.label,
      href: stat.href,
      value: String(rawValue)
        .replace('{branches}', content?.branches || siteStats.branches.total)
        .replace('{branchValue}', currentBranchValue)
        .replace('{customers}', content?.customers || siteStats.customers.total)
        .replace('{years}', siteStats.yearsOfExcellence),
      subtext: stat.subtext
        .replace('{customers}', 'satisfied customers')
        .replace('{countryName}', currentCountryName),
    }
  })

  return (
    <section className="relative min-h-0 lg:min-h-[100svh] flex flex-col overflow-x-clip w-full pt-[calc(4rem+1rem)] pb-5 sm:pt-[calc(4rem+1.75rem)] sm:pb-7 lg:pt-[calc(5rem+2rem)] lg:pb-8">
      {/* Background with red gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800"></div>

      {/* Animated Background Elements - Red/Wooden tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container-custom relative z-10 px-4 sm:px-6 flex-1 flex flex-col min-h-0">
        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 sm:gap-8 lg:gap-8 xl:gap-12 items-stretch flex-1 min-h-0 min-w-0">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-w-0 h-full flex flex-col overflow-visible"
          >
            {/* Text block — even gaps, room for descenders */}
            <div className="relative z-10 w-full min-w-0 overflow-visible space-y-4 sm:space-y-6 lg:space-y-7">
              {/* 1. Company name */}
              <p
                className="font-museo uppercase text-white !leading-[1.15] pb-1"
                aria-label="Lotus Foreign Exchange"
              >
                <span className="inline-flex max-w-full flex-wrap items-baseline gap-x-[0.4em] gap-y-0 sm:flex-nowrap">
                  <span className="font-bold text-[2.15rem] sm:text-[3.1rem] lg:text-[3.6rem] tracking-[0.02em]">
                    Lotus
                  </span>
                  <span className="font-medium text-[1.2rem] sm:text-[1.95rem] lg:text-[2.25rem] tracking-[0.14em] text-white/90">
                    Foreign Exchange
                  </span>
                </span>
              </p>

              {/* 2. Slogan — wraps on mobile; one line on tablet+ */}
              <h1 className="text-[2.05rem] sm:text-[2.2rem] md:text-[2.35rem] lg:text-[2.5rem] xl:text-[2.75rem] font-bold text-white !leading-[1.2] pb-[0.15em] tracking-tight">
                {heroTitle}
              </h1>

              {/* 3. Brief description — wrap freely on mobile; break after "across" from sm up */}
              <p className="text-base sm:text-xl lg:text-[1.35rem] xl:text-xl text-white/90 !leading-[1.5] pb-[0.1em]">
                <span className="md:whitespace-nowrap">{subtitleBefore}</span>
                {subtitleAfter ? (
                  <>
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    {subtitleAfter}
                  </>
                ) : null}
              </p>

              {/* 4. Checklist */}
              <ul className="space-y-3 sm:space-y-4 list-none p-0 m-0 max-w-[48rem]">
                {features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.35 + index * 0.08, ease: 'easeOut' }}
                    className="flex items-start gap-3 min-w-0"
                  >
                    <CheckCircleIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white/90 flex-shrink-0 mt-0.5" />
                    <span className="text-white font-medium text-base sm:text-xl !leading-[1.4] pb-0.5">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mt-7 lg:mt-auto pt-2 sm:pt-8 space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {isQuickOrderEnabled(selectedCountry) && (
                  <Link
                    href={buildQuickOrderUrl({ to: 'USD' })}
                    onClick={() =>
                      trackEvent('order_initiation', {
                        cta_name: 'quick_order',
                        quote_type: 'cash',
                        country: selectedCountry,
                        location: 'hero',
                      })
                    }
                    className="hero-qo-pulse col-span-1 lg:col-span-2 w-full text-base lg:text-lg px-5 py-3.5 flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] shadow-lg hover:shadow-xl bg-white hover:bg-gray-50 text-primary-700 relative z-[1]"
                  >
                    <span>Quick Order</span>
                    <span className="ml-1 inline-flex items-center rounded-full bg-primary-600 px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-white">
                      New
                    </span>
                  </Link>
                )}
                <Link
                  href="/locations"
                  onClick={() =>
                    trackEvent('cta_click', {
                      cta_name: 'find_branch',
                      location: 'hero',
                      country: selectedCountry,
                    })
                  }
                  className={`${
                    isQuickOrderEnabled(selectedCountry) ? 'col-span-1' : 'col-span-2'
                  } lg:col-span-2 w-full text-base lg:text-lg px-5 py-3.5 rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] border-2 border-white text-white bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2`}
                >
                  <span>Find a local branch</span>
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat) => (
                  <Link
                    key={stat.href}
                    href={stat.href}
                    onClick={() =>
                      trackEvent('cta_click', {
                        cta_name: `hero_stat_${stat.label.toLowerCase().replace(/\s+/g, '_')}`,
                        location: 'hero',
                        country: selectedCountry,
                      })
                    }
                    className="block text-center p-3 sm:p-4 rounded-lg bg-white border border-gray-200 h-full transition-all duration-200 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  >
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-600 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                      {stat.label}
                    </div>
                    {stat.subtext ? (
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        {stat.subtext}
                      </div>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full min-h-0 min-w-0 w-full flex flex-col"
          >
            <div className="bg-white rounded-2xl shadow-strong p-4 sm:p-6 border border-gray-100 relative z-10 w-full max-w-lg h-full mx-auto lg:ml-auto lg:mr-0 flex flex-col min-h-0 min-w-0">
              {/* Currency symbols - LEFT — soft white + pink/light red */}
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
                <span
                  className="absolute top-[10%] right-[20%] text-4xl lg:text-5xl font-bold text-white/70"
                  style={{ textShadow: '0 0 14px rgba(255,255,255,0.2)' }}
                >
                  $
                </span>
                <span
                  className="absolute top-[30%] right-0 text-5xl lg:text-6xl font-bold text-white/80"
                  style={{ textShadow: '0 2px 10px rgba(127,29,29,0.28)' }}
                >
                  ₩
                </span>
                <span
                  className="absolute top-[50%] right-[30%] text-4xl lg:text-5xl font-bold"
                  style={{
                    color: 'rgba(251,146,160,0.85)',
                    textShadow: '0 0 16px rgba(251,113,133,0.45)',
                  }}
                >
                  ₺
                </span>
                <span
                  className="absolute top-[70%] right-[10%] text-5xl lg:text-6xl font-bold"
                  style={{
                    color: 'rgba(254,205,211,0.88)',
                    textShadow: '0 2px 8px rgba(190,18,60,0.25)',
                  }}
                >
                  ₱
                </span>
                <span
                  className="absolute top-[85%] right-[25%] text-4xl lg:text-5xl font-bold"
                  style={{
                    color: 'rgba(251,113,133,0.75)',
                    textShadow: '0 0 14px rgba(244,63,94,0.35)',
                  }}
                >
                  元
                </span>
              </div>

              {/* Currency symbols - RIGHT — soft white + pink/light red */}
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
                <span
                  className="absolute top-[8%] left-[15%] text-5xl lg:text-6xl font-bold text-white/80"
                  style={{ textShadow: '0 2px 10px rgba(127,29,29,0.28)' }}
                >
                  ¥
                </span>
                <span
                  className="absolute top-[25%] left-0 text-4xl lg:text-5xl font-bold"
                  style={{
                    color: 'rgba(254,205,211,0.9)',
                    textShadow: '0 2px 8px rgba(190,18,60,0.22)',
                  }}
                >
                  €
                </span>
                <span
                  className="absolute top-[45%] left-[25%] text-5xl lg:text-6xl font-bold"
                  style={{
                    color: 'rgba(251,113,133,0.82)',
                    textShadow: '0 0 18px rgba(244,63,94,0.4)',
                  }}
                >
                  ₹
                </span>
                <span
                  className="absolute top-[65%] left-[5%] text-4xl lg:text-5xl font-bold"
                  style={{
                    color: 'rgba(255,228,230,0.9)',
                    textShadow: '0 2px 8px rgba(190,18,60,0.22)',
                  }}
                >
                  £
                </span>
                <span
                  className="absolute top-[82%] left-[20%] text-5xl lg:text-6xl font-bold text-white/70"
                  style={{ textShadow: '0 2px 10px rgba(127,29,29,0.25)' }}
                >
                  ₫
                </span>
              </div>
              {showQuoteHeading && (
                <div className="text-center mb-5 sm:mb-6 shrink-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {selectedCountry === 'FJ' ? 'Exchange in branch' : 'Get Instant Quote'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {selectedCountry === 'FJ'
                      ? 'Live Fiji rates are available at our branches'
                      : 'Compare rates and get the best deal'}
                  </p>
                </div>
              )}
              <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-y-auto overflow-x-visible w-full px-1">
                <CurrencyCalculator
                  onOptionChosen={() => setShowQuoteHeading(false)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
