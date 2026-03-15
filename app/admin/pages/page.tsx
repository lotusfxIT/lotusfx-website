'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PencilSquareIcon, CheckIcon, XMarkIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface PageData {
  title?: string
  description?: string
  hero?: any
  features?: any
  testimonials?: any
  faq?: any
  [key: string]: any
}

interface PagesContent {
  [pageName: string]: PageData
}

export default function PagesEditor() {
  const router = useRouter()
  const [pages, setPages] = useState<PagesContent>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedPage, setSelectedPage] = useState<string>('home')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
  const [message, setMessage] = useState('')
  const [showNewPageForm, setShowNewPageForm] = useState(false)
  const [newPageName, setNewPageName] = useState('')

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/admin')
      return
    }
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages')
      const data = await response.json()
      setPages(data)
      if (Object.keys(data).length > 0) {
        setSelectedPage(Object.keys(data)[0])
      }
    } catch (error) {
      setMessage('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section: string) => {
    setEditingSection(section)
    setEditData(JSON.parse(JSON.stringify(pages[selectedPage]?.[section] || {})))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('adminToken')
      const updatedPages = { ...pages }
      updatedPages[selectedPage] = {
        ...updatedPages[selectedPage],
        [editingSection]: editData,
      }

      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          pages: updatedPages,
        }),
      })

      if (response.ok) {
        setMessage('✅ Content saved successfully!')
        setEditingSection(null)
        setPages(updatedPages)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ Failed to save content')
      }
    } catch (error) {
      setMessage('❌ Error saving content')
    } finally {
      setSaving(false)
    }
  }

  const handleCreatePage = async () => {
    if (!newPageName.trim()) return

    const updatedPages = { ...pages }
    updatedPages[newPageName.toLowerCase()] = {
      title: newPageName,
      description: '',
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          pages: updatedPages,
        }),
      })

      if (response.ok) {
        setPages(updatedPages)
        setSelectedPage(newPageName.toLowerCase())
        setNewPageName('')
        setShowNewPageForm(false)
        setMessage('✅ New page created!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('❌ Error creating page')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const sectionIcons: Record<string, string> = {
    title: '📝',
    description: '📋',
    hero: '🎯',
    features: '⭐',
    testimonials: '💬',
    faq: '❓',
    header: '📌',
    footer: '📍',
  }

  const currentPage = pages[selectedPage] || {}

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 pb-6 border-b-2 border-primary-200"
        >
          <h1 className="text-4xl font-bold text-primary-700 mb-2">📄 Edit Pages & Sections</h1>
          <p className="text-gray-600">Manage individual pages: Home, Currency Exchange, Money Transfer, etc.</p>
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

        {/* Page Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 items-center">
          {Object.keys(pages).map((pageName) => (
            <button
              key={pageName}
              onClick={() => setSelectedPage(pageName)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                selectedPage === pageName
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setShowNewPageForm(!showNewPageForm)}
            className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            New Page
          </button>
        </div>

        {/* New Page Form */}
        {showNewPageForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Page name (e.g., About Us)"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleCreatePage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewPageForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Sections for Selected Page */}
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(currentPage).map(([section, data], idx) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow-md border-l-4 border-primary-600 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{sectionIcons[section] || '📝'}</span>
                  <h2 className="text-2xl font-bold text-primary-700 capitalize">{section.replace(/_/g, ' ')}</h2>
                </div>
                {editingSection !== section && (
                  <button
                    onClick={() => handleEdit(section)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-lg transition"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                    Edit
                  </button>
                )}
              </div>

              {editingSection === section ? (
                <div className="space-y-4">
                  {typeof data === 'object' && data !== null ? (
                    Object.entries(data).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        {typeof value === 'string' ? (
                          <input
                            type="text"
                            value={editData[key] || ''}
                            onChange={(e) =>
                              setEditData({ ...editData, [key]: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          />
                        ) : Array.isArray(value) ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-gray-600">{(editData[key] || value).length} items</span>
                              <button
                                onClick={() => {
                                  const newArray = [...(editData[key] || value)]
                                  const firstItem = newArray[0]
                                  if (typeof firstItem === 'object') {
                                    const newItem: any = {}
                                    Object.keys(firstItem).forEach(k => {
                                      newItem[k] = ''
                                    })
                                    newArray.push(newItem)
                                  } else {
                                    newArray.push('')
                                  }
                                  setEditData({ ...editData, [key]: newArray })
                                }}
                                className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm"
                              >
                                <PlusIcon className="w-4 h-4" /> Add Item
                              </button>
                            </div>
                            {(editData[key] || value).map((item: any, i: number) => (
                              <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="font-semibold text-gray-700">Item {i + 1}</span>
                                  <button
                                    onClick={() => {
                                      const newArray = editData[key].filter((_: any, idx: number) => idx !== i)
                                      setEditData({ ...editData, [key]: newArray })
                                    }}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                                {typeof item === 'object' ? (
                                  Object.entries(item).map(([k, v]) => (
                                    <div key={k} className="mb-2">
                                      <label className="text-xs font-semibold text-gray-600 capitalize">{k.replace(/_/g, ' ')}</label>
                                      <input
                                        type="text"
                                        value={editData[key]?.[i]?.[k] || ''}
                                        onChange={(e) => {
                                          const newArray = [...(editData[key] || value)]
                                          if (!newArray[i]) newArray[i] = {}
                                          newArray[i][k] = e.target.value
                                          setEditData({ ...editData, [key]: newArray })
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                      />
                                    </div>
                                  ))
                                ) : (
                                  <input
                                    type="text"
                                    value={editData[key]?.[i] || ''}
                                    onChange={(e) => {
                                      const newArray = [...(editData[key] || value)]
                                      newArray[i] = e.target.value
                                      setEditData({ ...editData, [key]: newArray })
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            value={JSON.stringify(editData[key] || value, null, 2)}
                            onChange={(e) => {
                              try {
                                setEditData({ ...editData, [key]: JSON.parse(e.target.value) })
                              } catch {}
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                            rows={4}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <input
                      type="text"
                      value={editData}
                      onChange={(e) => setEditData(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  )}

                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                    >
                      <CheckIcon className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition"
                    >
                      <XMarkIcon className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600 max-h-48 overflow-auto">
                    <pre className="font-mono text-xs">{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Add New Section Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-dashed border-green-300 p-6 text-center hover:border-green-400 transition cursor-pointer"
            onClick={() => {
              const newSectionName = prompt('Enter section name (e.g., "testimonials", "faq", "custom-section"):')
              if (newSectionName && newSectionName.trim()) {
                const updatedPage = {
                  ...currentPage,
                  [newSectionName.toLowerCase()]: {
                    title: newSectionName,
                    items: [{ name: '', description: '' }],
                  },
                }
                setPages({
                  ...pages,
                  [selectedPage]: updatedPage,
                })
                setMessage(`✅ Section "${newSectionName}" added! Edit it to customize.`)
                setTimeout(() => setMessage(''), 3000)
              }
            }}
          >
            <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
              <PlusIcon className="w-6 h-6" />
              <span>Add New Section</span>
            </div>
            <p className="text-sm text-green-600 mt-2">Click to add a new section like testimonials, FAQ, or custom content</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

