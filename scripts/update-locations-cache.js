/**
 * Background Job Script - Update Locations Cache
 * 
 * This script should be run periodically (every 30 minutes) to update the cache.
 * 
 * Usage:
 * - Vercel Cron: Add to vercel.json
 * - Node Cron: Use node-cron library
 * - External Cron: Set up cron-job.org or similar
 * - GitHub Actions: Scheduled workflow
 * 
 * For local testing:
 * node scripts/update-locations-cache.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function updateCache() {
  try {
    console.log(`[${new Date().toISOString()}] Starting cache update...`)
    
    const response = await fetch(`${BASE_URL}/api/admin/refresh-cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to refresh cache')
    }

    const data = await response.json()
    console.log(`[${new Date().toISOString()}] Cache updated successfully:`)
    console.log(`  - Locations: ${data.locationsCount}`)
    console.log(`  - Cached: ${data.cached}`)
    console.log(`  - Timestamp: ${new Date(data.timestamp).toISOString()}`)
    
    return data
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Cache update failed:`, error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  updateCache()
    .then(() => {
      console.log('Cache update completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Cache update failed:', error)
      process.exit(1)
    })
}

module.exports = { updateCache }
