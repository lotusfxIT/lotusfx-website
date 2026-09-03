'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  MapPinIcon,
  UserIcon,
  DocumentCheckIcon,
  DevicePhoneMobileIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline'
import { trackEvent } from '@/lib/analytics'
import { FLAG_CDN, getCurrencyFlagCode } from '@/lib/currencies'
import { findStaticLocationByBranchName } from '@/data/locations-static'
import { STATS } from '@/config/stats'
import { useCountry } from '@/context/CountryContext'

type StepId = 'purchase' | 'fulfillment' | 'details' | 'payment'

type CurrencySold = { country: string; currency: string; flag: string; name?: string }

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

const STEPS: { id: StepId; label: string; icon: typeof ShoppingBagIcon }[] = [
  { id: 'purchase', label: 'Order', icon: ShoppingBagIcon },
  { id: 'fulfillment', label: 'Collection', icon: MapPinIcon },
  { id: 'details', label: 'Details', icon: UserIcon },
  { id: 'payment', label: 'Confirm', icon: DocumentCheckIcon },
]

const APP_STORE_URL = 'https://apps.apple.com/app/lotusfx'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.lotusfx'

function countryLabel(code: string) {
  if (code === 'NZ') return 'New Zealand'
  if (code === 'FJ') return 'Fiji'
  return 'Australia'
}

function supportEmailForCountry(code: string) {
  if (code === 'NZ') return STATS.emails.newZealand
  if (code === 'FJ') return STATS.emails.fiji
  return STATS.emails.australia
}

function defaultBaseCurrency(code: string) {
  if (code === 'NZ') return { code: 'NZD', name: 'New Zealand', flag: 'NZ' }
  if (code === 'FJ') return { code: 'FJD', name: 'Fiji', flag: 'FJ' }
  return { code: 'AUD', name: 'Australia', flag: 'AU' }
}

const fieldClass =
  'w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-white font-medium hover:border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200'
const labelClass =
  'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2'

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

/** 4D returns WebEwireID (e.g. LAWEB10192), not orderId. */
function extractOrderReference(result: Record<string, unknown> | null): string {
  if (!result) return ''
  const direct = [
    result.WebEwireID,
    result.webEwireID,
    result.orderId,
    result.OrderID,
    result.bookingRef,
    result.orderUUID,
  ]
    .map((v) => String(v || '').trim())
    .find(Boolean)
  if (direct) return direct

  const statusText = String(result.statusText || '')
  const fromStatus = statusText.match(/\b(LAWEB\d+|[A-Z]{2,}\d{4,})\b/i)
  return fromStatus?.[1] || ''
}

type CollectionPlace = {
  name: string
  address?: string
  phone?: string
  email?: string
  slug?: string
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
      className={`min-w-[260px] max-w-[420px] rounded-xl bg-white px-4 py-3 text-sm shadow-strong border ${
        variant === 'error'
          ? 'border-red-200 text-red-800'
          : variant === 'success'
            ? 'border-green-200 text-green-800'
            : 'border-primary-100 text-gray-800'
      }`}
    >
      {message}
    </div>
  )
}

