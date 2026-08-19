import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact Us',
  description:
    'Contact LotusFX for currency exchange and money transfer support across Australia, New Zealand and Fiji. Phone, email, and branch locations.',
  path: '/contact',
  keywords: ['contact LotusFX', 'customer support', 'currency exchange help', 'money transfer support'],
})

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
