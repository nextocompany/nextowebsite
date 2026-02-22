import { Geist } from 'next/font/google'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nexto.co.th'),
  title: 'Nexto - Your operations simplified',
  description:
    'Nexto helps businesses in Southeast Asia simplify their operations with tailored software solutions for HR, healthcare, and workforce management.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nexto - Your operations simplified',
    description:
      'Nexto helps businesses in Southeast Asia simplify their operations with tailored software solutions for HR, healthcare, and workforce management.',
    url: 'https://nexto.co.th',
    siteName: 'Nexto',
    images: [
      {
        url: '/og-placeholder.png',
        width: 1200,
        height: 630,
        alt: 'Nexto - Your operations simplified',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="antialiased">
        {children}
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-62ZB83X2YZ"
        strategy="afterInteractive"
        async
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-62ZB83X2YZ');
        `}
      </Script>
    </html>
  )
}
