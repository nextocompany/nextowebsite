import type { Metadata } from 'next'
import Link from 'next/link'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'ไม่พบหน้านี้ · Page not found — Nexto',
  robots: { index: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="th" className={fontVariables}>
      <body>
        <main className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-4 px-4 sm:px-8">
          <p className="font-mono text-sm text-ink-muted">404</p>
          <h1 className="text-3xl font-medium">ไม่พบหน้านี้</h1>
          <p lang="en" className="text-ink-muted">This page could not be found.</p>
          <p className="flex gap-6">
            <Link href="/" className="text-teal-text underline">กลับหน้าแรก</Link>
            <Link href="/en/" lang="en" className="text-teal-text underline">Back to home</Link>
          </p>
        </main>
      </body>
    </html>
  )
}
