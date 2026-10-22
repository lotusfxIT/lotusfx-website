export type DatePreset = 'all' | 'today' | '7d' | '30d'

const DEFAULT_TZ = 'Australia/Sydney'

export function dayKey(iso: string, tz = DEFAULT_TZ): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-CA', { timeZone: tz })
}

export function monthKey(iso: string, tz = DEFAULT_TZ): string {
  return dayKey(iso, tz).slice(0, 7)
}

export function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number)
  if (!year || !month) return key
  return new Date(year, month - 1, 1).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
}

export function dayLabel(iso: string, tz = DEFAULT_TZ): string {
  const key = dayKey(iso, tz)
  if (!key) return ''
  const today = dayKey(new Date().toISOString(), tz)
  const yesterdayDate = new Date()
  yesterdayDate.setDate(yesterdayDate.getDate() - 1)
  const yesterday = dayKey(yesterdayDate.toISOString(), tz)
  const pretty = new Date(iso).toLocaleDateString('en-AU', {
    timeZone: tz,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  if (key === today) return `Today — ${pretty}`
  if (key === yesterday) return `Yesterday — ${pretty}`
  return pretty
}

export function inDatePreset(iso: string, preset: DatePreset, tz = DEFAULT_TZ): boolean {
  if (preset === 'all') return true
  const key = dayKey(iso, tz)
  if (!key) return false
  const today = dayKey(new Date().toISOString(), tz)
  if (preset === 'today') return key === today
  const days = preset === '7d' ? 7 : 30
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (days - 1))
  const startKey = dayKey(start.toISOString(), tz)
  return key >= startKey && key <= today
}

export type DayGroup<T> = { key: string; label: string; items: T[] }

export function groupByDay<T extends { createdAt: string }>(items: T[], tz = DEFAULT_TZ): DayGroup<T>[] {
  const groups = new Map<string, DayGroup<T>>()
  for (const item of items) {
    const key = dayKey(item.createdAt, tz) || 'unknown'
    const existing = groups.get(key)
    if (existing) {
      existing.items.push(item)
    } else {
      groups.set(key, { key, label: dayLabel(item.createdAt, tz) || 'Unknown date', items: [item] })
    }
  }
  return Array.from(groups.values())
}

export function uniqueMonths<T extends { createdAt: string }>(items: T[], tz = DEFAULT_TZ): string[] {
  const keys = new Set<string>()
  for (const item of items) {
    const key = monthKey(item.createdAt, tz)
    if (key) keys.add(key)
  }
  return Array.from(keys).sort().reverse()
}
