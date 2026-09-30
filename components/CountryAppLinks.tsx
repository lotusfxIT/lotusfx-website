'use client'

import { useCountry } from '@/context/CountryContext'
import { getCountryPortalLinks } from '@/lib/country-portals'

type Variant = 'buttons' | 'inline' | 'dark'

/**
 * Country-aware App Store + Google Play links.
 * Renders nothing for Fiji (no app options).
 */
export default function CountryAppLinks({
  variant = 'buttons',
  className = '',
  appStoreClassName,
  playStoreClassName,
}: {
  variant?: Variant
  className?: string
  appStoreClassName?: string
  playStoreClassName?: string
}) {
  const { selectedCountry } = useCountry()
  const links = getCountryPortalLinks(selectedCountry)

  if (!links.showApps || !links.appStore || !links.playStore) return null

  if (variant === 'inline') {
    return (
      <span className={className}>
        <a
          href={links.appStore}
          target="_blank"
          rel="noopener noreferrer"
          className={appStoreClassName || 'font-semibold text-primary-700 hover:text-primary-800'}
        >
          App Store
        </a>
        <span className="text-gray-400 mx-1.5">·</span>
        <a
          href={links.playStore}
          target="_blank"
          rel="noopener noreferrer"
          className={playStoreClassName || 'font-semibold text-primary-700 hover:text-primary-800'}
        >
          Google Play
        </a>
      </span>
    )
  }

  const baseBtn =
    variant === 'dark'
      ? 'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors'
      : 'inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition'

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`.trim()}>
      <a
        href={links.appStore}
        target="_blank"
        rel="noopener noreferrer"
        className={appStoreClassName || baseBtn}
      >
        App Store
      </a>
      <a
        href={links.playStore}
        target="_blank"
        rel="noopener noreferrer"
        className={playStoreClassName || baseBtn}
      >
        Google Play
      </a>
    </div>
  )
}
