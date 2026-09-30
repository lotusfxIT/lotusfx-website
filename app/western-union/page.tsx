import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  GlobeAltIcon,
  ClockIcon,
  ShieldCheckIcon,
  MapPinIcon,
  IdentificationIcon,
  BanknotesIcon,
  UserIcon,
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

export const metadata: Metadata = buildPageMetadata({
  title: 'Western Union Money Transfers',
  description:
    'Send money worldwide with Western Union at Lotus FX branches. Fast, secure international transfers across 200+ countries with in-branch support.',
  path: '/western-union',
  keywords: ['Western Union', 'money transfer', 'international remittance', 'LotusFX', 'cash pickup'],
})

const features = [
  {
    icon: <GlobeAltIcon className="w-6 h-6" />,
    title: '200+ countries',
    description:
      'Send money to over 200 countries and territories through Western Union\u2019s global agent network.',
  },
  {
    icon: <ClockIcon className="w-6 h-6" />,
    title: 'Fast cash pickup',
    description:
      'Most transfers are ready for collection within minutes at Western Union locations worldwide.',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    title: 'Secure & trusted',
    description:
      'Your transfer is protected by Western Union security standards and Lotus FX compliance checks.',
  },
  {
    icon: <MapPinIcon className="w-6 h-6" />,
    title: 'Convenient collection',
    description:
      'Recipients can collect cash at hundreds of thousands of Western Union agent locations globally.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Visit a Lotus FX branch',
    description:
      'Bring a valid government-issued photo ID. Our team will guide you through the transfer in branch.',
  },
  {
    number: '02',
    title: 'Share recipient details',
    description:
      'Provide the recipient\u2019s full name, destination, and amount. We\u2019ll confirm the rate and fees upfront.',
  },
  {
    number: '03',
    title: 'Pay for the transfer',
    description:
      'Pay in cash or by bank transfer. You\u2019ll receive a Money Transfer Control Number (MTCN) to share.',
  },
  {
    number: '04',
    title: 'Recipient collects',
    description:
      'Your recipient collects the money at a Western Union location using the MTCN and their ID.',
  },
]

const bringItems = [
  {
    icon: IdentificationIcon,
    title: 'Valid photo ID',
    detail: 'Driver\u2019s licence, passport, or national ID card',
  },
  {
    icon: UserIcon,
    title: 'Recipient details',
    detail: 'Full legal name and destination country or city',
  },
  {
    icon: BanknotesIcon,
    title: 'Payment ready',
    detail: 'Cash or bank transfer details for the send amount and fees',
  },
]

const faqs = [
  {
    question: 'Can I send a Western Union transfer online with Lotus FX?',
    answer:
      'Western Union transfers through Lotus FX are completed in branch. Visit any participating location and our team will help you send the transfer securely.',
  },
  {
    question: 'How long does a Western Union transfer take?',
    answer:
      'Many transfers are available for pickup within minutes, depending on the destination and local agent hours. We\u2019ll confirm expected timing when you send.',
  },
  {
    question: 'What is an MTCN?',
    answer:
      'The Money Transfer Control Number (MTCN) is your unique tracking reference. Share it with your recipient so they can collect the funds with their ID.',
  },
  {
    question: 'What identification do I need?',
    answer:
      'You\u2019ll need a valid government-issued photo ID. For larger transfers, additional documentation may be required under compliance rules.',
  },
]

