'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCountry } from '@/context/CountryContext'
import FijiBranchRatesCard from '@/components/FijiBranchRatesCard'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { getTransferDestinations, getTransferModeFlags } from '@/lib/transfer-destinations'

const transferModes = [
  { value: 'Wire', label: 'Wire Transfer', description: 'To any bank account worldwide' },
  { value: 'eWire', label: 'eWire', description: 'Fast between LotusFX AU/NZ/FJ' },
  { value: 'Moneygram', label: 'Moneygram', description: 'Send via Moneygram' },
  { value: 'Western Union', label: 'Western Union', description: 'Send via Western Union' },
  { value: 'Wallet', label: 'Wallet', description: 'LotusFX wallet transfer' },
] as const

type TransferMode = 'Wire' | 'eWire' | 'Moneygram' | 'Western Union' | 'Wallet'

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
  const [toCountryCode, setToCountryCode] = useState('us')
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
  const toCountryOptions = getTransferDestinations(selectedCountry)
  const { allowEWire, allowWire, allowMoneygram, allowWesternUnion, allowWallet } =
    getTransferModeFlags(selectedCountry, toCountryCode)

  useEffect(() => {
    const invalid =
      (transferMode === 'Wallet' && !allowWallet) ||
      (transferMode === 'eWire' && !allowEWire) ||
      (transferMode === 'Wire' && !allowWire) ||
      (transferMode === 'Moneygram' && !allowMoneygram) ||
      (transferMode === 'Western Union' && !allowWesternUnion)
    if (!invalid) return
    if (allowEWire) setTransferMode('eWire')
    else if (allowWire) setTransferMode('Wire')
    else if (allowMoneygram) setTransferMode('Moneygram')
    else if (allowWesternUnion) setTransferMode('Western Union')
    else if (allowWallet) setTransferMode('Wallet')
  }, [
    allowEWire,
    allowWallet,
    allowWire,
    allowMoneygram,
    allowWesternUnion,
    transferMode,
  ])

  useEffect(() => {
    const options = getTransferDestinations(selectedCountry)
    const current = options.find((c) => c.countryCode === toCountryCode)
    if (current) {
      if (current.currency !== toCurrency) setToCurrency(current.currency)
      return
    }
    const byCurrency = options.find((c) => c.currency === toCurrency)
    const next = byCurrency || options[0]
    if (!next) return
    setToCountryCode(next.countryCode)
    setToCurrency(next.currency)
  }, [selectedCountry, toCountryCode, toCurrency])

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
            fromCcy: toCurrency,
            toCcy: baseCurrency,
            toAmount: send,
            country: selectedCountry,
            transferMode,
          }),
        })

        const result = await response.json().catch(() => ({}))
        if (!response.ok || !result.success || result.rate == null) {
          throw new Error('We could not get a live rate just now. Please try again.')
        }

        const rateNumber = Number(result.rate)
        const inverse =
          result.inverse != null ? Number(result.inverse) : rateNumber > 0 ? 1 / rateNumber : 0
        const receiveRate = inverse > 0 ? inverse : rateNumber
        conversionRateRef.current = receiveRate
        const converted = send * receiveRate
        setReceiveAmount(Number(converted).toFixed(2))
        setRate(receiveRate)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'We could not get a live rate just now. Please try again.')
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
          value={toCountryCode}
          onChange={(e) => {
            const dest = toCountryOptions.find((c) => c.countryCode === e.target.value)
            if (!dest) return
            setToCountryCode(dest.countryCode)
            setToCurrency(dest.currency)
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {toCountryOptions.map((c) => (
            <option key={c.countryCode} value={c.countryCode}>
              {c.country} ({c.currency})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Mode</label>
        <div className="space-y-2">
          {transferModes.map((mode) => {
            const isVisible =
              (mode.value === 'Wire' && allowWire) ||
              (mode.value === 'eWire' && allowEWire) ||
              (mode.value === 'Moneygram' && allowMoneygram) ||
              (mode.value === 'Western Union' && allowWesternUnion) ||
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <button type="button" onClick={() => calculateTransfer()} className="w-full btn-primary py-3">
        Update Quote
      </button>
    </div>
  )
}
