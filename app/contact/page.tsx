'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import MotionWrapper from '@/components/MotionWrapper'
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { STATS } from '@/config/stats'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <MotionWrapper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Expert Support Available
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Get in Touch with LotusFX
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're committed to providing the highest quality service. Reach out through any 
                channel that works best for you.
              </p>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Reach Us
            </h2>
            <p className="text-lg text-gray-600">
              Choose the contact method that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PhoneIcon,
                title: 'Phone Support',
                description: 'Call us during business hours for immediate assistance with your currency exchange or money transfer needs.',
                action: 'Call Now',
                color: 'text-primary-600',
                bgColor: 'bg-primary-50'
              },
              {
                icon: EnvelopeIcon,
                title: 'Email Support',
                description: 'Send us an email and we\'ll respond within 24 hours. Perfect for detailed questions or documentation.',
                action: 'Send Email',
                color: 'text-accent-600',
                bgColor: 'bg-accent-50'
              },
              {
                icon: MapPinIcon,
                title: 'Visit a Branch',
                description: `Visit any of our ${STATS.branches.total} branches across Australia, New Zealand, and Fiji for face-to-face service.`,
                action: 'Find Branch',
                color: 'text-success-600',
                bgColor: 'bg-success-50'
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Live Chat',
                description: 'Chat with our support team in real-time during business hours for instant answers.',
                action: 'Start Chat',
                color: 'text-purple-600',
                bgColor: 'bg-purple-50'
              },
              {
                icon: DevicePhoneMobileIcon,
                title: 'Mobile App',
                description: 'Download the Lotus app to contact support, track transfers, and manage transactions anytime.',
                action: 'Get App',
                color: 'text-blue-600',
                bgColor: 'bg-blue-50'
              },
              {
                icon: GlobeAltIcon,
                title: 'Social Media',
                description: 'Follow us on Facebook and Instagram for updates, tips, and to reach out with questions.',
                action: 'Follow Us',
                color: 'text-pink-600',
                bgColor: 'bg-pink-50'
              },
            ].map((method, index) => (
              <MotionWrapper
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${method.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <method.icon className={`w-6 h-6 ${method.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{method.description}</p>
                <button className={`text-sm font-semibold ${method.color} hover:underline`}>
                  {method.action} →
                </button>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <MotionWrapper
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-strong p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            </MotionWrapper>

            {/* Contact Information */}
            <MotionWrapper
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Direct Contact Information</h2>
                  <div className="space-y-6">
                    {[
                      {
                        flag: '🇦🇺',
                        country: 'Australia',
                        email: STATS.emails.australia,
                        branches: `${STATS.branches.australia} branches across major cities`,
                        hours: STATS.businessHours.australia
                      },
                      {
                        flag: '🇳🇿',
                        country: 'New Zealand',
                        email: STATS.emails.newZealand,
                        branches: `${STATS.branches.newZealand} branches nationwide`,
                        hours: STATS.businessHours.newZealand
                      },
                      {
                        flag: '🇫🇯',
                        country: 'Fiji',
                        email: STATS.emails.fiji,
                        branches: `${STATS.branches.fiji} branches across islands`,
                        hours: STATS.businessHours.fiji
                      },
                    ].map((region) => (
                      <div key={region.country} className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-3xl">{region.flag}</span>
                          <h3 className="text-xl font-bold text-gray-900">{region.country}</h3>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-start gap-2">
                            <EnvelopeIcon className="w-5 h-5 flex-shrink-0 text-primary-600" />
                            <span className="break-all">{region.email}</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <MapPinIcon className="w-5 h-5 flex-shrink-0 text-primary-600" />
                            <span>{region.branches}</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <PhoneIcon className="w-5 h-5 flex-shrink-0 text-primary-600" />
                            <span>{region.hours}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Response Times</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone calls</span>
                      <span className="font-semibold text-primary-600">Immediate</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Live chat</span>
                      <span className="font-semibold text-primary-600">1-2 minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email</span>
                      <span className="font-semibold text-primary-600">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
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

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about contacting us
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'What are your business hours?',
                answer: 'We\'re open Monday to Friday, 9am-5pm in your local timezone. Some branches may have extended hours or weekend service. Check our locations page for specific branch hours.'
              },
              {
                question: 'How quickly will you respond to my inquiry?',
                answer: 'Phone calls are answered immediately during business hours. Email and social media inquiries are responded to within 24 hours. For urgent matters, please call us directly or visit your nearest branch.'
              },
              {
                question: 'Can I schedule an appointment?',
                answer: 'Yes! You can schedule an appointment at any of our branches by calling ahead, using our mobile app, or visiting in person. This is especially helpful for large transactions or complex currency needs.'
              },
              {
                question: 'Do you offer support in multiple languages?',
                answer: 'Yes, our staff speak multiple languages including English, Hindi, Mandarin, Cantonese, Tagalog, and more. Let us know your preferred language when you contact us.'
              },
              {
                question: 'What information should I have ready when contacting you?',
                answer: 'For general inquiries, just your name and contact details. For transaction-specific questions, have your transaction reference number ready. For new services, have your ID and proof of address available.'
              },
            ].map((faq, index) => (
              <MotionWrapper
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <details className="bg-gray-50 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-colors">
                  <summary className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-gray-600">
                    {faq.answer}
                  </p>
                </details>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* (CTA banner removed as requested) */}
    </>
  )
}

