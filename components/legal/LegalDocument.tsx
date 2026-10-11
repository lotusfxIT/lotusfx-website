import Link from 'next/link'
import type { ReactNode } from 'react'
import LegalToc from '@/components/legal/LegalToc'
import { LEGAL_REGIONS, type LegalRegionCode } from '@/lib/legal-regions'

type LegalDocumentProps = {
  title: string
  subtitle?: string
  lastUpdated?: string
  /** Shows the country version switcher, linking to `${basePath}/au` etc. */
  regions?: { basePath: string; current: LegalRegionCode }
  children: ReactNode
}

export default function LegalDocument({ title, subtitle, lastUpdated, regions, children }: LegalDocumentProps) {
  const currentRegion = regions ? LEGAL_REGIONS.find((r) => r.code === regions.current) : undefined

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-x-clip bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-14 lg:pb-16 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" aria-hidden />
        <div className="pointer-events-none absolute right-40 bottom-0 h-40 w-40 translate-y-1/2 rounded-full bg-white/5" aria-hidden />
        <div className="container-custom relative">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70 mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight !leading-[1.2] mb-5">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-base sm:text-lg text-white/85 !leading-[1.75] max-w-4xl">{subtitle}</p>
          ) : null}

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            {lastUpdated ? (
              <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/90 ring-1 ring-white/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Last updated {lastUpdated}
              </p>
            ) : null}

            {regions ? (
              <div className="flex flex-col gap-2 sm:items-end">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  Country version
                </p>
                <div className="flex flex-wrap gap-2" role="list">
                  {LEGAL_REGIONS.map((region) => {
                    const isCurrent = region.code === regions.current
                    return (
                      <Link
                        key={region.code}
                        role="listitem"
                        href={`${regions.basePath}/${region.code}`}
                        aria-current={isCurrent ? 'page' : undefined}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                          isCurrent
                            ? 'bg-white text-primary-700 shadow-lg'
                            : 'bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://flagcdn.com/${region.code}.svg`}
                          alt=""
                          className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-black/10"
                          loading="lazy"
                        />
                        {region.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container-custom grid gap-0 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[17rem_minmax(0,1fr)] xl:gap-16">
          <aside className="min-w-0">
            <LegalToc />
          </aside>

          <div className="min-w-0">
            {currentRegion ? (
              <p className="mb-10 flex items-start gap-3 rounded-xl border border-primary-100 bg-primary-50/60 px-4 py-3 text-sm sm:text-base text-gray-700 !leading-relaxed">
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  You are reading the <strong className="text-gray-900">{currentRegion.adjective}</strong> version.
                  Use the country buttons above to view another country.
                </span>
              </p>
            ) : null}

            <article
              data-legal-article
              className="
                max-w-3xl
                legal-content
                text-gray-700 text-base sm:text-lg !leading-[1.75]
                [&>section]:space-y-4
                [&>section+section]:mt-12 [&>section+section]:border-t [&>section+section]:border-gray-100 [&>section+section]:pt-12
                [&_h2]:scroll-mt-28 [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-gray-900
                [&_h2]:tracking-tight [&_h2]:!leading-[1.35] [&_h2]:pb-[0.15em] [&_h2]:mb-2
                [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900
                [&_h3]:!leading-[1.4] [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:mb-0
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:my-2 [&_ul]:marker:text-primary-500
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-3.5 [&_ol]:my-2 [&_ol]:marker:font-semibold [&_ol]:marker:text-primary-600
                [&_li]:!leading-[1.75] [&_li]:pl-1
                [&_a]:text-primary-700 [&_a]:font-semibold [&_a]:underline-offset-2 hover:[&_a]:underline hover:[&_a]:text-primary-900
                [&_strong]:text-gray-900 [&_strong]:font-semibold
              "
            >
              {children}
            </article>

            <footer className="max-w-3xl mt-14 sm:mt-16 rounded-2xl bg-gray-50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <p className="text-lg font-bold text-gray-900 mb-1">Questions about this page?</p>
                <p className="text-gray-600 !leading-relaxed mb-0">Our customer care team is happy to help.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition"
                >
                  Contact us
                </Link>
                <nav aria-label="Legal pages" className="flex gap-4 text-sm font-semibold">
                  <Link href="/privacy" className="text-primary-700 hover:text-primary-900">Privacy</Link>
                  <Link href="/terms" className="text-primary-700 hover:text-primary-900">Terms</Link>
                  <Link href="/complaints" className="text-primary-700 hover:text-primary-900">Complaints</Link>
                </nav>
              </div>
            </footer>
          </div>
        </div>
      </section>
    </div>
  )
}
