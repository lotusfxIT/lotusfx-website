import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuickOrderWizard from '@/components/quick-order/QuickOrderWizard'
import { buildPageMetadata } from '@/lib/seo'
import { CLICK_COLLECT_PREVIEW_PATH } from '@/lib/quick-order-url'

export const metadata: Metadata = buildPageMetadata({
  title: 'Click & Collect preview',
  description: 'Staff preview for LotusFX Click & Collect. Not linked from the public site.',
  path: CLICK_COLLECT_PREVIEW_PATH,
  noIndex: true,
})

export default function QuickOrderPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-28 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-primary-100">
          Loading Click & Collect…
        </div>
      }
    >
      <QuickOrderWizard preview />
    </Suspense>
  )
}
