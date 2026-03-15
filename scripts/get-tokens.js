/**
 * Helper script to extract tokens from localStorage
 * 
 * Run this in browser console after authenticating:
 * 1. Go to /locations page
 * 2. Authenticate with Google
 * 3. Open browser console (F12)
 * 4. Copy and paste this code, or run: node scripts/get-tokens.js (if you have the values)
 */

// If running in browser console, use this:
if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('google_access_token')
  const refreshToken = localStorage.getItem('google_refresh_token')
  const expiry = localStorage.getItem('google_token_expiry')

  console.log('\n=== Copy these to your .env.local file ===\n')
  console.log(`GOOGLE_ACCESS_TOKEN=${accessToken}`)
  console.log(`GOOGLE_REFRESH_TOKEN=${refreshToken}`)
  console.log(`GOOGLE_TOKEN_EXPIRY=${expiry}`)
  console.log('\n==========================================\n')
} else {
  // If running as Node script, prompt for values
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log('\n📝 Token Setup Helper\n')
  console.log('After authenticating at /locations, get these values from browser localStorage:\n')

  rl.question('GOOGLE_ACCESS_TOKEN: ', (accessToken) => {
    rl.question('GOOGLE_REFRESH_TOKEN: ', (refreshToken) => {
      rl.question('GOOGLE_TOKEN_EXPIRY (or press Enter to calculate from expires_in): ', (expiry) => {
        if (!expiry) {
          rl.question('expires_in (seconds, usually 3600): ', (expiresIn) => {
            const expiryTime = Date.now() + (parseInt(expiresIn || '3600') * 1000)
            console.log('\n=== Add these to your .env.local file ===\n')
            console.log(`GOOGLE_ACCESS_TOKEN=${accessToken}`)
            console.log(`GOOGLE_REFRESH_TOKEN=${refreshToken}`)
            console.log(`GOOGLE_TOKEN_EXPIRY=${expiryTime}`)
            console.log('\n==========================================\n')
            rl.close()
          })
        } else {
          console.log('\n=== Add these to your .env.local file ===\n')
          console.log(`GOOGLE_ACCESS_TOKEN=${accessToken}`)
          console.log(`GOOGLE_REFRESH_TOKEN=${refreshToken}`)
          console.log(`GOOGLE_TOKEN_EXPIRY=${expiry}`)
          console.log('\n==========================================\n')
          rl.close()
        }
      })
    })
  })
}
