import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { DevicePhoneMobileIcon, MapPinIcon, ClockIcon, ShieldCheckIcon, GlobeAltIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'MoneyGram Money Transfers | LotusFX',
  description:
    'Send money worldwide with MoneyGram through LotusFX. Use our app or visit us in-store for fast, secure international money transfers.',
  keywords: [
    'MoneyGram',
    'money transfer',
    'international remittance',
    'mobile app',
    'LotusFX',
  ],
}

const features = [
  {
    icon: GlobeAltIcon,
    title: '400,000+ Locations',
    description: 'Access MoneyGram\'s vast network of agent locations across 200+ countries and territories.',
  },
  {
    icon: ClockIcon,
    title: 'Fast & Convenient',
    description: 'Send money in minutes. Recipients can collect cash, receive bank deposits, or mobile wallet transfers.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Transactions',
    description: 'Your money is protected with MoneyGram\'s advanced security measures and fraud prevention.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Competitive Rates',
    description: 'Get transparent exchange rates and fees with no hidden charges.',
  },
]

const options = [
  {
    icon: DevicePhoneMobileIcon,
    title: 'Use Our App',
    description: 'Send money on-the-go with the LotusFX mobile app. Complete transfers from anywhere, anytime.',
    features: [
      '24/7 money transfer access',
      'Track transfers in real-time',
      'Save recipient details',
      'View transaction history',
    ],
    cta: 'Download App',
    color: 'from-red-600 to-red-700',
  },
  {
    icon: MapPinIcon,
    title: 'Visit Our Branch',
    description: 'Get personalized assistance at any LotusFX branch. Our staff will help you complete your transfer.',
    features: [
      'Expert staff support',
      'Multilingual assistance',
      'Cash or bank transfer payment',
      'Instant transaction processing',
    ],
    cta: 'Find Branch',
    color: 'from-gray-700 to-gray-800',
  },
]

const steps = [
  {
    number: '01',
    title: 'Choose Your Method',
    description: 'Use our mobile app for convenience or visit any LotusFX branch for in-person assistance.',
  },
  {
    number: '02',
    title: 'Enter Details',
    description: 'Provide recipient information, destination country, and transfer amount. We\'ll show you the exchange rate and fees upfront.',
  },
  {
    number: '03',
    title: 'Complete Payment',
    description: 'Pay securely through the app or in-store with cash or bank transfer. Receive a tracking number for your transfer.',
  },
  {
    number: '04',
    title: 'Recipient Receives',
    description: 'Your recipient can collect cash, receive a bank deposit, or get funds in their mobile wallet.',
  },
]

export default function MoneyGramPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-red-700 to-red-600 text-white py-20 lg:py-24">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-red-500 rounded-full mix-blend-screen blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen blur-3xl" />
        </div>
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-10 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-50">
                  LotusFX Partner
                </span>
                <span className="h-5 w-px bg-white/30" />
                <span className="text-sm font-semibold">MoneyGram</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                Send Money Worldwide with MoneyGram
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-red-100 mb-8 max-w-2xl">
                Choose how you want to send money – use our convenient mobile app or visit us
                in‑store. Fast, secure and trusted worldwide, with LotusFX support at every step.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-red-700 font-semibold shadow-lg hover:bg-gray-50 transition-colors"
                >
                  Download App →
                </Link>
                <Link
                  href="/locations"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/60 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Find Nearest Branch
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-32 h-10 bg-white rounded-md px-3 py-1 flex items-center">
                    <Image
                      src="/images/partners/moneygram.png"
                      alt="MoneyGram"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 text-white">
                    App & in‑store
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-red-100">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">📱</span>
                    <span>Send money 24/7 from the LotusFX app.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">🏦</span>
                    <span>Cash pickup, bank deposits or mobile wallets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">🛡️</span>
                    <span>MoneyGram security plus LotusFX compliance and support.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Options Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Preferred Method
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Send money with MoneyGram through our app or visit us in-store - the choice is yours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {options.map((option) => (
              <div
                key={option.title}
                className={`bg-gradient-to-br ${option.color} text-white rounded-2xl p-8 shadow-xl`}
              >
                <option.icon className="w-16 h-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">{option.title}</h3>
                <p className="text-white/90 mb-6">{option.description}</p>
                <ul className="space-y-3 mb-8">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-white mr-2">✓</span>
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={option.cta === 'Download App' ? '#' : '/locations'}
                  className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {option.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MoneyGram?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by millions, MoneyGram offers reliable and convenient money transfer solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-red-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sending money with MoneyGram is simple, whether you use our app or visit us in-store.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-soft"
              >
                <div className="text-4xl font-bold text-red-600 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Can I use the app or do I need to visit a branch?',
                a: 'You can use either method! Send money conveniently through our mobile app 24/7, or visit any LotusFX branch for in-person assistance. Both methods are secure and reliable.',
              },
              {
                q: 'How long does it take?',
                a: 'Most MoneyGram transfers are available within minutes. Recipients can collect cash, receive bank deposits, or get funds in their mobile wallet depending on the destination.',
              },
              {
                q: 'What are the fees?',
                a: 'Fees vary based on the amount and destination. Both our app and in-store service show you all fees and exchange rates upfront before you complete the transaction.',
              },
              {
                q: 'Is it safe?',
                a: 'Yes, MoneyGram uses advanced security measures to protect your transactions. All transfers are encrypted and monitored for fraud prevention.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-gray-200 border-l-4 border-l-primary-400 bg-white shadow-soft"
              >
                <div className="px-6 py-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* (CTA section removed as requested) */}
    </>
  )
}
