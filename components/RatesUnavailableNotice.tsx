'use client'

import Link from 'next/link'
import { RATES_UNAVAILABLE_MESSAGE, RATES_UNAVAILABLE_TITLE } from '@/lib/service-availability'

type RatesUnavailableNoticeProps = {
  message?: string
  onRetry?: () => void
}

export default function RatesUnavailableNotice({
  message = RATES_UNAVAILABLE_MESSAGE,
  onRetry,
}: RatesUnavailableNoticeProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center text-center rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-8 sm:px-8 sm:py-10"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 mb-4">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </span>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-800 mb-2">
        {RATES_UNAVAILABLE_TITLE}
      </p>
      <p className="text-gray-700 !leading-relaxed max-w-md">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition"
          >
            Try again
          </button>
        ) : null}
        <Link
          href="/locations"
          className="inline-flex items-center rounded-lg border-2 border-primary-600 px-5 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 transition"
        >
          Find a branch
        </Link>
      </div>
    </div>
  )
}
