import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuickOrderWizard from '@/components/quick-order/QuickOrderWizard'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Quick Order',
  description:
    'Order foreign currency online with LotusFX and pay in store when you collect. Guest Quick Order across Australia.',
  path: '/quick-order',
  keywords: ['quick order', 'buy currency online', 'currency pickup', 'LotusFX order'],
})

export default function QuickOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-28 text-gray-500">
          Loading Quick Order…
        </div>
      }
    >
      <QuickOrderWizard />
    </Suspense>
  )
}
