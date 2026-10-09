import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getDictionary, type Locale } from '@/lib/i18n'

interface HomePageProps {
  locale: Locale
}

// Phase 4 shell: hero only. Phase 5 adds the remaining sections.
export function HomePage({ locale }: HomePageProps) {
  const dict = getDictionary(locale)

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
          <h1 id="hero-title" className="max-w-4xl text-4xl font-medium text-balance sm:text-6xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-muted">{dict.hero.subtitle}</p>
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