export default function QuickOrderWizard() {
  const searchParams = useSearchParams()
  const { selectedCountry } = useCountry()
  const marketCountry =
    selectedCountry === 'NZ' || selectedCountry === 'FJ' || selectedCountry === 'AU'
      ? selectedCountry
      : 'AU'
  const lookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [activeStep, setActiveStep] = useState<StepId>('purchase')
  const [guestLimit, setGuestLimit] = useState(1000)
  const [enableDelivery, setEnableDelivery] = useState(false)
  const [apiReady, setApiReady] = useState(true)
  const [loadingMeta, setLoadingMeta] = useState(true)
  const [baseCurrency, setBaseCurrency] = useState(() => defaultBaseCurrency(marketCountry))
  const [portalLoginUrl, setPortalLoginUrl] = useState(
    marketCountry === 'NZ' || marketCountry === 'FJ'
      ? 'https://nzcportal.lotusfx.com/customers/login.shtml'
      : 'https://auportal.lotusfx.com/customers/login.shtml'
  )

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
  /** Which amount field the user last edited: foreign currency or AUD. */
  const amountSide = useRef<'buy' | 'pay'>('buy')
  const audLookupTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    country: countryLabel(marketCountry),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentResult, setPaymentResult] = useState<Record<string, unknown> | null>(null)
  const [collectionPlace, setCollectionPlace] = useState<CollectionPlace | null>(null)
  const [toasts, setToasts] = useState<{ id: number; message: string; variant?: 'error' | 'success' }[]>(
    []
  )
  const [isMobile, setIsMobile] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [currencySearch, setCurrencySearch] = useState('')
  const toastId = useRef(0)
  const overLimitTracked = useRef(false)
  const currencyDropdownRef = useRef<HTMLDivElement>(null)

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

  const sortedCurrencies = useMemo(
    () =>
      [...currenciesSold].sort((a, b) =>
        a.currency.localeCompare(b.currency, undefined, { sensitivity: 'base' })
      ),
    [currenciesSold]
  )

  const filteredCurrencies = useMemo(() => {
    const q = currencySearch.trim().toLowerCase()
    if (!q) return sortedCurrencies
    return sortedCurrencies.filter(
      (c) =>
        c.currency.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        (c.name || '').toLowerCase().includes(q)
    )
  }, [sortedCurrencies, currencySearch])

  useEffect(() => {
    if (!currencyOpen) return
    const onPointerDown = (e: MouseEvent) => {
      if (!currencyDropdownRef.current?.contains(e.target as Node)) {
        setCurrencyOpen(false)
        setCurrencySearch('')
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [currencyOpen])

  useEffect(() => {
    if (activeStep !== 'purchase') {
      setCurrencyOpen(false)
      setCurrencySearch('')
    }
  }, [activeStep])

  function selectCurrency(found: CurrencySold) {
    amountSide.current = 'buy'
    setSelectedCurrency({
      code: found.currency,
      name: found.country,
      flag: getCurrencyFlagCode(found.currency),
    })
    setCurrencyOpen(false)
    setCurrencySearch('')
    trackEvent('currency_select', {
      currency: found.currency,
      location: 'quick_order',
    })
  }

  useEffect(() => {
    trackEvent('order_initiation', {
      cta_name: 'quick_order_page',
      quote_type: 'cash',
      location: 'quick_order',
    })
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      const narrow = window.matchMedia('(max-width: 768px)').matches
      const ua = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      setIsMobile(narrow || ua)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    trackEvent('quick_order_step', {
      location: activeStep,
    })
  }, [activeStep])

  useEffect(() => {
    if (!isOverLimit) {
      overLimitTracked.current = false
      return
    }
    if (overLimitTracked.current) return
    overLimitTracked.current = true
    trackEvent('quick_order_over_limit', {
      location: 'quick_order',
      guest_limit: guestLimit,
      total_due: totalAmountDue,
      device: isMobile ? 'mobile' : 'desktop',
    })
  }, [isOverLimit, guestLimit, totalAmountDue, isMobile])

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
      setPaymentResult(null)
      setCollectionPlace(null)
      setSelectedBranch(null)
      setBaseCurrency(defaultBaseCurrency(marketCountry))
      setGuest((prev) => ({ ...prev, country: countryLabel(marketCountry) }))
      try {
        const [cfgRes, curRes, brRes] = await Promise.all([
          fetch(`/api/quick-order/config?country=${encodeURIComponent(marketCountry)}`),
          fetch('/api/quick-order/currencies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: marketCountry }),
          }),
          fetch('/api/quick-order/branches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: marketCountry }),
          }),
        ])
        const cfg = await cfgRes.json()
        const cur = await curRes.json()
        const br = await brRes.json()

        if (cfg.success) {
          setGuestLimit(cfg.guestPurchaseLimit ?? 1000)
          setEnableDelivery(!!cfg.enableDelivery)
          setApiReady(!!cfg.configured)
          if (cfg.baseCurrency?.code) {
            setBaseCurrency({
              code: cfg.baseCurrency.code,
              name: cfg.baseCurrency.name,
              flag: cfg.baseCurrency.flag || marketCountry,
            })
          }
          if (cfg.portalLoginUrl) setPortalLoginUrl(cfg.portalLoginUrl)
          if (!cfg.configured && cfg.configError) {
            showToast(cfg.configError, 'error')
          }
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
            flag: getCurrencyFlagCode(preferred.currency),
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
  }, [marketCountry])

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
            country: marketCountry,
            fromCcy: selectedCurrency.code,
            toCcy: baseCurrency.code,
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
          to_currency: baseCurrency.code,
          location: 'quick_order',
        })
      } catch {
        clearRateAmounts()
        showToast('Exchange rate request failed.', 'error')
      } finally {
        setIsCalculating(false)
      }
    },
    [localAmount, selectedCurrency.code, baseCurrency.code, marketCountry, clearRateAmounts, showToast]
  )

  useEffect(() => {
    if (loadingMeta) return
    if (amountSide.current === 'pay') return
    if (lookupTimer.current) clearTimeout(lookupTimer.current)
    lookupTimer.current = setTimeout(() => {
      lookupRate()
    }, 400)
    return () => {
      if (lookupTimer.current) clearTimeout(lookupTimer.current)
    }
  }, [localAmount, selectedCurrency.code, loadingMeta, lookupRate])

  function onForeignAmountChange(value: string) {
    amountSide.current = 'buy'
    setLocalAmount(value)
  }

  function onAudAmountChange(value: string) {
    amountSide.current = 'pay'
    setForeignAmount(value)

    if (audLookupTimer.current) clearTimeout(audLookupTimer.current)
    audLookupTimer.current = setTimeout(() => {
      const aud = parseAmount(value)
      const rate = lastRate
      if (aud == null || aud <= 0) {
        clearRateAmounts()
        return
      }
      if (rate == null || rate <= 0) {
        showToast('Waiting for a rate — try editing the purchase amount first.', 'error')
        return
      }
      const foreign = aud / rate
      setLocalAmount(foreign.toFixed(2))
      lookupRate(foreign)
    }, 400)
  }

  function validateStep(step: StepId): string | null {
    const amount = parseAmount(localAmount)
    const totalDue = parseAmount(totalAmountDue) || 0
    const over = totalDue > guestLimit
    const needsAddress = fulfillmentMethod === 'delivery'

    if (step === 'purchase') {
      if (amount == null || amount <= 0) return 'Enter a valid purchase amount.'
      if (over) {
        return isMobile
          ? `Orders over ${baseCurrency.code} ${guestLimit.toLocaleString()} need the LotusFX app. Download the app to log in or sign up.`
          : `Orders over ${baseCurrency.code} ${guestLimit.toLocaleString()} need a LotusFX account. Please log in or sign up to continue.`
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
      if (!guest.dateOfBirth.trim()) return 'Enter your date of birth.'
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
    setCollectionPlace(null)

    try {
      const payload = {
        purchase: {
          transactionType: 'currencyPurchase',
          customerReference: guest.email.trim(),
          sourceCurrency: baseCurrency.code,
          debitCurrency: baseCurrency.code,
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
          guestDateOfBirth: guest.dateOfBirth.trim() || undefined,
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
        body: JSON.stringify({ ...payload, country: marketCountry }),
      })
      const data = await response.json()

      if (!data.success) {
        showToast(data.error || 'Unable to create purchase order.', 'error')
        return
      }

      const result = (data.result || {}) as Record<string, unknown>
      setPaymentResult(result)
      showToast(String(result.statusText || 'Purchase request sent.'), 'success')

      const payment =
        result.payment && typeof result.payment === 'object'
          ? (result.payment as Record<string, unknown>)
          : {}
      const branchNameFromApi = String(
        payment.branchName || selectedBranch?.BranchName || ''
      ).trim()
      const matched = findStaticLocationByBranchName(
        branchNameFromApi || selectedBranch?.BranchName,
        marketCountry === 'NZ' || marketCountry === 'FJ' ? marketCountry : 'AU'
      )
      const supportEmail = supportEmailForCountry(marketCountry)

      const basePlace: CollectionPlace = {
        name:
          matched?.name.replace(/^Lotus Foreign Exchange - /i, '') ||
          branchNameFromApi ||
          selectedBranch?.BranchName ||
          'Selected branch',
        address:
          [
            String(payment.branchAddress || '').trim(),
            String(payment.branchCity || '').trim(),
            selectedBranch ? formatBranchAddress(selectedBranch) : '',
          ]
            .filter(Boolean)
            .join(', ') || undefined,
        phone:
          String(payment.branchPhone || selectedBranch?.BranchPhone || '').trim() ||
          undefined,
        email: supportEmail,
        slug: matched?.slug,
      }
      setCollectionPlace(basePlace)

      if (matched?.id) {
        void fetch(`/api/locations/details?id=${encodeURIComponent(matched.id)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((loc) => {
            if (!loc) return
            const formatted =
              loc.address?.formatted ||
              [
                ...(loc.address?.addressLines || []),
                loc.address?.locality,
                loc.address?.administrativeArea,
                loc.address?.postalCode,
              ]
                .filter(Boolean)
                .join(', ')
            setCollectionPlace((prev) => ({
              name:
                String(loc.displayName || '')
                  .replace(/^Lotus Foreign Exchange - /i, '')
                  .trim() ||
                prev?.name ||
                basePlace.name,
              address: formatted || prev?.address,
              phone: loc.phoneNumbers?.[0] || prev?.phone,
              email: prev?.email || supportEmail,
              slug: matched.slug,
            }))
          })
          .catch(() => {
            /* keep basePlace from 4D / static match */
          })
      }

      const ref = extractOrderReference(result)
      trackEvent('quick_order_complete', {
        form_name: 'quick_order',
        subject_category: 'pay_in_store',
        location: 'quick_order',
        foreign_currency: selectedCurrency.code,
        has_order_id: !!ref,
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
    setCollectionPlace(null)
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
      country: countryLabel(marketCountry),
    })
  }

  const orderRef = extractOrderReference(paymentResult)

  const stepTitle =
    activeStep === 'purchase'
      ? 'Purchase details'
      : activeStep === 'fulfillment'
        ? 'Collection details'
        : activeStep === 'details'
          ? 'Your details'
          : 'Confirm details'

  const summaryPanel = (
    <div className="h-full flex flex-col gap-4">
      <div className="rounded-xl border-2 border-gray-100 bg-gray-50 p-4 space-y-2.5 text-sm flex-1 flex flex-col justify-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 text-center">
          Order summary
        </h3>
        <div className="flex justify-between gap-3">
          <span className="text-gray-500">Buy</span>
          <span className="font-semibold text-gray-900 text-right">
            {localAmount} {selectedCurrency.code}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-gray-500">You pay</span>
          <span className="font-semibold text-gray-900 text-right">
            {isCalculating ? '…' : `${baseCurrency.code} ${foreignAmount}`}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-gray-500">Rate</span>
          <span className="font-semibold text-gray-900 text-right">
            1 {selectedCurrency.code} = {rateDisplay} {baseCurrency.code}
          </span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-gray-500">Fee</span>
          <span className="font-semibold text-gray-900 text-right">{feeAmount}</span>
        </div>
        <div className="flex justify-between gap-3 pt-2 border-t border-gray-200 text-base font-bold mt-auto">
          <span className="text-gray-900">Total due</span>
          <span className="text-primary-700 text-right">
            {baseCurrency.code} {totalAmountDue}
          </span>
        </div>
        {isOverLimit ? (
          <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
            Over guest limit — log in or use the app below.
          </p>
        ) : null}
        {fulfillmentMethod === 'pickup' && selectedBranch ? (
          <div className="flex justify-between gap-3 pt-1">
            <span className="text-gray-500">Store</span>
            <span className="font-semibold text-gray-900 text-right">{selectedBranch.BranchName}</span>
          </div>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 pt-24 sm:pt-28 pb-28">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Quick Order
            </h1>
            <p className="mt-2 text-primary-100 max-w-2xl text-sm sm:text-base">
              Order currency online in a few steps, then pay in store when you collect.
            </p>
          </div>

          {!paymentResult ? (
            <div className="mt-6 flex w-full gap-2 sm:gap-3">
              {STEPS.map((step, idx) => {
                const Icon = step.icon
                const isActive = idx === activeIdx
                const isDone = idx < activeIdx
                return (
                  <button
                    key={step.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => goToStep(step.id)}
                    className={`flex-[1_1_0%] min-w-0 box-border flex items-center gap-2 sm:gap-2.5 rounded-xl px-2 sm:px-3 py-2.5 sm:py-3 text-left transition-all border ${
                      isActive
                        ? 'bg-white text-gray-900 border-white shadow-md'
                        : isDone
                          ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                          : 'bg-white/10 text-primary-100 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg shrink-0 ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : isDone
                            ? 'bg-white text-primary-700'
                            : 'bg-white/15 text-white'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 overflow-hidden">
                      <span
                        className={`block text-[10px] font-bold uppercase tracking-wider truncate ${
                          isActive ? 'text-gray-400' : 'text-primary-200'
                        }`}
                      >
                        Step {idx + 1}
                      </span>
                      <span className="block text-sm font-semibold truncate">{step.label}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!apiReady && !loadingMeta ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm mb-4 shadow-soft">
              Quick Order API credentials are not configured for this country yet. Ask IT to set
              the Quick Order (or exchange-rate) keys for AU / NZ in Vercel.
            </div>
          ) : null}

          <div className="bg-white rounded-2xl shadow-strong border border-gray-100 p-5 sm:p-7 lg:p-8">
            {loadingMeta ? (
              <div className="py-16 text-center text-gray-500">Loading…</div>
            ) : paymentResult ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <CheckCircleIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                      Order confirmed
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 max-w-2xl">
                      Thank you
                      {guest.firstName.trim() ? `, ${guest.firstName.trim()}` : ''}. You will
                      receive an email when your currency is ready to be collected.
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start pt-2 border-t border-gray-100">
                  <div className="space-y-5 min-w-0 lg:pr-2">
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Order reference
                        </p>
                        {orderRef ? (
                          <button
                            type="button"
                            onClick={() => {
                              void navigator.clipboard?.writeText(orderRef).then(
                                () => showToast('Reference copied', 'success'),
                                () => showToast('Could not copy reference', 'error')
                              )
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
                          >
                            <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                            Copy
                          </button>
                        ) : null}
                      </div>
                      <p className="mt-1 text-2xl font-bold font-mono text-primary-700 tracking-tight">
                        {orderRef || 'Pending confirmation'}
                      </p>
                    </div>

                    {guest.email.trim() ? (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Receipt emailed to
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-900 break-all">
                          {guest.email.trim()}
                        </p>
                      </div>
                    ) : null}

                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-2">Please note:</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-500 marker:text-primary-600">
                        <li>Bring a valid photo ID with you.</li>
                        <li>Pay in store — cash &amp; Eftpos.</li>
                      </ul>
                    </div>

                    <button type="button" onClick={resetForNext} className="btn-primary">
                      Place another order
                    </button>
                  </div>

                  <aside className="lg:border-l lg:border-gray-100 lg:pl-10 min-w-0 space-y-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                        Collection branch
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {collectionPlace?.name || selectedBranch?.BranchName || '—'}
                      </p>
                    </div>

                    {collectionPlace || selectedBranch ? (
                      <dl className="space-y-3 text-sm">
                        {(collectionPlace?.address ||
                          (selectedBranch && formatBranchAddress(selectedBranch))) && (
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">
                              Address
                            </dt>
                            <dd className="mt-0.5 font-semibold text-gray-900 m-0 leading-snug">
                              {collectionPlace?.address ||
                                (selectedBranch ? formatBranchAddress(selectedBranch) : '—')}
                            </dd>
                          </div>
                        )}
                        {(collectionPlace?.phone || selectedBranch?.BranchPhone) && (
                          <div>
                            <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">
                              Phone
                            </dt>
                            <dd className="mt-0.5 font-semibold text-gray-900 m-0">
                              <a
                                href={`tel:${collectionPlace?.phone || selectedBranch?.BranchPhone}`}
                                className="hover:text-primary-700"
                              >
                                {collectionPlace?.phone || selectedBranch?.BranchPhone}
                              </a>
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Email
                          </dt>
                          <dd className="mt-0.5 font-semibold text-gray-900 m-0 break-all">
                            <a
                              href={`mailto:${collectionPlace?.email || supportEmailForCountry(marketCountry)}`}
                              className="hover:text-primary-700"
                            >
                              {collectionPlace?.email || supportEmailForCountry(marketCountry)}
                            </a>
                          </dd>
                        </div>
                      </dl>
                    ) : (
                      <p className="text-sm text-gray-500">No branch selected.</p>
                    )}

                    {collectionPlace?.slug ? (
                      <a
                        href={`/locations/${collectionPlace.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
                      >
                        View location details
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </a>
                    ) : null}
                  </aside>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  {(() => {
                    const Icon = STEPS[activeIdx]?.icon || ShoppingBagIcon
                    return <Icon className="w-5 h-5 text-primary-600 shrink-0" />
                  })()}
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{stepTitle}</h2>
                </div>

                {activeStep === 'payment' ? (
                  <div className="w-full">
                    <div className="grid lg:grid-cols-2 lg:grid-rows-[auto_auto] gap-x-0 gap-y-6 lg:gap-y-0 items-start">
                      <section className="lg:pr-10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                          Currency
                        </h3>
                        <dl className="grid grid-cols-[9rem_minmax(0,1fr)] gap-x-5 gap-y-2.5 text-sm">
                          <dt className="text-gray-500">Buy</dt>
                          <dd className="font-semibold text-gray-900 m-0">
                            {localAmount} {selectedCurrency.code}
                          </dd>
                          <dt className="text-gray-500">Rate</dt>
                          <dd className="font-semibold text-gray-900 m-0">
                            1 {selectedCurrency.code} = {rateDisplay} {baseCurrency.code}
                          </dd>
                          <dt className="text-gray-500">Fee</dt>
                          <dd className="font-semibold text-gray-900 m-0">
                            {baseCurrency.code} {feeAmount}
                          </dd>
                          <dt className="text-gray-500">Collection</dt>
                          <dd className="font-semibold text-gray-900 m-0">
                            {fulfillmentMethod === 'pickup'
                              ? selectedBranch?.BranchName || '—'
                              : deliveryLocation || 'Delivery'}
                          </dd>
                        </dl>
                      </section>

                      <section className="lg:border-l lg:border-gray-100 lg:pl-10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                          Total
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">Amount due in store</p>
                        <p className="text-4xl sm:text-5xl font-bold text-primary-700 tracking-tight leading-none">
                          {baseCurrency.code} {totalAmountDue}
                        </p>
                      </section>

                      <section className="border-t border-gray-100 pt-6 lg:pr-10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                          Customer details
                        </h3>
                        <dl className="grid grid-cols-[9rem_minmax(0,1fr)] gap-x-5 gap-y-2.5 text-sm">
                          <dt className="text-gray-500">Customer</dt>
                          <dd className="font-semibold text-gray-900 m-0">
                            {guest.firstName} {guest.lastName}
                          </dd>
                          <dt className="text-gray-500">Email</dt>
                          <dd className="font-semibold text-gray-900 m-0 break-all">
                            {guest.email}
                          </dd>
                          <dt className="text-gray-500">Phone</dt>
                          <dd className="font-semibold text-gray-900 m-0">{guest.phone}</dd>
                          <dt className="text-gray-500">DOB</dt>
                          <dd className="font-semibold text-gray-900 m-0">
                            {guest.dateOfBirth || '—'}
                          </dd>
                        </dl>
                      </section>

                      <section className="border-t border-gray-100 pt-6 lg:border-l lg:border-gray-100 lg:pl-10">
                        {/* Match Customer details heading so "Please note" lines up with Customer name */}
                        <div
                          className="text-xs font-bold uppercase tracking-wider mb-3 invisible select-none"
                          aria-hidden="true"
                        >
                          Customer details
                        </div>
                        <p className="text-sm font-semibold text-gray-800 mb-2">Please note:</p>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-500 marker:text-primary-600">
                          <li>No online payment is taken for quick orders.</li>
                          <li>Please pay in store upon collection, we accept cash &amp; Eftpos.</li>
                          <li>
                            Bring a valid photo ID matching the details you have provided.
                          </li>
                        </ul>
                      </section>
                    </div>
                  </div>
                ) : (
                <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,1fr)] gap-8 lg:gap-10 items-stretch">
                <div className="min-w-0 h-full flex flex-col">
                  {activeStep === 'purchase' && (
                    <div className="flex flex-col h-full gap-5">
                      <div>
                        <label className={labelClass}>Currency</label>
                        <div className="relative" ref={currencyDropdownRef}>
                          <button
                            type="button"
                            className={`${fieldClass} flex items-center gap-3 text-left`}
                            onClick={() => {
                              setCurrencyOpen((open) => {
                                const next = !open
                                if (next) setCurrencySearch('')
                                return next
                              })
                            }}
                            aria-haspopup="listbox"
                            aria-expanded={currencyOpen}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`${FLAG_CDN}/${getCurrencyFlagCode(selectedCurrency.code)}.png`}
                              alt=""
                              className="w-8 h-5 object-cover rounded-sm shrink-0"
                            />
                            <span className="flex-1 font-semibold text-gray-900 truncate">
                              {selectedCurrency.code} ({selectedCurrency.name})
                            </span>
                            <ChevronDownIcon
                              className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                                currencyOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {currencyOpen ? (
                            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-72">
                              <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                                <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 rounded-lg">
                                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 shrink-0" />
                                  <input
                                    type="search"
                                    autoFocus
                                    value={currencySearch}
                                    onChange={(e) => setCurrencySearch(e.target.value)}
                                    placeholder="Search currency or country"
                                    className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400"
                                    aria-label="Search currencies"
                                  />
                                </div>
                              </div>
                              <div className="overflow-y-auto" role="listbox">
                                {filteredCurrencies.length === 0 ? (
                                  <p className="px-4 py-3 text-sm text-gray-500 text-center">
                                    No currencies match
                                  </p>
                                ) : (
                                  filteredCurrencies.map((c) => {
                                    const active = c.currency === selectedCurrency.code
                                    return (
                                      <button
                                        key={c.currency}
                                        type="button"
                                        role="option"
                                        aria-selected={active}
                                        className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-primary-50 ${
                                          active ? 'bg-primary-50' : ''
                                        }`}
                                        onClick={() => selectCurrency(c)}
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={`${FLAG_CDN}/${getCurrencyFlagCode(c.currency)}.png`}
                                          alt=""
                                          className="w-8 h-5 object-cover rounded-sm shrink-0"
                                        />
                                        <span className="font-semibold text-gray-900">
                                          {c.currency}
                                        </span>
                                        <span className="text-gray-500 truncate">{c.country}</span>
                                      </button>
                                    )
                                  })
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Amount to purchase</label>
                        <div className="flex gap-3">
                          <div className="w-28 shrink-0 flex items-center justify-center h-14 px-3 border-2 border-gray-200 rounded-xl bg-gray-50 font-semibold text-gray-800">
                            {selectedCurrency.code}
                          </div>
                          <input
                            inputMode="decimal"
                            className={`${fieldClass} font-bold text-lg`}
                            value={localAmount}
                            onChange={(e) => onForeignAmountChange(e.target.value)}
                            aria-label="Amount to purchase"
                          />
                        </div>
                      </div>

                      <div className="mt-auto">
                        <label className={labelClass}>{baseCurrency.code} amount</label>
                        <div className="flex gap-3">
                          <div className="w-28 shrink-0 flex items-center justify-center h-14 px-3 border-2 border-gray-200 rounded-xl bg-gray-50 font-semibold text-gray-800">
                            {baseCurrency.code}
                          </div>
                          <input
                            inputMode="decimal"
                            className={`${fieldClass} font-bold text-lg`}
                            value={foreignAmount}
                            onChange={(e) => onAudAmountChange(e.target.value)}
                            aria-label={`${baseCurrency.code} amount`}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 'fulfillment' && (
                    <div className="space-y-5">
                      {enableDelivery ? (
                        <div>
                          <label className={labelClass}>Fulfillment method</label>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              className={`flex-1 h-14 rounded-xl border-2 text-sm font-semibold transition ${
                                fulfillmentMethod === 'pickup'
                                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                              }`}
                              onClick={() => setFulfillmentMethod('pickup')}
                            >
                              Pickup
                            </button>
                            <button
                              type="button"
                              className={`flex-1 h-14 rounded-xl border-2 text-sm font-semibold transition ${
                                fulfillmentMethod === 'delivery'
                                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
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
                          <label className={labelClass}>Store</label>
                          <select
                            className={`${fieldClass} ${
                              !selectedBranch ? 'border-amber-400 focus:ring-amber-400' : ''
                            }`}
                            value={selectedBranch?.BranchID || ''}
                            onChange={(e) => {
                              const found =
                                branches.find((b) => b.BranchID === e.target.value) || null
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
                          <label className={labelClass}>Delivery location</label>
                          <input
                            className={fieldClass}
                            value={deliveryLocation}
                            onChange={(e) => setDeliveryLocation(e.target.value)}
                            placeholder="Delivery address or suburb"
                          />
                        </div>
                      )}

                      <div>
                        <label className={labelClass}>Instructions</label>
                        <textarea
                          className="w-full min-h-[110px] px-4 py-3 border-2 border-gray-200 rounded-xl bg-white font-medium hover:border-primary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 resize-y"
                          value={instructions}
                          onChange={(e) => setInstructions(e.target.value)}
                          placeholder="Optional pickup notes"
                        />
                      </div>
                    </div>
                  )}

                  {activeStep === 'details' && (
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>First name</label>
                          <input
                            className={fieldClass}
                            value={guest.firstName}
                            onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Last name</label>
                          <input
                            className={fieldClass}
                            value={guest.lastName}
                            onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Email</label>
                        <input
                          type="email"
                          className={fieldClass}
                          value={guest.email}
                          onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Phone</label>
                          <input
                            className={fieldClass}
                            value={guest.phone}
                            onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>
                            Date of birth <span className="text-primary-600">*</span>
                          </label>
                          <input
                            type="date"
                            required
                            max={new Date().toISOString().slice(0, 10)}
                            className={fieldClass}
                            value={guest.dateOfBirth}
                            onChange={(e) => setGuest({ ...guest, dateOfBirth: e.target.value })}
                          />
                        </div>
                      </div>
                      {fulfillmentMethod === 'delivery' ? (
                        <>
                          <div>
                            <label className={labelClass}>Address</label>
                            <input
                              className={fieldClass}
                              value={guest.addressLine1}
                              onChange={(e) =>
                                setGuest({ ...guest, addressLine1: e.target.value })
                              }
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>Suburb</label>
                              <input
                                className={fieldClass}
                                value={guest.suburb}
                                onChange={(e) => setGuest({ ...guest, suburb: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>State</label>
                              <input
                                className={fieldClass}
                                value={guest.state}
                                onChange={(e) => setGuest({ ...guest, state: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelClass}>Postcode</label>
                              <input
                                className={fieldClass}
                                value={guest.postalCode}
                                onChange={(e) =>
                                  setGuest({ ...guest, postalCode: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Country</label>
                              <input
                                className={fieldClass}
                                value={guest.country}
                                onChange={(e) => setGuest({ ...guest, country: e.target.value })}
                              />
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>

                <aside className="h-full min-h-0">{summaryPanel}</aside>
                </div>
                )}

                {isOverLimit ? (
                  <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0">
                        <DevicePhoneMobileIcon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900">
                          Account required for orders over {baseCurrency.code}{' '}
                          {guestLimit.toLocaleString()}
                        </h3>
                        <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                          {isMobile
                            ? 'Guest Quick Order is limited on the website. Download the LotusFX app to log in or sign up and complete larger orders.'
                            : 'Guest Quick Order is limited to this amount. Log in or sign up to continue with a larger order. On your phone, use the LotusFX app instead.'}
                        </p>
                      </div>
                    </div>

                    {isMobile ? (
                      <div className="space-y-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-900 text-center sm:text-left">
                          Download the LotusFX app
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              trackEvent('cta_click', {
                                cta_name: 'app_store',
                                location: 'quick_order_over_limit',
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
                          >
                            App Store
                          </a>
                          <a
                            href={PLAY_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              trackEvent('cta_click', {
                                cta_name: 'google_play',
                                location: 'quick_order_over_limit',
                              })
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition"
                          >
                            Google Play
                          </a>
                        </div>
                        <a
                          href={portalLoginUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent('order_initiation', {
                              cta_name: 'portal_login',
                              location: 'quick_order_over_limit',
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
                        >
                          Or log in on the website
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </a>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <a
                          href={portalLoginUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent('order_initiation', {
                              cta_name: 'portal_login',
                              location: 'quick_order_over_limit',
                            })
                          }
                          className="btn-primary inline-flex items-center justify-center gap-2"
                        >
                          Login / Sign Up
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </a>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span>On your phone?</span>
                          <a
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary-700 hover:text-primary-800"
                          >
                            App Store
                          </a>
                          <span className="text-gray-400">·</span>
                          <a
                            href={PLAY_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-primary-700 hover:text-primary-800"
                          >
                            Google Play
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}

                {activeStep !== 'payment' ? (
                <p className="mt-6 pt-5 border-t border-gray-100 text-xs sm:text-sm text-gray-500 text-center">
                  Guest limit {baseCurrency.code} {guestLimit.toLocaleString()}. Pay in store when
                  you collect — no online payment.
                </p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {!loadingMeta && !paymentResult ? (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-primary-800/40 bg-primary-800/95 backdrop-blur-md">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            <button
              type="button"
              className="min-w-[7rem] rounded-lg border-2 border-white/40 bg-transparent px-5 py-2.5 font-semibold text-white hover:bg-white/10 transition disabled:opacity-40 disabled:pointer-events-none"
              onClick={stepBack}
              disabled={activeIdx === 0 || isSubmitting}
            >
              Back
            </button>
            <p className="hidden sm:block text-sm text-primary-100">
              Step {activeIdx + 1} of {STEPS.length} · {STEPS[activeIdx]?.label}
            </p>
            {activeStep === 'payment' ? (
              <button
                type="button"
                className="min-w-[9rem] rounded-lg bg-white text-primary-700 font-semibold px-6 py-2.5 shadow-md hover:bg-primary-50 transition disabled:opacity-50 disabled:pointer-events-none"
                onClick={submitOrder}
                disabled={isSubmitting || !apiReady}
              >
                {isSubmitting ? 'Submitting…' : 'Confirm order'}
              </button>
            ) : (
              <button
                type="button"
                className="min-w-[7rem] rounded-lg bg-white text-primary-700 font-semibold px-6 py-2.5 shadow-md hover:bg-primary-50 transition disabled:opacity-50 disabled:pointer-events-none"
                onClick={stepForward}
                disabled={isSubmitting || isOverLimit}
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : null}

      <div className="fixed left-4 bottom-20 sm:bottom-24 z-50 grid gap-2.5">
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
