export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LotusFX",
    "alternateName": "Lotus Foreign Exchange",
    "url": "https://lotusfx.com",
    "logo": "https://lotusfx.com/images/lotus-logo-white.png",
    "description": "Leading currency exchange and money transfer service across Australia, New Zealand, and Fiji. Get the best exchange rates with no hidden fees.",
    "foundingDate": "2009",
    "numberOfEmployees": "100-500",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 George Street",
      "addressLocality": "Sydney",
      "addressRegion": "NSW",
      "postalCode": "2000",
      "addressCountry": "AU"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+61-2-1234-5678",
        "contactType": "customer service",
        "availableLanguage": ["English"],
        "areaServed": ["AU", "NZ", "FJ"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/lotusfx",
      "https://www.twitter.com/lotusfx",
      "https://www.instagram.com/lotusfx",
      "https://www.linkedin.com/company/lotusfx"
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": -25.2744,
        "longitude": 133.7751
      },
      "geoRadius": "5000000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Currency Exchange Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Currency Exchange",
            "description": "Exchange between 25+ currencies with competitive rates"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Money Transfer",
            "description": "Fast and secure international money transfers"
          }
        }
      ]
    }
  }

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "LotusFX Currency Exchange",
    "description": "Professional currency exchange and money transfer services",
    "url": "https://lotusfx.com",
    "logo": "https://lotusfx.com/images/lotus-logo-white.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 George Street",
      "addressLocality": "Sydney",
      "addressRegion": "NSW",
      "postalCode": "2000",
      "addressCountry": "AU"
    },
    "telephone": "+61-2-1234-5678",
    "email": "info@lotusfx.com",
    "feesAndCommissionsSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "0",
      "priceCurrency": "AUD",
      "description": "No commission fees"
    },
    "serviceType": "Currency Exchange",
    "areaServed": [
      {
        "@type": "Country",
        "name": "Australia"
      },
      {
        "@type": "Country",
        "name": "New Zealand"
      },
      {
        "@type": "Country",
        "name": "Fiji"
      }
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://lotusfx.com"
      }
    ]
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are your exchange rates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our exchange rates are updated in real-time and are among the most competitive in the market. We offer rates that are typically 2-3% better than banks, with no hidden fees or commissions."
        }
      },
      {
        "@type": "Question",
        "name": "How do I exchange currency with LotusFX?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can exchange currency with us in three ways: 1) Visit any of our 50+ branches across Australia, New Zealand, and Fiji, 2) Use our online platform to order currency and pick it up at a branch, or 3) Use our mobile app for instant quotes and branch booking."
        }
      },
      {
        "@type": "Question",
        "name": "Is it safe to exchange currency with LotusFX?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, absolutely. LotusFX is licensed by ASIC (Australian Securities and Investments Commission) and is a member of AFMA (Australian Financial Markets Association). We use bank-grade security for all transactions and are PCI DSS compliant."
        }
      }
    ]
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
