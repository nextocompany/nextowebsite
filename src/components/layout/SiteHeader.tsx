import Link from 'next/link'
import { getDictionary, LOCALE_PATH, otherLocale, type Locale } from '@/lib/i18n'
import { BrandLogo } from './BrandLogo'

interface SiteHeaderProps {
  locale: Locale
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const dict = getDictionary(locale)
  const target = otherLocale(locale)

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
      <Link href={LOCALE_PATH[locale]} aria-label="Nexto">
        <BrandLogo basePath="/brand/nexto-logo" alt="Nexto" width={124} height={29} />
      </Link>
      <Link
        href={LOCALE_PATH[target]}
        hrefLang={target}
        lang={target}
        aria-label={dict.nav.switchLanguageLabel}
        className="font-mono text-sm text-ink-muted hover:text-ink"
      >
        {dict.nav.switchLanguage}
      </Link>
    </header>
  )
}
