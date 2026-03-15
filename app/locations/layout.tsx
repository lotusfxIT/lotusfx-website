import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Branch Locations - Find LotusFX Near You | Australia, NZ, Fiji',
  description: 'Find your nearest LotusFX branch across Australia, New Zealand, and Fiji. 30+ locations with expert currency exchange and money transfer services.',
  keywords: [
    'LotusFX locations',
    'currency exchange near me',
    'money transfer branches',
    'LotusFX Australia',
    'LotusFX New Zealand',
    'LotusFX Fiji',
    'branch finder',
    'nearest currency exchange'
  ],
  openGraph: {
    title: 'Branch Locations - Find LotusFX Near You',
    description: 'Find your nearest LotusFX branch across Australia, New Zealand, and Fiji. 30+ locations with expert services.',
    images: ['/images/locations-og.jpg'],
  },
}

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
