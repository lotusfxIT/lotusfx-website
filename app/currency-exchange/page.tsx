import { Metadata } from 'next'
import Link from 'next/link'
import {
  BanknotesIcon,
  MapPinIcon,
  SparklesIcon,
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
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start lg:items-center">
            <div className="w-full flex flex-col justify-center lg:pr-4 xl:pr-8 py-2 lg:py-6">
              <SectionEyebrow>Travel money for any itinerary</SectionEyebrow>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold text-gray-900 mt-3 mb-8 sm:mb-10 leading-[1.15] tracking-tight">
                Currency exchange made easy
              </h1>
              <div className="space-y-8 max-w-xl">
                <p className="text-lg sm:text-xl text-gray-700 leading-[1.8]">
                  Getting your foreign currency sorted shouldn&apos;t feel complicated. Lotus FX
                  makes it easy to buy and sell foreign cash with market-leading exchange rates,
                  no commission fees, and convenient locations across Australia, New Zealand and
                  Fiji.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-[1.85]">
                  From pre-holiday planning to exchanging cash during your trip, our friendly team
                  helps you get your currency sorted quickly and without the hassle.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 sm:mt-12">
                <Link href="#currencies-we-offer" className="btn-primary text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 text-center">
                  View currencies
                </Link>
                <Link href="/locations" className="btn-secondary text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 text-center">
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
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 xl:gap-20 items-center">
            <div className="flex flex-col justify-center lg:pr-4">
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
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {[
                { label: 'Taxis & tips', hint: 'Small notes ready' },
                { label: 'Markets & cafés', hint: 'Everyday spending' },
                { label: 'No commission', hint: 'Keep more cash' },
                { label: 'In-branch help', hint: 'Ask before you fly' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-white border border-primary-100 p-5 sm:p-6 shadow-soft flex flex-col justify-center min-h-[7.5rem]"
                >
                  <p className="font-bold text-gray-900 text-base sm:text-lg">{item.label}</p>
                  <p className="text-sm text-primary-600 mt-1.5">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="currencies-we-offer" className="py-20 bg-white scroll-mt-28">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionHeading
              align="center"
              title="Currencies we offer"
              subtitle="Select a currency to view live rates and available note and coin denominations."
            />
          </div>

          <CurrencyGrid />

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

      <Locations />
    </>
  )
}
