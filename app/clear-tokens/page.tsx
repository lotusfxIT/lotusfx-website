'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ClearTokensPage() {
  const router = useRouter()
  const [status, setStatus] = useState('Clearing tokens...')

  useEffect(() => {
    // Clear all Google tokens from localStorage
    localStorage.removeItem('google_access_token')
    localStorage.removeItem('google_refresh_token')
    localStorage.removeItem('google_token_expiry')
    localStorage.removeItem('google_locations')

    setStatus('✅ Tokens cleared! Redirecting to locations page...')

    // Redirect to locations page after 2 seconds
    setTimeout(() => {
      router.push('/locations')
    }, 2000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="loading-dots mx-auto">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Clearing Tokens
        </h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}
