'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

type StepId = 'purchase' | 'fulfillment' | 'details' | 'payment'

type CurrencySold = { country: string; currency: string; flag: string }

type Branch = {
  BranchID: string
  BranchName: string
  Address?: string
  BranchPhone?: string
  City?: string
  Province?: string
  CountryCode?: string
}

type Guest = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  addressLine1: string
  addressLine2: string
  suburb: string
  state: string
  postalCode: string
  country: string
}

const STEPS: { id: StepId; label: string }[] = [
  { id: 'purchase', label: 'Order' },
  { id: 'fulfillment', label: 'Collection' },
  { id: 'details', label: 'Details' },
  { id: 'payment', label: 'Confirm' },
]

const BASE_CURRENCY = { code: 'AUD', name: 'Australia', flag: 'AU' }

function parseAmount(v: string | number | null | undefined): number | null {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())
}

function isoWithLocalOffset(date: Date) {
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMinutes)
  const hh = String(Math.floor(abs / 60)).padStart(2, '0')
  const mm = String(abs % 60).padStart(2, '0')
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 19) + sign + hh + ':' + mm
}

function formatBranchAddress(branch: Branch) {
  return [branch.Address, branch.City, branch.Province, branch.CountryCode]
    .filter(Boolean)
    .join(', ')
}

function Toast({
  message,
  variant,
  onDone,
}: {
  message: string
  variant?: 'error' | 'success'
  onDone: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className={`min-w-[250px] max-w-[440px] rounded-lg bg-white px-3 py-2.5 text-sm shadow-lg border-l-4 ${
        variant === 'error'
          ? 'border-red-600'
          : variant === 'success'
            ? 'border-green-700'
            : 'border-primary-600'
      }`}
    >
      {message}
    </div>
  )
}

