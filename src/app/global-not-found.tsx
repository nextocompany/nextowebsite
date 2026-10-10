import type { Metadata } from 'next'
import Link from 'next/link'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page not found — Nexto',
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-4 px-4 sm:px-8">
          <p className="font-mono text-sm text-ink-muted">404</p>
          <h1 className="text-3xl font-medium">This page could not be found.</h1>
          <p>
            <Link href="/" className="text-teal-text underline">
              Back to home
            </Link>
          </p>
        </main>
      </body>
    </html>
  )
}
