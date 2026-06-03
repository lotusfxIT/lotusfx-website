import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function HomeServiceSections() {
  return (
    <>
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Currency exchange that makes travel easier
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            From taxis and tips to markets and everyday spending, having the right cash on hand
            makes the trip smoother from the moment you arrive.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Our friendly, travel-savvy team can help you choose practical denominations, work out
            roughly how much cash makes sense for your trip, and help you feel properly prepared
            before you go.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            With branches across Australia, New Zealand and Fiji, it&apos;s easy to walk in,
            exchange currency in minutes, and leave feeling ready for what&apos;s next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/currency-exchange" className="btn-primary inline-flex items-center justify-center gap-2">
              Explore Currency Exchange
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link href="/locations" className="btn-secondary inline-flex items-center justify-center gap-2">
              Find a Local Branch
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Need to send money overseas?
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            Lotus FX gives you the ability to transfer money worldwide through our own trusted
            transfer network, including eWire and wire transfers, as well as global partners like
            Western Union and MoneyGram.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Whether you&apos;re sending money to family overseas, paying internationally, or
            transferring funds abroad, our team can help you choose the right option for your needs
            with clear guidance and straightforward support.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Reliable transfer options, transparent pricing, and local help when you need it means
            you can send money with confidence and peace of mind.
          </p>
          <Link href="/money-transfer" className="btn-primary inline-flex items-center gap-2">
            Learn About Money Transfers
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
