import { Metadata } from 'next'
import Link from 'next/link'
import CurrencyCalculator from '@/components/CurrencyCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import CurrencyGrid from '@/components/CurrencyGrid'
import Locations from '@/components/Locations'
import currenciesDenominations from '@/data/currencies-denominations.json'

export const metadata: Metadata = {
  title: 'Currency Exchange & Foreign Cash | Lotus FX',
  description:
    'Competitive currency exchange with no commission fees across Australia, New Zealand and Fiji. Buy and sell foreign cash with confidence at Lotus FX.',
  keywords: [
    'currency exchange',
    'foreign exchange',
    'travel money',
    'foreign cash',
    'no commission',
    'Lotus FX',
  ],
  openGraph: {
    title: 'Currency Exchange & Foreign Cash | Lotus FX',
    description:
      'Competitive currency exchange with no commission fees across Australia, New Zealand and Fiji. Buy and sell foreign cash with confidence at Lotus FX.',
    images: ['/images/currency-exchange-og.jpg'],
  },
}

const highlights = [
  {
    title: 'Market-leading exchange rates with no commission fees',
    description:
      'Lotus FX offers competitive exchange rates across a wide range of major and minor currencies, with no commission fees on currency exchange. Clear pricing and convenient locations make it easier to get more from your travel money.',
  },
  {
    title: 'Friendly service from travel-savvy teams',
    description:
      'Our team helps travellers every day and understands the practical side of preparing for a trip. From choosing sensible cash amounts for taxis, tips and everyday spending, we\u2019re here to help you feel properly prepared before you go.',
  },
  {
    title: 'Convenient locations across the Pacific',
    description:
      'With branches across Australia, New Zealand and Fiji, it\u2019s easy to exchange currency somewhere convenient and close to where you already are. Whether you\u2019re preparing for a trip or needing local cash during your travels, our friendly team is here to help.',
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
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
                Travel money for any itinerary
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Currency exchange made easy
              </h1>
              <p className="text-lg text-gray-600 mb-4 max-w-xl">
                Getting your foreign currency sorted shouldn&apos;t feel complicated. Lotus FX makes
                it easy to buy and sell foreign cash with market-leading exchange rates, no
                commission fees, and convenient locations across Australia, New Zealand and Fiji.
              </p>
              <p className="text-lg text-gray-600 mb-10 max-w-xl">
                From pre-holiday planning to exchanging cash during your trip, our friendly team
                helps you get your currency sorted quickly and without the hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#rates" className="btn-primary text-lg px-8 py-4 text-center">
                  View Exchange Rates
                </Link>
                <Link href="/locations" className="btn-secondary text-lg px-8 py-4 text-center">
                  Find a Branch
                </Link>
              </div>
            </div>
            <div id="rates" className="bg-white rounded-2xl shadow-strong p-6 sm:p-8 border border-gray-100 scroll-mt-32">
              <CurrencyCalculator forceCashOnly />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Travel money that works in the real world
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            From taxis and tips to markets and everyday spending, having the right cash on hand
            makes the trip smoother from the moment you arrive.
          </p>
          <p className="text-lg text-gray-600">
            Our friendly, travel-savvy team can help you choose practical denominations, work out
            roughly how much cash makes sense for your trip, and help you feel properly prepared
            before you go.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore popular travel currencies
            </h2>
            <p className="text-lg text-gray-600">
              Exchange rates, travel tips, and practical cash guidance for some of our most popular
              foreign currencies.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              href="/currency-exchange/usd"
              className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              US Dollars (USD)
            </Link>
          </div>

          <CurrencyGrid currencies={currenciesDenominations.currencies} />

          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-4">
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
