import { Metadata } from 'next'
import Link from 'next/link'
import {
  BoltIcon,
  BuildingLibraryIcon,
  GlobeAmericasIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import TransferCalculatorSection from '@/components/TransferCalculatorSection'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import Locations from '@/components/Locations'
import {
  IconFeatureCard,
  SectionEyebrow,
  SectionHeading,
} from '@/components/marketing/MarketingBlocks'
import MotionWrapper from '@/components/MotionWrapper'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'International Money Transfers',
  description:
    'Send money overseas with confidence through eWire, Western Union, MoneyGram and wire transfers. Trusted international money transfer services worldwide.',
  path: '/money-transfer',
  ogImage: '/images/money-transfer-og.jpg',
  keywords: ['money transfer', 'international transfer', 'eWire', 'Western Union', 'MoneyGram', 'wire transfer'],
})

const transferMethods = [
  {
    title: 'Lotus special eWire transfers',
    description:
      'Send and receive money across New Zealand, Australia and Fiji through Lotus FX\u2019s own transfer platform — via website or app. Cash pickup, bank transfer, and Fiji mobile wallet.',
    href: '/ewire',
    icon: <BoltIcon className="w-6 h-6" />,
    badge: 'Lotus special',
  },
  {
    title: 'Lotus international wire transfers',
    description:
      'Secure bank-to-bank transfers for individuals and businesses — via website or app after account onboarding, powered by our international bank partnerships for competitive send rates.',
    href: '/international-wire',
    icon: <BuildingLibraryIcon className="w-6 h-6" />,
    badge: 'Bank to bank',
  },
  {
    title: 'MoneyGram transfers',
    description:
      'Send and receive money worldwide through MoneyGram across more than 200 countries and territories, with cash pickup and direct bank deposit options.',
    href: '/moneygram',
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    badge: '200+ countries',
  },
  {
    title: 'Western Union transfers',
    description:
      'Send money worldwide through Western Union for fast cash pickup across hundreds of countries and territories — a flexible option for urgent or international payments.',
    href: '/western-union',
    icon: <GlobeAmericasIcon className="w-6 h-6" />,
    badge: 'Global network',
  },
]

const whyChoose = [
  {
    title: 'Clear guidance and local support',
    description:
      'Our team can explain different transfer methods in simple terms, help with forms and details, and guide you toward the right option for your situation.',
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
  },
  {
    title: 'Trusted transfer networks',
    description:
      'Through trusted providers including MoneyGram, banks and eWire, Lotus FX helps you send money with confidence and peace of mind.',
    icon: <ShieldCheckIcon className="w-6 h-6" />,
  },
  {
    title: 'Transparent pricing and straightforward service',
    description:
      'Clear fees, reliable transfer options, and convenient branch locations help make international money transfers simple and stress free.',
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
  },
]

export default function MoneyTransferPage() {
  return (
    <>
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-start lg:items-center">
            <div className="w-full flex flex-col justify-center lg:pr-4 xl:pr-8 py-2 lg:py-6">
              <SectionEyebrow>Send money overseas with confidence</SectionEyebrow>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-bold text-gray-900 mt-3 mb-8 sm:mb-10 !leading-[1.2] tracking-tight">
                International money transfers made simple
              </h1>
              <div className="space-y-8 max-w-xl">
                <p className="text-lg sm:text-xl text-gray-700 leading-[1.8]">
                  Lotus FX offers reliable international money transfer services through trusted
                  networks including eWire, Western Union, MoneyGram and wire transfers.
                </p>
                <p className="text-base sm:text-lg text-gray-600 leading-[1.85]">
                  From overseas payments and bank transfers to worldwide cash pickups, we make
                  sending money simple and convenient — with clear guidance and support whenever
                  you need it.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 sm:mt-12">
                <Link href="/contact" className="btn-primary text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 text-center">
                  Send Money
                </Link>
                <Link href="/locations" className="btn-secondary text-base sm:text-lg px-7 sm:px-8 py-3.5 sm:py-4 text-center">
                  Find a Branch
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-strong p-6 sm:p-8 border border-gray-100">
              <TransferCalculatorSection />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow>Choose how you send</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Transfer methods for every need"
              subtitle="Regional eWire, global cash networks, and secure bank wires — with local Lotus FX support."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 lg:gap-10">
            {transferMethods.map((method, index) => (
              <MotionWrapper
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <article className="mobile-safe-card h-full flex flex-col rounded-2xl border border-primary-100 bg-white p-8 lg:p-10 shadow-soft hover:shadow-lg hover:border-primary-300 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center shadow-md shrink-0">
                      {method.icon}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                      {method.badge}
                    </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-snug">
                    {method.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-base lg:text-lg flex-1">
                    {method.description}
                  </p>
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <Link
                      href={method.href}
                      className="inline-flex items-center gap-1.5 font-semibold text-primary-600 hover:text-primary-700 transition"
                    >
                      Learn more
                    </Link>
                  </div>
                </article>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow>Peace of mind</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Why choose Lotus FX for international transfers?"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {whyChoose.map((item, i) => (
              <IconFeatureCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                delay={i * 0.08}
              />
            ))}
          </div>
        </div>
      </section>

      <Locations />
    </>
  )
}
