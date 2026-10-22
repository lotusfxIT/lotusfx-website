'use client'

import Link from 'next/link'
import { useCountry } from '@/context/CountryContext'
import { getCountryPortalLinks } from '@/lib/country-portals'

/** Hero CTAs for MoneyGram — country-aware app links; Fiji shows branch only. */
export function MoneygramHeroCtas({
  primaryClass,
  secondaryClass,
}: {
  primaryClass: string
  secondaryClass: string
}) {
  const { selectedCountry } = useCountry()
  const portal = getCountryPortalLinks(selectedCountry)

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-7 sm:mt-8">
      {portal.showLogin && portal.web ? (
        <a href={portal.web} target="_blank" rel="noopener noreferrer" className={primaryClass}>
          Send on the website
        </a>
      ) : null}
      {portal.showApps && portal.appStore ? (
        <a href={portal.appStore} target="_blank" rel="noopener noreferrer" className={primaryClass}>
          App Store
        </a>
      ) : null}
      {portal.showApps && portal.playStore ? (
        <a href={portal.playStore} target="_blank" rel="noopener noreferrer" className={primaryClass}>
          Google Play
        </a>
      ) : null}
      <Link href="/locations" className={secondaryClass}>
        Find a branch
      </Link>
    </div>
  )
}

export function MoneygramAppFooterNote({ linkClass }: { linkClass: string }) {
  const { selectedCountry } = useCountry()
  const portal = getCountryPortalLinks(selectedCountry)
  if (!portal.showApps || !portal.appStore || !portal.playStore) return null

  return (
    <p className="text-center text-sm text-gray-500 mt-6">
      Download on{' '}
      <a href={portal.appStore} target="_blank" rel="noopener noreferrer" className={linkClass}>
        App Store
      </a>
      {' · '}
      <a href={portal.playStore} target="_blank" rel="noopener noreferrer" className={linkClass}>
        Google Play
      </a>
      .
    </p>
  )
}

export function MoneygramWebSendCta({
  className,
  label = 'Send on the website',
}: {
  className: string
  label?: string
}) {
  const { selectedCountry } = useCountry()
  const portal = getCountryPortalLinks(selectedCountry)
  if (!portal.showLogin || !portal.web) {
    return (
      <Link href="/locations" className={className}>
        Find a branch
      </Link>
    )
  }
  return (
    <a href={portal.web} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  )
}

export function MoneygramAppSendCta({
  className,
}: {
  className: string
  label?: string
}) {
  const { selectedCountry } = useCountry()
  const portal = getCountryPortalLinks(selectedCountry)
  if (!portal.showApps || (!portal.appStore && !portal.playStore)) {
    return (
      <Link href="/locations" className={className}>
        Find a branch
      </Link>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      {portal.appStore ? (
        <a href={portal.appStore} target="_blank" rel="noopener noreferrer" className={className}>
          App Store
        </a>
      ) : null}
      {portal.playStore ? (
        <a href={portal.playStore} target="_blank" rel="noopener noreferrer" className={className}>
          Google Play
        </a>
      ) : null}
    </div>
  )
}
