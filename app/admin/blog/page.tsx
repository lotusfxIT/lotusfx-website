'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

interface BlogPost {
  id: string
  title: string
  slug: string
  author: string
  publishedAt: string
  category: string
  status: 'published' | 'draft'
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'How to Get the Best Currency Exchange Rates',
      slug: 'best-currency-exchange-rates',
      author: 'John Smith',
      publishedAt: '2024-01-15',
      category: 'Tips',
      status: 'published',
    },
    {
      id: '2',
      title: 'International Money Transfer Guide',
      slug: 'international-money-transfer-guide',
      author: 'Sarah Johnson',
      publishedAt: '2024-01-10',
      category: 'Guide',
      status: 'published',
    },
    {
      id: '3',
      title: 'Currency Exchange for Travelers',
      slug: 'currency-exchange-travelers',
      author: 'Mike Chen',
      publishedAt: '2024-01-05',
      category: 'Travel',
      status: 'published',
    },
  ])
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(posts.map(p => p.id))
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          </div>
          <Link
            href="/admin/blog/new"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
          >
            <PlusIcon className="w-5 h-5" />
            New Post
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table */}
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPosts.length === posts.length && posts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Published</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post, idx) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPosts([...selectedPosts, post.id])
                          } else {
                            setSelectedPosts(selectedPosts.filter(id => id !== post.id))
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-500">{post.slug}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{post.author}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">Published</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition"
                          title="View"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition"
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No blog posts yet</p>
              <Link
                href="/admin/blog/new"
                className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
              >
                Create your first post →
              </Link>
            </div>
          )}
        </motion.div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <motion.div
            className="mt-6 bg-white rounded-lg shadow-lg p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-900 font-semibold">
              {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
            </p>
            <button className="text-red-500 hover:text-red-700 font-semibold">
              Delete Selected
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

