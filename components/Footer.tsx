'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useCountry } from '@/context/CountryContext'

interface FooterConfig {
  company_name?: string
  description?: string
  contact_phone?: string
  contact_email?: string
  social_links?: Array<{ name: string; url: string }>
  sections?: Record<string, Array<{ name: string; href: string }>>
  legal_links?: Array<{ name: string; href: string }>
}

const defaultSections: Record<string, Array<{ name: string; href: string }>> = {
  Services: [
    { name: 'Currency Exchange', href: '/currency-exchange' },
    { name: 'Money Transfer', href: '/money-transfer' },
    { name: 'Rates', href: '/rates' },
    { name: 'Locations', href: '/locations' },
  ],
  Partners: [
    { name: 'Western Union', href: '/western-union' },
    { name: 'MoneyGram', href: '/moneygram' },
    { name: 'Cash Passport', href: '/cash-passport' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  Resources: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
    { name: 'Support', href: '/support' },
  ],
}

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig>({})
  const [loading, setLoading] = useState(true)
  const { selectedCountry } = useCountry() // Move hook call before any conditional returns

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/header-footer')
      const data = await response.json()
      setConfig(data.footer || {})
    } catch (error) {
      console.error('Failed to load footer config:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  const allOfficeLocations = {
    AU: {
      country: 'Australia',
      address: 'Suite 605B, Level 6, Westfield Shoppingtown, 15-175 Church Street, Parramatta NSW 2150, Australia',
      phone: '(61) 410 663 726 / (61) 415 099 933',
    },
    NZ: {
      country: 'New Zealand',
      address: 'Suite 3, Level 7, Unite House, 300 Queen Street, Auckland New Zealand',
      phone: '0800 442288',
    },
    FJ: {
      country: 'Fiji',
      address: 'Level 3, House of Lords, Cumming Street, Suva City',
      phone: '(679) 992 1755',
    },
  }

  // Get the current country's office location
  const currentOffice = allOfficeLocations[selectedCountry as keyof typeof allOfficeLocations] || allOfficeLocations.AU

  const sections = config.sections || defaultSections
  return (
  <footer className="bg-primary-600 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Brand Section */}
            <div className="lg:w-1/3 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center mb-6">
                  <img
                    src="/images/lotus-logo-white-red-bg.jpg"
                    alt="LotusFX Logo"
                    className="h-20 lg:h-24 w-auto"
                  />
                </Link>

                <p className="text-white/90 mb-6 leading-relaxed">
                  {config.description || 'Your trusted partner for currency exchange and money transfers across Australia, New Zealand, and Fiji. Get the best rates with no hidden fees.'}
                </p>

                {/* Office Location - Current Country */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="space-y-3"
                  >
                    <h4 className="text-white font-semibold text-lg">{currentOffice.country}</h4>
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="w-5 h-5 text-white flex-shrink-0 mt-1" />
                      <p className="text-white/90 text-sm leading-relaxed">
                        {currentOffice.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-5 h-5 text-white flex-shrink-0" />
                      <a
                        href={`tel:${currentOffice.phone.replace(/\s/g, '').replace(/\//g, '')}`}
                        className="text-white/90 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {currentOffice.phone}
                      </a>
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3 pt-2"
                  >
                    <EnvelopeIcon className="w-5 h-5 text-white flex-shrink-0" />
                    <a
                      href={`mailto:${config.contact_email || 'info@lotusfx.com'}`}
                      className="text-white/90 hover:text-white transition-colors duration-200"
                    >
                      {config.contact_email || 'info@lotusfx.com'}
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Sections */}
            <div className="lg:flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 lg:ml-32 xl:ml-48">
              {Object.entries(sections).map(([sectionName, items], idx) => (
                <motion.div
                  key={sectionName}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col"
                >
                  <h3 className="text-lg font-semibold mb-4 text-white">{sectionName}</h3>
                  <ul className="space-y-3 list-none pl-0">
                    {items.map((item) => (
                      <li key={item.name} className="pl-0">
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={item.href}
                            className="text-white/80 hover:text-white transition-colors duration-200 inline-flex items-center"
                          >
                            {item.name}
                          </Link>
                        </motion.div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/20 py-8"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/3">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-white/90">
                Get the latest exchange rates and exclusive offers delivered to your inbox.
              </p>
            </div>
            <div className="lg:flex-1 flex space-x-4 lg:ml-32 xl:ml-48">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white focus:border-white transition-colors duration-200"
              />
              <button className="bg-white text-primary-600 hover:bg-white/90 font-bold py-3 px-6 rounded-lg transition-all duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Social Links & Legal */}
        <div className="border-t border-white/20 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-white font-medium whitespace-nowrap">Follow us:</span>
              <div className="flex space-x-4">
                {config.social_links && config.social_links.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    aria-label={social.name}
                  >
                    {social.name === 'Facebook' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ) : social.name === 'Instagram' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    ) : social.name === 'LinkedIn' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ) : social.name === 'TikTok' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    ) : social.name === 'X' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ) : social.name === 'YouTube' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) : social.name === 'WhatsApp' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    ) : social.name === 'Reddit' ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                      </svg>
                    ) : (
                      <span className="text-white">🔗</span>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end space-x-6">
              {config.legal_links && config.legal_links.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-white/80 text-sm">
              © 2025 LotusFX. All rights reserved. ABN: 12 345 678 901
            </p>
            <div className="flex items-center flex-wrap justify-center gap-4 text-sm text-white/80">
              <span>Licensed by ASIC</span>
              {selectedCountry === 'AU' && (
                <>
                  <span>•</span>
                  <span>AUSTRAC Registered</span>
                </>
              )}
              {selectedCountry === 'NZ' && (
                <>
                  <span>•</span>
                  <span>FMA Licensed</span>
                </>
              )}
              {selectedCountry === 'FJ' && (
                <>
                  <span>•</span>
                  <span>RBF Licensed</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
