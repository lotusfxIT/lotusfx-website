import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BanknotesIcon,
  MapPinIcon,
  ArrowPathIcon,
  SparklesIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline'
import CurrencyCalculator from '@/components/CurrencyCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import CurrencyDenominationsDisplay from '@/components/CurrencyDenominationsDisplay'
import Locations from '@/components/Locations'
import {
  IconFeatureCard,
  SectionEyebrow,
  SectionHeading,
} from '@/components/marketing/MarketingBlocks'
import {
  ALL_CURRENCIES,
  currencySlug,
  getCurrencyBySlug,
  type CurrencyDenominations,
} from '@/lib/currencies'
import { buildPageMetadata } from '@/lib/seo'

type PageProps = { params: { currency: string } }

export function generateStaticParams() {
  return ALL_CURRENCIES.map((c) => ({ currency: currencySlug(c.code) }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const currency = getCurrencyBySlug(params.currency)
  if (!currency) {
    return buildPageMetadata({
      title: 'Currency Not Found',
      description: 'The requested currency page could not be found.',
      path: '/currency-exchange',
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `Buy & Sell ${currency.name} (${currency.code})`,
    description: `Buy and sell ${currency.name} (${currency.code}) with market-leading exchange rates and no commission fees. Compare travel money options, view denominations and find a Lotus FX branch across Australia, New Zealand and Fiji.`,
    path: `/currency-exchange/${currencySlug(currency.code)}`,
    ogImage: '/images/currency-exchange-og.jpg',
  })
}

function CurrencyPageSections({ currency }: { currency: CurrencyDenominations }) {
  const pluralName = currency.name.endsWith('s') ? currency.name : `${currency.name}s`

  const seoCards = [
    {
      title: `Buy ${currency.name} for travel`,
      description: `Get ${currency.code} cash before you fly with competitive buy rates and no commission fees. Walk into a Lotus FX branch across Australia, New Zealand or Fiji and leave with the notes you need.`,
      icon: <BanknotesIcon className="w-6 h-6" />,
    },
    {
      title: `Sell leftover ${pluralName}`,
      description: `Back from your trip with unused ${currency.code}? Sell leftover ${pluralName} back into local currency at Lotus FX — a simple way to tidy up travel money when you return.`,
      icon: <ArrowPathIcon className="w-6 h-6" />,
    },
    {
      title: 'Compare rates before you visit',
      description: `Use our live calculator to estimate today's ${currency.code} rate, then confirm in branch. Indicative online rates help you plan — final rates and availability are confirmed in store.`,
      icon: <SparklesIcon className="w-6 h-6" />,
    },
  ]

  return (
    <>
      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionEyebrow>{currency.code} travel money</SectionEyebrow>
            <SectionHeading
              align="center"
              title={`Buy, sell and compare ${currency.name}`}
              subtitle="Competitive rates to buy travel cash, sell leftovers when you return, and check indicative rates before you visit."
            />
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {seoCards.map((card, i) => (
              <IconFeatureCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                description={card.description}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 px-8 py-12 lg:px-14 lg:py-14 text-center text-white shadow-strong relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border border-white/15" aria-hidden />
            <div className="absolute bottom-6 left-10 w-24 h-24 rounded-full border border-white/10" aria-hidden />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 mb-5">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">Explore more foreign currencies</h2>
              <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">
                Planning a multi-country trip? Lotus FX offers 35+ major and minor currencies for
                international travel.
              </p>
              <Link
                href="/currency-exchange"
                className="inline-flex items-center justify-center bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                View All Currencies
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function CurrencyDetailPage({ params }: PageProps) {
  const currency = getCurrencyBySlug(params.currency)
  if (!currency) notFound()

  const highlights = [
    { icon: CheckBadgeIcon, label: 'No commission fees' },
    { icon: BanknotesIcon, label: 'Competitive live rates' },
    { icon: BuildingStorefrontIcon, label: 'Ready at branch' },
  ]

  return (
    <>
      <section className="relative pt-28 lg:pt-32 pb-6 bg-gradient-to-b from-primary-50/50 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {/* Left — compact intro card matching right height */}
            <div className="flex flex-col justify-between rounded-3xl border border-primary-100/80 bg-white/90 backdrop-blur-sm shadow-soft p-6 sm:p-7 lg:p-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-gray-900 tracking-tight leading-tight mb-4 min-h-[2.5rem] sm:min-h-[2.75rem] flex flex-wrap items-center gap-x-2">
                  <span>Buy &amp; sell {currency.name}</span>
                  <span className="text-primary-600">({currency.code})</span>
                </h1>
                <div className="space-y-2 text-base text-gray-600 leading-relaxed">
                  <p>
                    Market-leading rates, no commission, and the notes you actually need — whether
                    you&apos;re buying for travel or selling leftovers.
                  </p>
                  <p>
                    Ready at Lotus FX branches across Australia, New Zealand and Fiji.
                  </p>
                </div>

                <ul className="mt-5 grid sm:grid-cols-1 gap-2.5">
                  {highlights.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="flex items-center gap-3 rounded-xl bg-primary-50/70 px-3.5 py-2.5 text-sm sm:text-[0.95rem] font-medium text-gray-800"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                <Link href="#rates" className="btn-primary text-center px-6 py-3 flex-1">
                  Check {currency.code} rate
                </Link>
                <Link href="/locations" className="btn-secondary text-center px-6 py-3 flex-1">
                  Find a branch
                </Link>
              </div>
            </div>

            <CurrencyDenominationsDisplay
              currency={currency}
              compact
              className="scroll-mt-28 w-full"
            />
          </div>
        </div>
      </section>

      {/* Calculator with proper section intro */}
      <section id="rates" className="relative py-12 lg:py-16 bg-gradient-to-b from-white via-primary-50/30 to-white scroll-mt-28">
        <div className="container-custom">
          <div className="text-center max-w-xl mx-auto mb-8">
            <SectionEyebrow>Live exchange rate</SectionEyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Check today&apos;s {currency.code} rate
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              See how much you&apos;ll pay or receive before you visit a branch. Rates are indicative
              and may vary in store.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-strong p-5 sm:p-7 border border-gray-100">
            <CurrencyCalculator
              forceCashOnly
              defaultToCurrency={currency.code}
              lockForeignCurrency
            />
          </div>
        </div>
      </section>

      <CurrencyPageSections currency={currency} />
      <Locations />
    </>
  )
}
