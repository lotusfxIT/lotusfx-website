import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found | LotusFX',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white pt-28 pb-16 px-4">
      <div className="text-center max-w-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Page not found</h1>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Try one of these instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Go home
          </Link>
          <Link
            href="/currency-exchange"
            className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Exchange rates
          </Link>
          <Link
            href="/locations"
            className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 hover:border-gray-400 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Find a branch
          </Link>
        </div>
      </div>
    </div>
  )
}
