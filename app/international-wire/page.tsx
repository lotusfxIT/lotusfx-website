'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import MotionWrapper from '@/components/MotionWrapper'
import { useCountry } from '@/context/CountryContext'
import {
  BuildingLibraryIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CheckBadgeIcon,
  UserPlusIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline'
import { getCountryPortalLinks } from '@/lib/country-portals'

const partnerships = [
  {
    title: 'International bank partners',
    description:
      'We collaborate with established international banks in each country we serve — so your wire can move through trusted channels worldwide.',
  },
  {
    title: 'Proud collaborations',
    description:
      'Our banking relationships are built to give customers better access, clearer process, and stronger confidence on larger or business sends.',
  },
  {
    title: 'Better send rates',
    description:
      'Through these partnerships we work to offer competitive send rates — helping you get more value when paying overseas.',
  },
]

const whoFor = [
  {
    icon: BriefcaseIcon,
    title: 'Businesses & suppliers',
    description:
      'Pay overseas suppliers, settle invoices, or move larger commercial amounts with bank-to-bank security.',
  },
  {
    icon: UserGroupIcon,
    title: 'Families & individuals',
    description:
      'Send meaningful amounts to family or cover overseas costs with a reliable international wire.',
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Larger transfers',
    description:
      'When you need more than everyday remittance limits, wire transfers give you a clear bank pathway.',
  },
]

const reasons = [
  {
    icon: BuildingLibraryIcon,
    title: 'Bank-to-bank delivery',
    description:
      'Funds go from bank account to bank account — a familiar, secure path for international payments.',
  },
  {
    icon: GlobeAltIcon,
    title: 'Website or app',
    description:
      'Send international wires from the Lotus FX website or mobile app once your account is verified — branch support available too.',
  },
  {
    icon: CheckBadgeIcon,
    title: 'Competitive send rates',
    description:
      'Our international bank collaborations are aimed at better send rates for the amounts that matter.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Verified & compliant',
    description:
      'A completed customer profile and onboarding (AML) keeps your wire transfers secure and regulation-ready.',
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
    title: 'Share bank details',
    description:
      'Provide the beneficiary’s full name, bank account details and any routing information required.',
  },
  {
    number: '03',
    title: 'Confirm rate & fees',
    description:
      'We’ll show the send rate and fees clearly before you proceed — no surprises.',
  },
  {
    number: '04',
    title: 'Send the wire',
    description:
      'Complete your international wire online or in the app through our banking partners.',
  },
]

export default function InternationalWirePage() {
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
          <span className="absolute top-[20%] right-[12%] text-7xl font-bold text-white/10">€</span>
          <span className="absolute bottom-[22%] left-[8%] text-6xl font-bold text-white/10">£</span>
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
                Bank to bank · Worldwide
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold !leading-[1.35] pb-[0.15em] tracking-tight mb-5"
              >
                Lotus international wire transfers
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.14 }}
                className="text-base sm:text-lg text-white/85 !leading-[1.75] mb-8 max-w-xl"
              >
                Secure bank-to-bank transfers powered by our partnerships with international banks —
                send from the website or app once your account is set up.
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
                  Our approach
                </p>
                <ul className="space-y-5">
                  {[
                    'Partner banks in each country we serve',
                    'Proud collaborations for stronger sends',
                    'Competitive rates on international wires',
                    'Send via website or app after onboarding',
                  ].map((item) => (
                    <li key={item} className="flex gap-4 items-start">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-white shrink-0" />
                      <span className="text-white/90 !leading-[1.6]">{item}</span>
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
                International wires via the website or app require customer onboarding and a verified
                profile. That’s how we meet AML and compliance rules while keeping your transfer
                secure.
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
                  detail: 'Verified profiles let us process wires in line with financial regulations.',
                },
                {
                  icon: GlobeAltIcon,
                  title: 'Send on the website',
                  detail: 'Log in to the Lotus FX customer portal and start your international wire.',
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
              Banking partnerships
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Partnered with international banks
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              We work with international banks in each country to move your money securely — and we
              take pride in collaborations that help deliver better send rates for our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {partnerships.map((item, index) => (
              <MotionWrapper
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="border-t-2 border-primary-600 pt-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3 !leading-[1.4] pb-0.5">
                  {item.title}
                </h3>
                <p className="text-gray-600 !leading-[1.75]">{item.description}</p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mb-10 sm:mb-14">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
              Who it’s for
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              When a wire transfer makes sense
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              Ideal when you need a secure bank deposit overseas — for business, family support, or
              larger personal transfers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {whoFor.map((item, index) => {
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
              The Lotus difference
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em] mb-4">
              Why send a wire with us
            </h2>
            <p className="text-lg text-gray-600 !leading-[1.75]">
              Banking partnerships, competitive send rates, and a clear digital path once you’re
              onboarded.
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
              From account to send
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
              Ready to send an international wire?
            </h2>
            <p className="text-lg text-white/85 !leading-[1.75] mb-8 max-w-2xl">
              Log in or create your Lotus FX account, complete verification, then send from the
              website or app. Branch teams are happy to help if you prefer in person.
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
