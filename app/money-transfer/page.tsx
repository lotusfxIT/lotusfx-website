import { Metadata } from 'next'
import MotionWrapper from '@/components/MotionWrapper'
import TransferCalculator from '@/components/TransferCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import TransferServices from '@/components/TransferServices'
import {
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { STATS } from '@/config/stats'

export const metadata: Metadata = {
  title: 'Money Transfers in Australia, New Zealand & Fiji | LotusFX',
  description:
    'Send money internationally with LotusFX from Australia, New Zealand and Fiji. Competitive rates, clear fees and fast processing to over 200 countries.',
  keywords: [
    'money transfer',
    'international transfer',
    'send money overseas',
    'wire transfer',
    'remittance',
    'international payments',
    'money transfer Australia',
    'money transfer New Zealand',
    'money transfer Fiji',
    'LotusFX',
  ],
  openGraph: {
    title: 'Money Transfers in Australia, New Zealand & Fiji | LotusFX',
    description:
      'Send money internationally with LotusFX from Australia, New Zealand and Fiji. Competitive rates, clear fees and fast processing to over 200 countries.',
    images: ['/images/money-transfer-og.jpg'],
  },
}

const features = [
  {
    icon: ClockIcon,
    title: 'Fast Transfers',
    description: 'Same-day transfers to major countries, 1-2 business days for most destinations.',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Bank-Grade Security',
    description: 'Your money is protected with enterprise-level security and regulatory compliance.',
    color: 'text-success-600',
    bgColor: 'bg-success-50',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Competitive Rates',
    description: 'Get competitive exchange rates with transparent pricing and no hidden fees.',
    color: 'text-accent-600',
    bgColor: 'bg-accent-50',
  },
  {
    icon: GlobeAltIcon,
    title: '200+ Countries',
    description: 'Send money to over 200 countries and territories worldwide.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
]

const transferSteps = [
  {
    step: 1,
    title: 'Create Account',
    description: 'Sign up online or visit any of our branches to create your account.',
  },
  {
    step: 2,
    title: 'Enter Details',
    description: 'Provide recipient details and transfer amount. We support 200+ countries.',
  },
  {
    step: 3,
    title: 'Make Payment',
    description: 'Pay securely online or at any of our branches. Multiple payment options available.',
  },
  {
    step: 4,
    title: 'Track Transfer',
    description: 'Monitor your transfer in real-time with our tracking system.',
  },
]

export default function MoneyTransferPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="text-center mb-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
              Money Transfer
            </p>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl mx-auto">
              Fast & Secure Money Transfers
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Send money internationally with confidence. Fast, secure, and affordable
              transfers to 200+ countries with competitive rates and no hidden fees.
            </p>
          </div>

        </div>
      </section>

      {/* Why Choose LotusFX Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose LotusFX for Money Transfers?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Whether you are transacting for individual or commercial purposes,
                Lotus FX offers a simple, secure and affordable way of sending and
                receiving money worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary text-lg px-8 py-4">
                  Start Transfer
                </button>
                <button className="btn-secondary text-lg px-8 py-4">
                  Calculate Fees
                </button>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-strong p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Transfer Calculator
                </h3>
                <p className="text-gray-600">
                  See how much your recipient will receive
                </p>
              </div>
              <TransferCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Our Services - after Why Choose + calculator */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Services</h2>
          <TransferServices />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Key Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Experience the difference with our fast, secure, and affordable
              international money transfer services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <MotionWrapper
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Send money internationally in just 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transferSteps.map((step, index) => (
              <MotionWrapper
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Your Money is Safe with Us
            </h2>
            <p className="text-lg text-gray-600">
              We use bank-grade security and comply with all regulatory requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🔒',
                title: 'Encrypted Transfers',
                description: '256-bit SSL encryption protects all your transactions and personal data'
              },
              {
                icon: '✅',
                title: 'Fully Licensed',
                description: 'Regulated by financial authorities in AU, NZ, and Fiji'
              },
              {
                icon: '🛡️',
                title: 'Fraud Protection',
                description: 'Advanced fraud detection systems monitor every transaction 24/7'
              },
              {
                icon: '📱',
                title: 'Real-Time Tracking',
                description: 'Track your transfer every step of the way with SMS and email updates'
              },
            ].map((item, index) => (
              <MotionWrapper
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </MotionWrapper>
            ))}
          </div>

        </div>
      </section>

      {/* (No large CTA banner; page ends with Security & Trust section) */}
    </>
  )
}
