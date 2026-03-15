import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Partners from '@/components/Partners'
import Locations from '@/components/Locations'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import StructuredData from '@/components/StructuredData'
import ZeroCommission from '@/components/ZeroCommission'
import PopupModal from '@/components/PopupModal'
import { STATS } from '@/config/stats'

export default function Home() {
  return (
    <>
      <StructuredData />
      <PopupModal />
      <Hero />
      <Partners />
      <section className="section-padding bg-white">
        <div className="container-custom grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-3">
              Who We Are
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
              Lotus Foreign Exchange at a Glance
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-4 max-w-xl">
              LotusFX is a specialist foreign exchange and money transfer group with{' '}
              {STATS.branches.total} branches across Australia, New Zealand and Fiji.
              Since 2008, we&apos;ve focused on one thing: helping customers move money
              simply, safely and at better rates than the big banks.
            </p>
            <p className="text-sm sm:text-base text-gray-600 mb-3 max-w-xl">
              From everyday travel money to large international payments, our FX
              specialists work with individuals, families and businesses across the
              Pacific. We combine friendly in‑branch service with powerful online tools,
              so you can choose the way you like to deal with your money.
            </p>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              Regulated in three countries and trusted by {STATS.customers.total}{' '}
              customers, we&apos;re here to make foreign exchange feel clear, transparent
              and stress‑free.
            </p>
          </div>
          <div className="flex flex-col gap-4 lg:mt-6">
            <div className="rounded-2xl bg-white shadow-md p-6 border border-primary-200">
              <div className="text-xs sm:text-sm font-semibold text-primary-700 mb-2 tracking-wide">
                What we do
              </div>
              <ul className="space-y-1.5 text-sm sm:text-base text-gray-700 list-disc list-inside">
                <li>Cash currency exchange in‑branch</li>
                <li>International money transfers</li>
                <li>Cash Passport travel money cards</li>
                <li>eWire transfers across AU / NZ / FJ</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-white shadow-md p-6 border border-primary-200">
              <div className="text-xs sm:text-sm font-semibold text-primary-700 mb-2 tracking-wide">
                Why it matters
              </div>
              <ul className="space-y-1.5 text-sm sm:text-base text-gray-700 list-disc list-inside">
                <li>Better rates than major banks</li>
                <li>No hidden fees or surprises</li>
                <li>Local teams who know your market</li>
                <li>Secure, compliant and regulated</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Features />
      <ZeroCommission />
      <Locations />
      <Testimonials />
      <FAQ />
    </>
  )
}
