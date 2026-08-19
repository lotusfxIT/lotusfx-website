import { Metadata } from 'next'
import Link from 'next/link'
import {
  BanknotesIcon,
  MapPinIcon,
  SparklesIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import CurrencyCalculator from '@/components/CurrencyCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import CurrencyGrid from '@/components/CurrencyGrid'
import Locations from '@/components/Locations'
import {
  IconFeatureCard,
  LeadParagraphs,
  SectionEyebrow,
  SectionHeading,
} from '@/components/marketing/MarketingBlocks'
import currenciesDenominations from '@/data/currencies-denominations.json'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Currency Exchange & Foreign Cash',
  description:
    'Competitive currency exchange with no commission fees across Australia, New Zealand and Fiji. Buy and sell foreign cash with confidence at Lotus FX.',
  path: '/currency-exchange',
  ogImage: '/images/currency-exchange-og.jpg',
  keywords: ['currency exchange', 'foreign exchange', 'travel money', 'foreign cash', 'no commission'],
})

const highlights = [
  {
    title: 'Market-leading exchange rates with no commission fees',
    description:
      'Lotus FX offers competitive exchange rates across a wide range of major and minor currencies, with no commission fees on currency exchange. Clear pricing and convenient locations make it easier to get more from your travel money.',
    icon: <BanknotesIcon className="w-6 h-6" />,
  },
  {
    title: 'Friendly service from travel-savvy teams',
    description:
      'Our team helps travellers every day and understands the practical side of preparing for a trip. From choosing sensible cash amounts for taxis, tips and everyday spending, we\u2019re here to help you feel properly prepared before you go.',
    icon: <SparklesIcon className="w-6 h-6" />,
  },
  {
    title: 'Convenient locations across the Pacific',
    description:
      'With branches across Australia, New Zealand and Fiji, it\u2019s easy to exchange currency somewhere convenient and close to where you already are. Whether you\u2019re preparing for a trip or needing local cash during your travels, our friendly team is here to help.',
    icon: <MapPinIcon className="w-6 h-6" />,
  },
]

export default function CurrencyExchangePage() {
  return (
    <>
      <section className="relative pt-32 lg:pt-40 pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl w-full">
              <SectionEyebrow>Travel money for any itinerary</SectionEyebrow>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                Currency exchange made easy
              </h1>
              <LeadParagraphs
                paragraphs={[
                  'Getting your foreign currency sorted shouldn\u2019t feel complicated. Lotus FX makes it easy to buy and sell foreign cash with market-leading exchange rates, no commission fees, and convenient locations across Australia, New Zealand and Fiji.',
                  'From pre-holiday planning to exchanging cash during your trip, our friendly team helps you get your currency sorted quickly and without the hassle.',
                ]}
              />
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link href="#rates" className="btn-primary text-lg px-8 py-4 text-center">
                  View Exchange Rates
                </Link>
                <Link href="/locations" className="btn-secondary text-lg px-8 py-4 text-center">
                  Find a Branch
                </Link>
              </div>
            </div>
            <div
              id="rates"
              className="bg-white rounded-2xl shadow-strong p-6 sm:p-8 border border-gray-100 scroll-mt-32"
            >
              <CurrencyCalculator forceCashOnly />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-gradient-to-b from-white via-primary-50/30 to-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            <div>
              <SectionEyebrow>Prepared for the trip</SectionEyebrow>
              <SectionHeading title="Travel money that works in the real world" />
              <div className="mt-8">
                <LeadParagraphs
                  paragraphs={[
                    'From taxis and tips to markets and everyday spending, having the right cash on hand makes the trip smoother from the moment you arrive.',
                    'Our friendly, travel-savvy team can help you choose practical denominations, work out roughly how much cash makes sense for your trip, and help you feel properly prepared before you go.',
                  ]}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Taxis & tips', hint: 'Small notes ready' },
                { label: 'Markets & cafés', hint: 'Everyday spending' },
                { label: 'No commission', hint: 'Keep more cash' },
                { label: 'In-branch help', hint: 'Ask before you fly' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white border border-primary-100 p-5 shadow-soft"
                >
                  <p className="font-bold text-gray-900">{item.label}</p>
                  <p className="text-sm text-primary-600 mt-1">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionEyebrow>Why Lotus FX</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Everything you need for foreign cash"
              subtitle="Competitive rates, practical advice, and branches where you already are."
            />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <IconFeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white mb-5 shadow-md">
              <GlobeAltIcon className="w-6 h-6" />
            </div>
            <SectionHeading
              align="center"
              title="Explore popular travel currencies"
              subtitle="Exchange rates, travel tips, and practical cash guidance for some of our most popular foreign currencies."
            />
          </div>

          <CurrencyGrid currencies={currenciesDenominations.currencies} />
          <p className="text-center text-sm text-gray-500 mt-4">
            Select a currency to view exchange rates and available note and coin denominations.
          </p>

          <div className="mt-12 text-center rounded-2xl bg-gradient-to-r from-primary-50 to-white border border-primary-100 px-6 py-10">
            <p className="text-gray-700 mb-5 text-lg">
              Don&apos;t see your currency? We can source most major currencies with advance notice.
            </p>
            <Link href="/contact" className="btn-secondary inline-block">
              Contact Us for Other Currencies
            </Link>
          </div>
        </div>
      </section>

      <Locations />
    </>
  )
}
