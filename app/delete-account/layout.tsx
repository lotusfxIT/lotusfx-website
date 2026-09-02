import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Delete Your Account',
  description:
    'Request deletion of your LotusFX mobile app account and associated personal data. Steps, data retention, and contact details for Lotus Foreign Exchange.',
  path: '/delete-account',
  noIndex: true,
})

export default function DeleteAccountLayout({ children }: { children: React.ReactNode }) {
  return children
}
