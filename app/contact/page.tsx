'use client'

import { useState } from 'react'
import MotionWrapper from '@/components/MotionWrapper'
import { trackEvent } from '@/lib/analytics'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { useSiteStats } from '@/context/SiteStatsContext'
import { useCountry } from '@/context/CountryContext'
import { getSiteFaqs } from '@/data/faqs'
import FaqAccordion from '@/components/FaqAccordion'
import { HONEYPOT_FIELD } from '@/lib/spam-fields'

export default function ContactPage() {
  const { stats: siteStats } = useSiteStats()
  const { selectedCountry } = useCountry()
  const faqs = getSiteFaqs(selectedCountry)
  const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' }
  const [formData, setFormData] = useState(emptyForm)
  const [honeypot, setHoneypot] = useState('')
  const [startedAt] = useState(() => Date.now())
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [sentTo, setSentTo] = useState({ name: '', email: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setStatusMessage('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          country: selectedCountry,
          [HONEYPOT_FIELD]: honeypot,
          startedAt,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'We could not send your message. Please try again.')
      }
      trackEvent('form_submit', {
        form_name: 'contact',
        subject_category: formData.subject || 'general',
      })
      setSentTo({ name: formData.name.trim().split(/\s+/)[0] ?? '', email: formData.email.trim() })
      setStatus('sent')
      setFormData(emptyForm)
    } catch (err) {
      setStatus('error')
      setStatusMessage(err instanceof Error ? err.message : 'We could not send your message.')
    }
  }

  return (
    <>
      <section className="pt-24 sm:pt-32 pb-10 sm:pb-14 bg-gradient-to-br from-primary-50 via-white to-white">
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
              <div className="bg-white rounded-[1.5rem] shadow-strong border border-gray-100 p-5 sm:p-8 h-full flex flex-col">
                {status === 'sent' ? (
                  <div
                    role="status"
                    className="flex-1 flex flex-col items-center justify-center text-center py-8 sm:py-12 px-2 animate-fade-in"
                  >
                    <div className="relative mb-6">
                      <span className="absolute inset-0 rounded-full bg-primary-400/25 animate-ping [animation-iteration-count:2]" aria-hidden />
                      <span className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/25">
                        <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 mb-2">
                      Message sent
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                      {sentTo.name ? `Thanks, ${sentTo.name}` : 'Thank you'}
                    </h2>
                    <p className="text-gray-600 !leading-relaxed max-w-sm">
                      We have received your message
                      {sentTo.email ? (
                        <>
                          {' '}and will reply to{' '}
                          <span className="font-semibold text-gray-900 break-all">{sentTo.email}</span>
                        </>
                      ) : null}
                      . Our team usually gets back within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="mt-8 inline-flex items-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                <>
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
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    <label>
                      Company website
                      <input
                        type="text"
                        name={HONEYPOT_FIELD}
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </label>
                  </div>
                  {status === 'error' && statusMessage && (
                    <p role="alert" className="text-sm rounded-lg px-4 py-3 bg-red-50 text-red-700 border border-red-200">
                      {statusMessage}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full btn-primary mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
                </>
                )}
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
                        phones: ['(61) 410 663 726', '(61) 415 099 933'],
                        branches: `${siteStats.branches.australia} branches across major cities`,
                        hours: siteStats.businessHours.australia,
                      },
                      {
                        flag: '🇳🇿',
                        country: 'New Zealand',
                        email: siteStats.emails.newZealand,
                        phones: ['0800 442288'],
                        branches: `${siteStats.branches.newZealand} branches nationwide`,
                        hours: siteStats.businessHours.newZealand,
                      },
                      {
                        flag: '🇫🇯',
                        country: 'Fiji',
                        email: siteStats.emails.fiji,
                        phones: ['(679) 992 1755'],
                        branches: `${siteStats.branches.fiji} branches across islands`,
                        hours: siteStats.businessHours.fiji,
                      },
                    ].map((region) => (
                      <div
                        key={region.country}
                        className="rounded-2xl bg-gradient-to-br from-primary-50 to-white p-5 sm:p-6 border border-primary-100"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl leading-none" aria-hidden>
                            {region.flag}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">{region.country}</h3>
                        </div>
                        <div className="space-y-2.5 text-sm text-gray-600">
                          <p className="flex items-start gap-2">
                            <PhoneIcon className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
                            <span className="flex flex-wrap items-center gap-x-1">
                              {region.phones.map((phone, i) => (
                                <span key={phone} className="inline-flex items-center">
                                  {i > 0 ? <span className="text-gray-400 mr-1">/</span> : null}
                                  <a
                                    href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                                    className="hover:text-primary-700 font-medium text-gray-800"
                                  >
                                    {phone}
                                  </a>
                                </span>
                              ))}
                            </span>
                          </p>
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
                            <ClockIcon className="w-5 h-5 flex-shrink-0 text-primary-600 mt-0.5" />
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

          <FaqAccordion items={faqs} className="max-w-4xl mx-auto" />
        </div>
      </section>
    </>
  )
}
