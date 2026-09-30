import { ReactNode } from 'react'
import Link from 'next/link'
import MotionWrapper from '@/components/MotionWrapper'

export type PartnerTone = 'lotus' | 'wu' | 'mg' | 'cp'

const toneStyles = {
  lotus: {
    eyebrow: 'text-primary-600',
    line: 'bg-primary-500',
    cardBorder: 'border-primary-100 hover:border-primary-300',
    iconBg: 'bg-gradient-to-br from-primary-600 to-primary-700 text-white',
    link: 'text-primary-600 hover:text-primary-700',
    number: 'text-primary-600/90',
    accentBorder: 'border-l-primary-500',
  },
  wu: {
    eyebrow: 'text-neutral-900',
    line: 'bg-black',
    cardBorder: 'border-yellow-200 hover:border-[#FFE600]',
    iconBg: 'bg-black text-[#FFE600]',
    link: 'text-neutral-900 hover:text-black',
    number: 'text-black',
    accentBorder: 'border-l-[#FFE600]',
  },
  mg: {
    eyebrow: 'text-[#E21B24]',
    line: 'bg-[#E21B24]',
    cardBorder: 'border-red-100 hover:border-[#E21B24]/40',
    iconBg: 'bg-[#E21B24] text-white',
    link: 'text-[#E21B24] hover:text-red-700',
    number: 'text-[#E21B24]',
    accentBorder: 'border-l-[#E21B24]',
  },
  cp: {
    eyebrow: 'text-[#3860BE]',
    line: 'bg-[#3860BE]',
    cardBorder: 'border-[#E8E2DA] hover:border-[#3860BE]/40',
    iconBg: 'bg-[#141413] text-white',
    link: 'text-[#3860BE] hover:text-[#2d4d99]',
    number: 'text-[#141413]',
    accentBorder: 'border-l-[#3860BE]',
  },
} as const

export function SectionEyebrow({
  children,
  tone = 'lotus',
}: {
  children: ReactNode
  tone?: PartnerTone
}) {
  const t = toneStyles[tone]
  return (
    <span
      className={`block text-sm font-semibold uppercase tracking-[0.18em] ${t.eyebrow} mb-3`}
    >
      {children}
    </span>
  )
}

export function SectionHeading({
  title,
  subtitle,
  align = 'left',
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'text-center max-w-5xl mx-auto px-1' : 'max-w-4xl'}>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight !leading-[1.35] pb-[0.15em]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-600 !leading-[1.75] max-w-4xl mx-auto text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  )
}

export function LeadParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={
            i === 0
              ? 'text-lg lg:text-xl text-gray-700 leading-relaxed border-l-4 border-primary-500 pl-5'
              : 'text-base lg:text-lg text-gray-600 leading-relaxed'
          }
        >
          {p}
        </p>
      ))}
    </div>
  )
}

