'use client'

import { useEffect, useState } from 'react'

type TocItem = { id: string; label: string }

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function LegalToc() {
  const [items, setItems] = useState<TocItem[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>('[data-legal-article] h2')
    )
    const found = headings.map((h) => {
      if (!h.id) h.id = slugify(h.textContent ?? '')
      return { id: h.id, label: (h.textContent ?? '').trim() }
    })
    setItems(found)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [])

  if (items.length < 3) return null

  const links = (
    <ol className="space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block rounded-md border-l-2 py-1.5 pl-3 pr-2 text-sm !leading-snug transition-colors ${
              active === item.id
                ? 'border-primary-600 bg-primary-50 font-semibold text-primary-700'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <details className="lg:hidden mb-10 rounded-xl border border-gray-200 bg-gray-50/60 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900">
          On this page
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <nav aria-label="On this page" className="px-2 pb-3">
          {links}
        </nav>
      </details>

      <nav aria-label="On this page" className="hidden lg:block sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <p className="mb-3 pl-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
          On this page
        </p>
        {links}
      </nav>
    </>
  )
}
