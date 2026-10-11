'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCountry } from '@/context/CountryContext'
import { trackEvent } from '@/lib/analytics'
import { HONEYPOT_FIELD } from '@/lib/spam-fields'

export default function NewsletterSignup() {
  const { selectedCountry } = useCountry()
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [startedAt] = useState(() => Date.now())
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setMessage('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, country: selectedCountry, [HONEYPOT_FIELD]: honeypot, startedAt }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.success) throw new Error(data.error || 'Please try again.')
      trackEvent('form_submit', { form_name: 'newsletter' })
      setStatus('done')
      setMessage("You're subscribed — thanks! Watch your inbox for rates and offers.")
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-t border-white/20 py-8 overflow-visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center min-w-0 w-full">
        <div className="lg:col-span-4 min-w-0 w-full">
          <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
          <p className="text-white/90 text-sm sm:text-[0.9375rem] leading-relaxed">
            Get the latest exchange rates and exclusive offers delivered to your inbox.
          </p>
        </div>
        <div className="lg:col-span-8 min-w-0 w-full flex lg:justify-end">
          <form onSubmit={handleSubmit} className="w-full max-w-4xl min-w-0" noValidate={false}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full min-w-0">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full min-w-0 flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200"
              />
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <input
                  type="text"
                  name={HONEYPOT_FIELD}
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-white text-primary-600 hover:bg-white/90 font-bold py-3 px-6 rounded-lg transition-all duration-200 whitespace-nowrap w-full sm:w-auto flex-shrink-0 disabled:opacity-70"
              >
                {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </div>
            {message && (
              <p
                role="status"
                className={`mt-3 text-sm ${status === 'done' ? 'text-white' : 'text-yellow-100'}`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  )
}
