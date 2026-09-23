'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCountry } from '@/context/CountryContext'
import FijiBranchRatesCard from '@/components/FijiBranchRatesCard'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

// To country: display name + currency for API
const toCountries = [
  { country: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  { country: 'New Zealand', currency: 'NZD', flag: '🇳🇿' },
  { country: 'Fiji', currency: 'FJD', flag: '🇫🇯' },
  { country: 'United States', currency: 'USD', flag: '🇺🇸' },
  { country: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { country: 'Eurozone', currency: 'EUR', flag: '🇪🇺' },
  { country: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  { country: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { country: 'Switzerland', currency: 'CHF', flag: '🇨🇭' },
  { country: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
]

const transferModes = [
  { value: 'Wire', label: 'Wire Transfer', description: 'To any bank account worldwide' },
  { value: 'eWire', label: 'eWire', description: 'Fast between LotusFX AU/NZ/FJ' },
  { value: 'Wallet', label: 'Wallet', description: 'LotusFX wallet transfer' },
] as const

type TransferMode = 'Wire' | 'eWire' | 'Wallet'

function getBaseCurrency(country: string): string {
  if (country === 'NZ') return 'NZD'
  if (country === 'FJ') return 'FJD'
  return 'AUD'
}

export default function TransferCalculator() {
  const { selectedCountry } = useCountry()
  if (selectedCountry === 'FJ') {
    return <FijiBranchRatesCard variant="transfer" />
  }
  return <TransferCalculatorActive />
}

function TransferCalculatorActive() {
  const { selectedCountry } = useCountry()
  const [sendAmount, setSendAmount] = useState('500')
  const [receiveAmount, setReceiveAmount] = useState('')
  const [toCurrency, setToCurrency] = useState('USD')
  const [transferMode, setTransferMode] = useState<TransferMode>('Wire')
  const [rate, setRate] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Which field the user last edited */
  const amountSideRef = useRef<'send' | 'receive'>('send')
  /** receive = send * conversionRate */
  const conversionRateRef = useRef(0)
  const receiveLookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const baseCurrency = getBaseCurrency(selectedCountry)
  const toCountryOptions = toCountries.filter((c) => c.currency !== baseCurrency)

  const allowEWire = toCurrency === 'NZD' || toCurrency === 'FJD'
  const allowWallet = toCurrency === 'FJD'

  useEffect(() => {
    if (transferMode === 'Wallet' && !allowWallet) {
      setTransferMode('Wire')
    } else if (transferMode === 'eWire' && !allowEWire) {
      setTransferMode('Wire')
    }
  }, [allowEWire, allowWallet, transferMode])

  useEffect(() => {
    const options = toCountries.filter((c) => c.currency !== baseCurrency)
    const valid = options.some((c) => c.currency === toCurrency)
    if (!valid && options.length > 0) {
      setToCurrency(options[0].currency)
    }
  }, [baseCurrency, toCurrency])

  const calculateTransfer = useCallback(
    async (sendOverride?: number) => {
      const send = sendOverride != null ? sendOverride : parseFloat(sendAmount)
      if (!sendAmount && sendOverride == null) {
        setReceiveAmount('')
        setRate(0)
        return
      }
      if (isNaN(send) || send <= 0) {
        setReceiveAmount('')
        setRate(0)
        return
      }

      setIsCalculating(true)
      setError(null)

      try {
        const response = await fetch('/api/exchange-rate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromCcy: baseCurrency,
            toCcy: toCurrency,
            toAmount: send,
            country: selectedCountry,
            transferMode,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to fetch rate' }))
          throw new Error(errorData.error || errorData.details || 'Failed to fetch exchange rate')
        }

        const result = await response.json()
        if (result.success && result.rate != null) {
          const rateNumber = Number(result.rate)
          const inverse =
            result.inverse != null ? Number(result.inverse) : rateNumber > 0 ? 1 / rateNumber : 0
          // Prefer inverse for "1 base = X foreign" display & receive = send * inverse
          const receiveRate = inverse > 0 ? inverse : rateNumber
          conversionRateRef.current = receiveRate
          const converted = result.toAmount != null ? Number(result.toAmount) : send * receiveRate
          setReceiveAmount(Number(converted).toFixed(2))
          setRate(receiveRate)
          setError(null)
        } else {
          throw new Error(result.error || result.details || 'Invalid response')
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to calculate'
        setError(msg)
        setReceiveAmount('')
        setRate(0)
      } finally {
        setIsCalculating(false)
      }
    },
    [sendAmount, toCurrency, transferMode, selectedCountry, baseCurrency]
  )

  useEffect(() => {
    if (amountSideRef.current === 'receive') return
    void calculateTransfer()
  }, [calculateTransfer])

  useEffect(() => {
    return () => {
      if (receiveLookupTimer.current) clearTimeout(receiveLookupTimer.current)
    }
  }, [])

  const onSendChange = (value: string) => {
    amountSideRef.current = 'send'
    setSendAmount(value)
  }

  const onReceiveChange = (value: string) => {
    amountSideRef.current = 'receive'
    setReceiveAmount(value)

    if (receiveLookupTimer.current) clearTimeout(receiveLookupTimer.current)
    receiveLookupTimer.current = setTimeout(() => {
      const receive = parseFloat(value)
      const conv = conversionRateRef.current
      if (!value || isNaN(receive) || receive <= 0) {
        setSendAmount('')
        return
      }
      if (conv <= 0) {
        amountSideRef.current = 'send'
        setSendAmount('500')
        return
      }
      const send = receive / conv
      amountSideRef.current = 'send'
      setSendAmount(send.toFixed(2))
    }, 400)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">You send</label>
        <div className="flex gap-2">
          <div className="w-24 shrink-0 flex items-center justify-center px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-gray-800">
            {baseCurrency}
          </div>
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              step="0.01"
              inputMode="decimal"
              value={sendAmount}
              onChange={(e) => onSendChange(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold"
            />
            <PencilSquareIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recipient gets</label>
        <div className="flex gap-2">
          <div className="w-24 shrink-0 flex items-center justify-center px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-gray-800">
            {toCurrency}
          </div>
          <div className="relative flex-1">
            <input
              type="number"
              min="1"
              step="0.01"
              inputMode="decimal"
              value={isCalculating ? '' : receiveAmount}
              onChange={(e) => onReceiveChange(e.target.value)}
              placeholder={isCalculating ? '…' : 'Enter amount'}
              className="w-full px-4 py-3 pr-10 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-semibold"
            />
            <PencilSquareIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden />
          </div>
        </div>
        {rate > 0 && !isCalculating && (
          <p className="mt-1 text-xs text-gray-500">
            1 {baseCurrency} = {rate.toFixed(4)} {toCurrency}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">To country</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {toCountryOptions.map((c) => (
            <option key={c.currency} value={c.currency}>
              {c.flag} {c.country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Mode</label>
        <div className="space-y-2">
          {transferModes.map((mode) => {
            const isVisible =
              mode.value === 'Wire' ||
              (mode.value === 'eWire' && allowEWire) ||
              (mode.value === 'Wallet' && allowWallet)

            if (!isVisible) return null

            return (
              <label
                key={mode.value}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  transferMode === mode.value ? 'border-primary-500 bg-primary-50/40' : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="transferMode"
                  value={mode.value}
                  checked={transferMode === mode.value}
                  onChange={() => setTransferMode(mode.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="font-medium text-gray-900">{mode.label}</span>
                  <p className="text-xs text-gray-500">{mode.description}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      <button type="button" onClick={() => calculateTransfer()} className="w-full btn-primary py-3">
        Update Quote
      </button>
    </div>
  )
}
