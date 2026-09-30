'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MotionWrapper from '@/components/MotionWrapper'
import { useCountry } from '@/context/CountryContext'
import {
  BoltIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  ClockIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { getCountryPortalLinks } from '@/lib/country-portals'

const corridors = [
  {
    code: 'au',
    country: 'Australia',
    detail: 'Send to New Zealand and Fiji online, in the app, or at a Lotus FX branch.',
  },
  {
    code: 'nz',
    country: 'New Zealand',
    detail: 'Send to Australia and Fiji — fast regional transfers via website, app or in branch.',
  },
  {
    code: 'fj',
    country: 'Fiji',
    detail: 'Send to Australia and New Zealand, including mobile wallet payout options.',
  },
]

const payouts = [
  {
    icon: BanknotesIcon,
    title: 'Cash pickup',
    description:
      'Your recipient collects cash at a Lotus FX branch — quick, simple, and ready when they arrive.',
  },
  {
    icon: BuildingLibraryIcon,
    title: 'Bank transfer',
    description:
      'Deposit straight into the recipient’s bank account across Australia, New Zealand and Fiji.',
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile wallet (Fiji)',
    description:
      'In Fiji, funds can also go to a mobile wallet where available — modern payout for everyday needs.',
  },
]

const reasons = [
  {
    icon: BoltIcon,
    title: 'Very fast',
    description:
      'eWire is built for Pacific corridors. Many transfers move quickly so families and businesses aren’t left waiting.',
  },
  {
    icon: MapPinIcon,
    title: 'AU · NZ · Fiji only',
    description:
      'A dedicated Lotus FX network between Australia, New Zealand and Fiji — regional transfers done the smart way.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Website or app',
    description:
      'Send eWire from the Lotus FX website or mobile app after you’re onboarded — branch help is available too.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified customer profile',
    description:
      'You’ll need a Lotus FX account with ID verification (AML / compliance) before sending online or in the app.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Create your account',
    description:
      'Sign up on the website or app and complete onboarding so we can verify your customer profile for AML compliance.',
  },
  {
    number: '02',
    title: 'Choose eWire',
    description:
      'Log in and select eWire for Australia, New Zealand or Fiji — cash pickup, bank transfer, or Fiji mobile wallet.',
  },
  {
    number: '03',
    title: 'Enter the details',
    description:
      'Add the amount, destination and recipient details. We’ll show the rate and fees before you confirm.',
  },
  {
    number: '04',
    title: 'Send — recipient receives',
    description:
      'Complete your transfer online or in the app. Your recipient gets cash, a bank deposit, or a Fiji mobile wallet credit.',
  },
]

export default function EWirePage() {
  const { selectedCountry } = useCountry()
  const portal = getCountryPortalLinks(selectedCountry)
  const loginUrl = portal.web
  const appStoreUrl = portal.appStore
  const playStoreUrl = portal.playStore

  return (
    <>
      <section className="relative overflow-x-clip bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 text-white">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
          <span className="absolute top-[18%] right-[10%] text-7xl font-bold text-white/10">$</span>
          <span className="absolute bottom-[24%] left-[8%] text-6xl font-bold text-white/10">NZ$</span>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="min-w-0">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70 mb-4"
              >
                Lotus special · Pacific corridors
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold !leading-[1.35] pb-[0.15em] tracking-tight mb-5"
              >
                Lotus special eWire transfers
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14 }}
                className="text-base sm:text-lg text-white/85 !leading-[1.75] mb-8 max-w-xl"
              >
                Send money between Australia, New Zealand and Fiji on Lotus FX’s own platform —
                via our website or app. Fast, clear, and built for the Pacific.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                className="flex flex-wrap gap-3 sm:gap-4"
              >
                {portal.showLogin && loginUrl ? (
                  <a
                    href={loginUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-base font-semibold text-primary-700 shadow-lg hover:bg-gray-50 transition"
                  >
                    Login / Sign Up
                  </a>
                ) : null}
                {portal.showApps && playStoreUrl ? (
                  <a
                    href={playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-5 py-3 text-base font-semibold text-white hover:bg-white/10 transition"
                  >
                    Google Play
                  </a>
                ) : null}
                {portal.showApps && appStoreUrl ? (
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-5 py-3 text-base font-semibold text-white hover:bg-white/10 transition"
                  >
                    App Store
                  </a>
                ) : null}
                {!portal.showLogin && !portal.showApps ? (
                  <Link
                    href="/locations"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-base font-semibold text-primary-700 shadow-lg hover:bg-gray-50 transition"
                  >
                    Find a branch
                  </Link>
                ) : null}
              </motion.div>
              <p className="mt-4 text-sm text-white/70">
                Prefer in person?{' '}
                <Link href="/locations" className="underline underline-offset-2 hover:text-white">
                  Find a branch
                </Link>
                .
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="min-w-0"
            >
              <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-6 sm:p-8 backdrop-blur-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70 mb-5">
                  How recipients can get paid
                </p>
                <ul className="space-y-5">
                  {[
                    { label: 'Cash pickup', note: 'Collect at a Lotus FX branch' },
                    { label: 'Bank transfer', note: 'Direct to their account' },
                    { label: 'Mobile wallet', note: 'Available in Fiji' },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-4 items-start">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-white shrink-0" />
                      <div>
                        <div className="font-semibold text-white">{item.label}</div>
                        <div className="text-sm text-white/75 mt-0.5">{item.note}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Account requirement */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
                Before you send
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
                You’ll need a Lotus FX account
              </h2>
              <p className="text-lg text-gray-600 !leading-[1.75]">
                To send eWire online or in the app, complete customer onboarding and verify your
                profile. This helps us meet AML and compliance requirements so transfers stay secure.
              </p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: UserPlusIcon,
                  title: 'Sign up & onboard',
                  detail: 'Create your account and complete identity verification for your customer profile.',
                },
                {
                  icon: ShieldCheckIcon,
                  title: 'AML ready',
                  detail: 'Verified profiles let us process transfers in line with financial regulations.',
                },
                {
                  icon: GlobeAltIcon,
                  title: 'Send on the website',
                  detail: 'Log in to the Lotus FX customer portal and start an eWire transfer anytime.',
                },
                {
                  icon: DevicePhoneMobileIcon,
                  title: 'Or use the app',
                  detail: 'Download Lotus FX on iOS or Android and send from your phone.',
                },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <MotionWrapper
                    key={item.title}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex gap-3"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 !leading-[1.7]">{item.detail}</p>
                    </div>
                  </MotionWrapper>
                )
              })}
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            {portal.showLogin && loginUrl ? (
              <a href={loginUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Login / Sign Up
              </a>
            ) : null}
            {portal.showApps && playStoreUrl ? (
              <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Google Play
              </a>
            ) : null}
            {portal.showApps && appStoreUrl ? (
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                App Store
              </a>
            ) : null}
            {!portal.showLogin ? (
              <Link href="/locations" className="btn-primary">
                Find a branch
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-primary-50/40">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              Where it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Australia · New Zealand · Fiji
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              eWire connects our three markets. Send between any of these countries with Lotus FX —
              the regional option designed for Pacific families and businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {corridors.map((item, index) => (
              <MotionWrapper
                key={item.country}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="border-t-2 border-primary-600 pt-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={`https://flagcdn.com/w80/${item.code}.png`}
                    alt=""
                    className="h-7 w-10 object-cover rounded-sm shadow-sm"
                  />
                  <h3 className="text-xl font-bold text-gray-900">{item.country}</h3>
                </div>
                <p className="text-gray-600 !leading-[1.75]">{item.detail}</p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              Payout options
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Cash, bank, or Fiji mobile wallet
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              Choose the delivery method that suits your recipient — flexible options across the
              Pacific corridor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {payouts.map((item, index) => {
              const Icon = item.icon
              return (
                <MotionWrapper
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  viewport={{ once: true }}
                >
                  <div className="w-11 h-11 rounded-full bg-primary-600 text-white flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 !leading-[1.4] pb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 !leading-[1.75]">{item.description}</p>
                </MotionWrapper>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              Why eWire
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Built for speed across the Pacific
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              Our own transfer platform means fewer hops, clearer pricing, and service tuned to AU,
              NZ and Fiji.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
            {reasons.map((item, index) => {
              const Icon = item.icon
              return (
                <MotionWrapper
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-11 h-11 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 !leading-[1.4] pb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 !leading-[1.75]">{item.description}</p>
                  </div>
                </MotionWrapper>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em]">
              Four simple steps
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <MotionWrapper
                key={step.number}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <div className="text-sm font-bold text-primary-600 mb-3">{step.number}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 !leading-[1.4] pb-0.5">
                  {step.title}
                </h3>
                <p className="text-gray-600 !leading-[1.75] text-sm sm:text-base">{step.description}</p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-x-clip bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 py-16 sm:py-20 text-white">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Ready to send with eWire?
            </h2>
            <p className="text-lg text-white/85 !leading-[1.75] mb-8 max-w-2xl">
              Create or log into your Lotus FX account, then send from the website or app. Prefer
              face-to-face help? Visit a branch across Australia, New Zealand or Fiji.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {portal.showLogin && loginUrl ? (
                <a
                  href={loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-primary-700 hover:bg-gray-50 transition"
                >
                  Login / Sign Up
                </a>
              ) : null}
              {portal.showApps && playStoreUrl ? (
                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-5 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  Google Play
                </a>
              ) : null}
              {portal.showApps && appStoreUrl ? (
                <a
                  href={appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-white/80 px-5 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  App Store
                </a>
              ) : null}
              <Link
                href="/money-transfer"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/40 px-5 py-3 font-semibold text-white/90 hover:bg-white/10 transition"
              >
                All transfer options
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
