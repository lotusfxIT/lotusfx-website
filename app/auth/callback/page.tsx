'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
          setStatus(`Error: ${error}`)
          return
        }

        if (!code) {
          setStatus('No authorization code received')
          return
        }

        setStatus('Exchanging code for access token...')
        console.log('Exchanging code for token:', { code: code ? 'Present' : 'Missing' })

        // Exchange authorization code for access token
        const tokenResponse = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })
        
        console.log('Token exchange response status:', tokenResponse.status)

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          console.error('Token exchange failed:', errorData)
          throw new Error(`Failed to exchange code for token: ${errorData.details || errorData.error || 'Unknown error'}`)
        }

        const tokenData = await tokenResponse.json()

        // Store token in localStorage for now (in production, use secure storage)
        localStorage.setItem('google_access_token', tokenData.access_token)
        localStorage.setItem('google_refresh_token', tokenData.refresh_token)
        localStorage.setItem('google_token_expiry', tokenData.expiry_date?.toString() || '')

        setStatus('Authentication successful! Redirecting...')
        
        // Redirect back to locations page
        setTimeout(() => {
          router.push('/locations')
        }, 2000)

      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    handleCallback()
  }, [searchParams, router])

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
          Google My Business Authentication
        </h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
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
            Google My Business Authentication
          </h2>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
