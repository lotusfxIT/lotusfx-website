'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MotionWrapper from '@/components/MotionWrapper'
import { fillStatsTemplate } from '@/config/stats'
import { useSiteStats } from '@/context/SiteStatsContext'
import {
  EyeIcon,
  HeartIcon,
  BoltIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

const milestones = [
  {
    year: '2002',
    event:
      'Lotus FX was established in New Zealand, opening its first branch in St Lukes, Auckland. In the same year, the business expanded into Fiji and became a Super Agent for MoneyGram.',
  },
  {
    year: '2004',
    event:
      'Opened the first Lotus FX branch in Australia, marking an important step in the company’s regional expansion.',
  },
  {
    year: '2014',
    event:
      'Launched the 4D system and mobile app, enhancing operational efficiency and customer convenience.',
  },
  {
    year: '2020',
    event:
      'Launched the Lotus FX website across New Zealand, Australia, and Fiji, strengthening the Group’s digital presence.',
  },
  {
    year: '2023',
    event:
      'Introduced onboard currency exchange services for cruise ship passengers in Auckland.',
  },
  {
    year: '2024',
    event:
      'Became a title sponsor of Auckland Rugby League, supporting community activities and championing the spirit of sport.',
  },
  {
    year: '2025',
    event:
      'Began working with Mastercard and Western Union, further strengthening payment and remittance capabilities.',
  },
  {
    year: '2026',
    event:
      'Surpassed 30,000 positive customer reviews across the Group, reflecting strong customer trust and service excellence.',
  },
]

const values = [
  {
    icon: EyeIcon,
    title: 'Transparency',
    description: 'No hidden fees, no surprises. What you see is what you pay.',
  },
  {
    icon: HeartIcon,
    title: 'Customer first',
    description: 'Your needs come first. We’re here to serve you, not the other way around.',
  },
  {
    icon: BoltIcon,
    title: 'Speed & efficiency',
    description: 'Fast processing, quick transfers, and minimal wait times.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Trust & integrity',
    description: 'We earn your trust through consistent, reliable, and honest service.',
  },
]

const reasons = [
  {
    title: 'Better rates than banks',
    description:
      'Our rates are typically 2–3% better than major banks. As specialists in foreign exchange, we offer value banks struggle to match.',
    icon: BanknotesIcon,
  },
  {
    title: 'No commission fees',
    description:
      'We don’t charge commission on currency exchange. Complete transparency with no hidden charges.',
    icon: CheckBadgeIcon,
  },
  {
    title: 'Expert FX team',
    description:
      'Our staff are trained foreign exchange specialists who understand the markets and can give practical advice.',
    icon: UserGroupIcon,
  },
  {
    title: 'Multiple channels',
    description:
      'Exchange in-branch, online, or via our mobile app — with consistent rates across every channel.',
    icon: DevicePhoneMobileIcon,
  },
  {
    title: 'Fast processing',
    description:
      'Most transfers complete within 24 hours. eWire between Australia, New Zealand and Fiji is instant with zero fees.',
    icon: BoltIcon,
  },
  {
    title: 'Licensed & regulated',
    description:
      'Licensed and regulated in all three countries, with bank-grade protection for your money and data.',
    icon: ShieldCheckIcon,
  },
]

export default function AboutPage() {
  const { stats: siteStats } = useSiteStats()

  const regions = [
    {
      code: 'au',
      country: 'Australia',
      branches: `${siteStats.branches.australia} branches`,
      customers: `${siteStats.customers.australia} customers`,
      email: siteStats.emails.australia,
      highlights: ['Major city coverage', 'Extended trading hours', 'eWire to NZ & Fiji'],
    },
    {
      code: 'nz',
      country: 'New Zealand',
      branches: `${siteStats.branches.newZealand} branches`,
      customers: `${siteStats.customers.newZealand} customers`,
      email: siteStats.emails.newZealand,
      highlights: ['Nationwide network', 'Expert FX advisors', 'Same-day transfers'],
    },
    {
      code: 'fj',
      country: 'Fiji',
      branches: `${siteStats.branches.fiji} branches`,
      customers: `${siteStats.customers.fiji} customers`,
      email: siteStats.emails.fiji,
      highlights: ['Island-wide service', 'Pacific specialist', 'Local currency expertise'],
    },
  ]

  return (
    <>
      {/* Brand hero — copy + video side by side */}
      <section className="relative overflow-x-clip bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 text-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <span className="absolute top-[18%] right-[8%] text-7xl font-bold text-white/10">$</span>
          <span className="absolute bottom-[28%] left-[6%] text-6xl font-bold text-white/10">€</span>
          <span className="absolute top-[62%] right-[42%] text-5xl font-bold text-white/10">¥</span>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center min-w-0">
            <div className="min-w-0">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-museo uppercase text-white leading-none mb-5 sm:mb-6"
                aria-label="Lotus Foreign Exchange"
              >
                <span className="inline-flex flex-wrap items-baseline gap-x-[0.38em]">
                  <span className="font-bold text-[2rem] sm:text-[2.5rem] lg:text-[2.85rem] tracking-[0.02em]">
                    Lotus
                  </span>
                  <span className="font-medium text-[1.15rem] sm:text-[1.45rem] lg:text-[1.7rem] tracking-[0.14em] text-white/90">
                    Foreign Exchange
                  </span>
                </span>
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-4"
              >
                Since 2002 · Australia · New Zealand · Fiji
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.12 }}
                className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.35] pb-[0.15em] tracking-tight mb-5"
              >
                Your trusted partner for currency exchange across the Pacific
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="text-base sm:text-lg text-white/85 !leading-[1.75] mb-8 max-w-xl"
              >
                Helping travellers, families and businesses exchange currency and send money overseas
                with competitive rates, clear pricing, and friendly local service.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.24 }}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                <Link
                  href="/locations"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-base font-semibold text-primary-700 shadow-lg hover:bg-gray-50 transition"
                >
                  Find a branch
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-5 py-3 text-base font-semibold text-white hover:bg-white/10 transition"
                >
                  Contact us
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="min-w-0 w-full"
            >
              <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black/40 ring-1 ring-white/20 shadow-2xl pt-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/7z2zFF3z_9s?rel=0&modestbranding=1"
                  title="Welcome to Lotus Foreign Exchange"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <p className="mt-3 text-sm text-white/70">
                A quick look at who we are and how we help customers across the Pacific.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-t border-white/20 pt-8 sm:pt-10 min-w-0"
          >
            {[
              { value: siteStats.yearsOfExcellence, label: 'Years of excellence' },
              { value: siteStats.branches.total, label: 'Branches across the Pacific' },
              { value: siteStats.customers.total, label: 'Customers served' },
              { value: siteStats.totalTransferred, label: 'Safely transferred' },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight !leading-none break-words">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/75 leading-snug">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our story — full-width editorial */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="mb-10 lg:mb-12">
            <MotionWrapper
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: true }}
              className="max-w-4xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
                Our story
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] text-balance">
                Built for better exchange — not bank fees
              </h2>
              <p className="mt-5 text-lg sm:text-xl text-gray-600 !leading-[1.75] max-w-3xl">
                Founded in 2002 with one mission: fairer rates, clearer pricing, and genuine help —
                the opposite of bank foreign exchange.
              </p>
            </MotionWrapper>
          </div>

          <MotionWrapper
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 lg:gap-14 border-t border-gray-200 pt-10"
          >
            <p className="text-gray-700 text-base sm:text-lg !leading-[1.75] min-w-0">
              {fillStatsTemplate(siteStats.copy.aboutGrowth, siteStats)}
            </p>
            <p className="text-gray-700 text-base sm:text-lg !leading-[1.75] min-w-0">
              Today we serve over {siteStats.customers.total} customers and have facilitated over{' '}
              {siteStats.totalTransferred} in currency exchanges and international transfers — across
              Australia, New Zealand and Fiji.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 lg:py-24 bg-primary-50/40">
        <div className="container-custom">
          <div className="max-w-2xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              Milestones
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em]">
              Growing with the Pacific since 2002
            </h2>
          </div>

          <div className="relative max-w-4xl">
            <div
              className="absolute left-[2.15rem] sm:left-[2.4rem] top-3 bottom-3 w-px bg-primary-200"
              aria-hidden
            />
            <ol className="space-y-8 sm:space-y-10">
              {milestones.map((milestone, index) => (
                <MotionWrapper
                  key={milestone.year}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.28) }}
                  viewport={{ once: true }}
                  className="relative grid grid-cols-[4.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-4 sm:gap-6"
                >
                  <div className="relative z-10">
                    <span className="inline-flex h-10 w-[4.3rem] sm:w-[4.8rem] items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white shadow-md">
                      {milestone.year}
                    </span>
                  </div>
                  <p className="pt-1.5 text-gray-700 !leading-[1.75] text-base sm:text-lg">
                    {milestone.event}
                  </p>
                </MotionWrapper>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              What we stand for
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Our core values
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              These principles guide every rate, every transfer, and every conversation in branch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <MotionWrapper
                  key={value.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  viewport={{ once: true }}
                >
                  <div className="w-11 h-11 rounded-full bg-primary-600 text-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 !leading-[1.75]">{value.description}</p>
                </MotionWrapper>
              )
            })}
          </div>
        </div>
      </section>

      {/* Presence */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              Across the Pacific
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Local branches. Regional reach.
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              {fillStatsTemplate(siteStats.copy.aboutPacificIntro, siteStats)}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {regions.map((region, index) => (
              <MotionWrapper
                key={region.country}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="border-t-2 border-primary-600 pt-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={`https://flagcdn.com/w80/${region.code}.png`}
                    alt=""
                    className="h-7 w-10 object-cover rounded-sm shadow-sm"
                  />
                  <h3 className="text-2xl font-bold text-gray-900">{region.country}</h3>
                </div>
                <p className="text-primary-700 font-semibold mb-1">{region.branches}</p>
                <p className="text-sm text-gray-600 mb-1">{region.customers}</p>
                <a
                  href={`mailto:${region.email}`}
                  className="text-sm text-gray-500 hover:text-primary-700 break-all transition"
                >
                  {region.email}
                </a>
                <ul className="mt-5 space-y-2">
                  {region.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <MapPinIcon className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </MotionWrapper>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 font-semibold text-primary-700 hover:text-primary-800 transition"
            >
              Browse all locations
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              The Lotus difference
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Why customers choose us
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              We’re not just another exchange counter — we’re a local partner for travel money and
              overseas transfers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {reasons.map((reason, index) => {
              const Icon = reason.icon
              return (
                <MotionWrapper
                  key={reason.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-11 h-11 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 !leading-[1.4] pb-0.5">{reason.title}</h3>
                    <p className="text-gray-600 !leading-[1.75] pb-0.5">{reason.description}</p>
                  </div>
                </MotionWrapper>
              )
            })}
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="relative overflow-x-clip bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 py-16 sm:py-20 text-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Ready when you are
            </h2>
            <p className="text-lg text-white/85 !leading-[1.75] mb-8 max-w-3xl">
              Visit a branch near you, or get in touch — our teams across Australia, New Zealand and
              Fiji are here to help with travel money and overseas transfers.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-primary-700 hover:bg-gray-50 transition"
              >
                Find a local branch
              </Link>
              <Link
                href="/currency-exchange"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-5 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                Explore currency exchange
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
