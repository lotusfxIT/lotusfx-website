'use client'

import Link from 'next/link'
import {
  MapPinIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { STATS } from '@/config/stats'

type FijiBranchRatesCardProps = {
  /** cash = FX quote gap; transfer = money transfer calculator gap */
  variant?: 'cash' | 'transfer'
  className?: string
}

export default function FijiBranchRatesCard({
  variant = 'cash',
  className = '',
}: FijiBranchRatesCardProps) {
  const isTransfer = variant === 'transfer'

  return (
    <div
      className={`flex flex-col justify-center h-full min-h-[20rem] w-full text-center px-2 sm:px-4 py-6 ${className}`}
    >
      <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-5">
        <BuildingStorefrontIcon className="h-7 w-7" />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600 mb-2">
        Fiji rates in branch
      </p>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-3">
        {isTransfer ? 'Visit us to send money' : "Visit a branch for today's rates"}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto leading-relaxed mb-6">
        {isTransfer
          ? 'Online transfer quotes aren’t available for Fiji yet. Our team can help you send money with clear rates and local support at a Lotus FX branch.'
          : 'Online exchange quotes aren’t available for Fiji yet. Pop into a Lotus FX branch for live rates, no commission fees, and friendly help sorting your travel money.'}
      </p>

      <ul className="text-left max-w-sm mx-auto space-y-3 mb-8">
        <li className="flex gap-3 text-sm text-gray-700">
          <MapPinIcon className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
          <span>Branches across Fiji</span>
        </li>
        <li className="flex gap-3 text-sm text-gray-700">
          <ClockIcon className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
          <span>{STATS.businessHours.fiji}</span>
        </li>
        <li className="flex gap-3 text-sm text-gray-700">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
          <span>
            Questions?{' '}
            <a
              href={`mailto:${STATS.emails.fiji}`}
              className="font-semibold text-primary-700 hover:text-primary-800 break-all"
            >
              {STATS.emails.fiji}
            </a>
          </span>
        </li>
      </ul>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/locations" className="btn-primary inline-flex items-center justify-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          Find a Fiji branch
        </Link>
        <Link href="/contact" className="btn-secondary inline-flex items-center justify-center">
          Contact us
        </Link>
      </div>
    </div>
  )
}
