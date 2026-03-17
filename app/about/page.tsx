'use client'

import { Metadata } from 'next'
import MotionWrapper from '@/components/MotionWrapper'
import { STATS } from '@/config/stats'
import { useCountry } from '@/context/CountryContext'

function AboutVideo() {
  return (
    <section className="w-full bg-black">
      <div className="w-full">
        <div className="relative w-full pt-[56.25%] overflow-hidden">
          <iframe
            className="absolute inset-0 w-full h-full scale-[1.08] origin-center"
            src="https://www.youtube.com/embed/7z2zFF3z_9s?autoplay=1&mute=1&controls=0&loop=1&playlist=7z2zFF3z_9s&modestbranding=1"
            title="Welcome to Lotus Foreign Exchange | Trusted Currency &amp; Money Transfer Services"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  const { selectedCountry } = useCountry()
  return (
    <>
      {/* Brand video - full width at top */}
      <AboutVideo />

      {/* Hero Section */}
      <section className="pt-16 pb-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <MotionWrapper initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <div className="mb-8">
                <img
                  src="/images/lotus-logo-white.png"
                  alt="LotusFX Logo"
                  className="h-24 lg:h-32 w-auto mx-auto mb-6"
                  style={{ filter: 'brightness(0) saturate(100%)' }}
                />
              </div>
              <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Trusted by {STATS.customers.total} Customers
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Your Trusted Partner for Foreign Exchange Across the Pacific
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Since 2002, LotusFX has been helping individuals and businesses exchange currency 
                and transfer money internationally with competitive rates, fast service, and expert support.
              </p>
            </MotionWrapper>
          </div>
        </div>
      </section>


      {/* Our Story */}
      <section className="pt-6 pb-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <MotionWrapper
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  LotusFX was founded in 2002 with a simple mission: to provide better foreign exchange 
                  services than traditional banks. We saw that customers were paying too much in fees and 
                  getting poor exchange rates, so we set out to change that.
                </p>
                <p>
                  Starting with a single branch, we've grown to over 60 locations across Australia, 
                  New Zealand, and Fiji. Our success comes from our commitment to competitive rates, 
                  transparent pricing, and exceptional customer service.
                </p>
                <p>
                  Today, we serve over {STATS.customers.total} customers and have facilitated over {STATS.totalTransferred} in
                  currency exchanges and international transfers. We're proud to be the trusted choice
                  for travelers, families sending money home, and businesses making international payments.
                </p>
              </div>
            </MotionWrapper>

            <MotionWrapper
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-6">Our Milestones</h3>
              <div className="space-y-6">
                {[
                  { year: '2002', event: 'LotusFX founded with first branch in Australia' },
                  { year: '2012', event: 'Expanded to New Zealand with multiple branches' },
                  { year: '2015', event: 'Launched online tools for rates and branch information' },
                  { year: '2018', event: 'Opened operations in Fiji, serving the Pacific' },
                  { year: '2020', event: 'Reached $1 billion in total transfers' },
                  { year: '2024', event: `${STATS.branches.total} branches serving ${STATS.customers.total} customers` },
                ].map((milestone) => (
                  <div key={milestone.year} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center font-bold">
                      {milestone.year}
                    </div>
                    <div className="flex items-center">
                      <p>{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600">
              These principles guide everything we do at LotusFX
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '💎',
                title: 'Transparency',
                description: 'No hidden fees, no surprises. What you see is what you pay.'
              },
              {
                icon: '🎯',
                title: 'Customer First',
                description: 'Your needs come first. We\'re here to serve you, not the other way around.'
              },
              {
                icon: '⚡',
                title: 'Speed & Efficiency',
                description: 'Fast processing, quick transfers, and minimal wait times.'
              },
              {
                icon: '🤝',
                title: 'Trust & Integrity',
                description: 'We earn your trust through consistent, reliable, and honest service.'
              },
            ].map((value, index) => (
              <MotionWrapper
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Our Presence */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Serving the Pacific Region
            </h2>
            <p className="text-lg text-gray-600">
              With {STATS.branches.total} branches across three countries, we're always nearby when you need us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                flag: '🇦🇺',
                country: 'Australia',
                branches: `${STATS.branches.australia} Branches`,
                customers: `${STATS.customers.australia} Customers`,
                email: STATS.emails.australia,
                highlights: ['Major cities coverage', 'Extended trading hours', 'eWire to NZ & Fiji']
              },
              {
                flag: '🇳🇿',
                country: 'New Zealand',
                branches: `${STATS.branches.newZealand} Branches`,
                customers: `${STATS.customers.newZealand} Customers`,
                email: STATS.emails.newZealand,
                highlights: ['Nationwide network', 'Expert FX advisors', 'Same-day transfers']
              },
              {
                flag: '🇫🇯',
                country: 'Fiji',
                branches: `${STATS.branches.fiji} Branches`,
                customers: `${STATS.customers.fiji} Customers`,
                email: STATS.emails.fiji,
                highlights: ['Island-wide service', 'Pacific specialist', 'Local currency expert']
              },
            ].map((region, index) => (
              <MotionWrapper
                key={region.country}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-8 border border-primary-100"
              >
                <div className="text-6xl mb-4 text-center">{region.flag}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{region.country}</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold">🏢</span>
                    <span>{region.branches}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="font-semibold">👥</span>
                    <span>{region.customers}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <span className="font-semibold">✉️</span>
                    <span className="break-all">{region.email}</span>
                  </div>
                </div>
                <div className="border-t border-primary-200 pt-4">
                  <ul className="space-y-2">
                    {region.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-primary-600">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Customers Choose LotusFX
            </h2>
            <p className="text-lg text-gray-600">
              We're not just another currency exchange - we're your trusted financial partner
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Better Rates Than Banks',
                description: 'Our rates are typically 2-3% better than major banks. As specialists in foreign exchange, we can offer superior rates that banks simply can\'t match.',
                icon: '💰'
              },
              {
                title: 'No Commission Fees',
                description: 'We don\'t charge commission on currency exchange. What you see is what you pay - complete transparency with no hidden charges.',
                icon: '🎯'
              },
              {
                title: 'Expert FX Team',
                description: 'Our staff are trained foreign exchange specialists, not general banking staff. We understand the markets and can provide expert advice.',
                icon: '👨‍💼'
              },
              {
                title: 'Multiple Service Channels',
                description: 'Exchange in-branch, online, or via our mobile app. Choose the method that works best for you with consistent rates across all channels.',
                icon: '📱'
              },
              {
                title: 'Fast Processing',
                description: 'Most transfers complete within 24 hours. eWire transfers between AU, NZ & Fiji are instant with zero fees.',
                icon: '⚡'
              },
              {
                title: 'Fully Licensed & Regulated',
                description: 'We\'re licensed and regulated by financial authorities in all three countries. Your money and data are protected with bank-grade security.',
                icon: '🔒'
              },
            ].map((reason, index) => (
              <MotionWrapper
                key={reason.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <div className="flex gap-4">
                  <div className="text-4xl flex-shrink-0">{reason.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                    <p className="text-gray-600">{reason.description}</p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Profile */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team Profile
            </h2>
            <p className="text-lg text-gray-600">
              Meet the experienced team leading LotusFX across Australia, New Zealand, and Fiji
            </p>
          </div>

          <div className="space-y-12">
            {/* Group Leadership */}
            <MotionWrapper
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b-2 border-primary-600 pb-2">
                Group Leadership
              </h3>
              
              {/* Level 1: Top Leadership - Pravin and Kashmin side by side */}
              <div className="flex justify-center gap-6 mb-8">
                <MotionWrapper
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 border-2 border-primary-800 shadow-xl max-w-sm w-full"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-primary-600 text-3xl font-bold">
                        PK
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Pravin Kumar QSM JP</h4>
                    <p className="text-primary-100 font-semibold text-lg">Managing Director</p>
                  </div>
                </MotionWrapper>
                
                <MotionWrapper
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 border-2 border-primary-800 shadow-xl max-w-sm w-full"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-primary-600 text-3xl font-bold">
                        KK
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">Kashmin Kumar</h4>
                    <p className="text-primary-100 font-semibold text-lg">Director</p>
                  </div>
                </MotionWrapper>
              </div>

              {/* Connecting Lines */}
              <div className="flex justify-center mb-8">
                <div className="w-1 h-12 bg-primary-300"></div>
              </div>

              {/* Level 2: Murray - Group Manager */}
              <div className="flex justify-center mb-8">
                <MotionWrapper
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 border-2 border-primary-700 shadow-lg max-w-xs"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-primary-600 text-2xl font-bold">
                        MB
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">Murray Broadmore</h4>
                    <p className="text-primary-100 font-semibold">Group Manager</p>
                  </div>
                </MotionWrapper>
              </div>

              {/* Connecting Lines to Level 3 */}
              <div className="flex justify-center mb-8">
                <div className="w-1 h-12 bg-primary-300"></div>
              </div>

              {/* Level 3: The Rest 4 - All at same level */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Prashant Kumar', role: 'Legal Counsel' },
                  { name: 'Bhavishna Dutt', role: 'Group Accountant' },
                  { name: 'Anthony Wu', role: 'Marketing Manager' },
                  { name: 'Ash Singh', role: 'IT Manager' },
                ].map((member, index) => (
                  <MotionWrapper
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border-2 border-primary-300 hover:border-primary-500 hover:shadow-lg transition-all"
                  >
                    <div className="text-center">
                      <div className="w-18 h-18 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{member.name}</h4>
                      <p className="text-primary-600 font-semibold text-sm">{member.role}</p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </MotionWrapper>

            {/* New Zealand Team - Only show if NZ is selected */}
            {selectedCountry === 'NZ' && (
              <MotionWrapper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-600 pb-2 flex items-center gap-2">
                  <span>🇳🇿</span>
                  <span>New Zealand Team</span>
                </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Shaveen Lata', role: 'Treasury Manager' },
                  { name: 'Krishneel Kusal Ram', role: 'Customer Relationship Manager' },
                  { name: 'Rachana Patel', role: 'Compliance Manager' },
                  { name: 'Visha Dutt', role: 'Online Manager' },
                ].map((member, index) => (
                  <MotionWrapper
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                      <p className="text-primary-600 font-semibold text-sm">{member.role}</p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </MotionWrapper>
            )}

            {/* Australia Team - Only show if AU is selected */}
            {selectedCountry === 'AU' && (
              <MotionWrapper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-600 pb-2 flex items-center gap-2">
                  <span>🇦🇺</span>
                  <span>Australia Team</span>
                </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { name: 'Subhasish Mukhopadhyay', role: 'General Manager' },
                  { name: 'Rishi Dhingra', role: 'Customer Relationship Manager' },
                  { name: 'Priyanga Nair', role: 'Treasury Manager' },
                  { name: 'Priyanka Hingu', role: 'Compliance Manager' },
                  { name: 'Tarushi Pareek', role: 'Accounts Manager' },
                ].map((member, index) => (
                  <MotionWrapper
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                      <p className="text-primary-600 font-semibold text-sm">{member.role}</p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </MotionWrapper>
            )}

            {/* Fiji Team - Only show if FJ is selected */}
            {selectedCountry === 'FJ' && (
              <MotionWrapper
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-primary-600 pb-2 flex items-center gap-2">
                  <span>🇫🇯</span>
                  <span>Fiji Team</span>
                </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { name: 'Ritesh Chandra', role: 'Operations Manager' },
                  { name: 'Kavinesh Prasad', role: 'Area Manager West' },
                  { name: 'Rohini Devi Singh', role: 'Manager HR/FX Dealer' },
                  { name: 'Ashnil Anand Kumar', role: 'Compliance Manager' },
                  { name: 'Ravinesh Reddy', role: 'Manager International Payments' },
                ].map((member, index) => (
                  <MotionWrapper
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                      <p className="text-primary-600 font-semibold text-sm">{member.role}</p>
                    </div>
                  </MotionWrapper>
                ))}
              </div>
            </MotionWrapper>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: STATS.yearsOfExcellence, label: 'Years of Excellence' },
              { number: STATS.branches.total, label: 'Branches Across Pacific' },
              { number: STATS.customers.total, label: 'Happy Customers' },
              { number: STATS.totalTransferred, label: 'Safely Transferred' },
            ].map((stat, index) => (
              <MotionWrapper
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* (CTA section removed as requested) */}
    </>
  )
}

