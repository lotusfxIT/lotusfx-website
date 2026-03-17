import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'
import { CountryProvider } from '@/context/CountryContext'

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
    default: 'LotusFX | Currency Exchange & Money Transfers in Australia, New Zealand & Fiji',
    template: '%s | LotusFX'
  },
  description:
    'Exchange currency and send money internationally with LotusFX. Compare rates online and visit branches across Australia, New Zealand and Fiji.',
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
  metadataBase: new URL('https://lotusfx.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-AU': '/au',
      'en-NZ': '/nz',
      'en-FJ': '/fj',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://lotusfx.com',
    siteName: 'LotusFX',
    title: 'LotusFX | Currency Exchange & Money Transfers in Australia, New Zealand & Fiji',
    description:
      'Exchange currency and send money internationally with LotusFX. Compare rates online and visit branches across Australia, New Zealand and Fiji.',
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
    title: 'LotusFX | Currency Exchange & Money Transfers in Australia, New Zealand & Fiji',
    description:
      'Exchange currency and send money internationally with LotusFX. Compare rates online and visit branches across Australia, New Zealand and Fiji.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" type="image/jpeg" href="/images/lotus-logo-white-red-bg.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/lotus-logo-white-red-bg.jpg" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/images/lotus-logo-white-red-bg.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/images/lotus-logo-white-red-bg.jpg" />
        <link rel="shortcut icon" href="/images/lotus-logo-white-red-bg.jpg" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
      </head>
      <body className="antialiased bg-white text-gray-900">
        <CountryProvider>
          <Analytics />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CountryProvider>
      </body>
    </html>
  )
}
