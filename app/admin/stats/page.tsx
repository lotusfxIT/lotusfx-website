'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { DEFAULT_SITE_STATS, fillStatsTemplate, mergeSiteStats, type SiteStats } from '@/config/stats'

const inputClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'

const textareaClass =
  'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[88px] text-sm'

function Field({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>
      {hint ? <p className="text-xs text-gray-500 mb-1.5">{hint}</p> : null}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </div>
  )
}

function TextArea({
  label,
  hint,
  value,
  onChange,
  preview,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  preview?: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-1.5">{label}</label>
      {hint ? <p className="text-xs text-gray-500 mb-1.5">{hint}</p> : null}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} className={textareaClass} rows={3} />
      {preview ? (
        <p className="mt-2 text-xs text-gray-500">
          Preview: <span className="text-gray-700">{preview}</span>
        </p>
      ) : null}
    </div>
  )
}

export default function AdminSiteStatsPage() {
  const [stats, setStats] = useState<SiteStats>(DEFAULT_SITE_STATS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || ''
        const res = await fetch('/api/admin/stats', {
          credentials: 'include',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (res.status === 401) {
          window.location.href = '/admin'
          return
        }
        if (res.ok) {
          setStats(mergeSiteStats(await res.json()))
        }
      } catch {
        setError('Could not load site stats')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const patch = (partial: Partial<SiteStats>) => {
    setStats((prev) => mergeSiteStats({ ...prev, ...partial }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('adminToken') || ''
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(stats),
      })
      const data = await res.json()
      if (!res.ok) {
        const fallback = data.stats ? mergeSiteStats(data.stats) : stats
        if (data.stats) setStats(fallback)
        const blob = new Blob([JSON.stringify(fallback, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'site-stats.json'
        a.click()
        URL.revokeObjectURL(url)
        setError(
          (data.error || 'Could not save on server') +
            ' — JSON downloaded. Commit public/site-stats.json for a permanent update.'
        )
        return
      }
      if (data.stats) setStats(mergeSiteStats(data.stats))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'site-stats.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'))
        setStats(mergeSiteStats(parsed))
        setError('')
        setSaved(false)
      } catch {
        setError('Invalid JSON file — could not import')
      }
    }
    reader.readAsText(file)
  }

  const resetDefaults = () => {
    if (!window.confirm('Reset all fields to built-in defaults? Unsaved changes will be lost.')) return
    setStats(DEFAULT_SITE_STATS)
    setSaved(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">
        Loading site stats…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Site stats & contact</h1>
              <p className="text-sm text-gray-500">Homepage cards, branch counts, emails, hours, marketing copy</p>
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
              onClick={resetDefaults}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition"
            >
              {saving ? 'Saving…' : saved ? (
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {error ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
            {error}
          </div>
        ) : null}

        <p className="text-sm text-gray-600 rounded-xl border border-gray-200 bg-white px-4 py-3">
          Edits write to <code className="font-mono text-xs">public/site-stats.json</code>. On Vercel,
          file writes may not stick after redeploy — use <strong>Download JSON</strong> and commit that
          file if you need a permanent production update. Copy fields support placeholders like{' '}
          <code className="font-mono text-xs">{'{branches.total}'}</code>,{' '}
          <code className="font-mono text-xs">{'{customers.total}'}</code>,{' '}
          <code className="font-mono text-xs">{'{totalTransferred}'}</code>.
        </p>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Homepage stat cards</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Customer rating"
              hint="Shown on the first hero card"
              value={stats.customerRating}
              onChange={(v) => patch({ customerRating: v })}
            />
            <Field
              label="Currencies available"
              hint="e.g. 40+"
              value={stats.currenciesAvailable}
              onChange={(v) => patch({ currenciesAvailable: v })}
            />
            <Field
              label="Years of experience"
              hint="e.g. 20+"
              value={stats.yearsOfExcellence}
              onChange={(v) => patch({ yearsOfExcellence: v })}
            />
            <Field
              label="Total transferred"
              hint="Used on Features / About"
              value={stats.totalTransferred}
              onChange={(v) => patch({ totalTransferred: v })}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Branch counts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Australia"
              value={stats.branches.australia}
              onChange={(v) => patch({ branches: { ...stats.branches, australia: v } })}
            />
            <Field
              label="New Zealand"
              value={stats.branches.newZealand}
              onChange={(v) => patch({ branches: { ...stats.branches, newZealand: v } })}
            />
            <Field
              label="Fiji"
              value={stats.branches.fiji}
              onChange={(v) => patch({ branches: { ...stats.branches, fiji: v } })}
            />
            <Field
              label="Total (all countries)"
              value={stats.branches.total}
              onChange={(v) => patch({ branches: { ...stats.branches, total: v } })}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Customer counts</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Australia"
              value={stats.customers.australia}
              onChange={(v) => patch({ customers: { ...stats.customers, australia: v } })}
            />
            <Field
              label="New Zealand"
              value={stats.customers.newZealand}
              onChange={(v) => patch({ customers: { ...stats.customers, newZealand: v } })}
            />
            <Field
              label="Fiji"
              value={stats.customers.fiji}
              onChange={(v) => patch({ customers: { ...stats.customers, fiji: v } })}
            />
            <Field
              label="Total"
              value={stats.customers.total}
              onChange={(v) => patch({ customers: { ...stats.customers, total: v } })}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Support emails</h2>
          <div className="grid sm:grid-cols-1 gap-4">
            <Field
              label="Australia"
              value={stats.emails.australia}
              onChange={(v) => patch({ emails: { ...stats.emails, australia: v } })}
            />
            <Field
              label="New Zealand"
              value={stats.emails.newZealand}
              onChange={(v) => patch({ emails: { ...stats.emails, newZealand: v } })}
            />
            <Field
              label="Fiji"
              value={stats.emails.fiji}
              onChange={(v) => patch({ emails: { ...stats.emails, fiji: v } })}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Business hours</h2>
          <div className="grid sm:grid-cols-1 gap-4">
            <Field
              label="Australia"
              value={stats.businessHours.australia}
              onChange={(v) =>
                patch({ businessHours: { ...stats.businessHours, australia: v } })
              }
            />
            <Field
              label="New Zealand"
              value={stats.businessHours.newZealand}
              onChange={(v) =>
                patch({ businessHours: { ...stats.businessHours, newZealand: v } })
              }
            />
            <Field
              label="Fiji"
              value={stats.businessHours.fiji}
              onChange={(v) => patch({ businessHours: { ...stats.businessHours, fiji: v } })}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Hero feature bullets</h2>
          <Field
            label="Trusted by prefix"
            hint='Shown as “Trusted by {customers} customers”'
            value={stats.hero.trustedPrefix}
            onChange={(v) => patch({ hero: { ...stats.hero, trustedPrefix: v } })}
          />
          <Field
            label="Feature 1"
            value={stats.hero.featureCompetitiveRates}
            onChange={(v) => patch({ hero: { ...stats.hero, featureCompetitiveRates: v } })}
          />
          <Field
            label="Feature 2"
            value={stats.hero.featureNoCommission}
            onChange={(v) => patch({ hero: { ...stats.hero, featureNoCommission: v } })}
          />
          <Field
            label="Feature 3 (locations)"
            value={stats.hero.featureLocations}
            onChange={(v) => patch({ hero: { ...stats.hero, featureLocations: v } })}
          />
          <Field
            label="Feature 4 (currencies)"
            value={stats.hero.featureCurrencies}
            onChange={(v) => patch({ hero: { ...stats.hero, featureCurrencies: v } })}
          />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900">Marketing copy</h2>
          <p className="text-sm text-gray-500">
            Used on Features, About, Contact, and Fiji branch panels. Placeholders auto-fill from the
            counts above.
          </p>
          <TextArea
            label="Features — Convenient locations"
            hint="Homepage Features section card"
            value={stats.copy.featuresLocationsDescription}
            onChange={(v) => patch({ copy: { ...stats.copy, featuresLocationsDescription: v } })}
            preview={fillStatsTemplate(stats.copy.featuresLocationsDescription, stats)}
          />
          <TextArea
            label="About — Growth story"
            hint="About page company history paragraph"
            value={stats.copy.aboutGrowth}
            onChange={(v) => patch({ copy: { ...stats.copy, aboutGrowth: v } })}
            preview={fillStatsTemplate(stats.copy.aboutGrowth, stats)}
          />
          <TextArea
            label="About — Pacific intro"
            hint="Serving the Pacific section subtitle"
            value={stats.copy.aboutPacificIntro}
            onChange={(v) => patch({ copy: { ...stats.copy, aboutPacificIntro: v } })}
            preview={fillStatsTemplate(stats.copy.aboutPacificIntro, stats)}
          />
          <TextArea
            label="Contact — Visit a branch"
            hint="Contact page visit-branch card description"
            value={stats.copy.contactVisitBranch}
            onChange={(v) => patch({ copy: { ...stats.copy, contactVisitBranch: v } })}
            preview={fillStatsTemplate(stats.copy.contactVisitBranch, stats)}
          />
          <Field
            label="Fiji panel — branches label"
            hint="Fiji calculator placeholder list item"
            value={stats.copy.fijiBranchesLabel}
            onChange={(v) => patch({ copy: { ...stats.copy, fijiBranchesLabel: v } })}
          />
        </motion.section>
      </div>
    </div>
  )
}
