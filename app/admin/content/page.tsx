'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const countries = ['AU', 'NZ', 'FJ']

export default function AdminContentPage() {
  const router = useRouter()
  const [selectedCountry, setSelectedCountry] = useState('AU')
  const [content, setContent] = useState<any>(null)
  const [editingContent, setEditingContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin')
      return
    }
    fetchContent()
  }, [selectedCountry])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/content/${selectedCountry}`)
      const data = await response.json()
      setContent(data)
      setEditingContent(data)
    } catch (error) {
      console.error('Error fetching content:', error)
      setMessage('Error loading content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/content/${selectedCountry}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingContent),
      })

      if (!response.ok) throw new Error('Failed to save')
      setContent(editingContent)
      setMessage('✅ Content saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error saving content:', error)
      setMessage('❌ Error saving content')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingContent(content)
    setMessage('')
  }

  const handleChange = (field: string, value: string) => {
    setEditingContent({
      ...editingContent,
      [field]: value,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="mb-8 pb-6 border-b-2 border-primary-200">
          <h1 className="text-4xl font-bold text-primary-700 mb-2">Edit Country Content</h1>
          <p className="text-gray-600">Customize content for each country</p>
        </motion.div>

        {/* Country Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">Select Country</label>
          <div className="grid grid-cols-3 gap-4">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(country)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCountry === country
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                }`}
              >
                <div className="font-semibold">{country}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
          >
            {message}
          </motion.div>
        )}

        {/* Content Editor */}
        <motion.div className="bg-white rounded-lg shadow-md border-l-4 border-primary-600 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
            <input
              type="text"
              value={editingContent?.heroTitle || ''}
              onChange={(e) => handleChange('heroTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter hero title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
            <textarea
              value={editingContent?.heroSubtitle || ''}
              onChange={(e) => handleChange('heroSubtitle', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter hero subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Branches (e.g., 20 in AU, 18 in NZ, 16 in FJ)</label>
            <input
              type="text"
              value={editingContent?.branches || ''}
              onChange={(e) => handleChange('branches', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 20 branches across Australia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customers</label>
            <input
              type="text"
              value={editingContent?.customers || ''}
              onChange={(e) => handleChange('customers', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., 6,000+ satisfied customers"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exchange Rates Info</label>
            <input
              type="text"
              value={editingContent?.exchangeRates || ''}
              onChange={(e) => handleChange('exchangeRates', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Competitive rates updated in real-time"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              <CheckIcon className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition"
            >
              <XMarkIcon className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

