/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'lh3.googleusercontent.com', // Google My Business photos
      'lh4.googleusercontent.com', // Google My Business photos
      'lh5.googleusercontent.com', // Google My Business photos
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/download-app', destination: '/', permanent: false },
      { source: '/promo', destination: '/', permanent: false },
      // URLs from the previous lotusfx.com site
      { source: '/exchange-rates', destination: '/currency-exchange', permanent: true },
      { source: '/app-download', destination: '/', permanent: false },
      { source: '/pdf/:path*', destination: '/terms', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/rates', destination: '/currency-exchange', permanent: true },
      { source: '/reviews', destination: '/customer-reviews', permanent: true },
      { source: '/quick-order', destination: '/click-and-collect', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
