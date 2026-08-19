'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { canLoadAnalytics, isAnalyticsConsentRequired } from '@/lib/analytics-consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * Loads GA4 (direct) and/or GTM once in production.
 * - If NEXT_PUBLIC_GTM_ID is set, GTM loads GA4/Ads via the container — no direct gtag.js.
 * - If only NEXT_PUBLIC_GA_ID is set, gtag.js loads directly.
 * - Never load both GA implementations (prevents duplicate page views).
 */
export default function AnalyticsScripts() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(canLoadAnalytics())
    sync()

    if (isAnalyticsConsentRequired()) {
      window.addEventListener('lotusfx-analytics-consent', sync)
      return () => window.removeEventListener('lotusfx-analytics-consent', sync)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      {GTM_ID ? (
        <>
          <Script
            id="gtm-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
              title="Google Tag Manager"
            />
          </noscript>
        </>
      ) : null}

      {!GTM_ID && GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { send_page_view: false });
              `,
            }}
          />
        </>
      ) : null}
    </>
  )
}
