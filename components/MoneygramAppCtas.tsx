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
    <div className="flex flex-col sm:flex-row gap-3 mt-7 sm:mt-8">
      {portal.showApps && portal.playStore ? (
        <a href={portal.playStore} target="_blank" rel="noopener noreferrer" className={primaryClass}>
          Google Play
        </a>
      ) : null}
      {portal.showApps && portal.appStore ? (
        <a href={portal.appStore} target="_blank" rel="noopener noreferrer" className={primaryClass}>
          App Store
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

export function MoneygramAppSendCta({
  className,
  label = 'Get the app',
}: {
  className: string
  label?: string
}) {
  const { selectedCountry } = useCountry()
  const portal = getCountryPortalLinks(selectedCountry)
  if (!portal.showApps || !portal.playStore) {
    return (
      <Link href="/locations" className={className}>
        Find a branch
      </Link>
    )
  }
  return (
    <a href={portal.playStore} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  )
}
