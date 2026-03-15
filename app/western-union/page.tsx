import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MapPinIcon, ClockIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Western Union Money Transfers | LotusFX',
  description:
    'Send money worldwide with Western Union at LotusFX branches. Visit us in-store for fast, secure international money transfers across 200+ countries.',
  keywords: [
    'Western Union',
    'money transfer',
    'international remittance',
    'cash transfer',
    'LotusFX',
  ],
}

const features = [
  {
    icon: GlobeAltIcon,
    title: '200+ Countries',
    description: 'Send money to over 200 countries and territories worldwide with Western Union\'s global network.',
  },
  {
    icon: ClockIcon,
    title: 'Fast Transfers',
    description: 'Most transfers are available for pickup within minutes at Western Union locations worldwide.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Trusted',
    description: 'Your money is protected with Western Union\'s industry-leading security and fraud prevention.',
  },
  {
    icon: MapPinIcon,
    title: 'Convenient Pickup',
    description: 'Recipients can collect cash at over 500,000 Western Union agent locations globally.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Visit Our Branch',
    description: 'Come to any LotusFX branch with a valid government-issued ID. Our friendly staff will assist you with the transfer process.',
  },
  {
    number: '02',
    title: 'Provide Details',
    description: 'Tell us the recipient\'s name, location, and amount. We\'ll calculate the exchange rate and fees upfront.',
  },
  {
    number: '03',
    title: 'Complete Payment',
    description: 'Pay in cash or via bank transfer. You\'ll receive a Money Transfer Control Number (MTCN) for tracking.',
  },
  {
    number: '04',
    title: 'Recipient Collects',
    description: 'Your recipient can collect the money at any Western Union location using the MTCN and their ID.',
  },
]

export default function WesternUnionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white py-20 lg:py-24">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-16 w-80 h-80 bg-yellow-400 rounded-full mix-blend-screen blur-3xl" />
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
                <span className="text-sm font-semibold">Western Union</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                Send Money Worldwide with Western Union
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-primary-100 mb-8 max-w-2xl">
                Visit any LotusFX branch to send money to over 200 countries. Fast, secure and
                trusted by millions worldwide, with personal support from our in‑branch FX experts.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Link
                  href="/locations"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-primary-700 font-semibold shadow-lg hover:bg-gray-50 transition-colors"
                >
                  Find Nearest Branch →
                </Link>
                <Link
                  href="/money-transfer"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/60 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  View Money Transfer Options
                </Link>
              </div>

              <div className="inline-flex items-center gap-2 text-sm text-primary-100">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-xs">
                  📍
                </span>
                <span>Western Union transfers are available in‑store at LotusFX branches only.</span>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-32 h-10">
                    <Image
                      src="/images/partners/western-union.png"
                      alt="Western Union"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400 text-gray-900">
                    In‑store only
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-primary-100">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">🌍</span>
                    <span>Send cash to 200+ countries and territories.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">⚡</span>
                    <span>Most transfers ready for pickup within minutes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-base">🛡️</span>
                    <span>Protected by Western Union security and LotusFX compliance.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Western Union?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Trusted by millions, Western Union offers the most reliable way to send money across borders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-yellow-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sending money with Western Union at LotusFX is simple and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft"
              >
                <div className="text-4xl font-bold text-yellow-600 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-Store CTA */}
      <section className="py-16 lg:py-24 bg-yellow-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Visit Us In-Store Today
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Our experienced staff at LotusFX branches are ready to help you send money worldwide with Western Union. 
              We offer competitive rates, transparent fees, and multilingual support.
            </p>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">What to Bring</h3>
              <ul className="text-left max-w-md mx-auto space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span>Valid government-issued photo ID (driver's license, passport, or national ID)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span>Recipient's full name and location</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">✓</span>
                  <span>Cash or bank transfer details for payment</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href="/locations"
                className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors shadow-lg"
              >
                Find Nearest Branch →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Do I need to visit a branch?',
                a: 'Yes, Western Union transfers through LotusFX are only available in-store. Visit any of our branches for personalized assistance and secure money transfers.',
              },
              {
                q: 'What identification do I need?',
                a: 'You\'ll need a valid government-issued photo ID such as a driver\'s license, passport, or national ID card. Our staff will verify your identity before processing the transfer.',
              },
              {
                q: 'How long does it take?',
                a: 'Most Western Union transfers are available for pickup within minutes at the destination location. Some transfers may take up to 24 hours depending on the destination country.',
              },
              {
                q: 'What are the fees?',
                a: 'Fees vary based on the amount sent and destination country. Our staff will provide you with a complete breakdown of all fees and exchange rates before you complete the transaction.',
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
