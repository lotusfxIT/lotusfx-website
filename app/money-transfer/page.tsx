import { Metadata } from 'next'
import Link from 'next/link'
import MotionWrapper from '@/components/MotionWrapper'
import TransferCalculator from '@/components/TransferCalculator'
import CurrencySymbolsBg from '@/components/CurrencySymbolsBg'
import Locations from '@/components/Locations'

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
  },
  {
    title: 'Western Union transfers',
    description:
      'Send money worldwide through Western Union, one of the most widely used international money transfer networks. Western Union services allow fast cash pickup and global reach across hundreds of countries and territories, making it a flexible option for urgent or international payments.',
    link: '/western-union',
  },
  {
    title: 'MoneyGram transfers',
    description:
      'Send and receive money worldwide through Lotus FX\u2019s official partnership with MoneyGram, one of the world\u2019s leading international money transfer providers. MoneyGram services are available across more than 200 countries and territories, with options including cash pickup and direct bank deposits.',
    link: '/moneygram',
  },
  {
    title: 'International wire transfers',
    description:
      'Lotus FX offers international wire transfer services for individuals and businesses sending money directly to overseas bank accounts. Whether you\u2019re paying suppliers, transferring larger amounts, or making overseas business payments, wire transfers provide a secure and reliable option.',
  },
]

const whyChoose = [
  {
    title: 'Clear guidance and local support',
    description:
      'Our team can explain different transfer methods in simple terms, help with forms and details, and guide you toward the right option for your situation.',
  },
  {
    title: 'Trusted transfer networks',
    description:
      'Through trusted providers including MoneyGram, banks and eWire, Lotus FX helps you send money with confidence and peace of mind.',
  },
  {
    title: 'Transparent pricing and straightforward service',
    description:
      'Clear fees, reliable transfer options, and convenient branch locations help make international money transfers simple and stress free.',
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
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
                Send money overseas with confidence
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                International money transfers made simple
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Lotus FX offers reliable international money transfer services through trusted
                transfer networks including eWire, Western Union, MoneyGram and wire transfers.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                From overseas payments and bank transfers to worldwide cash pickups, we make sending
                money simple, convenient and affordable. Our friendly team can help you move money
                internationally with less hassle, clear guidance, and support whenever you need it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
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

      <section className="py-16 bg-white">
        <div className="container-custom space-y-12">
          {transferMethods.map((method, index) => (
            <MotionWrapper
              key={method.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{method.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{method.description}</p>
              {method.cta && (
                <Link href={method.cta.href} className="btn-primary inline-block">
                  {method.cta.label}
                </Link>
              )}
              {method.link && (
                <Link href={method.link} className="text-primary-600 font-semibold hover:text-primary-700">
                  Learn more →
                </Link>
              )}
            </MotionWrapper>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-10 text-center">
            Why choose Lotus FX for international transfers?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {whyChoose.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Locations />
    </>
  )
}
