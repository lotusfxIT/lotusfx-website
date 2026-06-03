import { Metadata } from 'next'
import Link from 'next/link'
import CurrencyCalculator from '@/components/CurrencyCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import Locations from '@/components/Locations'

export const metadata: Metadata = {
  title: 'Buy US Dollars (USD) | Currency Exchange | Lotus FX',
  description:
    'Buy and sell US Dollars (USD) with market-leading exchange rates and no commission fees. Find a local branch across Australia, New Zealand and Fiji.',
}

const travelTips = [
  {
    title: 'Carry smaller notes',
    description:
      'Many everyday purchases and tipping situations in the USA are easier with $1, $5 and $10 bills on hand.',
  },
  {
    title: 'Tips are expected',
    description:
      'Restaurants, bars, hotels and taxis commonly expect tips, so having small USD notes available can be useful throughout your trip.',
  },
  {
    title: 'Keep emergency cash handy',
    description:
      'Even if you mainly use cards, carrying some USD cash can help for transport, small vendors or unexpected situations.',
  },
]

const cashUses = [
  'Tips and gratuities',
  'Taxis and transport',
  'Markets and small purchases',
  'Emergencies or backup spending',
]

export default function UsdCurrencyPage() {
  return (
    <>
      <section className="relative pt-32 lg:pt-40 pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
                Get your US travel money sorted before you fly
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Buy US Dollars (USD)
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Planning a trip to the United States? Lotus FX makes it simple to buy and sell US
                Dollars (USD) with competitive exchange rates, no commission fees, and convenient
                branch locations across Australia, New Zealand and Fiji.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether you&apos;re heading to New York, Los Angeles, Hawaii or travelling across
                the USA, having USD cash ready before you arrive can make the trip smoother from
                the start.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#rates" className="btn-primary text-center px-8 py-4">
                  View USD Exchange Rates
                </Link>
                <Link href="/locations" className="btn-secondary text-center px-8 py-4">
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

      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl space-y-12">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Convenient US Dollar currency exchange
            </h2>
            <p className="text-gray-600 text-lg">
              US Dollars are one of the world&apos;s most widely used travel currencies, and cash is
              still commonly used across the United States for tips, taxis, cafés, small purchases
              and everyday spending. Lotus FX offers competitive USD exchange rates across a wide
              range of branches, helping travellers exchange currency quickly, conveniently and with
              confidence.
            </p>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Practical travel money support for the USA
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Our friendly, travel-savvy team can help you choose practical USD denominations for the
              way you&apos;ll actually use cash during your trip. Smaller bills can be useful for
              tipping, transport and day-to-day purchases, while larger notes may make more sense
              for hotels, shopping and bigger expenses.
            </p>
            <p className="text-gray-600 text-lg">
              If you&apos;re unsure roughly how much USD cash makes sense for your holiday, our team
              is happy to help guide you based on your travel plans.
            </p>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Why travellers still carry USD cash
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              While cards are widely accepted throughout the USA, many travellers still prefer
              carrying some US Dollar cash for convenience and peace of mind. Cash can be especially
              useful for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              {cashUses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-gray-600 text-lg">
              Having some USD ready before you land means one less thing to worry about when your
              trip begins.
            </p>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Sell your leftover US Dollars
            </h2>
            <p className="text-gray-600 text-lg">
              Returned from your trip with unused USD cash? Lotus FX can help you exchange leftover
              US Dollars back into local currency quickly and conveniently at branches across
              Australia, New Zealand and Fiji.
            </p>
          </div>

          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Popular USA travel tips
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {travelTips.map((tip) => (
                <div key={tip.title} className="rounded-xl border border-gray-100 p-5 bg-gray-50">
                  <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore more foreign currencies</h2>
            <p className="text-gray-600 mb-6">
              Planning a multi-country trip? Lotus FX offers a wide range of major and minor
              currencies for international travel.
            </p>
            <Link href="/currency-exchange" className="btn-primary inline-block">
              View All Currencies
            </Link>
          </div>
        </div>
      </section>

      <Locations />
    </>
  )
}
