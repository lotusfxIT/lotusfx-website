'use client'

const SYMBOLS = ['$', '€', '£', '¥', '¢', '₹']
const POSITIONS: { top?: string; left?: string; right?: string; bottom?: string; size: string; opacity: string; color: string }[] = [
  { top: '6%', left: '6%', size: 'text-4xl', opacity: 'opacity-[0.16]', color: 'text-primary-500' },
  { top: '14%', right: '10%', size: 'text-5xl', opacity: 'opacity-[0.14]', color: 'text-amber-700' },
  { top: '4%', left: '2%', size: 'text-3xl', opacity: 'opacity-[0.18]', color: 'text-primary-600' },
  { top: '40%', right: '14%', size: 'text-4xl', opacity: 'opacity-[0.15]', color: 'text-amber-800' },
  { bottom: '28%', right: '8%', size: 'text-5xl', opacity: 'opacity-[0.14]', color: 'text-amber-700' },
  { top: '22%', left: '48%', size: 'text-2xl', opacity: 'opacity-[0.12]', color: 'text-primary-400' },
  { top: '8%', right: '28%', size: 'text-3xl', opacity: 'opacity-[0.15]', color: 'text-amber-800' },
  { top: '52%', left: '24%', size: 'text-3xl', opacity: 'opacity-[0.16]', color: 'text-amber-700' },
  { bottom: '10%', right: '22%', size: 'text-4xl', opacity: 'opacity-[0.15]', color: 'text-primary-500' },
  { top: '4%', left: '38%', size: 'text-2xl', opacity: 'opacity-[0.13]', color: 'text-amber-800' },
  { top: '36%', left: '32%', size: 'text-3xl', opacity: 'opacity-[0.14]', color: 'text-primary-500' },
  { bottom: '46%', right: '18%', size: 'text-3xl', opacity: 'opacity-[0.15]', color: 'text-amber-700' },
  { top: '26%', right: '38%', size: 'text-2xl', opacity: 'opacity-[0.13]', color: 'text-primary-600' },
  { bottom: '22%', left: '36%', size: 'text-3xl', opacity: 'opacity-[0.14]', color: 'text-amber-800' },
]

type CurrencySymbolsBgProps = {
  variant?: 'default' | 'white'
}

export default function CurrencySymbolsBg({ variant = 'default' }: CurrencySymbolsBgProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden>
      {POSITIONS.map((pos, i) => {
        const symbol = SYMBOLS[i % SYMBOLS.length]
        const colorClass = variant === 'white' ? 'text-white' : pos.color
        const opacityClass = variant === 'white' ? 'opacity-[0.16]' : pos.opacity

        return (
          <span
            key={i}
            className={`absolute font-bold ${pos.size} ${opacityClass} ${colorClass}`}
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
            }}
          >
            {symbol}
          </span>
        )
      })}
    </div>
  )
}
