'use client'

import { motion } from 'framer-motion'
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'Sydney, Australia',
    rating: 5,
    text: 'LotusFX saved me hundreds of dollars on my European trip. The rates were excellent and the service was incredibly fast. I\'ll definitely use them again!',
    avatar: '👩‍💼',
    service: 'Currency Exchange',
    amount: '$5,000 AUD → EUR',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Melbourne, Australia',
    rating: 5,
    text: 'I\'ve been using LotusFX for business transactions for 3 years. They\'re reliable, fast, and always offer the best rates. Highly recommended!',
    avatar: '👨‍💻',
    service: 'Business FX',
    amount: '$50,000 AUD → USD',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    location: 'Auckland, New Zealand',
    rating: 5,
    text: 'The online platform is so easy to use. I can exchange currency from home and pick it up at the branch. Customer service is outstanding!',
    avatar: '👩‍🎓',
    service: 'Online Exchange',
    amount: '$2,000 NZD → AUD',
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'Brisbane, Australia',
    rating: 5,
    text: 'Fast, secure, and transparent. No hidden fees, no surprises. LotusFX made my money transfer to the UK seamless and cost-effective.',
    avatar: '👨‍🏫',
    service: 'Money Transfer',
    amount: '$10,000 AUD → GBP',
  },
  {
    id: 5,
    name: 'Lisa Park',
    location: 'Wellington, New Zealand',
    rating: 5,
    text: 'Excellent rates and professional service. The staff at the Wellington branch were knowledgeable and helpful. Will definitely return!',
    avatar: '👩‍⚕️',
    service: 'Currency Exchange',
    amount: '$3,000 NZD → JPY',
  },
  {
    id: 6,
    name: 'James Rodriguez',
    location: 'Perth, Australia',
    rating: 5,
    text: 'Outstanding customer service and competitive rates. I saved significantly compared to my bank. The online booking system is very convenient.',
    avatar: '👨‍🔬',
    service: 'Travel Money',
    amount: '$8,000 AUD → USD',
  },
]

export default function Testimonials() {
  return (
    <section className="relative section-padding bg-white overflow-hidden">
      {/* Currency symbol decorations - light red/pink color */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-20 left-10 text-7xl font-bold text-red-200 opacity-35">
          $
        </span>
        <span className="absolute top-40 right-16 text-6xl font-bold text-red-200 opacity-40">
          €
        </span>
        <span className="absolute bottom-32 left-1/4 text-8xl font-bold text-red-200 opacity-25">
          ¥
        </span>
        <span className="absolute top-1/2 right-10 text-5xl font-bold text-red-200 opacity-35">
          £
        </span>
        <span className="absolute bottom-20 right-1/3 text-6xl font-bold text-red-200 opacity-30">
          ₹
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
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Don't just take our word for it - hear from thousands of satisfied customers 
            who trust LotusFX for their currency exchange and money transfer needs.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group relative h-full"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Card */}
              <div className="relative card-hover h-full p-8 rounded-2xl border-2 border-primary-200 bg-white flex flex-col shadow-md hover:shadow-lg transition-shadow">
                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </motion.div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.1 + i * 0.05 }}
                    >
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 mb-6 italic leading-relaxed flex-grow">
                  "{testimonial.text}"
                </blockquote>

                {/* Service Info */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 mb-6 border border-primary-700 group-hover:border-primary-800 transition-colors duration-300">
                  <div className="text-sm font-bold text-white mb-1">
                    {testimonial.service}
                  </div>
                  <div className="text-xs text-white/90 font-medium">
                    {testimonial.amount}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-3xl"
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-primary-600 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers and start saving money on your 
              currency exchange and money transfers today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                Get Started Now
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-all duration-200">
                View All Reviews
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
