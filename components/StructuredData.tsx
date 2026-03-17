export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LotusFX',
    alternateName: 'Lotus Foreign Exchange',
    url: 'https://lotusfx.com',
    logo: 'https://lotusfx.com/images/lotus-logo-white.png',
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
    url: 'https://lotusfx.com',
    logo: 'https://lotusfx.com/images/lotus-logo-white.png',
    serviceType: 'Currency Exchange',
    areaServed: [
      {
        '@type': 'Country',
        name: 'Australia',
      },
      {
        '@type': 'Country',
        name: 'New Zealand',
      },
      {
        '@type': 'Country',
        name: 'Fiji',
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lotusfx.com',
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
    </>
  )
}
