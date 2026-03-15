'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowsRightLeftIcon, ArrowDownTrayIcon, BanknotesIcon, PaperAirplaneIcon, ChevronDownIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useCountry } from '@/context/CountryContext'

// Currency code → ISO country code for flag images (flagcdn.com)
const currencyToCountry: Record<string, string> = {
  AUD: 'au', AED: 'ae', BDT: 'bd', BND: 'bn', CAD: 'ca', CHF: 'ch', CNY: 'cn', DKK: 'dk', EGP: 'eg',
  EUR: 'eu', FJD: 'fj', GBP: 'gb', HKD: 'hk', IDR: 'id', INR: 'in', ISK: 'is', JPY: 'jp', KHR: 'kh',
  KRW: 'kr', LKR: 'lk', MXN: 'mx', MYR: 'my', NOK: 'no', NPR: 'np', NZD: 'nz', PGK: 'pg', PHP: 'ph',
  PKR: 'pk', PLN: 'pl', QAR: 'qa', SAR: 'sa', SEK: 'se', SGD: 'sg', THB: 'th', TOP: 'to', TRY: 'tr',
  TWD: 'tw', USD: 'us', VND: 'vn', VUV: 'vu', WST: 'ws', XPF: 'pf', ZAR: 'za',
}
const FLAG_CDN = 'https://flagcdn.com/w40'

