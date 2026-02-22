import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — Nexto',
  description: 'How Nexto handles visitor data and Google Analytics cookies.',
  robots: { index: false },
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy — Nexto',
    description: 'How Nexto handles visitor data and Google Analytics cookies.',
    url: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-3xl font-semibold text-neutral-900 mb-8">Privacy Policy</h1>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-neutral-900 mb-3">What data we collect</h2>
          <p className="text-neutral-600 leading-relaxed">
            We use Google Analytics to understand how visitors interact with this website.
            Google Analytics collects anonymous usage data — such as page views, session duration,
            and general location (country or city level). No personally identifiable information
            is collected through our website.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-neutral-900 mb-3">Cookies</h2>
          <p className="text-neutral-600 leading-relaxed">
            Google Analytics sets cookies in your browser to distinguish visitors and track sessions.
            These cookies do not identify you personally. You can disable cookies through your browser
            settings or opt out of Google Analytics tracking at{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 underline hover:text-brand-teal-dark transition-colors"
            >
              tools.google.com/dlpage/gaoptout
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-neutral-900 mb-3">Third-party services</h2>
          <p className="text-neutral-600 leading-relaxed">
            This site uses Google Analytics, operated by Google LLC. Google may use the data
            collected to personalise ads on its own network. For details on how Google handles
            this data, see{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-900 underline hover:text-brand-teal-dark transition-colors"
            >
              Google&apos;s Privacy Policy
            </a>
            . No other third-party analytics or tracking services are used.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-neutral-900 mb-3">Contact</h2>
          <p className="text-neutral-600 leading-relaxed">
            If you have questions about this privacy policy, contact us at{' '}
            <a
              href="mailto:info@nexto.co.th"
              className="text-neutral-900 underline hover:text-brand-teal-dark transition-colors"
            >
              info@nexto.co.th
            </a>
            .
          </p>
        </section>

        <p className="text-sm text-neutral-500">Last updated: February 2026</p>
      </main>
      <Footer />
    </>
  )
}
