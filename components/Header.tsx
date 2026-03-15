'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useCountry } from '@/context/CountryContext'

const countries = [
  { name: 'Australia', code: 'AU' },
  { name: 'New Zealand', code: 'NZ' },
  { name: 'Fiji', code: 'FJ' },
]

const FLAG_CDN = 'https://flagcdn.com'

function CountryFlag({ code, className = 'w-6 h-4 rounded-sm object-cover' }: { code: string; className?: string }) {
  const cc = code.toLowerCase()
  return <img src={`${FLAG_CDN}/${cc}.svg`} alt={code} className={className} loading="lazy" />
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [countryMenuOpen, setCountryMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navigation, setNavigation] = useState<Array<{ name: string; href: string }>>([])
  const [logoText, setLogoText] = useState('LotusFX')
  const [loading, setLoading] = useState(true)
  const [partnerMenuOpen, setPartnerMenuOpen] = useState(false)
  const { selectedCountry, setSelectedCountry } = useCountry()
  const pathname = usePathname()

  const partnerLinks = [
    { name: 'Western Union', href: '/western-union' },
    { name: 'MoneyGram', href: '/moneygram' },
    { name: 'Cash Passport', href: '/cash-passport' },
  ]

  useEffect(() => {
    fetchHeaderConfig()
  }, [])

  const fetchHeaderConfig = async () => {
    try {
      const response = await fetch('/api/admin/header-footer')
      const data = await response.json()
      if (data.header) {
        const items = (data.header.nav_items || [])
          .filter((item: { name: string }) => item.name.toLowerCase() !== 'rates')
          .map((item: { name: string; href: string }) => {
            const lower = item.name.toLowerCase()
            if (lower === 'about') return { ...item, name: 'About Us' }
            if (lower === 'contact') return { ...item, name: 'Contact Us' }
            return item
          })
        setNavigation(items)
        setLogoText(data.header.logo_text || 'LotusFX')
      }
    } catch (error) {
      console.error('Failed to load header config:', error)
      setNavigation([
        { name: 'Currency Exchange', href: '/currency-exchange' },
        { name: 'Money Transfer', href: '/money-transfer' },
        { name: 'Locations', href: '/locations' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Get portal URL based on selected country
  const getPortalUrl = () => {
    switch (selectedCountry) {
      case 'NZ':
        return 'https://nzcportal.lotusfx.com/customers/login.shtml'
      case 'AU':
        return 'https://auportal.lotusfx.com/customers/login.shtml'
      default:
        return 'https://nzcportal.lotusfx.com/customers/login.shtml'
    }
  }

  return (
    <header className="fixed w-full z-50 bg-white shadow-lg border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity flex-shrink-0">
              <img
                src="/images/lotus-logo-horizontal.jpg"
                alt="LotusFX Logo"
                className="h-10 lg:h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-primary-600'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPartnerMenuOpen(!partnerMenuOpen)}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <span>Our Partners</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {partnerMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      {partnerLinks.map((partner) => (
                        <Link
                          key={partner.name}
                          href={partner.href}
                          onClick={() => setPartnerMenuOpen(false)}
                          className={`block px-4 py-2 text-sm ${
                            pathname === partner.href
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {partner.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right: Country Selector + Login/Sign Up */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {/* Country Selector */}
            <div className="relative">
              <button
                onClick={() => setCountryMenuOpen(!countryMenuOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
              >
                <CountryFlag code={selectedCountry} />
                <span>{countries.find(c => c.code === selectedCountry)?.name || ''}</span>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {countryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          setSelectedCountry(country.code)
                          setCountryMenuOpen(false)
                        }}
                        className={`w-full flex items-center space-x-2 px-4 py-2 text-sm transition-colors duration-200 ${
                          selectedCountry === country.code
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <CountryFlag code={country.code} />
                        <span>{country.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href={getPortalUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary shadow-lg hover:shadow-xl"
              >
                Login / Sign Up
              </a>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden"
          >
            <div className="fixed inset-0 z-50">
              <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
              <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">LotusFX</span>
                  </div>
                  <button
                    type="button"
                    className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="px-4 py-6 space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block text-base font-medium transition-colors duration-200 ${
                        pathname === item.href
                          ? 'text-primary-600'
                          : 'text-gray-700 hover:text-primary-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                      Our Partners
                    </p>
                    <div className="space-y-2">
                      {partnerLinks.map((partner) => (
                        <Link
                          key={partner.name}
                          href={partner.href}
                          className={`block text-base font-medium transition-colors duration-200 ${
                            pathname === partner.href
                              ? 'text-primary-600'
                              : 'text-gray-700 hover:text-primary-600'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {partner.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={getPortalUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login / Sign Up
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
