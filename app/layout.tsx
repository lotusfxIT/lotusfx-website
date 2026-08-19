import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { CountryProvider } from '@/context/CountryContext'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { getSiteUrl } from '@/lib/site-url'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Competitive Currency Exchange & Money Transfers | LotusFX',
    template: '%s | LotusFX'
  },
  description:
    'Exchange foreign currency with competitive rates and no commission fees. Currency exchange across Australia, New Zealand & Fiji plus global money transfers.',
  keywords: [
    'currency exchange',
    'money transfer',
    'foreign exchange',
    'exchange rates',
    'currency converter',
    'travel money',
    'AUD to USD',
    'NZD to AUD',
    'currency exchange near me',
    'LotusFX'
  ],
  authors: [{ name: 'LotusFX' }],
  creator: 'LotusFX',
  publisher: 'LotusFX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: '/images/lotus-logo-white-red-bg.jpg',
    apple: '/images/lotus-logo-white-red-bg.jpg',
    shortcut: '/images/lotus-logo-white-red-bg.jpg',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: getSiteUrl(),
    siteName: 'LotusFX',
    title: 'Competitive Currency Exchange & Money Transfers | LotusFX',
    description:
      'Exchange foreign currency with competitive rates and no commission fees. Currency exchange across Australia, New Zealand & Fiji plus global money transfers.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LotusFX - Currency Exchange & Money Transfer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Competitive Currency Exchange & Money Transfers | LotusFX',
    description:
      'Exchange foreign currency with competitive rates and no commission fees. Currency exchange across Australia, New Zealand & Fiji plus global money transfers.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#b91c1c',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased bg-white text-gray-900">
        <CountryProvider>
          <Analytics />
          <VercelAnalytics />
          <Header />
          <main className="min-h-screen overflow-x-hidden w-full">
            {children}
          </main>
          <Footer />
        </CountryProvider>
      </body>
    </html>
  )
}
