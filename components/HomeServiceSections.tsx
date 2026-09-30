import Link from 'next/link'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { AccentPanel, SplitBand } from '@/components/marketing/MarketingBlocks'

export default function HomeServiceSections() {
  return (
    <>
      <SplitBand
        tone="soft"
        eyebrow="Currency exchange"
        title="Currency exchange that makes travel easier"
        paragraphs={[
          'From taxis and tips to markets and everyday spending, having the right cash on hand makes the trip smoother from the moment you arrive.',
          'Our friendly, travel-savvy team can help you choose practical denominations, work out roughly how much cash makes sense for your trip, and help you feel properly prepared before you go.',
          "With branches across Australia, New Zealand and Fiji, it's easy to walk in, exchange currency in minutes, and leave feeling ready for what's next.",
        ]}
        ctas={
          <>
            <Link href="/currency-exchange" className="btn-primary inline-flex items-center justify-center gap-2">
              Explore Currency Exchange
            </Link>
            <Link href="/locations" className="btn-secondary inline-flex items-center justify-center gap-2">
              Find a Local Branch
            </Link>
          </>
        }
        accent={
          <div className="relative h-full">
            <div className="absolute -inset-4 bg-primary-100/60 rounded-[2rem] blur-2xl" aria-hidden />
            <div className="relative h-full flex flex-col justify-center rounded-3xl border border-primary-100 bg-white p-8 lg:p-10 shadow-strong">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white flex items-center justify-center mb-6 shadow-md">
                <BanknotesIcon className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-5">
                Why travellers choose us
              </p>
              <ul className="space-y-5 text-gray-700 flex-1 flex flex-col justify-center">
                {[
                  'Market-leading rates with no commission fees',
                  'Practical denominations for real travel spending',
                  'Friendly help before you board',
                  'Branches across AU, NZ & Fiji',
                ].map((item) => (
                  <li key={item} className="flex gap-3.5 items-start">
                    <span className="mt-2.5 h-2.5 w-2.5 rounded-full bg-primary-600 shrink-0" />
                    <span className="text-base lg:text-lg leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <SplitBand
        reverse
        tone="light"
        eyebrow="Money transfers"
        title="Need to send money overseas?"
        paragraphs={[
          'Lotus FX gives you the ability to transfer money worldwide through our own trusted transfer network, including eWire and wire transfers, as well as global partners like Western Union and MoneyGram.',
          "Whether you're sending money to family overseas, paying internationally, or transferring funds abroad, our team can help you choose the right option for your needs with clear guidance and straightforward support.",
          'Reliable transfer options, transparent pricing, and local help when you need it means you can send money with confidence and peace of mind.',
        ]}
        ctas={
          <Link href="/money-transfer" className="btn-primary inline-flex items-center gap-2">
            Learn About Money Transfers
          </Link>
        }
        accent={
          <AccentPanel
            title="Transfer options"
            items={[
              {
                label: 'Lotus Special eWire',
                detail: 'Fast regional transfers across Australia, New Zealand and Fiji.',
              },
              {
                label: 'Lotus International Wire',
                detail: 'Secure bank-to-bank transfers for larger or business payments.',
              },
              {
                label: 'MoneyGram',
                detail: 'Worldwide cash pickup and bank deposit across 200+ countries.',
              },
              {
                label: 'Western Union',
                detail: 'Fast global cash pickup through a trusted worldwide network.',
              },
            ]}
          />
        }
      />
    </>
  )
}
