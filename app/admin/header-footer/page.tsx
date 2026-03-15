'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PencilSquareIcon, CheckIcon, XMarkIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface HeaderFooterConfig {
  header?: {
    logo_text?: string
    nav_items?: Array<{ name: string; href: string }>
  }
  footer?: {
    company_name?: string
    description?: string
    contact_phone?: string
    contact_email?: string
    social_links?: Array<{ name: string; url: string }>
    sections?: Record<string, Array<{ name: string; href: string }>>
    legal_links?: Array<{ name: string; href: string }>
  }
}

export default function HeaderFooterEditor() {
  const router = useRouter()
  const [config, setConfig] = useState<HeaderFooterConfig>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin')
      return
    }
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/header-footer')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      setMessage('Failed to load configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section: string) => {
    setEditingSection(section)
    const sectionKey = section as keyof HeaderFooterConfig
    setEditData(JSON.parse(JSON.stringify(config[sectionKey] || {})))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const updatedConfig = { ...config }
      const sectionKey = editingSection as keyof HeaderFooterConfig
      updatedConfig[sectionKey] = editData

      const response = await fetch('/api/admin/header-footer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updatedConfig),
      })

      if (response.ok) {
        setMessage('✅ Configuration saved successfully!')
        setEditingSection(null)
        setConfig(updatedConfig)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Failed to save configuration')
      }
    } catch (error) {
      setMessage('❌ Error saving configuration')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pb-6 border-b-2 border-primary-200"
        >
          <h1 className="text-4xl font-bold text-primary-700 mb-2">📌 Edit Header & Footer</h1>
          <p className="text-gray-600">Customize navigation, links, and contact information</p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mb-6 px-4 py-3 rounded-lg border ${
              message.includes('✅')
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md border-l-4 border-primary-600 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-700">📌 Header</h2>
              {editingSection !== 'header' && (
                <button
                  onClick={() => handleEdit('header')}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>

            {editingSection === 'header' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Text</label>
                  <input
                    type="text"
                    value={editData.logo_text || ''}
                    onChange={(e) => setEditData({ ...editData, logo_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Navigation Items</label>
                    <button
                      onClick={() => {
                        const newItems = [...(editData.nav_items || []), { name: '', href: '' }]
                        setEditData({ ...editData, nav_items: newItems })
                      }}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                    >
                      <PlusIcon className="w-4 h-4" /> Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editData.nav_items || []).map((item: any, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Name"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...editData.nav_items]
                            newItems[i].name = e.target.value
                            setEditData({ ...editData, nav_items: newItems })
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={item.href}
                          onChange={(e) => {
                            const newItems = [...editData.nav_items]
                            newItems[i].href = e.target.value
                            setEditData({ ...editData, nav_items: newItems })
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => {
                            const newItems = editData.nav_items.filter((_: any, idx: number) => idx !== i)
                            setEditData({ ...editData, nav_items: newItems })
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(config.header, null, 2)}
              </pre>
            )}
          </motion.div>

          {/* Footer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md border-l-4 border-primary-600 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary-700">📍 Footer</h2>
              {editingSection !== 'footer' && (
                <button
                  onClick={() => handleEdit('footer')}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit
                </button>
              )}
            </div>

            {editingSection === 'footer' ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-3">📋 Basic Information</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={editData.company_name || ''}
                      onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Description"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="Contact Phone"
                      value={editData.contact_phone || ''}
                      onChange={(e) => setEditData({ ...editData, contact_phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Contact Email"
                      value={editData.contact_email || ''}
                      onChange={(e) => setEditData({ ...editData, contact_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Footer Sections */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-purple-900">📑 Footer Sections (Services, Locations, etc.)</h3>
                    <button
                      onClick={() => {
                        const sections = editData.sections || {}
                        const newSectionName = `section-${Object.keys(sections).length + 1}`
                        sections[newSectionName] = [{ name: '', href: '' }]
                        setEditData({ ...editData, sections })
                      }}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm"
                    >
                      <PlusIcon className="w-4 h-4" /> Add Section
                    </button>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(editData.sections || {}).map(([sectionKey, items]: [string, any]) => (
                      <div key={sectionKey} className="bg-white p-3 rounded border border-purple-200">
                        <div className="flex justify-between items-center mb-2">
                          <input
                            type="text"
                            placeholder="Section Title (e.g., Services, Locations)"
                            value={sectionKey}
                            onChange={(e) => {
                              const sections = { ...editData.sections }
                              delete sections[sectionKey]
                              sections[e.target.value] = items
                              setEditData({ ...editData, sections })
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-bold"
                          />
                          <button
                            onClick={() => {
                              const sections = { ...editData.sections }
                              delete sections[sectionKey]
                              setEditData({ ...editData, sections })
                            }}
                            className="text-red-600 hover:text-red-700 ml-2"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-2 ml-2">
                          {items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Link name"
                                value={item.name}
                                onChange={(e) => {
                                  const sections = { ...editData.sections }
                                  sections[sectionKey][i].name = e.target.value
                                  setEditData({ ...editData, sections })
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                              <input
                                type="text"
                                placeholder="URL"
                                value={item.href}
                                onChange={(e) => {
                                  const sections = { ...editData.sections }
                                  sections[sectionKey][i].href = e.target.value
                                  setEditData({ ...editData, sections })
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                              <button
                                onClick={() => {
                                  const sections = { ...editData.sections }
                                  sections[sectionKey] = sections[sectionKey].filter((_: any, idx: number) => idx !== i)
                                  setEditData({ ...editData, sections })
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const sections = { ...editData.sections }
                              sections[sectionKey].push({ name: '', href: '' })
                              setEditData({ ...editData, sections })
                            }}
                            className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                          >
                            <PlusIcon className="w-3 h-3" /> Add Link
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckIcon className="w-5 h-5" />
                    Save
                  </button>
                  <button
                    onClick={() => setEditingSection(null)}
                    className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(config.footer, null, 2)}
              </pre>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

