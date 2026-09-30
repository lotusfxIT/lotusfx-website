import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  CreditCardIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import MotionWrapper from '@/components/MotionWrapper'
import {
  IconFeatureCard,
  SectionEyebrow,
  SectionHeading,
  StepCard,
} from '@/components/marketing/MarketingBlocks'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Cash Passport Travel Card',
  description:
    'Get your Cash Passport multi-currency travel card from Lotus FX. Sign up online or visit us in-store. Mastercard security with 10+ currencies.',
  path: '/cash-passport',
  keywords: ['Cash Passport', 'travel card', 'multi-currency card', 'prepaid travel money', 'Mastercard', 'LotusFX'],
})

const benefits = [
  {
    icon: <GlobeAltIcon className="w-6 h-6" />,
    title: '10+ currencies',
    description:
      'Load major travel currencies including USD, EUR, GBP, JPY and more — ready before you fly.',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: 'Mastercard security',
    description:
      'Chip & PIN, contactless payments and fraud monitoring help keep your travel money protected.',
  },
  {
    icon: <DevicePhoneMobileIcon className="w-6 h-6" />,
    title: 'App control',
    description:
      'Check balances, freeze or unfreeze your card, reload funds and review transactions on the go.',
  },
  {
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    title: 'Lock in rates',
    description:
      'Load at a known rate before you travel so everyday spending abroad feels more predictable.',
  },
]

const currencies = [
  'AUD',
  'USD',
  'EUR',
  'GBP',
  'NZD',
  'JPY',
  'SGD',
  'HKD',
  'CAD',
  'THB',
  'CHF',
  'AED',
]

const getCardOptions = [
  {
    icon: CreditCardIcon,
    title: 'Get started online',
    description:
      'Apply through our secure Mastercard partner flow, then activate and load currencies when your card arrives.',
    points: [
      'Convenient online application',
      'Card delivered to your address',
      'Activate and manage via app',
      'Reload when you need more funds',
    ],
    href: '#',
    cta: 'Sign up online',
    recommended: true,
  },
  {
    icon: MapPinIcon,
    title: 'Get your card in branch',
    description:
      'Visit a Lotus FX branch for help setting up your Cash Passport and loading your first currencies.',
    points: [
      'In-person setup support',
      'Load currencies on the spot',
      'Ask questions before you travel',
      'Friendly Lotus FX guidance',
    ],
    href: '/locations',
    cta: 'Find a branch',
    recommended: false,
  },
]

const process = [
  {
    number: '01',
    title: 'Get your card',
    description: 'Sign up online or visit a Lotus FX branch to get your Cash Passport travel card.',
  },
  {
    number: '02',
    title: 'Load currencies',
    description: 'Add the currencies you need at locked-in rates before or during your trip.',
  },
  {
    number: '03',
    title: 'Spend worldwide',
    description: 'Use it anywhere Mastercard is accepted — shops, restaurants and ATMs.',
  },
  {
    number: '04',
    title: 'Reload anytime',
    description: 'Top up online, in the app, or at a Lotus FX branch when you need more.',
  },
]

const faqs = [
  {
    question: 'What is Cash Passport?',
    answer:
      'Cash Passport is a prepaid multi-currency travel card you can load before you travel, then spend abroad or withdraw from ATMs where Mastercard is accepted.',
  },
  {
    question: 'How do I get a Cash Passport from Lotus FX?',
    answer:
      'You can start online through our Mastercard partner signup, or visit a participating Lotus FX branch for in-person help.',
  },
  {
    question: 'Can I hold more than one currency?',
    answer:
      'Yes. You can load multiple supported currencies on the same card and switch between them as you travel.',
  },
  {
    question: 'How do I reload the card?',
    answer:
      'Reload options typically include online/app top-ups and in-branch loading at Lotus FX. Availability can vary by method and location.',
  },
]

const btnPrimary =
  'inline-flex items-center justify-center rounded-full bg-[#141413] text-[#F3F0EE] font-semibold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg hover:bg-black transition-colors shadow-md text-center'
const btnSecondary =
  'inline-flex items-center justify-center rounded-full border-2 border-[#141413] text-[#141413] font-semibold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg hover:bg-[#141413] hover:text-[#F3F0EE] transition-colors text-center'

