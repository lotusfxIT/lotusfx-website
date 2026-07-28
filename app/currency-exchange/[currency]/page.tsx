import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BanknotesIcon,
  MapPinIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import CurrencyCalculator from '@/components/CurrencyCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import CurrencyDenominationsDisplay from '@/components/CurrencyDenominationsDisplay'
import Locations from '@/components/Locations'
import {
  IconFeatureCard,
  LeadParagraphs,
  SectionEyebrow,
  SectionHeading,
} from '@/components/marketing/MarketingBlocks'
import {
  ALL_CURRENCIES,
  currencySlug,
  getCurrencyBySlug,
  type CurrencyDenominations,
} from '@/lib/currencies'

type PageProps = { params: { currency: string } }

export function generateStaticParams() {
  return ALL_CURRENCIES.map((c) => ({ currency: currencySlug(c.code) }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const currency = getCurrencyBySlug(params.currency)
  if (!currency) return { title: 'Currency Not Found' }

  return {
    title: `Buy ${currency.name} (${currency.code}) | Currency Exchange | Lotus FX`,
    description: `Buy and sell ${currency.name} (${currency.code}) with market-leading exchange rates and no commission fees. View denominations and find a branch across Australia, New Zealand and Fiji.`,
    openGraph: {
      title: `Buy ${currency.name} (${currency.code}) | Lotus FX`,
      description: `Exchange ${currency.code} with competitive rates and no commission fees at Lotus FX.`,
    },
  }
}

function CurrencyPageSections({ currency }: { currency: CurrencyDenominations }) {
  const pluralName = currency.name.endsWith('s') ? currency.name : `${currency.name}s`

  const seoCards = [
    {
      title: `Convenient ${currency.name} currency exchange`,
      description: `${currency.code} is a popular travel and international currency. Lotus FX offers competitive ${currency.code} exchange rates across branches in Australia, New Zealand and Fiji, helping you buy and sell foreign cash quickly, conveniently and with confidence.`,
      icon: <BanknotesIcon className="w-6 h-6" />,
    },
    {
      title: 'Practical travel money support',
      description: `Our friendly, travel-savvy team can help you choose practical ${currency.code} denominations for the way you'll actually use cash during your trip — from smaller notes for everyday spending to larger notes where appropriate. If you're unsure how much ${currency.code} cash makes sense for your plans, our team is happy to guide you based on your destination and itinerary.`,
      icon: <SparklesIcon className="w-6 h-6" />,
    },
    {
      title: `Sell your leftover ${pluralName}`,
      description: `Returned from your trip with unused ${currency.code} cash? Lotus FX can help you exchange leftover ${pluralName} back into local currency at branches across Australia, New Zealand and Fiji.`,
      icon: <ArrowPathIcon className="w-6 h-6" />,
    },
  ]

  return (
    <>
      <section id="denominations" className="py-16 bg-white scroll-mt-28">
        <div className="container-custom max-w-5xl">
          <CurrencyDenominationsDisplay currency={currency} />
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionEyebrow>{currency.code} travel money</SectionEyebrow>
            <SectionHeading
              align="center"
              title={`Everything you need for ${currency.name}`}
              subtitle="Competitive rates, practical denominations, and help when you get home with leftover cash."
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
                Planning a multi-country trip? Lotus FX offers 40+ major and minor currencies for
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

  return (
    <>
      <section className="relative pt-32 lg:pt-40 pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="max-w-xl">
              <SectionEyebrow>
                Get your {currency.name} travel money sorted before you go
              </SectionEyebrow>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                Buy {currency.name} ({currency.code})
              </h1>
              <LeadParagraphs
                paragraphs={[
                  `Lotus FX makes it simple to buy and sell ${currency.name} (${currency.code}) with market-leading exchange rates, no commission fees, and convenient branch locations across Australia, New Zealand and Fiji.`,
                  `Having ${currency.code} cash ready before you travel can make your trip smoother from the start — with practical denominations available at branch.`,
                ]}
              />
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-8">
                <Link href="#rates" className="btn-primary text-center px-8 py-4">
                  View {currency.code} Exchange Rates
                </Link>
                <Link href="#denominations" className="btn-secondary text-center px-8 py-4">
                  See Denominations
                </Link>
                <Link href="/locations" className="btn-secondary text-center px-8 py-4">
                  Find a Branch
                </Link>
              </div>
            </div>
            <div
              id="rates"
              className="bg-white rounded-2xl shadow-strong p-6 sm:p-8 border border-gray-100 scroll-mt-32"
            >
              <CurrencyCalculator forceCashOnly defaultToCurrency={currency.code} />
            </div>
          </div>
        </div>
      </section>

      <CurrencyPageSections currency={currency} />
      <Locations />
    </>
  )
}
