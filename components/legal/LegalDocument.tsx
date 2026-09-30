import Link from 'next/link'
import type { ReactNode } from 'react'

type LegalDocumentProps = {
  title: string
  subtitle?: string
  lastUpdated?: string
  children: ReactNode
}

export default function LegalDocument({ title, subtitle, lastUpdated, children }: LegalDocumentProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header — same open feel as About Us content sections */}
      <section className="pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 bg-gradient-to-b from-primary-50/40 via-white to-white">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-4">
              Legal
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-gray-900 tracking-tight !leading-[1.2] mb-6">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-lg sm:text-xl text-gray-600 !leading-[1.75] max-w-2xl">
                {subtitle}
              </p>
            ) : null}
            {lastUpdated ? (
              <p className="mt-6 text-sm text-gray-500">Last updated: {lastUpdated}</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* Body — open site-wide layout, no boxed card */}
      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container-custom">
          <article
            className="
              max-w-3xl
              legal-content
              space-y-12 sm:space-y-14
              text-gray-700 text-base sm:text-lg !leading-[1.75]
              [&_section]:space-y-4
              [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900
              [&_h2]:tracking-tight [&_h2]:!leading-[1.35] [&_h2]:pb-[0.15em] [&_h2]:mb-2
              [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900
              [&_h3]:!leading-[1.4] [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-0
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:my-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3.5 [&_ol]:my-2
              [&_li]:!leading-[1.75]
              [&_a]:text-primary-700 [&_a]:font-semibold hover:[&_a]:text-primary-900
              [&_strong]:text-gray-900 [&_strong]:font-semibold
            "
          >
            {children}
          </article>

          <footer className="max-w-3xl mt-14 sm:mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-base text-gray-600">
            <p className="!leading-[1.75] mb-0">
              Questions?{' '}
              <Link href="/contact" className="text-primary-700 font-semibold hover:text-primary-900">
                Contact us
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm sm:text-base">
              <Link href="/privacy" className="text-primary-700 font-semibold hover:text-primary-900">
                Privacy
              </Link>
              <Link href="/terms" className="text-primary-700 font-semibold hover:text-primary-900">
                Terms
              </Link>
              <Link href="/complaints" className="text-primary-700 font-semibold hover:text-primary-900">
                Complaints
              </Link>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}
