'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import DateToolbar from '@/components/admin/DateToolbar'
import type { MessageRecord } from '@/lib/messages'
import {
  dayKey,
  groupByDay,
  inDatePreset,
  monthKey,
  uniqueMonths,
  type DatePreset,
} from '@/lib/admin-list'

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function fmtDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })
}

const EMAIL_STATUS: Record<MessageRecord['emailStatus'], { label: string; cls: string }> = {
  sent: { label: 'Emailed', cls: 'text-green-700' },
  failed: { label: 'Email FAILED — reply from here', cls: 'text-red-700 font-semibold' },
  'not-configured': { label: 'Not emailed', cls: 'text-amber-700' },
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRecord[]>([])
  const [canDelete, setCanDelete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [unauthorized, setUnauthorized] = useState(false)
  const [filter, setFilter] = useState<'new' | 'handled' | 'all'>('new')
  const [query, setQuery] = useState('')
  const [datePreset, setDatePreset] = useState<DatePreset>('all')
  const [month, setMonth] = useState('')
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({})
  const [openId, setOpenId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/messages', { headers: authHeaders(), cache: 'no-store' })
      if (res.status === 401) {
        setUnauthorized(true)
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not load messages')
      setMessages(data.messages || [])
      setCanDelete(!!data.canDelete)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return messages.filter((m) => {
      if (filter !== 'all' && m.status !== filter) return false
      if (month && monthKey(m.createdAt) !== month) return false
      if (!month && !inDatePreset(m.createdAt, datePreset)) return false
      if (!q) return true
      return [m.name, m.email, m.phone, m.subject, m.message, m.id]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [messages, filter, query, datePreset, month])

  const groups = useMemo(() => groupByDay(filtered), [filtered])
  const months = useMemo(() => uniqueMonths(messages), [messages])
  const todayKey = dayKey(new Date().toISOString())

  function isDayOpen(key: string) {
    if (openDays[key] !== undefined) return openDays[key]
    if (groups.some((g) => g.key === key && g.items.some((item) => item.id === openId))) return true
    return key === todayKey || groups[0]?.key === key
  }

  async function setStatus(m: MessageRecord, status: 'new' | 'handled') {
    const res = await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ id: m.id, status }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error || 'Could not update message')
      return
    }
    setMessages((prev) => prev.map((x) => (x.id === m.id ? data.message : x)))
  }

  async function removeMessage(m: MessageRecord) {
    if (!canDelete) return
    if (!window.confirm(`Permanently delete the message from ${m.name}?`)) return
    setBusyId(m.id)
    setError('')
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: m.id, action: 'delete' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not delete message')
      setMessages((prev) => prev.filter((x) => x.id !== m.id))
      if (openId === m.id) setOpenId(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete message')
    } finally {
      setBusyId('')
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

  const newCount = messages.filter((m) => m.status === 'new').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact messages</h1>
              <p className="text-sm text-gray-500">Grouped by date — every website enquiry, even if the email didn&apos;t go through</p>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {(['new', 'handled', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-700'
              }`}
            >
              {f === 'new' ? `New (${newCount})` : f === 'handled' ? 'Handled' : `All (${messages.length})`}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, message…"
            className="ml-auto w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <DateToolbar
          preset={datePreset}
          month={month}
          months={months}
          onPreset={(p) => {
            setDatePreset(p)
            setMonth('')
          }}
          onMonth={(m) => {
            setMonth(m)
            setDatePreset('all')
          }}
        />
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {loading && messages.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">Loading messages…</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">No messages.</p>
        )}
        <div className="space-y-3">
          {groups.map((group) => {
            const open = isDayOpen(group.key)
            return (
              <div key={group.key} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenDays((prev) => ({ ...prev, [group.key]: !open }))}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100"
                >
                  <span className="font-semibold text-gray-900">{group.label}</span>
                  <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                    {group.items.length} {group.items.length === 1 ? 'message' : 'messages'}
                    <ChevronDownIcon className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
                  </span>
                </button>
                {open && (
                  <div className="divide-y divide-gray-100">
                    {group.items.map((m) => {
                      const itemOpen = openId === m.id
                      return (
                        <div key={m.id} className="p-4">
                          <button onClick={() => setOpenId(itemOpen ? null : m.id)} className="w-full text-left">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-semibold text-gray-900">
                                {m.name} <span className="font-normal text-gray-500">· {m.subject}</span>
                              </span>
                              <span className="text-xs text-gray-400">
                                {m.country} · {fmtDate(m.createdAt)}
                              </span>
                            </div>
                            {!itemOpen && <p className="mt-1 text-sm text-gray-600 line-clamp-1">{m.message}</p>}
                          </button>
                          {itemOpen && (
                            <div className="mt-3 space-y-3">
                              <p className="whitespace-pre-wrap text-sm text-gray-800">{m.message}</p>
                              <div className="text-sm text-gray-600">
                                <a href={`mailto:${m.email}`} className="text-primary-700 underline">
                                  {m.email}
                                </a>
                                {m.phone && (
                                  <>
                                    {' '}
                                    · <a href={`tel:${m.phone}`}>{m.phone}</a>
                                  </>
                                )}
                              </div>
                              <p className={`text-xs ${EMAIL_STATUS[m.emailStatus].cls}`}>
                                {EMAIL_STATUS[m.emailStatus].label}
                                {m.emailedTo ? ` (${m.emailedTo})` : ''}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <a
                                  href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-800"
                                >
                                  Reply
                                </a>
                                {m.status === 'new' ? (
                                  <button
                                    onClick={() => setStatus(m, 'handled')}
                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white"
                                  >
                                    Mark handled
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setStatus(m, 'new')}
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600"
                                  >
                                    Handled {fmtDate(m.handledAt)} — reopen
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    disabled={busyId === m.id}
                                    onClick={() => removeMessage(m)}
                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    {busyId === m.id ? 'Deleting…' : 'Delete'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
