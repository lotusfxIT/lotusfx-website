'use client'

import { motion } from 'framer-motion'
import {
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { STATS } from '@/config/stats'

const features = [
  {
    icon: CurrencyDollarIcon,
    title: 'Competitive Exchange Rates',
    description: 'Get strong rates with real-time pricing and no hidden fees.',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    icon: ClockIcon,
    title: 'Fast & Secure',
    description: 'Complete your currency exchange in minutes with our secure online platform and instant transfers.',
    color: 'text-primary-700',
    bgColor: 'bg-red-50',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Trusted & Licensed',
    description: `Licensed and trusted by ${STATS.customers.total} customers across the Pacific.`,
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    icon: MapPinIcon,
    title: `${STATS.branches.total} Locations`,
    description: 'Visit any of our branches across Australia, New Zealand, and Fiji for in-person service.',
    color: 'text-accent-700',
    bgColor: 'bg-accent-50',
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Reach',
    description: 'Send money to over 100+ countries worldwide. Our international transfer network ensures your funds reach anywhere you need, quickly and securely.',
    color: 'text-primary-600',
    bgColor: 'bg-primary-50',
  },
  {
    icon: GlobeAltIcon,
    title: '25+ Currencies',
    description: 'Exchange between 25+ currencies including major and exotic currencies worldwide.',
    color: 'text-accent-700',
    bgColor: 'bg-accent-50',
  },
]

const stats = [
  { label: 'Happy Customers', value: STATS.customers.total },
  { label: 'Exchange Volume', value: STATS.totalTransferred },
  { label: 'Branches', value: STATS.branches.total },
  { label: 'Countries', value: '3' },
]

export default function Features() {
  return (
    <section className="relative section-padding bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Currency symbols decorations - light red/pink color */}
        <span className="absolute -top-8 left-4 text-red-200 text-7xl font-extrabold opacity-30">
          $
        </span>
        <div className="absolute top-24 right-40 flex gap-10 text-red-200 text-6xl font-bold tracking-tight opacity-40">
          <span>₿</span>
          <span>₪</span>
          <span>₹</span>
        </div>
        <div className="absolute top-1/3 left-20 text-red-200 text-7xl font-bold opacity-35">
          ¥
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-red-200 text-8xl font-bold opacity-30">
          €
        </div>
        <div className="absolute top-1/2 right-1/4 text-red-200 text-6xl font-bold opacity-35">
          £
        </div>
        <div className="absolute bottom-40 right-60 text-red-200 text-5xl font-bold opacity-40">
          $
        </div>
      </div>
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose LotusFX?
          </h2>
          <p className="text-lg text-gray-600">
            We're committed to providing the best currency exchange experience with 
            competitive rates, secure transactions, and exceptional customer service.
          </p>
        </motion.div>

        {/* Trusted by Thousands band - solid LotusFX red */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-primary-600 rounded-2xl p-8 lg:p-12 mb-14 shadow-md"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Trusted by Thousands
            </h3>
            <p className="text-primary-100">
              Join thousands of satisfied customers who trust LotusFX for their currency exchange needs.
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid with red icon styling */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

              {/* Card Content */}
              <div className="relative p-8 rounded-2xl border-2 border-primary-100 bg-white shadow-md group-hover:border-primary-400 transition-all duration-300 hover:shadow-lg">
                {/* Icon Container - red circular style */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center mx-auto mb-5 shadow-md group-hover:shadow-xl transition-shadow duration-300"
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-primary-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
