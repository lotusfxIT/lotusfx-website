import { getSiteUrl } from '@/lib/site-url'

export default function StructuredData() {
  const siteUrl = getSiteUrl()

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LotusFX',
    alternateName: 'Lotus Foreign Exchange',
    url: siteUrl,
    logo: `${siteUrl}/images/lotus-logo-white.png`,
    description:
      'Currency exchange and money transfer services across Australia, New Zealand and Fiji.',
    foundingDate: '2002',
    sameAs: [
      'https://www.facebook.com/lotusfx',
      'https://www.instagram.com/lotusfx',
      'https://www.linkedin.com/company/lotusfx',
    ],
  }

  const financialServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'LotusFX Currency Exchange',
    description: 'Currency exchange and international money transfer services.',
    url: siteUrl,
    logo: `${siteUrl}/images/lotus-logo-white.png`,
    serviceType: ['Currency Exchange', 'Money Transfer', 'Travel Money'],
    areaServed: [
      { '@type': 'Country', name: 'Australia' },
      { '@type': 'Country', name: 'New Zealand' },
      { '@type': 'Country', name: 'Fiji' },
    ],
  }

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LotusFX',
    url: siteUrl,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  )
}
