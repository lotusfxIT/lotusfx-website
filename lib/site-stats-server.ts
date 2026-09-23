import fs from 'fs'
import path from 'path'
import { DEFAULT_SITE_STATS, mergeSiteStats, type SiteStats } from '@/config/stats'
import { readAdminJson, writeAdminJson } from '@/lib/admin-json-store'

const STATS_RELATIVE = 'public/site-stats.json'
const STATS_FILE = path.join(process.cwd(), STATS_RELATIVE)

/** Sync read for callers that cannot await (defaults / cold paths). Prefer readSiteStats(). */
export function readSiteStatsFile(): SiteStats {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf-8')
      return mergeSiteStats(JSON.parse(raw))
    }
  } catch (error) {
    console.error('[site-stats] sync read error:', error)
  }
  return DEFAULT_SITE_STATS
}

export async function readSiteStats(): Promise<SiteStats> {
  const data = await readAdminJson<Partial<SiteStats>>(STATS_RELATIVE, DEFAULT_SITE_STATS)
  return mergeSiteStats(data)
}

export async function writeSiteStats(stats: SiteStats) {
  return writeAdminJson(STATS_RELATIVE, stats)
}

/** @deprecated Prefer writeSiteStats() */
export function writeSiteStatsFile(stats: SiteStats): boolean {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('[site-stats] write error:', error)
    return false
  }
}
