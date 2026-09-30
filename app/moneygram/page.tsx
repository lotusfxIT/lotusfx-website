import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  DevicePhoneMobileIcon,
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import MotionWrapper from '@/components/MotionWrapper'
import {
  AccentPanel,
  IconFeatureCard,
  SectionEyebrow,
  SectionHeading,
  StepCard,
} from '@/components/marketing/MarketingBlocks'
import { buildPageMetadata } from '@/lib/seo'
import {
  MoneygramAppFooterNote,
  MoneygramAppSendCta,
  MoneygramHeroCtas,
} from '@/components/MoneygramAppCtas'

export const metadata: Metadata = buildPageMetadata({
  title: 'MoneyGram Money Transfers',
  description:
    'Send money worldwide with MoneyGram through Lotus FX. Use our app or visit us in-store for fast, secure international money transfers.',
  path: '/moneygram',
  keywords: ['MoneyGram', 'money transfer', 'international remittance', 'LotusFX'],
})

const features = [
  {
    icon: <GlobeAltIcon className="w-6 h-6" />,
    title: '200+ countries',
    description:
      'Reach recipients across MoneyGram\u2019s global network of agent locations, banks and mobile wallets.',
  },
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: 'Fast delivery options',
    description:
      'Many transfers are available quickly for cash pickup, bank deposit or mobile wallet credit.',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: 'Secure transfers',
    description:
      'MoneyGram security combined with Lotus FX compliance checks and in-person support when you need it.',
  },
  {
    icon: <WalletIcon className="w-6 h-6" />,
    title: 'Flexible payout',
    description:
      'Cash pickup, bank deposit or mobile wallet where available — choose what works for your recipient.',
  },
]

const sendOptions = [
  {
    icon: DevicePhoneMobileIcon,
    title: 'Send with the Lotus FX app',
    description:
      'Start a MoneyGram transfer from your phone — track progress, save recipients and send again faster next time.',
    points: [
      '24/7 access from your phone',
      'Track transfers in real time',
      'Save recipient details',
      'View your transfer history',
    ],
    cta: 'Get the app',
    useAppCta: true,
  },
  {
    icon: MapPinIcon,
    title: 'Send in a Lotus FX branch',
    description:
      'Prefer face-to-face help? Our team will walk you through rates, fees and paperwork at any participating branch.',
    points: [
      'Friendly in-branch guidance',
      'Clear rates and fees upfront',
      'Pay with cash or bank transfer',
      'Help choosing the right payout method',
    ],
    href: '/locations',
    cta: 'Find a branch',
    useAppCta: false,
  },
]

const steps = [
  {
    number: '01',
    title: 'Choose how you send',
    description: 'Use the Lotus FX app for convenience, or visit a branch for personal assistance.',
  },
  {
    number: '02',
    title: 'Enter the details',
    description:
      'Add recipient information, destination and amount. We\u2019ll show the exchange rate and fees before you confirm.',
  },
  {
    number: '03',
    title: 'Complete payment',
    description:
      'Pay securely in the app or in store. You\u2019ll get a reference number to track the transfer.',
  },
  {
    number: '04',
    title: 'Recipient receives',
    description:
      'Funds can be collected as cash, paid to a bank account, or credited to a mobile wallet where available.',
  },
]

const faqs = [
  {
    question: 'Can I send MoneyGram transfers through Lotus FX?',
    answer:
      'Yes. You can send MoneyGram transfers through the Lotus FX app or at participating Lotus FX branches, depending on availability in your location.',
  },
  {
    question: 'How long does a MoneyGram transfer take?',
    answer:
      'Many transfers are available for pickup or delivery quickly, depending on the destination, payout method and local hours. We\u2019ll confirm expected timing when you send.',
  },
  {
    question: 'What payout options are available?',
    answer:
      'Depending on the destination, recipients may collect cash, receive a bank deposit, or get funds in a mobile wallet where MoneyGram supports those options.',
  },
  {
    question: 'What ID do I need?',
    answer:
      'You\u2019ll need a valid government-issued photo ID. Larger transfers may require additional documentation under compliance rules.',
  },
]

