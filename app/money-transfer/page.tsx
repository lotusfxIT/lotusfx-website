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
import TransferCalculator from '@/components/TransferCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import Locations from '@/components/Locations'
import {
  IconFeatureCard,
  LeadParagraphs,
  SectionEyebrow,
  SectionHeading,
} from '@/components/marketing/MarketingBlocks'
import MotionWrapper from '@/components/MotionWrapper'

export const metadata: Metadata = {
  title: 'International Money Transfers | Lotus FX',
  description:
    'Send money overseas with confidence through eWire, Western Union, MoneyGram and wire transfers. Trusted international money transfer services worldwide.',
  keywords: [
    'money transfer',
    'international transfer',
    'eWire',
    'Western Union',
    'MoneyGram',
    'wire transfer',
    'Lotus FX',
  ],
  openGraph: {
    title: 'International Money Transfers | Lotus FX',
    description:
      'Send money overseas with confidence through eWire, Western Union, MoneyGram and wire transfers. Trusted international money transfer services worldwide.',
    images: ['/images/money-transfer-og.jpg'],
  },
}

const transferMethods = [
  {
    title: 'eWire transfers',
    description:
      'eWire allows customers to send and receive money across New Zealand, Australia and Fiji through Lotus FX\u2019s own transfer platform. Available online and in branch, eWire offers a simple and convenient option for regional transfers within the Pacific.',
    cta: { label: 'Send Money Now', href: '/contact' },
    icon: <BoltIcon className="w-6 h-6" />,
    badge: 'Lotus special',
  },
  {
    title: 'Western Union transfers',
    description:
      'Send money worldwide through Western Union, one of the most widely used international money transfer networks. Western Union services allow fast cash pickup and global reach across hundreds of countries and territories, making it a flexible option for urgent or international payments.',
    link: { label: 'Learn more', href: '/western-union' },
    icon: <GlobeAmericasIcon className="w-6 h-6" />,
    badge: 'Global network',
  },
  {
    title: 'MoneyGram transfers',
    description:
      'Send and receive money worldwide through Lotus FX\u2019s official partnership with MoneyGram, one of the world\u2019s leading international money transfer providers. MoneyGram services are available across more than 200 countries and territories, with options including cash pickup and direct bank deposits.',
    link: { label: 'Learn more', href: '/moneygram' },
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    badge: '200+ countries',
  },
  {
    title: 'International wire transfers',
    description:
      'Lotus FX offers international wire transfer services for individuals and businesses sending money directly to overseas bank accounts. Whether you\u2019re paying suppliers, transferring larger amounts, or making overseas business payments, wire transfers provide a secure and reliable option.',
    icon: <BuildingLibraryIcon className="w-6 h-6" />,
    badge: 'Bank to bank',
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
      <section className="relative pt-32 lg:pt-40 pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600" aria-hidden />
        <CurrencySymbolsBg />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="max-w-xl">
              <SectionEyebrow>Send money overseas with confidence</SectionEyebrow>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                International money transfers made simple
              </h1>
              <LeadParagraphs
                paragraphs={[
                  'Lotus FX offers reliable international money transfer services through trusted transfer networks including eWire, Western Union, MoneyGram and wire transfers.',
                  'From overseas payments and bank transfers to worldwide cash pickups, we make sending money simple, convenient and affordable. Our friendly team can help you move money internationally with less hassle, clear guidance, and support whenever you need it.',
                ]}
              />
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/contact" className="btn-primary text-lg px-8 py-4 text-center">
                  Send Money
                </Link>
                <Link href="/locations" className="btn-secondary text-lg px-8 py-4 text-center">
                  Find a Branch
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-strong p-6 sm:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Transfer calculator</h2>
              <p className="text-gray-600 text-sm text-center mb-4">
                See how much your recipient will receive
              </p>
              <TransferCalculator />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionEyebrow>Choose how you send</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Transfer methods for every need"
              subtitle="Regional eWire, global cash networks, and secure bank wires — all with local Lotus FX support."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {transferMethods.map((method, index) => (
              <MotionWrapper
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <article className="h-full flex flex-col rounded-2xl border border-primary-100 bg-white p-7 lg:p-8 shadow-soft hover:shadow-lg hover:border-primary-300 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center shadow-md shrink-0">
                      {method.icon}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                      {method.badge}
                    </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{method.title}</h2>
                  <p className="text-gray-600 leading-relaxed flex-1">{method.description}</p>
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    {method.cta && (
                      <Link href={method.cta.href} className="btn-primary inline-flex">
                        {method.cta.label}
                      </Link>
                    )}
                    {method.link && (
                      <Link
                        href={method.link.href}
                        className="inline-flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700"
                      >
                        {method.link.label}
                        <span aria-hidden>→</span>
                      </Link>
                    )}
                  </div>
                </article>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <SectionEyebrow>Peace of mind</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Why choose Lotus FX for international transfers?"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
