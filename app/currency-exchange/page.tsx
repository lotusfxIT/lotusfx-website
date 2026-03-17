import { Metadata } from 'next'
import CurrencyCalculator from '@/components/CurrencyCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import CurrencyGrid from '@/components/CurrencyGrid'
import Features from '@/components/Features'
import FAQ from '@/components/FAQ'
import currenciesDenominations from '@/data/currencies-denominations.json'
import { BuildingOffice2Icon, GlobeAltIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Currency Exchange in Australia, New Zealand & Fiji | LotusFX',
  description:
    'Exchange currency with LotusFX in Australia, New Zealand and Fiji. Competitive rates, no hidden fees, and branches across all three countries.',
  keywords: [
    'currency exchange',
    'foreign exchange',
    'exchange rates',
    'currency converter',
    'travel money',
    'AUD to USD',
    'AUD to EUR',
    'currency exchange near me',
    'exchange rates',
    'LotusFX'
  ],
  openGraph: {
    title: 'Currency Exchange in Australia, New Zealand & Fiji | LotusFX',
    description:
      'Exchange currency with LotusFX in Australia, New Zealand and Fiji. Competitive rates, no hidden fees, and branches across all three countries.',
    images: ['/images/currency-exchange-og.jpg'],
  },
}

export default function CurrencyExchangePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl w-full">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
                Currency Exchange
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Currency Exchange in Australia, New Zealand &amp; Fiji
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl">
                Get competitive exchange rates with no hidden fees. 
                Exchange 25+ currencies at our 54 branches across Australia, 
                New Zealand and Fiji.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary text-lg px-8 py-4">
                  Get Instant Quote
                </button>
                <button className="btn-secondary text-lg px-8 py-4">
                  Find Nearest Branch
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-strong p-6 sm:p-8 border border-gray-100">
              <CurrencyCalculator forceCashOnly />
            </div>
          </div>
        </div>
      </section>

      {/* Available Currencies */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              25+ Currencies Available
            </h2>
            <p className="text-lg text-gray-600">
              Buy and sell major world currencies at competitive rates with no commission
            </p>
          </div>

          <CurrencyGrid currencies={currenciesDenominations.currencies} />

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't see your currency? We can source most major currencies with advance notice.
            </p>
            <button className="btn-secondary">
              Contact Us for Other Currencies
            </button>
          </div>
        </div>
      </section>

      {/* How to Exchange with LotusFX */}
      <section className="py-20 bg-primary-600">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white max-w-xl">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Three Easy Ways to Exchange
              </h2>
              <p className="text-lg text-primary-100 mb-8">
                Choose the exchange method that works best for you – in branch, online,
                or on the go with our mobile app.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: BuildingOffice2Icon,
                    title: 'Visit a Branch',
                    description:
                      'Walk into any LotusFX branch for instant currency exchange with personalised service.',
                  },
                  {
                    icon: GlobeAltIcon,
                    title: 'Order Online',
                    description:
                      'Check live rates, place an order and pick up your cash at your chosen branch.',
                  },
                  {
                    icon: DevicePhoneMobileIcon,
                    title: 'Use the Lotus App',
                    description:
                      'Track rates, plan your trip and manage your cash from anywhere, any time.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-white" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-primary-100">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-full flex items-center justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2rem] border-4 border-white/80 bg-primary-600/40 shadow-xl flex items-center justify-center">
                <svg
                  className="w-32 h-32 md:w-40 md:h-40"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Back note */}
                  <rect
                    x="20"
                    y="20"
                    width="80"
                    height="44"
                    rx="10"
                    stroke="white"
                    strokeWidth="2.5"
                    opacity="0.45"
                  />
                  {/* Front note */}
                  <rect
                    x="15"
                    y="30"
                    width="90"
                    height="50"
                    rx="12"
                    fill="url(#cashGradient)"
                    stroke="white"
                    strokeWidth="3"
                  />
                  {/* Side bands */}
                  <rect x="24" y="36" width="18" height="38" rx="5" stroke="white" strokeWidth="2" opacity="0.9" />
                  <rect x="78" y="36" width="18" height="38" rx="5" stroke="white" strokeWidth="2" opacity="0.9" />
                  {/* Center circle with dollar */}
                  <circle cx="60" cy="55" r="13" fill="white" />
                  <path
                    d="M60 47v16M56 51h6.5M56 57h6.5"
                    stroke="#E03131"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  {/* Bottom stripes to suggest stack */}
                  <line
                    x1="20"
                    y1="88"
                    x2="100"
                    y2="88"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                  <line
                    x1="26"
                    y1="94"
                    x2="94"
                    y2="94"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <defs>
                    <linearGradient
                      id="cashGradient"
                      x1="15"
                      y1="30"
                      x2="105"
                      y2="80"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" stopOpacity="0.15" />
                      <stop offset="1" stopColor="white" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Money Tips */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-700 mb-4">
              Smart Travel Money Tips
            </h2>
            <p className="text-lg text-primary-600">
              Expert advice to help you get the most from your travel money
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '💡',
                title: 'Exchange Before You Go',
                description: 'Airport exchange rates are typically 5-10% worse than our rates. Exchange before you travel to save money.'
              },
              {
                icon: '🎒',
                title: 'Mix Your Money',
                description: 'Carry a mix of cash and cards. Have some local currency for small purchases and emergencies.'
              },
              {
                icon: '🔐',
                title: 'Keep It Safe',
                description: 'Split your cash between different bags. Use hotel safes and money belts for larger amounts.'
              },
              {
                icon: '📱',
                title: 'Know the Rate',
                description: 'Check our live rates before you travel so you know what to expect and can spot a bad deal.'
              },
              {
                icon: '💳',
                title: 'Avoid Dynamic Conversion',
                description: 'When paying by card abroad, always choose to pay in local currency, not your home currency.'
              },
              {
                icon: '🏧',
                title: 'ATM Fees Add Up',
                description: 'Foreign ATM fees can be $5-10 per withdrawal. Get cash from us before you go to avoid these fees.'
              },
            ].map((tip, index) => (
              <div
                key={tip.title}
                className="bg-white rounded-xl p-6 border border-primary-200 shadow-sm"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-lg font-bold text-primary-700 mb-2">{tip.title}</h3>
                <p className="text-sm text-gray-700">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
