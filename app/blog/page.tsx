'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { CalendarIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  image: string
  category: string
  readTime: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('Error fetching blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories = ['all', ...new Set(posts.map(p => p.category))]
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600">
              Tips, insights, and updates about currency exchange and international money transfer
            </p>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-200">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                          <span className="text-white text-4xl">📝</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">{post.readTime} min read</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-4 h-4" />
                            {post.author}
                          </span>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

