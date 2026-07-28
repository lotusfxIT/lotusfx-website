import { ReactNode } from 'react'
import Link from 'next/link'
import MotionWrapper from '@/components/MotionWrapper'

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
      <span className="h-px w-8 bg-primary-500" aria-hidden />
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
    <div className={align === 'center' ? 'text-center max-w-3xl mx-auto' : 'max-w-3xl'}>
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

export function LeadParagraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-5">
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
}: {
  icon: ReactNode
  title: string
  description: string
  href?: string
  linkLabel?: string
  delay?: number
}) {
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="h-full flex flex-col bg-white rounded-2xl border border-primary-100 p-7 shadow-soft hover:shadow-lg hover:border-primary-300 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center mb-5 shadow-md">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{description}</p>
        {href && linkLabel && (
          <Link
            href={href}
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            {linkLabel}
            <span aria-hidden>→</span>
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
          className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          <MotionWrapper
            initial={{ opacity: 0, x: reverse ? 24 : -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
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
}: {
  title: string
  items: { label: string; detail: string }[]
}) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 lg:p-10 text-white shadow-strong overflow-hidden min-h-[320px] flex flex-col justify-center">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/20" aria-hidden />
      <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full border border-white/15" aria-hidden />
      <p className="relative text-sm font-semibold uppercase tracking-widest text-white/80 mb-6">
        {title}
      </p>
      <ul className="relative space-y-5">
        {items.map((item) => (
          <li key={item.label} className="flex gap-4">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-white shrink-0" aria-hidden />
            <div>
              <p className="font-bold text-lg leading-snug">{item.label}</p>
              <p className="text-white/85 text-sm mt-1 leading-relaxed">{item.detail}</p>
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
}: {
  number: string
  title: string
  description: string
  delay?: number
}) {
  return (
    <MotionWrapper
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="h-full"
    >
      <div className="h-full rounded-2xl border border-primary-100 bg-white p-6 shadow-soft hover:shadow-lg hover:border-primary-300 transition-all duration-300">
        <div className="text-3xl font-black text-primary-600/90 mb-4 tabular-nums tracking-tight">
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
