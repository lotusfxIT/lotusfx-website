import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CreditCardIcon, GlobeAltIcon, ShieldCheckIcon, DevicePhoneMobileIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Cash Passport Travel Card | LotusFX',
  description:
    'Get your Cash Passport multi-currency travel card from LotusFX. Sign up online or visit us in-store. Mastercard security with 10+ currencies.',
  keywords: [
    'Cash Passport',
    'travel card',
    'multi-currency card',
    'prepaid travel money',
    'Mastercard',
    'LotusFX',
  ],
}

const benefits = [
  {
    icon: GlobeAltIcon,
    title: '10+ Currencies',
    description: 'Load and lock in exchange rates for major currencies including USD, EUR, GBP, JPY, and more.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Mastercard Security',
    description: 'Chip & PIN protection, contactless payments, and 24/7 fraud monitoring keep your money safe.',
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile App Control',
    description: 'Freeze/unfreeze your card, check balances, reload funds, and view transactions from anywhere.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Lock Exchange Rates',
    description: 'Lock in favorable exchange rates before you travel and avoid currency fluctuations.',
  },
]

const currencies = [
  'AUD', 'USD', 'EUR', 'GBP', 'NZD', 'JPY', 'SGD', 'HKD', 'CAD', 'THB', 'CHF', 'AED'
]

const options = [
  {
    icon: CreditCardIcon,
    title: 'Sign Up Online',
    description: 'Get your Cash Passport card quickly by signing up through our secure Mastercard partner link. Complete the application online and receive your card by mail.',
    features: [
      'Quick online application',
      'Secure Mastercard signup',
      'Card delivered to your address',
      'Activate and load via app',
    ],
    cta: 'Sign Up Now',
    link: '#', // Replace with actual Mastercard signup link
    color: 'from-orange-500 to-red-600',
    highlight: true,
  },
  {
    icon: MapPinIcon,
    title: 'Visit Our Branch',
    description: 'Get your Cash Passport card instantly at any LotusFX branch. Our staff will help you set up your card and load your first currencies.',
    features: [
      'Instant card issuance',
      'Expert staff assistance',
      'Load currencies on the spot',
      'Immediate activation',
    ],
    cta: 'Find Branch',
    link: '/locations',
    color: 'from-gray-700 to-gray-800',
    highlight: false,
  },
]

const process = [
  {
    title: 'Get Your Card',
    description: 'Sign up online through our Mastercard link or visit a LotusFX branch to get your Cash Passport card instantly.',
  },
  {
    title: 'Load Currencies',
    description: 'Load up to 10 different currencies at locked-in exchange rates. Add funds via bank transfer, BPAY, or in-store.',
  },
  {
    title: 'Spend Worldwide',
    description: 'Use your card anywhere Mastercard is accepted - shops, restaurants, ATMs. Switch between currencies in the app.',
  },
  {
    title: 'Reload Anytime',
    description: 'Top up your card anytime, anywhere. Reload online, via the app, or visit any LotusFX branch.',
  },
]

export default function CashPassportPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-red-700 to-orange-500 text-white py-20 lg:py-24">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-20 w-80 h-80 bg-orange-400 rounded-full mix-blend-screen blur-3xl" />
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
                <span className="text-sm font-semibold">Cash Passport</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                Cash Passport Travel Card
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-orange-100 mb-8 max-w-2xl">
                The smart way to travel. Lock in exchange rates, spend in 10+ currencies and stay
                in control with the Cash Passport app and LotusFX support.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="#"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-red-700 font-semibold shadow-lg hover:bg-gray-50 transition-colors"
                >
                  Sign Up Online →
                </Link>
                <Link
                  href="/locations"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/60 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Get Card In‑Store
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-white/15 border border-white/30" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/10 border border-white/20" />
                <Image
                  src="/images/partners/cash-passport-card.png"
                  alt="Cash Passport Card"
                  width={420}
                  height={260}
                  className="relative rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.55)] border border-white/20"
                />
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
              Get Your Cash Passport Card
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose how you want to get your card - sign up online through our secure Mastercard link or visit us in-store.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {options.map((option) => (
              <div
                key={option.title}
                className={`bg-gradient-to-br ${option.color} text-white rounded-2xl p-8 shadow-xl relative ${
                  option.highlight ? 'ring-4 ring-orange-200' : ''
                }`}
              >
                {option.highlight && (
                  <div className="absolute -top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </div>
                )}
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
                  href={option.link}
                  className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {option.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Cash Passport?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Travel smarter with a multi-currency card that gives you control and security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <benefit.icon className="w-12 h-12 text-orange-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Currencies */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-custom px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Supported Currencies
              </h2>
              <p className="text-lg text-gray-600">
                Load and lock in exchange rates for these major currencies.
              </p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {currencies.map((currency) => (
                <div
                  key={currency}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl px-4 py-6 text-center border border-orange-200"
                >
                  <div className="text-2xl font-bold text-gray-900">{currency}</div>
                </div>
              ))}
            </div>
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
              Getting started with Cash Passport is simple and straightforward.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <div
                key={step.title}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft"
              >
                <div className="text-4xl font-bold text-orange-600 mb-4">0{index + 1}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
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
                q: 'How do I get a Cash Passport card?',
                a: 'You can sign up online through our secure Mastercard partner link for quick delivery, or visit any LotusFX branch to get your card instantly. Both options are available.',
              },
              {
                q: 'What currencies can I load?',
                a: 'You can load up to 10 different currencies including USD, EUR, GBP, JPY, AUD, NZD, and more. Lock in exchange rates before you travel.',
              },
              {
                q: 'How do I reload my card?',
                a: 'Reload your card anytime via the mobile app, online banking, BPAY, or visit any LotusFX branch. Funds are available immediately.',
              },
              {
                q: 'Is it safe to use?',
                a: 'Yes, Cash Passport uses Mastercard security with chip & PIN protection, contactless payments, and 24/7 fraud monitoring. You can freeze your card instantly via the app if needed.',
              },
              {
                q: 'Where can I use it?',
                a: 'Use your Cash Passport card anywhere Mastercard is accepted worldwide - shops, restaurants, hotels, and ATMs. It works just like a regular debit card.',
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