export function IconFeatureCard({
  icon,
  title,
  description,
  href,
  linkLabel,
  delay = 0,
  tone = 'lotus',
}: {
  icon: ReactNode
  title: string
  description: string
  href?: string
  linkLabel?: string
  delay?: number
  tone?: PartnerTone
}) {
  const t = toneStyles[tone]
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div
        className={`mobile-safe-card h-full flex flex-col bg-white rounded-2xl border p-7 shadow-soft hover:shadow-lg transition-all duration-300 ${t.cardBorder}`}
      >
        <div
          className={`w-12 h-12 rounded-xl ${t.iconBg} flex items-center justify-center mb-5 shadow-md`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{description}</p>
        {href && linkLabel && (
          <Link
            href={href}
            className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${t.link}`}
          >
            {linkLabel}
          </Link>
        )}
      </div>
    </MotionWrapper>
  )
}

export function SplitBand({
  eyebrow,
  title,
  paragraphs,
  ctas,
  accent,
  reverse = false,
  tone = 'light',
}: {
  eyebrow: string
  title: string
  paragraphs: string[]
  ctas?: ReactNode
  accent: ReactNode
  reverse?: boolean
  tone?: 'light' | 'soft'
}) {
  return (
    <section
      className={`section-padding overflow-hidden ${
        tone === 'soft' ? 'bg-gradient-to-b from-primary-50/50 via-white to-white' : 'bg-white'
      }`}
    >
      <div className="container-custom">
        <div
          className={`grid lg:grid-cols-2 gap-7 sm:gap-10 lg:gap-16 items-stretch ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          <MotionWrapper
            initial={{ opacity: 0, x: reverse ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-full flex flex-col justify-center"
          >
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2 className="text-[2rem] sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-5 sm:mb-6">
              {title}
            </h2>
            <LeadParagraphs paragraphs={paragraphs} />
            {ctas && <div className="mt-8 flex flex-col sm:flex-row gap-4">{ctas}</div>}
          </MotionWrapper>

          <MotionWrapper
            initial={{ opacity: 0, x: reverse ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="h-full min-h-0"
          >
            {accent}
          </MotionWrapper>
        </div>
      </div>
    </section>
  )
}

export function AccentPanel({
  title,
  items,
  variant = 'lotus',
}: {
  title: string
  items: { label: string; detail: string }[]
  variant?: 'lotus' | 'gold' | 'crimson' | 'navy'
}) {
  const gradients = {
    lotus: 'from-primary-600 to-primary-800',
    gold: 'from-black via-neutral-950 to-black',
    crimson: 'from-[#E21B24] via-[#c41620] to-[#8b0f16]',
    navy: 'from-[#141413] via-[#1a1a19] to-[#0c0c0b]',
  } as const
  const dot = {
    lotus: 'bg-white',
    gold: 'bg-[#FFE600]',
    crimson: 'bg-white',
    navy: 'bg-[#3860BE]',
  } as const
  const glow = {
    gold: 'radial-gradient(circle at 80% 20%, rgba(255,230,0,0.35), transparent 45%)',
    crimson: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15), transparent 45%)',
    navy: 'radial-gradient(circle at 75% 20%, rgba(56,96,190,0.35), transparent 45%)',
  } as const

  return (
    <div
      className={`relative h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br ${gradients[variant]} p-6 sm:p-7 lg:p-8 text-white shadow-strong overflow-hidden flex flex-col min-w-0 w-full max-w-full`}
    >
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full border border-white/15 pointer-events-none" aria-hidden />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full border border-white/10 pointer-events-none" aria-hidden />
      {variant !== 'lotus' && (
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ backgroundImage: glow[variant] }}
          aria-hidden
        />
      )}
      {variant === 'gold' && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFE600]" aria-hidden />
      )}
      <p className="relative text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-white/75 mb-5 sm:mb-6 shrink-0">
        {title}
      </p>
      <ul className="relative min-w-0 flex-1 flex flex-col justify-center gap-5 sm:gap-6">
        {items.map((item) => (
          <li key={item.label} className="flex gap-3 min-w-0">
            <span className={`mt-2 h-2 w-2 rounded-full ${dot[variant]} shrink-0`} aria-hidden />
            <div className="min-w-0">
              <p className="font-bold text-base sm:text-lg leading-snug break-words">{item.label}</p>
              <p className="text-white/85 text-sm sm:text-[0.95rem] mt-1 leading-relaxed break-words">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StepCard({
  number,
  title,
  description,
  delay = 0,
  tone = 'lotus',
}: {
  number: string
  title: string
  description: string
  delay?: number
  tone?: PartnerTone
}) {
  const t = toneStyles[tone]
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div
        className={`mobile-safe-card h-full rounded-2xl border bg-white p-6 shadow-soft hover:shadow-lg transition-all duration-300 ${t.cardBorder}`}
      >
        <div className={`text-3xl font-black mb-4 tabular-nums tracking-tight ${t.number}`}>
          {number}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </MotionWrapper>
  )
}

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-xl border border-gray-200 border-l-4 border-l-primary-500 bg-white shadow-soft">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}
