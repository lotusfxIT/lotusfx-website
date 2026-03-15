'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function NewBlogPostPage() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Tips',
    readTime: 5,
    image: '',
    metaDescription: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'readTime' ? parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    // Simulate saving
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
            <Link href="/admin/blog" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition"
          >
            {saving ? 'Saving...' : saved ? <><CheckIcon className="w-5 h-5" /> Saved</> : 'Publish'}
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
          {/* Title */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              required
            />
          </div>

          {/* Slug */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">URL Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="post-url-slug"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-2">URL: /blog/{formData.slug}</p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Tips</option>
                <option>Guide</option>
                <option>Travel</option>
                <option>News</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the post..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here... (HTML supported)"
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              required
            />
            <p className="text-sm text-gray-500 mt-2">You can use HTML tags for formatting</p>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Read Time (minutes)</label>
              <input
                type="number"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Meta Description</label>
              <input
                type="text"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="SEO description"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              {saving ? 'Publishing...' : 'Publish Post'}
            </button>
            <Link
              href="/admin/blog"
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