const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-black text-[#FFE600] font-bold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg hover:bg-neutral-900 transition-colors shadow-lg text-center ring-1 ring-black/10'
const btnSecondary =
  'inline-flex items-center justify-center rounded-xl bg-white text-black font-bold px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg border-2 border-black hover:bg-black hover:text-[#FFE600] transition-colors shadow-md text-center'

export default function WesternUnionPage() {
  return (
    <>
      <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-[#FFE600] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(0,0,0,0.08),transparent_40%)]" aria-hidden />
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-stretch">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
              <SectionEyebrow tone="wu">Available at Lotus FX</SectionEyebrow>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-black mb-5 sm:mb-6 leading-[1.15] tracking-tight pr-0 lg:pr-2">
                Send money worldwide with
              </h1>
              <div className="mb-5 sm:mb-6 inline-flex w-fit max-w-full rounded-xl bg-white border border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.1)] px-4 sm:px-5 py-3 sm:py-3.5">
                <div className="relative w-64 h-14 sm:w-80 sm:h-16 md:w-96 md:h-[4.5rem]">
                  <Image
                    src="/images/partners/western-union.png"
                    alt="Western Union"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
              </div>
              <div className="space-y-3.5 pr-0 lg:pr-2">
                <p className="text-base sm:text-lg text-neutral-900 leading-relaxed">
                  Visit any Lotus FX branch to send money across 200+ countries with Western Union
                </p>
                <p className="text-base sm:text-lg text-neutral-900 leading-relaxed">
                  Fast cash pickup, clear fees, and help from our team in store.
                </p>
                <p className="text-sm sm:text-base text-neutral-800/80 leading-relaxed">
                  Transfers are completed in branch, so you get personal support every step of the
                  way — rates and fees explained before you pay.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-7 sm:mt-8">
                <Link href="/locations" className={btnPrimary}>
                  Find a branch
                </Link>
                <Link href="/money-transfer" className={btnSecondary}>
                  All transfer options
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
              <AccentPanel
                variant="gold"
                title="At a glance"
                items={[
                  {
                    label: 'Global reach',
                    detail: 'Cash pickup in 200+ countries and territories',
                  },
                  {
                    label: 'Often minutes',
                    detail: 'Many transfers ready for collection quickly',
                  },
                  {
                    label: 'In-branch help',
                    detail: 'Lotus FX staff guide you through the send',
                  },
                  {
                    label: 'Trackable',
                    detail: 'Share the MTCN so your recipient can collect safely',
                  },
                ]}
              />
            </MotionWrapper>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#FFFCE6]">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="wu">Simple process</SectionEyebrow>
            <SectionHeading
              align="center"
              title="How it works"
              subtitle="Four clear steps from branch visit to cash in your recipient\u2019s hands."
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
                tone="wu"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
            <div>
              <SectionEyebrow tone="wu">Before you visit</SectionEyebrow>
              <SectionHeading title="What to bring to the branch" />
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Arrive prepared and we can usually complete your Western Union send quickly —
                with rates and fees explained before you pay.
              </p>
              <Link href="/locations" className={`${btnPrimary} mt-8 sm:mt-10`}>
                Find nearest branch
              </Link>
            </div>
            <div className="space-y-4 sm:space-y-5">
              {bringItems.map((item, i) => (
                <MotionWrapper
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-4 sm:gap-5 rounded-2xl border border-yellow-200 bg-[#FFFCE6] p-5 sm:p-6 shadow-soft">
                    <div className="w-12 h-12 rounded-xl bg-black text-[#FFE600] flex items-center justify-center shadow-md shrink-0">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mt-1.5 leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-[#FFFCE6]">
        <div className="container-custom">
          <div className="text-center mb-14 lg:mb-16">
            <SectionEyebrow tone="wu">Global reach</SectionEyebrow>
            <SectionHeading
              align="center"
              title="Why Western Union with Lotus FX"
              subtitle="A trusted global network, with local branch support when you send."
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
                tone="wu"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-neutral-950">
        <div className="container-custom">
          <div className="text-center mb-12 lg:mb-14">
            <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-[#FFE600] mb-3">
              FAQs
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Western Union questions
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
                <details className="group bg-neutral-900 rounded-xl border border-neutral-800 p-6 hover:border-[#FFE600]/40 transition-colors">
                  <summary className="font-semibold text-white text-lg cursor-pointer list-none flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span
                      className="text-[#FFE600] shrink-0 transition group-open:rotate-45 text-2xl leading-none"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-neutral-300 leading-relaxed">{faq.answer}</p>
                </details>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
