'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  PencilSquareIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalPosts: number
  totalLocations: number
  totalViews: number
  totalUsers: number
}

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('adminToken', data.token) // Also store as adminToken for content API
        // Wait a moment for cookie to be set, then reload
        setTimeout(() => {
          window.location.href = '/admin'
        }, 500)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-white rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">LotusFX Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="admin@lotusfx.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo Credentials:</strong><br />
            Email: admin@lotusfx.com<br />
            Password: LotusFX@2024
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalLocations: 0,
    totalViews: 0,
    totalUsers: 1,
  })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth', {
          method: 'GET',
          credentials: 'include', // Include cookies
        })
        setIsAuthenticated(response.ok)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />
  }

  const menuItems = [
    {
      icon: PencilSquareIcon,
      title: 'Country Content',
      description: 'Edit content for AU, NZ, Fiji',
      href: '/admin/content',
      color: 'from-primary-600 to-primary-700',
      stat: 3,
    },
    {
      icon: DocumentTextIcon,
      title: 'Blog Posts',
      description: 'Create and manage blog content',
      href: '/admin/blog',
      color: 'from-primary-500 to-primary-600',
      stat: stats.totalPosts,
    },
    {
      icon: PencilSquareIcon,
      title: 'Pages & Sections',
      description: 'Edit home, currency exchange, money transfer pages',
      href: '/admin/pages',
      color: 'from-accent-600 to-accent-700',
      stat: 3,
    },
    {
      icon: PencilSquareIcon,
      title: 'Header & Footer',
      description: 'Edit navigation and footer links',
      href: '/admin/header-footer',
      color: 'from-primary-700 to-primary-800',
      stat: 2,
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics',
      description: 'View website statistics',
      href: '/admin/analytics',
      color: 'from-accent-700 to-accent-800',
      stat: stats.totalViews,
    },
    {
      icon: CogIcon,
      title: 'Settings',
      description: 'Configure website settings',
      href: '/admin/settings',
      color: 'from-accent-800 to-accent-900',
      stat: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/lotus-logo-white.png"
              alt="LotusFX Logo"
              className="h-10 w-auto"
              style={{ filter: 'brightness(0) saturate(100%)' }}
            />
            <h1 className="text-2xl font-bold text-gray-900">LotusFX Admin</h1>
          </div>
          <button className="text-gray-600 hover:text-gray-900">
            <UserGroupIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-xl text-gray-600">Manage your LotusFX website content and settings</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {[
            { label: 'Blog Posts', value: stats.totalPosts, icon: '📝' },
            { label: 'Locations', value: stats.totalLocations, icon: '📍' },
            { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: '👁️' },
            { label: 'Users', value: stats.totalUsers, icon: '👤' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + idx * 0.05 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">{item.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{item.value}</p>
                </div>
                <span className="text-4xl">{item.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Link href={item.href}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition h-full">
                    {/* Color Header */}
                    <div className={`bg-gradient-to-r ${item.color} h-24 flex items-center justify-center`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">{item.stat}</span>
                        <ArrowRightIcon className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-12 bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/blog/new"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 rounded-lg transition text-center"
            >
              ✍️ Create New Post
            </Link>
            <Link
              href="/admin/pages"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-6 rounded-lg transition text-center"
            >
              📄 Edit Pages
            </Link>
            <Link
              href="/admin/settings"
              className="bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white font-bold py-3 px-6 rounded-lg transition text-center"
            >
              ⚙️ Settings
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

