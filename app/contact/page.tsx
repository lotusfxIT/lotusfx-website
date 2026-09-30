'use client'

import { useState } from 'react'
import MotionWrapper from '@/components/MotionWrapper'
import { trackEvent } from '@/lib/analytics'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { useSiteStats } from '@/context/SiteStatsContext'
import { useCountry } from '@/context/CountryContext'
import { getSiteFaqs } from '@/data/faqs'

export default function ContactPage() {
  const { stats: siteStats } = useSiteStats()
  const { selectedCountry } = useCountry()
  const faqs = getSiteFaqs(selectedCountry)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('form_submit', {
      form_name: 'contact',
      subject_category: formData.subject || 'general',
    })
    console.log('Form submitted:', formData)
  }

  return (
    <>
      <section className="pt-28 sm:pt-32 pb-12 sm:pb-14 bg-gradient-to-br from-primary-50 via-white to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <MotionWrapper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-3">
                We&apos;re here to help
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
                Get in touch with us
              </h1>
            </MotionWrapper>
          </div>
        </div>
      </section>

      <section id="message" className="pb-16 sm:pb-20 bg-white scroll-mt-28">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start">
            <MotionWrapper
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="bg-white rounded-2xl shadow-strong border border-gray-100 p-7 sm:p-8 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+61 400 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="">Select a subject</option>
                      <option value="currency-exchange">Currency Exchange</option>
                      <option value="money-transfer">Money Transfer</option>
                      <option value="rates">Exchange Rates</option>
                      <option value="account">Account Support</option>
                      <option value="business">Business Services</option>
                      <option value="complaint">Complaint</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex-1 min-h-[8rem]"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary mt-2">
                    Send Message
                  </button>
                </form>
              </div>
            </MotionWrapper>

            <MotionWrapper
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <div className="space-y-6 h-full flex flex-col">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Direct contact information
                  </h2>
                  <div className="space-y-5">
                    {[
                      {
                        flag: '🇦🇺',
                        country: 'Australia',
                        email: siteStats.emails.australia,
                        branches: `${siteStats.branches.australia} branches across major cities`,
                        hours: siteStats.businessHours.australia,
                      },
                      {
                        flag: '🇳🇿',
                        country: 'New Zealand',
                        email: siteStats.emails.newZealand,
                        branches: `${siteStats.branches.newZealand} branches nationwide`,
                        hours: siteStats.businessHours.newZealand,
                      },
                      {
                        flag: '🇫🇯',
                        country: 'Fiji',
                        email: siteStats.emails.fiji,
                        branches: `${siteStats.branches.fiji} branches across islands`,
                        hours: siteStats.businessHours.fiji,
                      },
                    ].map((region) => (
                      <div
                        key={region.country}
                        className="rounded-2xl bg-gradient-to-br from-primary-50 to-white p-5 sm:p-6 border border-primary-100"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl" aria-hidden>
                            {region.flag}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">{region.country}</h3>
                        </div>
                        <div className="space-y-2.5 text-sm text-gray-600">
                          <p className="flex items-start gap-2">
                            <EnvelopeIcon className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                            <a
                              href={`mailto:${region.email}`}
                              className="break-all hover:text-primary-700"
                            >
                              {region.email}
                            </a>
                          </p>
                          <p className="flex items-start gap-2">
                            <MapPinIcon className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                            <span>{region.branches}</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <PhoneIcon className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                            <span>{region.hours}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mt-auto">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick response times</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-600">Phone calls</span>
                      <span className="font-semibold text-primary-600">Immediate</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-600">Email</span>
                      <span className="font-semibold text-primary-600">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-600">Social media</span>
                      <span className="font-semibold text-primary-600">Within 24 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Get answers to common questions about our services
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <MotionWrapper
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <details className="bg-white rounded-xl p-6 cursor-pointer border border-gray-100 hover:border-primary-200 transition-colors">
                  <summary className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
