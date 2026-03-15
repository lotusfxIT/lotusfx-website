'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCountry } from '@/context/CountryContext'

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
  const [amount, setAmount] = useState('500')
  const [toCurrency, setToCurrency] = useState('USD')
  const [transferMode, setTransferMode] = useState<TransferMode>('Wire')
  const [mode, setMode] = useState<'send' | 'receive'>('send')
  const [receivedAmount, setReceivedAmount] = useState<string>('')
  const [rate, setRate] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // When base country changes, if current "to" is same as base, pick first available country
  useEffect(() => {
    const options = toCountries.filter((c) => c.currency !== baseCurrency)
    const valid = options.some((c) => c.currency === toCurrency)
    if (!valid && options.length > 0) {
      setToCurrency(options[0].currency)
    }
  }, [baseCurrency, toCurrency])

  const calculateTransfer = useCallback(async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setReceivedAmount('')
      setRate(0)
      return
    }

    setIsCalculating(true)
    setError(null)
    const inputAmount = parseFloat(amount)

    try {
      // For "send" mode, we quote based on how much the customer sends.
      // For "receive" mode, we quote based on how much the recipient should receive,
      // so we request a 1-unit quote and use the rate to work backwards.
      const apiToAmount = mode === 'send' ? inputAmount : 1

      const response = await fetch('/api/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCcy: baseCurrency,
          toCcy: toCurrency,
          toAmount: apiToAmount,
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

        if (mode === 'send') {
          const converted = result.toAmount ?? inputAmount * rateNumber
          setReceivedAmount(Number(converted).toFixed(2))
        } else {
          // mode === 'receive': inputAmount is what the recipient should get (toCurrency)
          // We calculate how much the customer will pay in baseCurrency.
          const sendAmount = rateNumber > 0 ? inputAmount / rateNumber : 0
          setReceivedAmount(Number(sendAmount).toFixed(2))
        }

        setRate(Number(result.rate))
        setError(null)
      } else {
        throw new Error(result.error || result.details || 'Invalid response')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to calculate'
      setError(msg)
      setReceivedAmount('')
      setRate(0)
    } finally {
      setIsCalculating(false)
    }
  }, [amount, toCurrency, transferMode, selectedCountry, baseCurrency, mode])

  useEffect(() => {
    calculateTransfer()
  }, [calculateTransfer])

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-1">
        <button
          type="button"
          onClick={() => setMode('send')}
          className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg border ${
            mode === 'send'
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          Send amount
        </button>
        <button
          type="button"
          onClick={() => setMode('receive')}
          className={`flex-1 text-sm font-medium px-3 py-2 rounded-lg border ${
            mode === 'receive'
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          Receive amount
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === 'send' ? 'Send Amount' : 'Recipient Receives'}
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          {mode === 'send'
            ? `${baseCurrency} (base currency for your region)`
            : `${toCurrency} amount your recipient should receive`}
        </p>
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
                  transferMode === mode.value
                    ? 'border-primary-500 bg-primary-50/50'
                    : 'border-gray-200'
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

      <div className="pt-2">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">
            {mode === 'send' ? 'Recipient will receive (approx.)' : 'You will pay (approx.)'}
          </p>
          {isCalculating ? (
            <p className="text-xl font-bold text-primary-600">Calculating…</p>
          ) : receivedAmount ? (
            <p className="text-xl font-bold text-primary-600">
              {receivedAmount} {mode === 'send' ? toCurrency : baseCurrency}
            </p>
          ) : (
            <p className="text-lg text-gray-500">Enter amount and select country</p>
          )}
          {rate > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              1 {baseCurrency} = {rate.toFixed(4)} {toCurrency}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      <button
        type="button"
        onClick={calculateTransfer}
        className="w-full btn-primary py-3"
      >
        Update Quote
      </button>
    </div>
  )
}