// Currencies customers can buy or sell (Australia list)
const currencies = [
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'BDT', name: 'Bangladeshi Taka' },
  { code: 'BND', name: 'Brunei Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'DKK', name: 'Danish Krone' },
  { code: 'EGP', name: 'Egyptian Pound' },
  { code: 'EUR', name: 'Euro' },
  { code: 'FJD', name: 'Fijian Dollar' },
  { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'HKD', name: 'Hong Kong Dollar' },
  { code: 'IDR', name: 'Indonesian Rupiah' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'ISK', name: 'Icelandic Krona' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'KHR', name: 'Cambodian Riel' },
  { code: 'KRW', name: 'South Korean Won' },
  { code: 'LKR', name: 'Sri Lankan Rupee' },
  { code: 'MXN', name: 'Mexican Peso' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
  { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'NPR', name: 'Nepalese Rupee' },
  { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'PGK', name: 'Papua New Guinean Kina' },
  { code: 'PHP', name: 'Philippine Peso' },
  { code: 'PKR', name: 'Pakistani Rupee' },
  { code: 'PLN', name: 'Polish Zloty' },
  { code: 'QAR', name: 'Qatari Riyal' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'SEK', name: 'Swedish Krona' },
  { code: 'SGD', name: 'Singapore Dollar' },
  { code: 'THB', name: 'Thai Baht' },
  { code: 'TOP', name: 'Tongan Paanga' },
  { code: 'TRY', name: 'Turkish Lira' },
  { code: 'TWD', name: 'New Taiwan Dollar' },
  { code: 'USD', name: 'United States Dollar' },
  { code: 'VND', name: 'Vietnamese Dong' },
  { code: 'VUV', name: 'Vanuatu Vatu' },
  { code: 'WST', name: 'Samoan Tala' },
  { code: 'XPF', name: 'CFP Franc' },
  { code: 'ZAR', name: 'South African Rand' },
]

// Money Transfer: "To country" options (country name → currency for API)
const toCountries = [
  { country: 'Australia', currency: 'AUD', countryCode: 'au' },
  { country: 'New Zealand', currency: 'NZD', countryCode: 'nz' },
  { country: 'Fiji', currency: 'FJD', countryCode: 'fj' },
  { country: 'United States', currency: 'USD', countryCode: 'us' },
  { country: 'United Kingdom', currency: 'GBP', countryCode: 'gb' },
  { country: 'Eurozone', currency: 'EUR', countryCode: 'eu' },
  { country: 'Japan', currency: 'JPY', countryCode: 'jp' },
  { country: 'Canada', currency: 'CAD', countryCode: 'ca' },
  { country: 'Switzerland', currency: 'CHF', countryCode: 'ch' },
  { country: 'Singapore', currency: 'SGD', countryCode: 'sg' },
]

const transferModes = [
  { value: 'Wire', label: 'Wire', description: 'To any bank account worldwide' },
  { value: 'Moneygram', label: 'Moneygram', description: 'Send via Moneygram' },
  { value: 'Western Union', label: 'Western Union', description: 'Send via Western Union' },
  { value: 'eWire', label: 'eWire', description: 'Cash Pickup / Bank transfer' },
  { value: 'Wallet', label: 'Wallet', description: 'LotusFX wallet transfer' },
] as const

type TransferMode = 'Wire' | 'Moneygram' | 'Western Union' | 'eWire' | 'Wallet'

// API only accepts the "base" currency as fromCcy per country. Swap button changes UI only.
function getBaseCurrency(country: string): string {
  if (country === 'NZ') return 'NZD'
  if (country === 'FJ') return 'FJD'
  return 'AUD' // AU and default
}

// Mock exchange rates (in real app, these would come from an API)
const exchangeRates: { [key: string]: { [key: string]: number } } = {
  AUD: { USD: 0.65, EUR: 0.60, GBP: 0.52, NZD: 1.08, JPY: 95.5, CAD: 0.88, CHF: 0.57, SGD: 0.87, FJD: 1.45 },
  USD: { AUD: 1.54, EUR: 0.92, GBP: 0.80, NZD: 1.66, JPY: 147.0, CAD: 1.35, CHF: 0.88, SGD: 1.34, FJD: 2.23 },
  EUR: { AUD: 1.67, USD: 1.09, GBP: 0.87, NZD: 1.80, JPY: 160.0, CAD: 1.47, CHF: 0.96, SGD: 1.46, FJD: 2.42 },
  GBP: { AUD: 1.92, USD: 1.25, EUR: 1.15, NZD: 2.07, JPY: 184.0, CAD: 1.69, CHF: 1.10, SGD: 1.68, FJD: 2.78 },
  NZD: { AUD: 0.93, USD: 0.60, EUR: 0.56, GBP: 0.48, JPY: 88.5, CAD: 0.81, CHF: 0.53, SGD: 0.81, FJD: 1.34 },
  JPY: { AUD: 0.0105, USD: 0.0068, EUR: 0.0063, GBP: 0.0054, NZD: 0.0113, CAD: 0.0092, CHF: 0.0060, SGD: 0.0091, FJD: 0.0151 },
  CAD: { AUD: 1.14, USD: 0.74, EUR: 0.68, GBP: 0.59, NZD: 1.23, JPY: 109.0, CHF: 0.71, SGD: 1.08, FJD: 1.79 },
  CHF: { AUD: 1.75, USD: 1.14, EUR: 1.04, GBP: 0.91, NZD: 1.89, JPY: 167.0, CAD: 1.41, SGD: 1.52, FJD: 2.52 },
  SGD: { AUD: 1.15, USD: 0.75, EUR: 0.68, GBP: 0.59, NZD: 1.24, JPY: 110.0, CAD: 0.93, CHF: 0.66, FJD: 1.80 },
  FJD: { AUD: 0.69, USD: 0.45, EUR: 0.41, GBP: 0.36, NZD: 0.75, JPY: 66.2, CAD: 0.56, CHF: 0.40, SGD: 0.56 },
}

type CurrencyCalculatorProps = {
  onOptionChosen?: () => void
  forceCashOnly?: boolean
}

export default function CurrencyCalculator({ onOptionChosen, forceCashOnly = false }: CurrencyCalculatorProps) {
  const { selectedCountry } = useCountry()
  const [chosen, setChosen] = useState<boolean>(forceCashOnly ? true : false)
  const [quoteType, setQuoteType] = useState<'cash' | 'transfer'>('cash')
  const [buyOrSell, setBuyOrSell] = useState<'buy' | 'sell'>('buy') // Foreign Exchange: You Buy / You Sell → isBuy in API
  const [fromCurrency, setFromCurrency] = useState('AUD')
  const [toCurrency, setToCurrency] = useState('USD')
  const [transferMode, setTransferMode] = useState<TransferMode>('Wire')
  const [amount, setAmount] = useState('1000')
  const [convertedAmount, setConvertedAmount] = useState('')
  const [rate, setRate] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseCurrency = getBaseCurrency(selectedCountry)
  const toCountryOptions = toCountries.filter((c) => c.currency !== baseCurrency)
  const allowEWire = toCurrency === 'NZD' || toCurrency === 'FJD' || toCurrency === 'AUD'
  const allowWallet = toCurrency === 'FJD'
  const allowWire = !['AUD', 'NZD', 'FJD'].includes(toCurrency)

  const calculateConversion = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setConvertedAmount('')
      setRate(0)
      return
    }
    if (quoteType === 'transfer' && (transferMode === 'Moneygram' || transferMode === 'Western Union')) {
      setConvertedAmount('')
      return
    }

    setIsCalculating(true)
    setError(null)
    const fromAmount = parseFloat(amount)

    // API only accepts base (AUD) as fromCcy. Sell: call base→sellCurrency with toAmount=1, then use inverse for result.
    const apiFromCcy = baseCurrency
    const apiToCcy = quoteType === 'transfer' ? toCurrency : (buyOrSell === 'buy' ? toCurrency : fromCurrency)
    const isReversed = quoteType === 'transfer' ? false : (quoteType === 'cash' ? false : fromCurrency !== baseCurrency)
    const apiToAmount = quoteType === 'cash' && buyOrSell === 'sell' ? 1 : (quoteType === 'cash' ? fromAmount : (isReversed ? 1 : fromAmount))

    try {
      const response = await fetch('/api/exchange-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromCcy: apiFromCcy,
          toCcy: apiToCcy,
          toAmount: apiToAmount,
          country: selectedCountry,
          ...(quoteType === 'transfer' ? { transferMode } : {}),
          ...(quoteType === 'cash' && buyOrSell === 'buy' ? { isBuy: true } : {}),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch exchange rate' }))
        throw new Error(errorData.error || errorData.details || 'Failed to fetch exchange rate')
      }

      const result = await response.json()
      if (!result.success || result.rate == null) throw new Error(result.error || result.details || 'Invalid response')

      let converted: number
      let displayRate: number
      if (quoteType === 'transfer') {
        // Money Transfer: display 1 AUD = 0.699 USD (inverse value in the rate slot); amount = send * inverse
        const inverseRate = result.inverse != null ? Number(result.inverse) : 1 / Number(result.rate)
        displayRate = inverseRate // show inverse in line: "1 AUD = 0.699 USD"
        converted = fromAmount * inverseRate
        setConvertedAmount(Number(converted).toFixed(2))
        setRate(displayRate)
      } else if (isReversed) {
        // Flipped (FROM USD TO AUD): use other rate 1 USD = 1.45 AUD, amount = 1000 * 1.45 = 1450 AUD
        const rateFromTo = result.inverse != null ? Number(result.inverse) : 1 / Number(result.rate)
        displayRate = rateFromTo
        converted = fromAmount * rateFromTo
        setConvertedAmount(Number(converted).toFixed(2))
        setRate(displayRate)
      } else if (quoteType === 'cash' && buyOrSell === 'sell') {
        // Sell: use normal rate for amount and for exchange rate line (1 USD = rate AUD)
        const normalRate = Number(result.rate)
        displayRate = normalRate
        converted = fromAmount * normalRate
        setConvertedAmount(Number(converted).toFixed(2))
        setRate(displayRate)
      } else {
        // Foreign Exchange Buy: You Pay = amount * normal rate (AUD). Exchange rate line = inverse (1 AUD = 0.73 USD)
        const normalRate = Number(result.rate)
        const inverseRate = result.inverse != null ? Number(result.inverse) : 1 / normalRate
        displayRate = inverseRate
        converted = fromAmount * normalRate
        setConvertedAmount(Number(converted).toFixed(2))
        setRate(displayRate)
      }
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate conversion'
      setError(errorMessage)
      const fallbackRate = exchangeRates[quoteType === 'transfer' ? baseCurrency : fromCurrency]?.[toCurrency] || 1
      setConvertedAmount((fromAmount * fallbackRate).toFixed(2))
      setRate(fallbackRate)
    } finally {
      setIsCalculating(false)
    }
  }

  useEffect(() => {
    calculateConversion()
  }, [fromCurrency, toCurrency, amount, selectedCountry, quoteType, transferMode, buyOrSell])

  // Money Transfer: keep transfer mode valid when "to country" changes
  useEffect(() => {
    if (quoteType !== 'transfer') return
    if (transferMode === 'Wallet' && !allowWallet) setTransferMode(allowEWire ? 'eWire' : allowWire ? 'Wire' : 'Moneygram')
    else if (transferMode === 'eWire' && !allowEWire) setTransferMode(allowWire ? 'Wire' : 'Moneygram')
    else if (transferMode === 'Wire' && !allowWire) setTransferMode(allowEWire ? 'eWire' : 'Moneygram')
  }, [quoteType, transferMode, allowWallet, allowEWire, allowWire, toCurrency])

  // Money Transfer: if "to country" equals base, pick first available
  useEffect(() => {
    if (quoteType !== 'transfer') return
    const options = toCountries.filter((c) => c.currency !== baseCurrency)
    if (toCurrency !== baseCurrency) return
    if (options.length > 0) setToCurrency(options[0].currency)
  }, [quoteType, baseCurrency, toCurrency])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const getCurrencyInfo = (code: string) => {
    return currencies.find(c => c.code === code) || { code, name: code }
  }

  const [openDropdown, setOpenDropdown] = useState<'buy' | 'sell' | 'country' | null>(null)
  const [dropdownSearch, setDropdownSearch] = useState('')
  const buyDropdownRef = useRef<HTMLDivElement>(null)
  const sellDropdownRef = useRef<HTMLDivElement>(null)
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const ref = openDropdown === 'buy' ? buyDropdownRef : openDropdown === 'sell' ? sellDropdownRef : openDropdown === 'country' ? countryDropdownRef : null
      if (ref?.current && !ref.current.contains(target)) setOpenDropdown(null)
    }
    if (openDropdown) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const FlagImg = ({ code, className = 'w-8 h-5 object-cover rounded shrink-0' }: { code: string; className?: string }) => {
    const cc = currencyToCountry[code] || code.toLowerCase().slice(0, 2)
    return <img src={`${FLAG_CDN}/${cc}.png`} alt="" className={className} />
  }
  const CountryFlagImg = ({ countryCode, className = 'w-8 h-5 object-cover rounded shrink-0' }: { countryCode: string; className?: string }) => (
    <img src={`${FLAG_CDN}/${countryCode}.png`} alt="" className={className} />
  )

  const chooseOption = (type: 'cash' | 'transfer') => {
    if (forceCashOnly && type === 'transfer') return
    setQuoteType(type)
    setChosen(true)
    onOptionChosen?.()
  }

  // First-time: two big buttons (only when not forced into cash-only mode)
  if (!forceCashOnly && !chosen) {
    return (
      <div className="flex-1 flex flex-col justify-start pt-3 min-h-0 w-full min-w-0">
        <div className="flex justify-center mb-6 w-full">
          <img src="/images/LFX-Flower.png" alt="LotusFX" className="h-20 w-auto sm:h-24 md:h-28 object-contain" />
        </div>
        <p className="text-center text-sm font-medium text-gray-600 mb-5 w-full">What would you like to do?</p>
        <div className="grid grid-cols-1 gap-4 w-full min-w-0">
          <motion.button
            type="button"
            onClick={() => chooseOption('cash')}
            className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white hover:from-primary-100 hover:to-primary-50 hover:border-primary-500 transition-all shadow-soft text-left min-w-0"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-primary-600/15 flex items-center justify-center ring-2 ring-primary-200">
              <BanknotesIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="block text-lg font-bold text-gray-900">Foreign Exchange</span>
              <span className="block text-sm text-gray-500 mt-1">Get Cash Exchange Rates</span>
              <span className="inline-block mt-2.5 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">20 branches in Australia</span>
            </div>
          </motion.button>
          <motion.button
            type="button"
            onClick={() => chooseOption('transfer')}
            className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-white hover:from-primary-100 hover:to-primary-50 hover:border-primary-500 transition-all shadow-soft text-left min-w-0"
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 shrink-0 rounded-xl bg-primary-600/15 flex items-center justify-center ring-2 ring-primary-200">
              <PaperAirplaneIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <span className="block text-lg font-bold text-gray-900">Money Transfer</span>
              <span className="block text-sm text-gray-500 mt-1">Send money overseas</span>
              <span className="inline-block mt-2.5 text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">200+ countries</span>
            </div>
          </motion.button>
        </div>
        <div className="mt-6 pt-5 border-t border-gray-100 shrink-0 w-full">
          <p className="text-center text-xs text-gray-500 mb-3">Download on</p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <a
              href="https://apps.apple.com/app/lotusfx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.lotusfx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z"/></svg>
              Google Play
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-500">
            <span>✓ Best rates</span>
            <span>✓ No hidden fees</span>
            <span>✓ Fast & secure</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .amount-input::-webkit-inner-spin-button,
          .amount-input::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .amount-input[type="number"] {
            -moz-appearance: textfield;
          }
        `,
      }} />
      <motion.div
        className="space-y-5 w-full min-w-0"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Foreign Exchange / Money Transfer toggle */}
      {!forceCashOnly && (
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={() => setQuoteType('cash')}
            className={`flex-1 text-xs md:text-sm font-semibold px-3 py-2 rounded-lg border ${
              quoteType === 'cash'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Foreign Exchange
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setQuoteType('transfer')}
            className={`flex-1 text-xs md:text-sm font-semibold px-3 py-2 rounded-lg border ${
              quoteType === 'transfer'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Money Transfer
          </motion.button>
        </div>
      )}

      {!forceCashOnly && quoteType === 'transfer' ? (
        /* Money Transfer: amount, to country, transfer mode */
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">You send</label>
            <div className="flex space-x-3">
              <div className="flex-1 flex items-center h-14 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-700">
                {baseCurrency}
              </div>
              <div className="w-32 relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="amount-input w-full h-14 pl-3 pr-9 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white font-bold text-lg hover:border-primary-300"
                />
                <PencilSquareIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="space-y-2"
          >
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">To country</label>
            <div className="flex space-x-3">
              <div className="flex-1 relative" ref={countryDropdownRef}>
                <button
                  type="button"
                  onClick={() => { const next = openDropdown === 'country' ? null : 'country'; setOpenDropdown(next); if (next) setDropdownSearch('') }}
                  className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white font-medium hover:border-primary-300 flex items-center gap-3 text-left"
                >
                  {(() => {
                    const c = toCountryOptions.find((x) => x.currency === toCurrency) || toCountryOptions[0]
                    if (!c) return <span className="text-gray-500">Select country</span>
                    return (
                      <>
                        <CountryFlagImg countryCode={c.countryCode} />
                        <span>{c.country}</span>
                      </>
                    )
                  })()}
                  <ChevronDownIcon className={`w-5 h-5 ml-auto shrink-0 transition-transform ${openDropdown === 'country' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'country' && (
                  <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 rounded-lg">
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                          type="text"
                          value={dropdownSearch}
                          onChange={(e) => setDropdownSearch(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          placeholder="Search country..."
                          className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="overflow-auto max-h-52 py-1">
                      {(() => {
                        const filtered = toCountryOptions.filter((c) => {
                          const q = dropdownSearch.trim().toLowerCase()
                          return !q || c.country.toLowerCase().includes(q) || c.currency.toLowerCase().includes(q)
                        })
                        if (filtered.length === 0) return <p className="px-4 py-3 text-gray-500 text-sm">No countries match</p>
                        return filtered.map((c) => (
                          <button
                            key={c.currency}
                            type="button"
                            onClick={() => { setToCurrency(c.currency); setOpenDropdown(null); setDropdownSearch('') }}
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-primary-50 text-left"
                          >
                            <CountryFlagImg countryCode={c.countryCode} />
                            <span>{c.country}</span>
                          </button>
                        ))
                      })()}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-32 min-w-[8rem]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-14 flex items-center justify-center px-3 bg-gradient-to-br from-primary-600 to-primary-700 border-2 border-primary-700 rounded-xl text-white font-bold text-lg text-center"
                >
                  {(transferMode === 'Wire' || transferMode === 'eWire' || transferMode === 'Wallet') ? (
                    isCalculating ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⏳</motion.div>
                    ) : (
                      <motion.span key={convertedAmount} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
                        {convertedAmount}
                      </motion.span>
                    )
                  ) : transferMode === 'Moneygram' ? (
                    <span className="text-xs sm:text-sm font-semibold leading-tight">Login to get the rate</span>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold leading-tight">Please visit us in store</span>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-1.5"
          >
            <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">Transfer type</label>
            <div className="space-y-1.5">
              {[
                ...(allowEWire ? [transferModes.find((m) => m.value === 'eWire')!] : []),
                ...(allowWire ? [transferModes.find((m) => m.value === 'Wire')!] : []),
                transferModes.find((m) => m.value === 'Moneygram')!,
                transferModes.find((m) => m.value === 'Western Union')!,
                ...(allowWallet ? [transferModes.find((m) => m.value === 'Wallet')!] : []),
              ].map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                    transferMode === mode.value ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200'
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
                    <span className="font-semibold text-gray-900">
                      {mode.value === 'eWire' ? (
                        <span className="inline-flex items-center gap-1"><span className="text-primary-500" aria-hidden>⚡</span> {mode.label} <span className="font-normal text-gray-500">(Lotus special service)</span></span>
                      ) : (
                        mode.label
                      )}
                    </span>
                    <p className="text-xs text-gray-500">{mode.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
        </>
      ) : (
        /* Foreign Exchange: You Buy / You Sell, then From / Swap / To */
        <>
          <div className="flex gap-2">
            <motion.button
              type="button"
              onClick={() => {
              setBuyOrSell('buy');
              setFromCurrency(baseCurrency);
              if (toCurrency === baseCurrency) {
                const other = currencies.find((c) => c.code !== baseCurrency);
                if (other) setToCurrency(other.code);
              }
            }}
              className={`flex-1 text-xs md:text-sm font-semibold px-3 py-2 rounded-lg border ${
                buyOrSell === 'buy'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              You Buy
            </motion.button>
            <motion.button
              type="button"
              onClick={() => {
              setBuyOrSell('sell');
              setToCurrency(baseCurrency);
              if (fromCurrency === baseCurrency) {
                const other = currencies.find((c) => c.code !== baseCurrency);
                if (other) setFromCurrency(other.code);
              }
            }}
              className={`flex-1 text-xs md:text-sm font-semibold px-3 py-2 rounded-lg border ${
                buyOrSell === 'sell'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              You Sell
            </motion.button>
          </div>

          {buyOrSell === 'buy' ? (
            /* Buy: You Buy = dropdown + amount input (what they want); You Pay = AUD + result only */
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">You Buy</label>
                <div className="flex space-x-3">
                  <div className="flex-1 relative" ref={buyDropdownRef}>
                    <button
                      type="button"
                      onClick={() => { const next = openDropdown === 'buy' ? null : 'buy'; setOpenDropdown(next); if (next) setDropdownSearch('') }}
                      className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white font-medium hover:border-primary-300 flex items-center gap-3 text-left"
                    >
                      {(() => {
                        const currency = getCurrencyInfo(toCurrency)
                        return (
                          <>
                            <FlagImg code={currency.code} />
                            <span>{currency.code} - {currency.name}</span>
                          </>
                        )
                      })()}
                      <ChevronDownIcon className={`w-5 h-5 ml-auto shrink-0 transition-transform ${openDropdown === 'buy' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'buy' && (
                      <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                          <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 rounded-lg">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                              type="text"
                              value={dropdownSearch}
                              onChange={(e) => setDropdownSearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                              placeholder="Search currency..."
                              className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                        <div className="overflow-auto max-h-52 py-1">
                          {(() => {
                            const filtered = currencies
                              .filter((c) => c.code !== baseCurrency)
                              .filter((c) => {
                                const q = dropdownSearch.trim().toLowerCase()
                                return !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
                              })
                            if (filtered.length === 0) return <p className="px-4 py-3 text-gray-500 text-sm">No currencies match</p>
                            return filtered.map((currency) => (
                              <button
                                key={currency.code}
                                type="button"
                                onClick={() => { setToCurrency(currency.code); setOpenDropdown(null); setDropdownSearch('') }}
                                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-primary-50 text-left"
                              >
                                <FlagImg code={currency.code} />
                                <span>{currency.code} - {currency.name}</span>
                              </button>
                            ))
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-32 relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount"
                      className="amount-input w-full h-14 pl-3 pr-9 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white font-bold text-lg hover:border-primary-300"
                    />
                    <PencilSquareIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden />
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">You Pay</label>
                <div className="flex space-x-3">
                  <div className="flex-1 flex items-center justify-center h-14 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-700">
                    {baseCurrency}
                  </div>
                  <div className="w-32">
                    <motion.div className="w-full h-14 flex items-center justify-center px-4 bg-gradient-to-br from-primary-600 to-primary-700 border-2 border-primary-700 rounded-xl text-white font-bold text-lg text-center">
                      {isCalculating ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⏳</motion.div> : (
                        <motion.span key={convertedAmount} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>{convertedAmount}</motion.span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            /* Sell: You Sell = dropdown + amount. You Get = fixed AUD + converted (can't change You Get currency) */
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">You Sell</label>
                <div className="flex space-x-3">
                  <div className="flex-1 relative" ref={sellDropdownRef}>
                    <button
                      type="button"
                      onClick={() => { const next = openDropdown === 'sell' ? null : 'sell'; setOpenDropdown(next); if (next) setDropdownSearch('') }}
                      className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white font-medium hover:border-primary-300 flex items-center gap-3 text-left"
                    >
                      {(() => {
                        const currency = getCurrencyInfo(fromCurrency)
                        return (
                          <>
                            <FlagImg code={currency.code} />
                            <span>{currency.code} - {currency.name}</span>
                          </>
                        )
                      })()}
                      <ChevronDownIcon className={`w-5 h-5 ml-auto shrink-0 transition-transform ${openDropdown === 'sell' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'sell' && (
                      <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                          <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 rounded-lg">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" />
                            <input
                              type="text"
                              value={dropdownSearch}
                              onChange={(e) => setDropdownSearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                              placeholder="Search currency..."
                              className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                        <div className="overflow-auto max-h-52 py-1">
                          {(() => {
                            const filtered = currencies
                              .filter((c) => c.code !== baseCurrency)
                              .filter((c) => {
                                const q = dropdownSearch.trim().toLowerCase()
                                return !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
                              })
                            if (filtered.length === 0) return <p className="px-4 py-3 text-gray-500 text-sm">No currencies match</p>
                            return filtered.map((currency) => (
                              <button
                                key={currency.code}
                                type="button"
                                onClick={() => { setFromCurrency(currency.code); setOpenDropdown(null); setDropdownSearch('') }}
                                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-primary-50 text-left"
                              >
                                <FlagImg code={currency.code} />
                                <span>{currency.code} - {currency.name}</span>
                              </button>
                            ))
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-32 relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Amount"
                      className="amount-input w-full h-14 pl-3 pr-9 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white font-bold text-lg hover:border-primary-300"
                    />
                    <PencilSquareIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden />
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="space-y-2">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">You Get</label>
                <div className="flex space-x-3">
                  <div className="flex-1 flex items-center justify-center h-14 px-4 border-2 border-gray-200 rounded-xl bg-gray-50 font-medium text-gray-700">
                    {baseCurrency}
                  </div>
                  <div className="w-32">
                    <motion.div className="w-full h-14 flex items-center justify-center px-4 bg-gradient-to-br from-primary-600 to-primary-700 border-2 border-primary-700 rounded-xl text-white font-bold text-lg text-center">
                      {isCalculating ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block">⏳</motion.div> : (
                        <motion.span key={convertedAmount} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>{convertedAmount}</motion.span>
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </>
      )}

      {/* Exchange Rate */}
      {(rate > 0 || (quoteType === 'transfer' && (transferMode === 'Moneygram' || transferMode === 'Western Union'))) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl border-2 border-primary-700 shadow-md bg-gradient-to-r from-primary-600 to-primary-700 ${
            quoteType === 'transfer' ? 'px-4 py-2.5' : 'p-5'
          }`}
        >
          {quoteType === 'transfer' ? (
            /* Money Transfer: rate line or Moneygram/WU message */
            <div className="text-center flex flex-wrap items-center justify-center gap-2 text-white">
              {(transferMode === 'Moneygram' || transferMode === 'Western Union') ? (
                <span className="text-base sm:text-lg font-bold">
                  {transferMode === 'Moneygram' ? 'Please Login or Download our app' : 'Please visit us in store'}
                </span>
              ) : (
                <>
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Exchange Rate</span>
                  <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-base sm:text-lg font-bold">
                    1 {baseCurrency} = {rate.toFixed(4)} {toCurrency}
                  </motion.span>
                </>
              )}
            </div>
          ) : (
            /* Foreign Exchange: 2 lines */
            <div className="text-center">
              <div className="text-xs font-bold text-white/80 uppercase tracking-widest mb-2">Exchange Rate</div>
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-2xl font-bold text-white">
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      {/* CTA Buttons */}
      <div className="space-y-2 pt-2">
        <motion.button
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          <span>Get This Rate</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.005   }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-secondary shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          Find Nearest Branch
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700"
        >
          ⚠️ {error} (Using estimated rates)
        </motion.div>
      )}

      {/* Additional Info - only for Foreign Exchange */}
      {quoteType === 'cash' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-gray-600 space-y-1 pt-2"
        >
          <p className="font-medium">✓ Rates updated every 30 seconds</p>
          <p className="text-gray-500">No commission fees • Best rates guaranteed</p>
        </motion.div>
      )}
      </motion.div>
    </>
  )
}
