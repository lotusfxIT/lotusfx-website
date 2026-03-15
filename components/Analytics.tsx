'use client'

import { useEffect } from 'react'

export default function Analytics() {
  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Load Google Analytics
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      document.head.appendChild(script)

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || []
      const gtag = (...args: any[]) => {
        window.dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_title: document.title,
        page_location: window.location.href,
      })

      // Track page views
      const trackPageView = () => {
        gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
        })
      }

      // Track page view on load
      trackPageView()

      // Track page view on route change
      const handleRouteChange = () => {
        trackPageView()
      }

      // Listen for route changes (Next.js specific)
      window.addEventListener('popstate', handleRouteChange)

      return () => {
        window.removeEventListener('popstate', handleRouteChange)
      }
    }
  }, [])

  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}
