'use client'

import MotionWrapper from '@/components/MotionWrapper'

type ServiceKey = 'ewire' | 'wire' | 'moneygram' | 'westernunion'

const SERVICES: {
  key: ServiceKey
  iconBg: string
  icon: string
  title: string
  summary: string
}[] = [
  {
    key: 'ewire',
    iconBg: 'bg-primary-600',
    icon: '⚡',
    title: 'eWire',
    summary: 'Super fast transfers between LotusFX locations in NZ, AU & Fiji',
  },
  {
    key: 'wire',
    iconBg: 'bg-blue-600',
    icon: '🏦',
    title: 'Wire Transfer',
    summary: 'Send to any bank account worldwide',
  },
  {
    key: 'moneygram',
    iconBg: 'bg-red-600',
    icon: '💰',
    title: 'MoneyGram',
    summary: 'Cash pick-up and transfers via MoneyGram',
  },
  {
    key: 'westernunion',
    iconBg: 'bg-yellow-500',
    icon: '🌍',
    title: 'Western Union',
    summary: 'Trusted global cash pick-up network',
  },
]

const SERVICE_MESSAGES: Record<ServiceKey, string> = {
  ewire:
    'eWire: instant transfers between LotusFX locations in New Zealand, Australia, and Fiji with zero or low fees.',
  wire:
    'Wire Transfer: send directly to bank accounts worldwide in major and exotic currencies.',
  moneygram:
    'MoneyGram: send and receive cash worldwide through the MoneyGram network at LotusFX branches.',
  westernunion:
    'Western Union: send and receive cash internationally via the Western Union network at LotusFX.',
}

export default function TransferServices() {
  const handleClick = (key: ServiceKey) => {
    const message = SERVICE_MESSAGES[key]
    if (typeof window !== 'undefined') {
      // Simple popup explanation; can be upgraded to a proper modal later.
      window.alert(message)
    }
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {SERVICES.map((service, index) => (
        <MotionWrapper
          key={service.key}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <button
            type="button"
            className="w-full text-left bg-white rounded-2xl shadow-soft p-6 border border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all"
            onClick={() => handleClick(service.key)}
          >
            <div className={`w-12 h-12 rounded-full ${service.iconBg} flex items-center justify-center mb-4`}>
              <span className="text-white text-2xl font-bold">{service.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{service.summary}</p>
            <span className="text-sm font-semibold text-primary-600">View details →</span>
          </button>
        </MotionWrapper>
      ))}
    </div>
  )
}

