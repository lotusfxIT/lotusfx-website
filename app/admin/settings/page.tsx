'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'LotusFX',
    siteDescription: 'Currency Exchange & Money Transfer Services',
    siteUrl: 'https://lotusfx.com',
    contactEmail: 'info@lotusfx.com',
    contactPhone: '+1 (555) 123-4567',
    googleAnalyticsId: 'G-XXXXXXXXXX',
    googleMybusinessId: '104313690701494015090',
    maintenanceMode: false,
    enableComments: true,
    postsPerPage: 10,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setSettings(prev => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition"
          >
            {saving ? 'Saving...' : saved ? <><CheckIcon className="w-5 h-5" /> Saved</> : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Site Description</label>
                <textarea
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Site URL</label>
                <input
                  type="url"
                  name="siteUrl"
                  value={settings.siteUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Integration Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Integrations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Google Analytics ID</label>
                <input
                  type="text"
                  name="googleAnalyticsId"
                  value={settings.googleAnalyticsId}
                  onChange={handleChange}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Google My Business ID</label>
                <input
                  type="text"
                  name="googleMybusinessId"
                  value={settings.googleMybusinessId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Feature Settings */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
                <span className="text-gray-900 font-semibold">Maintenance Mode</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableComments"
                  checked={settings.enableComments}
                  onChange={handleChange}
                  className="w-5 h-5 rounded"
                />
                <span className="text-gray-900 font-semibold">Enable Blog Comments</span>
              </label>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Posts Per Page</label>
                <input
                  type="number"
                  name="postsPerPage"
                  value={settings.postsPerPage}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <Link
              href="/admin"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 px-6 rounded-lg transition text-center"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

