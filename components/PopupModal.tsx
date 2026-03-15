'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ArrowRightIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCountry } from '@/context/CountryContext'

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false)
  const { selectedCountry } = useCountry()

  useEffect(() => {
    // Check if user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem('lotusfx-popup-seen')
    if (!hasSeenPopup) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('lotusfx-popup-seen', 'true')
  }

  const handleSendMoney = () => {
    setIsOpen(false)
    sessionStorage.setItem('lotusfx-popup-seen', 'true')
    // Navigate to money transfer page
    window.location.href = '/money-transfer'
  }

  // Get country-specific messaging
  const getCountryMessage = () => {
    switch (selectedCountry) {
      case 'AU':
        return 'Send Money AU ↔ NZ ↔ FJ with LOTUS eWire'
      case 'NZ':
        return 'Send Money NZ ↔ AU ↔ FJ with LOTUS eWire'
      case 'FJ':
        return 'Send Money FJ ↔ AU ↔ NZ with LOTUS eWire'
      default:
        return 'Send Money AU ↔ NZ ↔ FJ with LOTUS eWire'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 group"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
              </button>

              <div className="grid md:grid-cols-[1.2fr_1.8fr] gap-0">
                {/* Left Side - Visual/Image */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 md:p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <GlobeAltIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-base md:text-lg lg:text-xl font-bold text-white mb-3 leading-tight">
                      {getCountryMessage()}
                    </h3>
                    <div className="flex flex-col items-center space-y-3 text-white/90">
                      <div className="flex items-center space-x-2">
                        <DevicePhoneMobileIcon className="w-4 h-4" />
                        <span className="text-xs md:text-sm">Available on App, Online & In-Store</span>
                      </div>
                      {/* App Store Buttons */}
                      <div className="flex flex-col space-y-2 mt-3">
                        <a
                          href="https://apps.apple.com/app/lotusfx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs font-semibold"
                        >
                          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                          </svg>
                          App Store
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.lotusfx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors text-xs font-semibold"
                        >
                          <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                          </svg>
                          Google Play
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="p-6 md:p-8">
                  <div className="space-y-4">
                    {/* Highlighted Features */}
                    <div>
                      <p className="text-base md:text-lg text-gray-700 mb-3">
                        <span className="text-primary-600 font-bold">Zero Fees</span> and{' '}
                        <span className="text-primary-600 font-bold">Best Rates</span> for transfers between{' '}
                        {selectedCountry === 'AU' ? 'Australia, New Zealand and Fiji' : 
                         selectedCountry === 'NZ' ? 'New Zealand, Australia and Fiji' : 
                         'Fiji, Australia and New Zealand'}.
                      </p>
                      <p className="text-sm md:text-base text-gray-600">
                        Fast, secure, and convenient - send online, via our app, or in-store.
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary-600 text-sm font-bold">✓</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">No Hidden Fees</div>
                          <div className="text-sm text-gray-600">Transparent pricing with zero commission</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary-600 text-sm font-bold">✓</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Competitive Rates</div>
                          <div className="text-sm text-gray-600">Best exchange rates in the market</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-primary-600 text-sm font-bold">✓</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">Fast & Secure</div>
                          <div className="text-sm text-gray-600">Your money arrives quickly and safely</div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={handleSendMoney}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm md:text-base"
                      >
                        <span>Send with Lotus eWire</span>
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 text-sm md:text-base"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
