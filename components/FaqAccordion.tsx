'use client'

import { useId, useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export type FaqEntry = { question: string; answer: string }

/** Site-wide FAQ accordion. One item open at a time; CSS-only open/close so it responds instantly. */
export default function FaqAccordion({ items, className = '' }: { items: FaqEntry[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {items.map((faq, index) => {
        const open = openIndex === index
        const panelId = `${baseId}-panel-${index}`
        const buttonId = `${baseId}-button-${index}`
        return (
          <div
            key={faq.question}
            className={`rounded-xl bg-white border border-l-4 transition-[border-color,box-shadow] duration-200 ${
              open
                ? 'border-primary-200 border-l-primary-600 shadow-md'
                : 'border-gray-200 border-l-primary-400 shadow-soft hover:shadow-md'
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <span
                  className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                    open ? 'text-primary-700' : 'text-gray-900'
                  }`}
                >
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 transition-transform duration-200 ${
                    open ? 'rotate-180 text-primary-600' : 'text-gray-400'
                  }`}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 sm:px-6 pb-5 text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
