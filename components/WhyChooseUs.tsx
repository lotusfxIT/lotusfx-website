'use client'

import { motion } from 'framer-motion'
import { 
  StarIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const benefits = [
  {
    icon: CurrencyDollarIcon,
    title: 'Best Exchange Rates',
    description: 'We offer the most competitive rates in the market with transparent pricing and no hidden fees.',
    stats: 'Save up to 3% vs banks',
  },
  {
    icon: ClockIcon,
    title: 'Fast Processing',
    description: 'Complete your currency exchange in minutes with our streamlined online platform.',
    stats: '2-minute average processing',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Bank-Grade Security',
    description: 'Your funds are protected with enterprise-level security and regulatory compliance.',
    stats: '100% secure transactions',
  },
  {
    icon: UserGroupIcon,
    title: 'Expert Support',
    description: 'Get personalized assistance from our experienced currency exchange specialists.',
    stats: '4.9★ customer rating',
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Sydney, Australia',
    rating: 5,
    text: 'LotusFX saved me hundreds of dollars on my European trip. The rates were excellent and the service was fast.',
    avatar: '👩‍💼',
  },
  {
    name: 'Michael Chen',
    location: 'Melbourne, Australia',
    rating: 5,
    text: 'I\'ve been using LotusFX for business transactions for 3 years. Reliable, fast, and always the best rates.',
    avatar: '👨‍💻',
  },
  {
    name: 'Emma Wilson',
    location: 'Auckland, New Zealand',
    rating: 5,
    text: 'The online platform is so easy to use. I can exchange currency from home and pick it up at the branch.',
    avatar: '👩‍🎓',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="relative pt-28 lg:pt-32 pb-24 lg:pb-32 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-16 right-[-40px] w-64 h-64 opacity-15"
          style={{
            clipPath: 'polygon(50% 0%, 100% 30%, 80% 100%, 0% 80%)',
            backgroundImage: 'linear-gradient(145deg, rgba(239,68,68,0.15), rgba(59,130,246,0.05)), url(/wood.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div
          className="absolute bottom-10 left-[-60px] w-72 h-72 opacity-20"
          style={{
            clipPath: 'polygon(0% 0%, 80% 10%, 100% 90%, 20% 100%)',
            backgroundImage: 'linear-gradient(200deg, rgba(255,255,255,0.5), rgba(255,255,255,0.15)), url(/wood.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <span className="absolute top-4 right-24 text-5xl font-semibold text-red-200 opacity-40">
          $
        </span>
        <span className="absolute top-24 right-4 text-5xl font-semibold text-red-200 opacity-40">
          €
        </span>
        <span className="absolute bottom-8 left-40 text-5xl font-semibold text-red-200 opacity-35">
          ¥
        </span>
        <span className="absolute top-1/3 left-10 text-6xl font-semibold text-red-200 opacity-30">
          £
        </span>
        <span className="absolute bottom-1/3 right-1/3 text-7xl font-semibold text-red-200 opacity-25">
          ₹
        </span>
        <span className="absolute top-2/3 left-1/4 text-5xl font-semibold text-red-200 opacity-35">
          ₽
        </span>
        <span className="absolute bottom-20 right-20 text-6xl font-semibold text-red-200 opacity-30">
          ₩
        </span>
      </div>
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why 6,000+ Customers Choose LotusFX
          </h2>
          <p className="text-lg text-gray-600">
            Experience the difference with our commitment to excellence, 
            competitive rates, and exceptional customer service.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group text-center"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

              {/* Content */}
              <div className="relative p-6 rounded-2xl border-2 border-primary-200 bg-white group-hover:border-primary-400 transition-all duration-300 shadow-md hover:shadow-lg">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300"
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                  {benefit.description}
                </p>
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  className="text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg py-2 px-3 inline-block group-hover:from-primary-700 group-hover:to-primary-800 transition-all duration-300"
                >
                  {benefit.stats}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 lg:p-12 shadow-soft"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h3>
            <p className="text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <div className="flex items-center justify-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="font-semibold text-gray-900">
                  {testimonial.name}
                </div>
                <div className="text-sm text-gray-500">
                  {testimonial.location}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9★</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">6,000+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">$2.4B+</div>
              <div className="text-sm text-gray-600">Exchange Volume</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