export default function QuickOrderWizard() {
  const searchParams = useSearchParams()
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activeStep, setActiveStep] = useState<StepId>('purchase')
  const [guestLimit, setGuestLimit] = useState(1000)
  const [enableDelivery, setEnableDelivery] = useState(false)
  const [apiReady, setApiReady] = useState(true)
  const [loadingMeta, setLoadingMeta] = useState(true)

  const [currenciesSold, setCurrenciesSold] = useState<CurrencySold[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: 'USD',
    name: 'United States',
    flag: 'US',
  })
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  const [localAmount, setLocalAmount] = useState('100.00')
  const [foreignAmount, setForeignAmount] = useState('0.00')
  const [rateValue, setRateValue] = useState('0.00000')
  const [feeAmount, setFeeAmount] = useState('0.00')
  const [totalAmountDue, setTotalAmountDue] = useState('0.00')
  const [lastRate, setLastRate] = useState<number | null>(null)
  const [lastInverse, setLastInverse] = useState<number | null>(null)
  const [rateQuotedAt, setRateQuotedAt] = useState<string | undefined>()
  const [rateExpiresAt, setRateExpiresAt] = useState<string | undefined>()
  const [isCalculating, setIsCalculating] = useState(false)

  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [instructions, setInstructions] = useState('')

  const [guest, setGuest] = useState<Guest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    suburb: '',
    state: '',
    postalCode: '',
    country: 'Australia',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentResult, setPaymentResult] = useState<Record<string, unknown> | null>(null)
  const [toasts, setToasts] = useState<{ id: number; message: string; variant?: 'error' | 'success' }[]>(
    []
  )
  const toastId = useRef(0)

  const showToast = useCallback((message: string, variant?: 'error' | 'success') => {
    const id = ++toastId.current
    setToasts((prev) => [...prev, { id, message, variant }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearRateAmounts = useCallback(() => {
    setForeignAmount('0.00')
    setRateValue('0.00000')
    setFeeAmount('0.00')
    setTotalAmountDue('0.00')
    setLastRate(null)
    setLastInverse(null)
    setRateQuotedAt(undefined)
    setRateExpiresAt(undefined)
  }, [])

  const activeIdx = STEPS.findIndex((s) => s.id === activeStep)
  const isOverLimit = (parseAmount(totalAmountDue) || 0) > guestLimit

  const rateDisplay = useMemo(() => {
    const rate = lastRate != null ? lastRate : lastInverse ? 1 / lastInverse : null
    return rate ? rate.toFixed(4) : '0.0000'
  }, [lastRate, lastInverse])

  useEffect(() => {
    trackEvent('order_initiation', {
      cta_name: 'quick_order_page',
      quote_type: 'cash',
      location: 'quick_order',
    })
  }, [])

  useEffect(() => {
    trackEvent('quick_order_step', {
      location: activeStep,
    })
  }, [activeStep])

  // Prefill from calculator query
  useEffect(() => {
    const to = searchParams.get('to')
    const amount = searchParams.get('amount')
    if (to) {
      setSelectedCurrency((prev) => ({
        ...prev,
        code: to.toUpperCase(),
      }))
    }
    if (amount && Number(amount) > 0) {
      setLocalAmount(String(Number(amount).toFixed(2)))
    }
  }, [searchParams])

  useEffect(() => {
    const load = async () => {
      setLoadingMeta(true)
      try {
        const [cfgRes, curRes, brRes] = await Promise.all([
          fetch('/api/quick-order/config'),
          fetch('/api/quick-order/currencies', { method: 'POST' }),
          fetch('/api/quick-order/branches', { method: 'POST' }),
        ])
        const cfg = await cfgRes.json()
        const cur = await curRes.json()
        const br = await brRes.json()

        if (cfg.success) {
          setGuestLimit(cfg.guestPurchaseLimit ?? 1000)
          setEnableDelivery(!!cfg.enableDelivery)
          setApiReady(!!cfg.configured)
        }

        if (cur.success && Array.isArray(cur.currencies) && cur.currencies.length) {
          setCurrenciesSold(cur.currencies)
          const prefTo = searchParams.get('to')?.toUpperCase()
          const preferred =
            cur.currencies.find((c: CurrencySold) => c.currency === prefTo) ||
            cur.currencies.find((c: CurrencySold) => c.currency === 'USD') ||
            cur.currencies.find((c: CurrencySold) => c.currency === 'CAD') ||
            cur.currencies[0]
          setSelectedCurrency({
            code: preferred.currency,
            name: preferred.country,
            flag: preferred.flag || preferred.country.slice(0, 2).toUpperCase(),
          })
        } else if (!cur.success) {
          showToast(cur.error || 'Unable to load currencies.', 'error')
        }

        if (br.success && Array.isArray(br.branches)) {
          setBranches(br.branches)
        } else if (!br.success) {
          showToast(br.error || 'Unable to load store locations.', 'error')
        }
      } catch {
        showToast('Unable to initialise Quick Order. Please try again.', 'error')
        setApiReady(false)
      } finally {
        setLoadingMeta(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lookupRate = useCallback(
    async (amountOverride?: number) => {
      const amount = amountOverride != null ? amountOverride : parseFloat(localAmount || '0')
      if (!Number.isFinite(amount) || amount <= 0) return

      setIsCalculating(true)
      try {
        const response = await fetch('/api/quick-order/rate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fromCcy: selectedCurrency.code,
            toCcy: BASE_CURRENCY.code,
            toAmount: amount,
            isBuy: true,
            transferMode: 'booking',
          }),
        })
        const data = await response.json()
        if (!data.success) {
          clearRateAmounts()
          showToast(data.error || 'Exchange rate request failed.', 'error')
          return
        }

        const nextRate = parseAmount(data.rate)
        const nextInverse = parseAmount(data.inverse)
        const nextFee = parseAmount(data.fee)
        const fromAmount =
          nextRate != null
            ? amount * nextRate
            : nextInverse != null && nextInverse !== 0
              ? amount / nextInverse
              : null

        if (nextRate != null) {
          setRateValue(nextRate.toFixed(5))
          setLastRate(nextRate)
        }
        if (nextInverse != null) setLastInverse(nextInverse)
        if (fromAmount != null) setForeignAmount(fromAmount.toFixed(2))
        if (nextFee != null) {
          setFeeAmount(nextFee.toFixed(2))
          setTotalAmountDue(
            fromAmount != null ? (fromAmount + nextFee).toFixed(2) : nextFee.toFixed(2)
          )
        } else if (fromAmount != null) {
          setTotalAmountDue(fromAmount.toFixed(2))
        }

        const quotedAt = new Date()
        setRateQuotedAt(isoWithLocalOffset(quotedAt))
        setRateExpiresAt(isoWithLocalOffset(new Date(quotedAt.getTime() + 15 * 60 * 1000)))

        trackEvent('view_rates', {
          quote_type: 'cash',
          from_currency: selectedCurrency.code,
          to_currency: BASE_CURRENCY.code,
          location: 'quick_order',
        })
      } catch {
        clearRateAmounts()
        showToast('Exchange rate request failed.', 'error')
      } finally {
        setIsCalculating(false)
      }
    },
    [localAmount, selectedCurrency.code, clearRateAmounts, showToast]
  )

  useEffect(() => {
    if (loadingMeta) return
    if (lookupTimer.current) clearTimeout(lookupTimer.current)
    lookupTimer.current = setTimeout(() => {
      lookupRate()
    }, 400)
    return () => {
      if (lookupTimer.current) clearTimeout(lookupTimer.current)
    }
  }, [localAmount, selectedCurrency.code, loadingMeta, lookupRate])

  function validateStep(step: StepId): string | null {
    const amount = parseAmount(localAmount)
    const totalDue = parseAmount(totalAmountDue) || 0
    const over = totalDue > guestLimit
    const needsAddress = fulfillmentMethod === 'delivery'

    if (step === 'purchase') {
      if (amount == null || amount <= 0) return 'Enter a valid purchase amount.'
      if (over) {
        return `Orders over ${BASE_CURRENCY.code} ${guestLimit.toLocaleString()} require onboarding before purchase.`
      }
    }

    if (step === 'fulfillment') {
      if (fulfillmentMethod === 'pickup') {
        if (!selectedBranch) return 'Choose a store.'
      } else if (!deliveryLocation.trim()) {
        return 'Enter a delivery location.'
      }
    }

    if (step === 'details') {
      if (!guest.firstName.trim() || !guest.lastName.trim()) {
        return 'Enter your first and last name.'
      }
      if (!isValidEmail(guest.email)) return 'Enter a valid email address.'
      if (!guest.phone.trim()) return 'Enter your phone number.'
      if (
        needsAddress &&
        (!guest.addressLine1.trim() ||
          !guest.suburb.trim() ||
          !guest.state.trim() ||
          !guest.postalCode.trim())
      ) {
        return 'Enter your address details.'
      }
    }

    return null
  }

  function goToStep(stepId: StepId) {
    const targetIdx = STEPS.findIndex((s) => s.id === stepId)
    if (targetIdx < activeIdx) {
      setActiveStep(stepId)
      return
    }
    for (let i = activeIdx; i < targetIdx; i += 1) {
      const msg = validateStep(STEPS[i].id)
      if (msg) {
        showToast(msg, 'error')
        return
      }
    }
    setActiveStep(stepId)
  }

  function stepForward() {
    const msg = validateStep(activeStep)
    if (msg) {
      showToast(msg, 'error')
      return
    }
    const next = STEPS[activeIdx + 1]
    if (next) setActiveStep(next.id)
  }

  function stepBack() {
    const prev = STEPS[activeIdx - 1]
    if (prev) setActiveStep(prev.id)
  }

  async function submitOrder() {
    for (const step of STEPS) {
      const msg = validateStep(step.id)
      if (msg) {
        showToast(msg, 'error')
        setActiveStep(step.id)
        return
      }
    }

    setIsSubmitting(true)
    setPaymentResult(null)

    try {
      const payload = {
        purchase: {
          transactionType: 'currencyPurchase',
          customerReference: guest.email.trim(),
          sourceCurrency: BASE_CURRENCY.code,
          debitCurrency: BASE_CURRENCY.code,
          foreignCurrency: selectedCurrency.code,
          foreignAmount: parseAmount(localAmount) || 0,
          exchangeRate: parseAmount(rateValue) || 0,
          feeAmount: parseAmount(feeAmount) || 0,
          totalDebitAmount: parseAmount(totalAmountDue) || 0,
          rateQuotedAt,
          rateExpiresAt,
          notes: instructions.trim() || undefined,
          // Extra context for backend/ops (ignored if API strips unknown fields)
          guestName: `${guest.firstName} ${guest.lastName}`.trim(),
          guestPhone: guest.phone.trim(),
          fulfillmentMethod,
          deliveryLocation: fulfillmentMethod === 'delivery' ? deliveryLocation.trim() : undefined,
        },
        paymentMethod: {
          paymentMethod: 'PAYINSTORE',
          type: 'PAYINSTORE',
          ...(selectedBranch
            ? {
                branchId: selectedBranch.BranchID,
                branchName: selectedBranch.BranchName,
                branch: selectedBranch,
              }
            : {}),
        },
      }

      const response = await fetch('/api/quick-order/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!data.success) {
        showToast(data.error || 'Unable to create purchase order.', 'error')
        return
      }

      const result = (data.result || {}) as Record<string, unknown>
      setPaymentResult(result)
      showToast(String(result.statusText || 'Purchase request sent.'), 'success')

      trackEvent('quick_order_complete', {
        form_name: 'quick_order',
        subject_category: 'pay_in_store',
        location: 'quick_order',
        foreign_currency: selectedCurrency.code,
        has_order_id: !!(result.orderId || result.OrderID),
      })
    } catch {
      showToast('Unable to create purchase order.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForNext() {
    setActiveStep('purchase')
    setPaymentResult(null)
    setSelectedBranch(null)
    setDeliveryLocation('')
    setInstructions('')
    setLocalAmount('100.00')
    clearRateAmounts()
    setGuest({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      addressLine1: '',
      addressLine2: '',
      suburb: '',
      state: '',
      postalCode: '',
      country: 'Australia',
    })
  }

  const orderRef = paymentResult
    ? String(paymentResult.orderId || paymentResult.OrderID || paymentResult.bookingRef || '')
    : ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-amber-50/40 pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-primary-700 mb-1">
              Currency purchase
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Quick Order
            </h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              Guest purchases are available up to {BASE_CURRENCY.code}{' '}
              {guestLimit.toLocaleString()}. Pay in store when you collect.
            </p>
          </div>
        </header>

        {!apiReady && !loadingMeta ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 text-sm mb-4">
            Quick Order API credentials are not configured yet. Ask IT to set{' '}
            <code className="font-mono text-xs">QUICK_ORDER_X_KEY</code> and{' '}
            <code className="font-mono text-xs">QUICK_ORDER_X_CLIENT</code> in Vercel.
          </div>
        ) : null}

        <section className="bg-[#fffaf3] border border-[#d8c9b5] rounded-2xl shadow-lg overflow-hidden">
          <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 border-b border-[#d8c9b5] bg-[#fbf6ee]">
            {STEPS.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                disabled={isSubmitting || !!paymentResult}
                onClick={() => goToStep(step.id)}
                className={`flex items-center gap-2.5 rounded-xl border bg-white p-2.5 text-left transition ${
                  idx === activeIdx
                    ? 'border-primary-600'
                    : idx < activeIdx
                      ? 'border-green-600/40'
                      : 'border-[#d8c9b5]'
                }`}
              >
                <span
                  className={`inline-grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold shrink-0 ${
                    idx === activeIdx
                      ? 'bg-primary-600 text-white border border-primary-600'
                      : idx < activeIdx
                        ? 'bg-green-700 text-white border border-green-700'
                        : 'bg-[#f4ece0] text-gray-500 border border-[#b89f80]'
                  }`}
                >
                  {idx + 1}
                </span>
                <span
                  className={`text-xs font-bold leading-tight ${
                    idx === activeIdx ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="px-4 sm:px-6 pb-6">
            {loadingMeta ? (
              <div className="py-16 text-center text-gray-500">Loading…</div>
            ) : paymentResult ? (
              <div className="pt-6 space-y-4">
                <h2 className="bg-primary-600 text-white text-sm font-extrabold tracking-wide px-4 py-3 -mx-4 sm:-mx-6 mb-4">
                  Order confirmed
                </h2>
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-900">
                  <p className="font-semibold">Your Quick Order has been submitted.</p>
                  {orderRef ? (
                    <p className="mt-2 text-sm">
                      Reference: <span className="font-mono font-bold">{orderRef}</span>
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm">
                    Pay in store when you collect your currency
                    {selectedBranch ? ` at ${selectedBranch.BranchName}` : ''}.
                  </p>
                </div>
                <div className="rounded-xl border border-[#d8c9b5] bg-white p-4 text-sm space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Currency</span>
                    <span className="font-semibold">
                      {localAmount} {selectedCurrency.code}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Total due</span>
                    <span className="font-semibold">
                      {BASE_CURRENCY.code} {totalAmountDue}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500">Customer</span>
                    <span className="font-semibold">
                      {guest.firstName} {guest.lastName}
                    </span>
                  </div>
                </div>
                <button type="button" onClick={resetForNext} className="btn-primary w-full sm:w-auto">
                  Place another order
                </button>
              </div>
            ) : (
              <>
                {activeStep === 'purchase' && (
                  <div className="pt-0 space-y-4">
                    <h2 className="bg-primary-600 text-white text-sm font-extrabold tracking-wide px-4 py-3 -mx-4 sm:-mx-6 mb-4">
                      Purchase details
                    </h2>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Currency
                      </label>
                      <select
                        className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                        value={selectedCurrency.code}
                        onChange={(e) => {
                          const found = currenciesSold.find((c) => c.currency === e.target.value)
                          if (found) {
                            setSelectedCurrency({
                              code: found.currency,
                              name: found.country,
                              flag: found.flag || found.country.slice(0, 2).toUpperCase(),
                            })
                          }
                        }}
                      >
                        {currenciesSold.length === 0 ? (
                          <option value={selectedCurrency.code}>
                            {selectedCurrency.code} — {selectedCurrency.name}
                          </option>
                        ) : (
                          currenciesSold.map((c) => (
                            <option key={c.currency} value={c.currency}>
                              {c.currency} — {c.country}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Amount to purchase
                      </label>
                      <div className="flex items-center rounded-lg border border-[#d8c9b5] bg-white overflow-hidden">
                        <span className="px-3 py-2.5 bg-[#f4ece0] text-sm font-bold text-gray-700 border-r border-[#d8c9b5]">
                          {selectedCurrency.code}
                        </span>
                        <input
                          inputMode="decimal"
                          className="flex-1 px-3 py-2.5 outline-none"
                          value={localAmount}
                          onChange={(e) => setLocalAmount(e.target.value)}
                          aria-label="Amount to purchase"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        {BASE_CURRENCY.code} amount
                      </label>
                      <div className="flex items-center rounded-lg border border-[#d8c9b5] bg-[#faf7f2] overflow-hidden">
                        <span className="px-3 py-2.5 bg-[#f4ece0] text-sm font-bold text-gray-700 border-r border-[#d8c9b5]">
                          {BASE_CURRENCY.code}
                        </span>
                        <input
                          readOnly
                          className="flex-1 px-3 py-2.5 outline-none bg-transparent"
                          value={isCalculating ? '…' : foreignAmount}
                          aria-label="Base currency amount"
                        />
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#d8c9b5] bg-white p-4">
                      <h3 className="font-bold text-gray-900 mb-1">Today&apos;s exchange rate</h3>
                      <p>
                        Buy 1 {selectedCurrency.code} for {rateDisplay} {BASE_CURRENCY.code}
                      </p>
                      <p className="mt-1.5 text-sm text-gray-500">
                        Online rate only. In-branch rate may differ.
                      </p>
                    </div>
                    <div
                      className={`rounded-xl border p-4 ${
                        isOverLimit
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-[#d8c9b5] bg-white'
                      }`}
                    >
                      <h3 className="font-bold text-gray-900 mb-2">Order summary</h3>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Rate</span>
                          <span>{rateValue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fee</span>
                          <span>{feeAmount}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-1 border-t border-[#d8c9b5]">
                          <span>Total due</span>
                          <span>
                            {BASE_CURRENCY.code} {totalAmountDue}
                          </span>
                        </div>
                      </div>
                      {isOverLimit ? (
                        <p className="mt-2 text-sm text-amber-800 font-medium">
                          This amount requires account onboarding before purchase.
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                {activeStep === 'fulfillment' && (
                  <div className="space-y-4">
                    <h2 className="bg-primary-600 text-white text-sm font-extrabold tracking-wide px-4 py-3 -mx-4 sm:-mx-6 mb-4">
                      Collection details
                    </h2>
                    {enableDelivery ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Fulfillment method
                        </label>
                        <div className="inline-flex rounded-lg border border-[#d8c9b5] overflow-hidden">
                          <button
                            type="button"
                            className={`px-4 py-2 text-sm font-bold ${
                              fulfillmentMethod === 'pickup'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700'
                            }`}
                            onClick={() => setFulfillmentMethod('pickup')}
                          >
                            Pickup
                          </button>
                          <button
                            type="button"
                            className={`px-4 py-2 text-sm font-bold border-l border-[#d8c9b5] ${
                              fulfillmentMethod === 'delivery'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700'
                            }`}
                            onClick={() => setFulfillmentMethod('delivery')}
                          >
                            Delivery
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {fulfillmentMethod === 'pickup' ? (
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Store
                        </label>
                        <select
                          className={`w-full rounded-lg border bg-white px-3 py-2.5 ${
                            !selectedBranch ? 'border-amber-400' : 'border-[#d8c9b5]'
                          }`}
                          value={selectedBranch?.BranchID || ''}
                          onChange={(e) => {
                            const found = branches.find((b) => b.BranchID === e.target.value) || null
                            setSelectedBranch(found)
                          }}
                        >
                          <option value="">Select a store</option>
                          {branches.map((b) => (
                            <option key={b.BranchID} value={b.BranchID}>
                              {b.BranchName}
                              {formatBranchAddress(b) ? ` — ${formatBranchAddress(b)}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Delivery location
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                          value={deliveryLocation}
                          onChange={(e) => setDeliveryLocation(e.target.value)}
                          placeholder="Delivery address or suburb"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Instructions
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5 min-h-[90px]"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Optional pickup notes"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 'details' && (
                  <div className="space-y-4">
                    <h2 className="bg-primary-600 text-white text-sm font-extrabold tracking-wide px-4 py-3 -mx-4 sm:-mx-6 mb-4">
                      Your details
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          First name
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                          value={guest.firstName}
                          onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Last name
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                          value={guest.lastName}
                          onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                        value={guest.email}
                        onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Phone
                        </label>
                        <input
                          className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                          value={guest.phone}
                          onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Date of birth
                        </label>
                        <input
                          type="date"
                          max={new Date().toISOString().slice(0, 10)}
                          className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                          value={guest.dateOfBirth}
                          onChange={(e) => setGuest({ ...guest, dateOfBirth: e.target.value })}
                        />
                      </div>
                    </div>
                    {fulfillmentMethod === 'delivery' ? (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Address
                          </label>
                          <input
                            className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                            value={guest.addressLine1}
                            onChange={(e) => setGuest({ ...guest, addressLine1: e.target.value })}
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                              Suburb
                            </label>
                            <input
                              className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                              value={guest.suburb}
                              onChange={(e) => setGuest({ ...guest, suburb: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                              State
                            </label>
                            <input
                              className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                              value={guest.state}
                              onChange={(e) => setGuest({ ...guest, state: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                              Postcode
                            </label>
                            <input
                              className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                              value={guest.postalCode}
                              onChange={(e) => setGuest({ ...guest, postalCode: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                              Country
                            </label>
                            <input
                              className="w-full rounded-lg border border-[#d8c9b5] bg-white px-3 py-2.5"
                              value={guest.country}
                              onChange={(e) => setGuest({ ...guest, country: e.target.value })}
                            />
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}

                {activeStep === 'payment' && (
                  <div className="space-y-4">
                    <h2 className="bg-primary-600 text-white text-sm font-extrabold tracking-wide px-4 py-3 -mx-4 sm:-mx-6 mb-4">
                      Confirm &amp; pay in store
                    </h2>
                    <div className="rounded-xl border border-[#d8c9b5] bg-white p-4 text-sm space-y-2">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Buy</span>
                        <span className="font-semibold">
                          {localAmount} {selectedCurrency.code}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Rate</span>
                        <span>{rateValue}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Fee</span>
                        <span>{feeAmount}</span>
                      </div>
                      <div className="flex justify-between gap-4 font-bold text-base border-t border-[#d8c9b5] pt-2">
                        <span>Total due</span>
                        <span>
                          {BASE_CURRENCY.code} {totalAmountDue}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4 pt-2">
                        <span className="text-gray-500">Collection</span>
                        <span className="font-semibold text-right">
                          {fulfillmentMethod === 'pickup'
                            ? selectedBranch?.BranchName || '—'
                            : deliveryLocation || 'Delivery'}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Customer</span>
                        <span className="font-semibold">
                          {guest.firstName} {guest.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Payment</span>
                        <span className="font-semibold">Pay in store</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      No online payment is taken. You pay when you collect your order at the branch.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3 border-t border-[#d8c9b5] pt-4">
                  <button
                    type="button"
                    className="rounded-lg border border-[#d8c9b5] bg-[#f9f3ea] px-5 py-2.5 font-semibold text-gray-800 disabled:opacity-50"
                    onClick={stepBack}
                    disabled={activeIdx === 0 || isSubmitting}
                  >
                    Back
                  </button>
                  {activeStep === 'payment' ? (
                    <button
                      type="button"
                      className="btn-primary disabled:opacity-50"
                      onClick={submitOrder}
                      disabled={isSubmitting || !apiReady}
                    >
                      {isSubmitting ? 'Submitting…' : 'Confirm order'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary disabled:opacity-50"
                      onClick={stepForward}
                      disabled={isSubmitting}
                    >
                      Next
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      <div className="fixed left-4 bottom-4 z-50 grid gap-2.5">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            variant={t.variant}
            onDone={() => removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  )
}