export default function CashPassportPage() {
  return (
    <>
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-[#F3F0EE] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#EB001B] via-[#F79E1B] to-[#3860BE]" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(56,96,190,0.08),transparent_45%)]" aria-hidden />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
              <SectionEyebrow tone="cp">Available at Lotus FX</SectionEyebrow>
              <div className="mb-5 sm:mb-6 inline-flex w-fit max-w-full rounded-xl bg-white border border-[#E8E2DA] shadow-md px-4 sm:px-5 py-3 sm:py-3.5">
                <div className="relative w-64 h-14 sm:w-80 sm:h-16 md:w-96 md:h-[4.5rem]">
                  <Image
                    src="/images/partners/cash-passport.png"
                    alt="Cash Passport"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-[#141413] mb-5 sm:mb-6 leading-[1.15] tracking-tight pr-0 lg:pr-2">
                Travel money on a smarter card
              </h1>
              <div className="space-y-3.5 pr-0 lg:pr-2">
                <p className="text-base sm:text-lg text-[#141413]/90 leading-relaxed">
                  Cash Passport lets you load multiple currencies, lock in rates before you travel,
                  and spend with Mastercard acceptance — with Lotus FX support when you need it.
                </p>
                <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
                  Get started online or in branch, then manage balances and reloads from the app
                  while you\u2019re away.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-7 sm:mt-8">
                <Link href="#" className={btnPrimary}>
                  Sign up online
                </Link>
                <Link href="/locations" className={btnSecondary}>
                  Get card in store
                </Link>
              </div>
            </div>

            <MotionWrapper
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:col-span-5 xl:col-span-4 h-full min-h-0 lg:min-h-full"
            >
              <div className="relative h-full rounded-2xl sm:rounded-3xl bg-[#141413] p-6 sm:p-7 lg:p-8 shadow-strong overflow-hidden flex flex-col">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full border border-white/10" aria-hidden />
                <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full border border-[#3860BE]/25" aria-hidden />
                <div
                  className="pointer-events-none absolute inset-0 opacity-45"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 70% 25%, rgba(56,96,190,0.28), transparent 45%)',
                  }}
                  aria-hidden
                />
                <p className="relative text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/75 mb-5 shrink-0">
                  At a glance
                </p>
                <Image
                  src="/images/partners/cash-passport-card.png"
                  alt="Cash Passport card"
                  width={420}
                  height={260}
                  className="relative w-full max-w-[16rem] sm:max-w-[18rem] mx-auto rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.4)] border border-white/15 mb-5 sm:mb-6"
                  priority
                />
                <ul className="relative grid sm:grid-cols-1 gap-4 sm:gap-5 text-white flex-1 content-between">
                  {[
                    { label: 'Multi-currency', detail: 'Load the currencies you actually need' },
                    { label: 'Spend & withdraw', detail: 'Shops, restaurants and ATMs worldwide' },
                    { label: 'Stay in control', detail: 'Balances, freeze and reloads in the app' },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#3860BE] shrink-0" aria-hidden />
                      <div>
                        <p className="font-bold text-base sm:text-lg leading-snug">{item.label}</p>
                        <p className="text-white/80 text-sm sm:text-[0.95rem] mt-1 leading-relaxed">
                          {item.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#FCFBFA]">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="cp">Get started</SectionEyebrow>
            <SectionHeading
              align="center"
              title="How to get your Cash Passport"
              subtitle="Apply online for delivery, or visit Lotus FX for in-person setup help."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {getCardOptions.map((option, i) => (
              <MotionWrapper
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <article
                  className={`relative h-full flex flex-col rounded-[1.75rem] border bg-white p-8 lg:p-9 shadow-soft hover:shadow-lg transition-all ${
                    option.recommended
                      ? 'border-[#3860BE]/35 ring-2 ring-[#3860BE]/15'
                      : 'border-[#E8E2DA] hover:border-[#3860BE]/30'
                  }`}
                >
                  {option.recommended && (
                    <span className="absolute -top-3 right-6 text-xs font-semibold uppercase tracking-wide bg-[#141413] text-[#F3F0EE] px-3 py-1 rounded-full shadow">
                      Popular
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-xl bg-[#141413] text-white flex items-center justify-center shadow-md mb-6">
                    <option.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[#141413] mb-3">{option.title}</h3>
                  <p className="text-[#555555] leading-relaxed mb-6">{option.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {option.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[#141413]/85">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#3860BE] shrink-0" aria-hidden />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={option.href}
                    className={option.recommended ? `${btnPrimary} self-start` : `${btnSecondary} self-start`}
                  >
                    {option.cta}
                  </Link>
                </article>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#F3F0EE]">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="cp">Travel smarter</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Why travellers choose Cash Passport"
              subtitle="Control, security and multi-currency convenience in one card."
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((benefit, i) => (
              <IconFeatureCard
                key={benefit.title}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                delay={i * 0.06}
                tone="cp"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-14">
            <SectionEyebrow tone="cp">Multi-currency</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Currencies you can load"
              subtitle="Load and manage major travel currencies on one card."
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {currencies.map((code, i) => (
              <MotionWrapper
                key={code}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                viewport={{ once: true }}
              >
                <div className="rounded-2xl px-3 py-5 text-center border border-[#E8E2DA] bg-[#F3F0EE] shadow-soft">
                  <span className="text-base sm:text-lg font-bold text-[#141413] tracking-wide">
                    {code}
                  </span>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#FCFBFA]">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="cp">Simple process</SectionEyebrow>
            <SectionHeading
              align="center"
              title="How it works"
              subtitle="From getting your card to spending and reloading overseas."
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {process.map((step, i) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                delay={i * 0.06}
                tone="cp"
              />
            ))}
          </div>
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-[#555555]">
            <ArrowPathIcon className="w-4 h-4 text-[#3860BE]" />
            <span>Reload online, in the app, or at a Lotus FX branch</span>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#141413]">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-14">
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#3860BE] mb-3">
              FAQs
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Cash Passport questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <MotionWrapper
                key={faq.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <details className="group bg-[#1c1c1b] rounded-2xl border border-white/10 p-6 hover:border-[#3860BE]/40 transition-colors">
                  <summary className="font-semibold text-white text-lg cursor-pointer list-none flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span
                      className="text-[#3860BE] shrink-0 transition group-open:rotate-45 text-2xl leading-none"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[#D1CDC7] leading-relaxed">{faq.answer}</p>
                </details>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
