'use client'

import { useState } from 'react'
import { useCountry } from '@/context/CountryContext'

/**
 * Test page for the Exchange Rate API
 * This helps us test the API integration before updating the main calculator
 */

export default function TestCalculatorPage() {
  const { selectedCountry } = useCountry()
  const [fromCcy, setFromCcy] = useState('AUD')
  const [toCcy, setToCcy] = useState('NZD')
  const [toAmount, setToAmount] = useState('100')
  const [transferMode, setTransferMode] = useState('eWire')
  const [isBuy, setIsBuy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [xKey, setXKey] = useState('')
  const [xClient, setXClient] = useState('')

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Build request body
      const requestBody: any = {
        fromCcy,
        toCcy,
        toAmount: Number(toAmount),
        transferMode,
        isBuy,
        country: selectedCountry, // Pass selected country
      }

      // Add authentication headers (for testing)
      if (xKey) {
        requestBody._apiKey = xKey // This will be used as X-KEY header
      }
      if (xClient) {
        requestBody._bearerToken = xClient // This will be used as X-CLIENT header
      }

      const response = await fetch('/api/exchange-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.details || 'API request failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exchange Rate API Test</h1>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Selected Country:</span> {selectedCountry}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Currency
              </label>
              <input
                type="text"
                value={fromCcy}
                onChange={(e) => setFromCcy(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="NZD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Currency
              </label>
              <input
                type="text"
                value={toCcy}
                onChange={(e) => setToCcy(e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="AUD"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Amount
              </label>
              <input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Mode
              </label>
              <select
                value={transferMode}
                onChange={(e) => setTransferMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Wire">Wire</option>
                <option value="eWire">eWire</option>
                <option value="Booking">Booking</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isBuy}
                  onChange={(e) => setIsBuy(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Is Buy</span>
              </label>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Headers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X-KEY (API Key/Password)
                </label>
                <input
                  type="text"
                  value={xKey}
                  onChange={(e) => setXKey(e.target.value)}
                  placeholder="Enter X-KEY value"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use .env.local value
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X-CLIENT (Client Identifier)
                </label>
                <input
                  type="text"
                  value={xClient}
                  onChange={(e) => setXClient(e.target.value)}
                  placeholder="Enter X-CLIENT value"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use .env.local value
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={testAPI}
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-semibold mb-2">Success!</h3>
              <pre className="text-sm text-green-700 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">API Request Format</h2>
          <pre className="text-sm text-blue-800 bg-blue-100 p-4 rounded overflow-auto">
{`POST /api/exchange-rate
Content-Type: application/json

{
  "fromCcy": "${fromCcy}",
  "toCcy": "${toCcy}",
  "toAmount": ${toAmount},
  "transferMode": "${transferMode}",
  "isBuy": ${isBuy}
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
