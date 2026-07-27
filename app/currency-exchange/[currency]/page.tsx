import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CurrencyCalculator from '@/components/CurrencyCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import CurrencyDenominationsDisplay from '@/components/CurrencyDenominationsDisplay'
import Locations from '@/components/Locations'
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

  return (
    <section className="py-16 bg-white">
      <div className="container-custom max-w-4xl space-y-12">
        <CurrencyDenominationsDisplay currency={currency} />

        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Convenient {currency.name} currency exchange
          </h2>
          <p className="text-gray-600 text-lg">
            {currency.code} is a popular travel and international currency. Lotus FX offers
            competitive {currency.code} exchange rates across branches in Australia, New Zealand and
            Fiji, helping you buy and sell foreign cash quickly, conveniently and with confidence.
          </p>
        </div>

        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Practical travel money support
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            Our friendly, travel-savvy team can help you choose practical {currency.code}{' '}
            denominations for the way you&apos;ll actually use cash during your trip — from smaller
            notes for everyday spending to larger notes where appropriate.
          </p>
          <p className="text-gray-600 text-lg">
            If you&apos;re unsure how much {currency.code} cash makes sense for your plans, our team
            is happy to guide you based on your destination and itinerary.
          </p>
        </div>

        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            Sell your leftover {pluralName}
          </h2>
          <p className="text-gray-600 text-lg">
            Returned from your trip with unused {currency.code} cash? Lotus FX can help you
            exchange leftover {pluralName} back into local currency at branches across Australia, New
            Zealand and Fiji.
          </p>
        </div>

        <div className="text-center pt-4 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore more foreign currencies</h2>
          <p className="text-gray-600 mb-6">
            Planning a multi-country trip? Lotus FX offers 40+ major and minor currencies for
            international travel.
          </p>
          <Link href="/currency-exchange" className="btn-primary inline-block">
            View All Currencies
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function CurrencyDetailPage({ params }: PageProps) {
  const currency = getCurrencyBySlug(params.currency)
  if (!currency) notFound()

  return (
    <>
      <section className="relative pt-32 lg:pt-40 pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
                Get your {currency.name} travel money sorted before you go
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Buy {currency.name} ({currency.code})
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Lotus FX makes it simple to buy and sell {currency.name} ({currency.code}) with
                market-leading exchange rates, no commission fees, and convenient branch locations
                across Australia, New Zealand and Fiji.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Having {currency.code} cash ready before you travel can make your trip smoother from
                the start — with practical denominations available at branch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#rates" className="btn-primary text-center px-8 py-4">
                  View {currency.code} Exchange Rates
                </Link>
                <Link href="#denominations" className="btn-secondary text-center px-8 py-4">
                  See Denominations
                </Link>
                <Link href="/locations" className="btn-secondary text-center px-8 py-4">
                  Find a Branch
                </Link>
                <Link href="/locations" className="btn-secondary text-center px-8 py-4 sm:col-span-2">
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