const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-[#E21B24] text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg hover:bg-[#c41620] transition-colors shadow-md text-center'
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl border-2 border-[#E21B24] text-[#E21B24] font-bold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg hover:bg-[#E21B24] hover:text-white transition-colors text-center'

export default function MoneyGramPage() {
  return (
    <>
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-[#E21B24] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_42%)]" aria-hidden />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-white/90 mb-3">
                Available at Lotus FX
              </span>
              <div className="mb-5 sm:mb-6 inline-flex w-fit max-w-full rounded-xl bg-white border border-black/5 shadow-lg px-4 sm:px-5 py-3 sm:py-3.5">
                <div className="relative w-64 h-14 sm:w-80 sm:h-16 md:w-96 md:h-[4.5rem]">
                  <Image
                    src="/images/partners/moneygram.png"
                    alt="MoneyGram"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-white mb-5 sm:mb-6 leading-[1.15] tracking-tight pr-0 lg:pr-2">
                Send money worldwide with MoneyGram
              </h1>
              <div className="space-y-3.5 pr-0 lg:pr-2">
                <p className="text-base sm:text-lg text-white leading-relaxed">
                  Send money through MoneyGram with Lotus FX — by app or in branch — with clear
                  guidance, competitive options and support when you need it.
                </p>
                <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                  Cash pickup, bank deposit or mobile wallet where available, across a trusted global
                  network.
                </p>
              </div>
              <MoneygramHeroCtas
                primaryClass="inline-flex items-center justify-center rounded-xl bg-white text-[#E21B24] font-bold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg hover:bg-neutral-100 transition-colors shadow-md text-center"
                secondaryClass="inline-flex items-center justify-center rounded-xl border-2 border-white text-white font-bold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg hover:bg-white/10 transition-colors text-center"
              />
            </div>

            <MotionWrapper
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="lg:col-span-5 xl:col-span-4 h-full min-h-0 lg:min-h-full"
            >
              <AccentPanel
                variant="crimson"
                title="At a glance"
                items={[
                  {
                    label: 'App or in branch',
                    detail: 'Send when it suits you — phone or face-to-face',
                  },
                  {
                    label: 'Global network',
                    detail: 'Reach recipients across 200+ countries and territories',
                  },
                  {
                    label: 'Flexible payout',
                    detail: 'Cash, bank deposit or mobile wallet where available',
                  },
                  {
                    label: 'Local support',
                    detail: 'Lotus FX help with rates, fees and paperwork',
                  },
                ]}
              />
            </MotionWrapper>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="mg">Your choice</SectionEyebrow>
            <SectionHeading
              align="center"
              title="How would you like to send?"
              subtitle="Start in the Lotus FX app, or walk into a branch for personal help."
            />
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {sendOptions.map((option, i) => (
              <MotionWrapper
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <article className="h-full flex flex-col rounded-2xl border border-red-100 bg-gradient-to-br from-white to-red-50/50 p-8 lg:p-9 shadow-soft hover:shadow-lg hover:border-[#E21B24]/30 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#E21B24] text-white flex items-center justify-center shadow-md mb-6">
                    <option.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{option.description}</p>
                  <ul className="space-y-3 mb-8 flex-1">
                    {option.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-gray-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#E21B24] shrink-0" aria-hidden />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  {option.useAppCta ? (
                    <MoneygramAppSendCta className={`${btnPrimary} self-start`} label={option.cta} />
                  ) : (
                    <Link href={option.href!} className={`${btnPrimary} self-start`}>
                      {option.cta}
                    </Link>
                  )}
                </article>
              </MotionWrapper>
            ))}
          </div>
          <MoneygramAppFooterNote linkClass="text-[#E21B24] hover:text-red-700 font-medium" />
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="mg">Simple process</SectionEyebrow>
            <SectionHeading
              align="center"
              title="How it works"
              subtitle="Four clear steps whether you send from the app or in branch."
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, i) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                delay={i * 0.06}
                tone="mg"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-neutral-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#E21B24] mb-3">
                Payout options
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                How recipients can get the money
              </h2>
              <p className="mt-6 text-lg text-neutral-300 leading-relaxed max-w-xl">
                Availability depends on the destination. We\u2019ll help you choose the option that
                fits your recipient best.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: MapPinIcon, title: 'Cash pickup', detail: 'Collect at an agent location' },
                { icon: BuildingLibraryIcon, title: 'Bank deposit', detail: 'Paid to a bank account' },
                { icon: WalletIcon, title: 'Mobile wallet', detail: 'Where MoneyGram supports it' },
              ].map((item, i) => (
                <MotionWrapper
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 shadow-soft h-full text-center">
                    <div className="mx-auto w-11 h-11 rounded-xl bg-[#E21B24] text-white flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-neutral-400 mt-1.5">{item.detail}</p>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#FFF5F5]">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="mg">Why MoneyGram</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Built for international sends"
              subtitle="A global payout network, with Lotus FX support locally."
            />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <IconFeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={i * 0.06}
                tone="mg"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-14">
            <SectionEyebrow tone="mg">FAQs</SectionEyebrow>
            <SectionHeading align="center" title="MoneyGram questions" />
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
                <details className="group bg-[#FFF5F5] rounded-xl border border-red-100 p-6 hover:border-[#E21B24]/40 transition-colors">
                  <summary className="font-semibold text-gray-900 text-lg cursor-pointer list-none flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span
                      className="text-[#E21B24] shrink-0 transition group-open:rotate-45 text-2xl leading-none"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
