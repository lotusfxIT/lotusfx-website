'use client'

import { useCountry } from '@/context/CountryContext'
import TransferCalculator from '@/components/TransferCalculator'
import FijiBranchRatesCard from '@/components/FijiBranchRatesCard'

/** Money transfer page side panel — calculator or Fiji branch message. */
export default function TransferCalculatorSection() {
  const { selectedCountry } = useCountry()

  if (selectedCountry === 'FJ') {
    return <FijiBranchRatesCard variant="transfer" />
  }

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Transfer calculator</h2>
      <p className="text-gray-600 text-sm text-center mb-4">
        See how much your recipient will receive
      </p>
      <TransferCalculator />
    </>
  )
}
