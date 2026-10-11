'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import type { OrderRecord, OrderStatus } from '@/lib/orders'

const STATUS_STYLES: Record<OrderStatus, string> = {
  received: 'bg-amber-100 text-amber-800',
  ready: 'bg-blue-100 text-blue-800',
  collected: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-200 text-gray-600',
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Received',
  ready: 'Ready to collect',
  collected: 'Collected',
  cancelled: 'Cancelled',
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function fmtDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })
}

function money(amount: number, ccy: string) {
  return `${amount.toLocaleString('en-AU', { maximumFractionDigits: 2 })} ${ccy}`
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unauthorized, setUnauthorized] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState('')
  const [notice, setNotice] = useState('')
  const [forwardTo, setForwardTo] = useState('')
  const [forwardNote, setForwardNote] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/orders', { headers: authHeaders(), cache: 'no-store' })
      if (res.status === 401) {
        setUnauthorized(true)
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not load orders')
      setOrders(data.orders || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('id')
    if (fromUrl) setSelectedId(fromUrl)
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (!q) return true
      return [o.id, o.customer.name, o.customer.email, o.customer.phone, o.branch.name, o.purchase.foreignCurrency]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [orders, statusFilter, query])

  const selected = orders.find((o) => o.id === selectedId) || null

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length }
    orders.forEach((o) => {
      c[o.status] = (c[o.status] || 0) + 1
    })
    return c
  }, [orders])

  async function act(body: Record<string, unknown>, confirmText?: string) {
    if (!selected) return
    if (confirmText && !window.confirm(confirmText)) return
    setBusy(String(body.action) + String(body.status || ''))
    setNotice('')
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(selected.id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Action failed')
      setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)))
      const last = data.order.events[data.order.events.length - 1]
      setNotice(`Done: ${last?.action || 'updated'}`)
      if (body.action === 'forward') {
        setForwardTo('')
        setForwardNote('')
      }
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setBusy('')
    }
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-gray-700">
        <p>Your admin session has expired.</p>
        <Link href="/admin" className="rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white">
          Log in again
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Click & Collect orders</h1>
              <p className="text-sm text-gray-500">Order history, receipts and pickup notifications</p>
            </div>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(['all', 'received', 'ready', 'collected', 'cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  statusFilter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                {s === 'all' ? 'All' : STATUS_LABELS[s]} ({counts[s] || 0})
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference, name, email, phone, branch…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
            {loading && orders.length === 0 && <p className="p-4 text-sm text-gray-500">Loading orders…</p>}
            {!loading && filtered.length === 0 && <p className="p-4 text-sm text-gray-500">No orders found.</p>}
            {filtered.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSelectedId(o.id)
                  setNotice('')
                }}
                className={`w-full text-left p-4 hover:bg-gray-50 ${selectedId === o.id ? 'bg-primary-50' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900">{o.customer.name || o.customer.email}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
                    {STATUS_LABELS[o.status]}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {money(o.purchase.foreignAmount, o.purchase.foreignCurrency)} · {o.branch.name || 'No branch'}
                </div>
                <div className="mt-0.5 text-xs text-gray-400">
                  {o.id} · {o.country} · {fmtDate(o.createdAt)}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          {!selected ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
              {selectedId && !loading ? `Order ${selectedId} not found.` : 'Select an order to see details.'}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-5 lg:sticky lg:top-24">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selected.id}</h2>
                  <p className="text-sm text-gray-500">
                    Placed {fmtDate(selected.createdAt)} · {selected.country}
                    {selected.backendId && selected.backendId !== selected.id ? ` · 4D ${selected.backendId}` : ''}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                {(
                  [
                    ['Customer', selected.customer.name],
                    ['Email', selected.customer.email],
                    ['Phone', selected.customer.phone],
                    ['Date of birth', selected.customer.dateOfBirth],
                    ['Buying', money(selected.purchase.foreignAmount, selected.purchase.foreignCurrency)],
                    ['Rate', selected.purchase.exchangeRate ? String(selected.purchase.exchangeRate) : ''],
                    ['Fee', selected.purchase.feeAmount ? money(selected.purchase.feeAmount, selected.purchase.baseCurrency) : ''],
                    ['Total to pay', money(selected.purchase.totalDebitAmount, selected.purchase.baseCurrency)],
                    ['Rate held until', fmtDate(selected.purchase.rateExpiresAt)],
                    ['Branch', selected.branch.name],
                    ['Branch address', selected.branch.address],
                    ['Branch phone', selected.branch.phone],
                    ['Customer notes', selected.purchase.notes],
                    ['Backend status', selected.backendStatusText],
                  ] as Array<[string, string | undefined]>
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="font-medium text-gray-900 break-words">{v}</dd>
                    </div>
                  ))}
              </dl>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled={!!busy}
                  onClick={() =>
                    act(
                      { action: 'ready' },
                      `Email ${selected.customer.email} that their currency is ready to collect?`
                    )
                  }
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {busy === 'ready' ? 'Sending…' : 'Ready for pickup — email customer'}
                </button>
                <button
                  disabled={!!busy}
                  onClick={() => act({ action: 'resend' }, `Resend the receipt to ${selected.customer.email}?`)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                >
                  {busy === 'resend' ? 'Sending…' : 'Resend receipt'}
                </button>
                <button
                  disabled={!!busy}
                  onClick={() => act({ action: 'status', status: 'collected' })}
                  className="rounded-lg border border-green-300 px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-50 disabled:opacity-50"
                >
                  Mark collected
                </button>
                <button
                  disabled={!!busy}
                  onClick={() => act({ action: 'status', status: 'cancelled' }, 'Mark this order as cancelled?')}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel order
                </button>
                {selected.status !== 'received' && (
                  <button
                    disabled={!!busy}
                    onClick={() => act({ action: 'status', status: 'received' })}
                    className="rounded-lg px-3 py-2 text-sm text-gray-500 underline disabled:opacity-50"
                  >
                    Reset to received
                  </button>
                )}
              </div>

              <form
                className="rounded-lg bg-gray-50 p-3 space-y-2"
                onSubmit={(e) => {
                  e.preventDefault()
                  act({ action: 'forward', to: forwardTo, note: forwardNote })
                }}
              >
                <p className="text-sm font-semibold text-gray-800">Forward order details</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={forwardTo}
                    onChange={(e) => setForwardTo(e.target.value)}
                    placeholder="colleague@lotusfx.com"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    value={forwardNote}
                    onChange={(e) => setForwardNote(e.target.value)}
                    placeholder="Note (optional)"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!!busy}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {busy === 'forward' ? 'Sending…' : 'Forward'}
                  </button>
                </div>
              </form>

              {notice && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}

              <div>
                <p className="mb-2 text-sm font-semibold text-gray-800">History</p>
                <ol className="space-y-2 border-l-2 border-gray-200 pl-4">
                  {[...selected.events].reverse().map((ev, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-medium text-gray-900">{ev.action}</span>
                      {ev.detail && <span className="text-gray-600"> — {ev.detail}</span>}
                      <div className="text-xs text-gray-400">{fmtDate(ev.at)}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
