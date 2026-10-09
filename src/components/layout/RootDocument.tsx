import Script from 'next/script'
import { fontVariables } from '@/lib/fonts'
import type { Locale } from '@/lib/i18n'
import '@/app/globals.css'

const GA_ID = 'G-62ZB83X2YZ'

interface RootDocumentProps {
  locale: Locale
  children: React.ReactNode
}

/** The <html> shell shared by the Thai and English root layouts. */
export function RootDocument({ locale, children }: RootDocumentProps) {
  return (
    <html lang={locale} className={fontVariables}>
      <body>{children}</body>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </html>
  )
}
