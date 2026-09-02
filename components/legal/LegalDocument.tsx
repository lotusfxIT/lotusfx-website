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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-white pt-28 pb-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary-600 mb-4">
              <span className="h-px w-8 bg-primary-500" aria-hidden />
              LotusFX
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-primary-500 pl-5">
                {subtitle}
              </p>
            ) : null}
            {lastUpdated ? <p className="mt-4 text-sm text-gray-500">Last updated: {lastUpdated}</p> : null}
          </header>

          <article className="legal-content space-y-8 text-gray-700 leading-relaxed">{children}</article>

          <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
            <p>
              Questions?{' '}
              <Link href="/contact" className="text-primary-700 font-semibold hover:text-primary-900">
                Contact us
              </Link>{' '}
              or email{' '}
              <a href="mailto:aucustomercare@lotusfx.com" className="text-primary-700 font-semibold hover:text-primary-900">
                aucustomercare@lotusfx.com
              </a>
              .
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
