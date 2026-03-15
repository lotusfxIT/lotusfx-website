'use client'

import { useState } from 'react'

export default function TestLocationsPage() {
  const [tokenStatus, setTokenStatus] = useState<any>(null)
  const [cacheStatus, setCacheStatus] = useState<any>(null)
  const [locations, setLocations] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testTokenStatus = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/token-status')
      const data = await response.json()
      setTokenStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test token status')
    } finally {
      setLoading(false)
    }
  }

  const testCacheRefresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/admin/refresh-cache', {
        method: 'POST',
      })
      const data = await response.json()
      setCacheStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh cache')
    } finally {
      setLoading(false)
    }
  }

  const testCachedLocations = async (country?: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = country 
        ? `/api/locations/cached?country=${country}`
        : '/api/locations/cached'
      const response = await fetch(url)
      const data = await response.json()
      setLocations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch locations')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Local Testing - Google My Business API
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Token Status Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">1. Token Status</h2>
            <button
              onClick={testTokenStatus}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
            >
              Test Token Status
            </button>
            {tokenStatus && (
              <div className="bg-gray-50 rounded p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(tokenStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Cache Refresh Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">2. Cache Refresh</h2>
            <button
              onClick={testCacheRefresh}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-4"
            >
              Refresh Cache
            </button>
            {cacheStatus && (
              <div className="bg-gray-50 rounded p-4">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(cacheStatus, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Cached Locations Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">3. Cached Locations</h2>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => testCachedLocations()}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Get All Locations
              </button>
              <button
                onClick={() => testCachedLocations('AU')}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Get AU Locations
              </button>
              <button
                onClick={() => testCachedLocations('NZ')}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Get NZ Locations
              </button>
              <button
                onClick={() => testCachedLocations('FJ')}
                disabled={loading}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                Get FJ Locations
              </button>
            </div>
            {locations && (
              <div className="bg-gray-50 rounded p-4">
                <div className="mb-2 text-sm">
                  <strong>Status:</strong> {locations.cached ? '✅ Cached' : '🔄 Fresh'}
                  {locations.stale && ' (Stale)'}
                  <br />
                  <strong>Count:</strong> {locations.locations?.length || 0}
                  <br />
                  <strong>Timestamp:</strong> {new Date(locations.timestamp).toLocaleString()}
                </div>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold">
                    View Locations Data ({locations.locations?.length || 0} locations)
                  </summary>
                  <pre className="text-xs overflow-auto mt-2 max-h-96">
                    {JSON.stringify(locations, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📋 Testing Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Make sure you've set environment variables in <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
              <li>Click "Test Token Status" - should show "valid" status</li>
              <li>Click "Refresh Cache" - should fetch locations from Google API</li>
              <li>Click "Get All Locations" - should return cached data</li>
              <li>Test country filters (AU, NZ, FJ)</li>
              <li>Visit <code className="bg-blue-100 px-1 rounded">/locations</code> page - should load without auth</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
