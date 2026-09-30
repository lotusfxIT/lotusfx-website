'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  CheckIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import {
  formatDenomList,
  normalizeCurrenciesFile,
  parseDenomList,
  type CurrenciesDenominationsFile,
  type CurrencyDenominations,
} from '@/lib/currencies'

const COUNTRIES = [
  { code: 'AU', label: 'Australia' },
  { code: 'NZ', label: 'New Zealand' },
  { code: 'FJ', label: 'Fiji' },
] as const

type CountryCode = (typeof COUNTRIES)[number]['code']

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm'

function stockForCountry(currency: CurrencyDenominations, country: CountryCode) {
  const override = currency.byCountry?.[country]
  return {
    notes: override?.notes ?? currency.notes,
    coins: override?.coins ?? currency.coins ?? [],
  }
}

export default function AdminCurrenciesPage() {
  const [data, setData] = useState<CurrenciesDenominationsFile>({ currencies: [] })
  const [country, setCountry] = useState<CountryCode>('AU')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || ''
        const res = await fetch('/api/admin/currencies', {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (res.status === 401) {
          window.location.href = '/admin'
          return
        }
        if (res.ok) {
          setData(normalizeCurrenciesFile(await res.json()))
        }
      } catch {
        setError('Could not load currencies')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const sorted = useMemo(() => {
    const q = filter.trim().toUpperCase()
    return [...data.currencies]
      .filter((c) => !q || c.code.includes(q) || c.name.toUpperCase().includes(q))
      .sort((a, b) => a.code.localeCompare(b.code))
  }, [data.currencies, filter])

  const updateCurrency = (code: string, patch: Partial<CurrencyDenominations>) => {
    setData((prev) => ({
      currencies: prev.currencies.map((c) => (c.code === code ? { ...c, ...patch } : c)),
    }))
    setSaved(false)
  }

  const setCountryStock = (
    code: string,
    field: 'notes' | 'coins',
    raw: string
  ) => {
    const values = parseDenomList(raw)
    setData((prev) => ({
      currencies: prev.currencies.map((c) => {
        if (c.code !== code) return c
        const byCountry = { ...(c.byCountry || {}) }
        const current = byCountry[country] || {
          notes: c.notes,
          coins: c.coins || [],
        }
        byCountry[country] = {
          ...current,
          [field]: values,
        }
        // Keep top-level notes in sync when editing AU (site default / fallback)
        if (country === 'AU' && field === 'notes') {
          return { ...c, notes: values, byCountry }
        }
        if (country === 'AU' && field === 'coins') {
          return { ...c, coins: values, byCountry }
        }
        return { ...c, byCountry }
      }),
    }))
    setSaved(false)
  }

  const addCurrency = () => {
    const code = window.prompt('Currency code (e.g. USD)?')?.trim().toUpperCase()
    if (!code || code.length < 3) return
    if (data.currencies.some((c) => c.code === code)) {
      setError(`${code} already exists`)
      return
    }
    const name = window.prompt('Currency name?', code)?.trim() || code
    const symbol = window.prompt('Symbol?', code)?.trim() || code
    setData((prev) =>
      normalizeCurrenciesFile({
        currencies: [
          ...prev.currencies,
          {
            code,
            name,
            symbol,
            notes: [],
            byCountry: { [country]: { notes: [], coins: [] } },
          },
        ],
      })
    )
    setSaved(false)
  }

  const removeCurrency = (code: string) => {
    if (!window.confirm(`Remove ${code} from the currency pages list?`)) return
    setData((prev) => ({
      currencies: prev.currencies.filter((c) => c.code !== code),
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || ''
      const payload = normalizeCurrenciesFile(data)
      const res = await fetch('/api/admin/currencies', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        const fallback = json.currencies
          ? normalizeCurrenciesFile(json.currencies)
          : payload
        setData(fallback)
        const blob = new Blob([JSON.stringify(fallback, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'currencies-denominations.json'
        a.click()
        URL.revokeObjectURL(url)
        setError(
          (json.error || 'Could not save on server') +
            ' — JSON downloaded. Commit public/currencies-denominations.json (and data/) for a permanent update.'
        )
        return
      }
      if (json.currencies) setData(normalizeCurrenciesFile(json.currencies))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(normalizeCurrenciesFile(data), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'currencies-denominations.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        setData(normalizeCurrenciesFile(JSON.parse(String(reader.result || '{}'))))
        setError('')
        setSaved(false)
      } catch {
        setError('Invalid JSON file — could not import')
      }
    }
    reader.readAsText(file)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Loading currencies…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Currencies & denominations</h1>
              <p className="text-sm text-gray-500">
                Control which currencies appear on currency pages and which notes/coins you stock
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleImportFile(file)
                e.target.value = ''
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 inline-flex items-center gap-1.5"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Import JSON
            </button>
            <button
              type="button"
              onClick={downloadJson}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Download JSON
            </button>
            <button
              type="button"
              onClick={addCurrency}
              className="px-4 py-2 rounded-lg border border-primary-300 text-sm font-semibold text-primary-700 hover:bg-primary-50 inline-flex items-center gap-1.5"
            >
              <PlusIcon className="w-4 h-4" />
              Add currency
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition"
            >
              {saving ? (
                'Saving…'
              ) : saved ? (
                <>
                  <CheckIcon className="w-5 h-5" /> Saved
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
            {error}
          </div>
        ) : null}

        <p className="text-sm text-gray-600 rounded-xl border border-gray-200 bg-white px-4 py-3">
          Edit stock per country. Use comma-separated values (e.g.{' '}
          <code className="font-mono text-xs">100, 50, 20</code> or{' '}
          <code className="font-mono text-xs">100K, 50K</code>). Leave coins blank if notes only.
          Saved to <code className="font-mono text-xs">public/currencies-denominations.json</code>.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCountry(c.code)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  country === c.code
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by code or name…"
            className={`${inputClass} max-w-xs`}
          />
          <span className="text-sm text-gray-500">{sorted.length} currencies</span>
        </div>

        <div className="space-y-3">
          {sorted.map((currency, idx) => {
            const stock = stockForCountry(currency, country)
            return (
              <motion.div
                key={currency.code}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.01, 0.2) }}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="grid lg:grid-cols-[140px_1fr_1fr_auto] gap-3 items-start">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Code</label>
                    <div className="font-bold text-lg text-gray-900">{currency.code}</div>
                    <input
                      className={`${inputClass} mt-2`}
                      value={currency.name}
                      onChange={(e) => updateCurrency(currency.code, { name: e.target.value })}
                      placeholder="Name"
                    />
                    <input
                      className={`${inputClass} mt-2`}
                      value={currency.symbol}
                      onChange={(e) => updateCurrency(currency.code, { symbol: e.target.value })}
                      placeholder="Symbol"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Notes ({country})
                    </label>
                    <input
                      className={inputClass}
                      defaultValue={formatDenomList(stock.notes)}
                      key={`${currency.code}-${country}-notes-${formatDenomList(stock.notes)}`}
                      onBlur={(e) => setCountryStock(currency.code, 'notes', e.target.value)}
                      placeholder="e.g. 100, 50, 20, 10, 5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Coins ({country})
                    </label>
                    <input
                      className={inputClass}
                      defaultValue={formatDenomList(stock.coins)}
                      key={`${currency.code}-${country}-coins-${formatDenomList(stock.coins)}`}
                      onBlur={(e) => setCountryStock(currency.code, 'coins', e.target.value)}
                      placeholder="Optional — leave blank for notes only"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCurrency(currency.code)}
                    className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title={`Remove ${currency.code}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
