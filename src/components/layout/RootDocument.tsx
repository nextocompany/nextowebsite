import Script from 'next/script'
import { fontVariables } from '@/lib/fonts'
import type { Locale } from '@/lib/i18n'
import '@/app/globals.css'

const GA_ID = 'G-62ZB83X2YZ'

// First thing in <body>, so it runs before content paints: when motion is allowed, hide the SVG stills so the
// canvas intro doesn't flash a finished brain first. Constant string, no input.
const MOTION_FLAG = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.motion='on'`

interface RootDocumentProps {
  locale: Locale
  children: React.ReactNode
}

/** The <html> shell shared by the Thai and English root layouts. */
export function RootDocument({ locale, children }: RootDocumentProps) {
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
        {children}
      </body>
      {/* Analytics waits for idle so it never competes with the first paint. */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Script id="gtag-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </html>
  )
}
