import { Geist } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Nexto',
  description: 'Enterprise software studio.',
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
    </html>
  )
}
