'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarIcon, UserIcon, ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline'

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
  metaDescription?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`)
        if (!response.ok) throw new Error('Post not found')
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-blue-500 hover:text-blue-700 flex items-center gap-2 justify-center">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* SEO Metadata */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          image: post.image,
          datePublished: post.publishedAt,
          author: {
            '@type': 'Person',
            name: post.author,
          },
        })}
      </script>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/blog" className="text-blue-500 hover:text-blue-700 mb-4 inline-flex items-center gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Blog
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.readTime} min read</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <button className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
                  <ShareIcon className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <motion.div
            className="relative h-96 bg-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* CTA Section */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Exchange Currency?</h3>
            <p className="text-blue-100 mb-6">
              Visit one of our locations or contact us for the best rates
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/locations"
                className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition"
              >
                Find a Location
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-10 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

