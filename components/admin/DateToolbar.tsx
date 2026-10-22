'use client'

import type { DatePreset } from '@/lib/admin-list'
import { monthLabel } from '@/lib/admin-list'

const PRESETS: Array<{ id: DatePreset; label: string }> = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: 'all', label: 'All dates' },
]

export default function DateToolbar({
  preset,
  month,
  months,
  onPreset,
  onMonth,
}: {
  preset: DatePreset
  month: string
  months: string[]
  onPreset: (preset: DatePreset) => void
  onMonth: (month: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onPreset(p.id)}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            !month && preset === p.id ? 'bg-primary-700 text-white' : 'bg-white border border-gray-300 text-gray-700'
          }`}
        >
          {p.label}
        </button>
      ))}
      {months.length > 0 && (
        <select
          value={month}
          onChange={(e) => onMonth(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
        >
          <option value="">By month</option>
          {months.map((key) => (
            <option key={key} value={key}>
              {monthLabel(key)}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
