import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Partners from '@/components/Partners'
import HomeServiceSections from '@/components/HomeServiceSections'
import Locations from '@/components/Locations'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import StructuredData from '@/components/StructuredData'
import ZeroCommission from '@/components/ZeroCommission'
import PopupModal from '@/components/PopupModal'
import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export const metadata: Metadata = buildPageMetadata({
  title: 'Competitive Currency Exchange & Money Transfers',
  description:
    'Exchange foreign currency with competitive rates and no commission fees. Currency exchange across Australia, New Zealand & Fiji plus global money transfers.',
  path: '/',
})

export default function Home() {
  return (
    <>
      <StructuredData />
      <PopupModal />
      <Hero />
      <Partners />
      <HomeServiceSections />
      <Features />
      <ZeroCommission />
      <Locations />
      <Testimonials />
      <FAQ />
    </>
  )
}
