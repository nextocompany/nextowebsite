import Link from 'next/link'
import { getDictionary, LOCALE_PATH, otherLocale, type Locale } from '@/lib/i18n'
import { NAV_SECTIONS, SECTION_IDS } from '@/lib/site/sections'
import { BrandLogo } from './BrandLogo'
import { LanguageSwitch } from './LanguageSwitch'

interface SiteHeaderProps {
  locale: Locale
}

const NAV_LINK = 'rounded-full px-3 py-2 text-ink-muted transition-colors hover:text-ink'

export function SiteHeader({ locale }: SiteHeaderProps) {
  const dict = getDictionary(locale)
  const target = otherLocale(locale)
  // Full path, so the anchors also work from /privacy/.
  const home = LOCALE_PATH[locale]
  const navLinks = NAV_SECTIONS.map(({ key, id }) => ({ label: dict.nav[key], href: `${home}#${id}` }))

  return (
    <header className="relative z-20 border-b border-[color:var(--grid-line)] bg-ground/80 backdrop-blur md:sticky md:top-0">
      <div className="grid-column mx-auto flex h-18 max-w-page items-center justify-between gap-4 px-4 sm:px-8">
        <Link href={home} aria-label="Nexto" className="shrink-0">
          <BrandLogo basePath="/brand/nexto-logo" alt="Nexto" width={124} height={29} />
        </Link>

        <nav aria-label={dict.nav.menu} className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={NAV_LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitch
            href={LOCALE_PATH[target]}
            hrefLang={target}
            label={dict.nav.switchLanguage}
            ariaLabel={dict.nav.switchLanguageLabel}
          />
          <Link
            href={`${home}#${SECTION_IDS.contact}`}
            className="hidden min-h-10 items-center rounded-[3px] bg-teal-text px-5 text-sm font-medium text-ground transition-colors hover:bg-ink sm:inline-flex"
          >
            {dict.hero.primaryCta}
          </Link>

          {/* <details> keeps the mobile menu working with no JS. */}
          <details className="group md:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full px-3 text-sm ring-1 ring-inset ring-ink/25 [&::-webkit-details-marker]:hidden">
              {dict.nav.menu}
              <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <nav aria-label={dict.nav.menu} className="absolute inset-x-0 top-full border-b border-ink/15 bg-ground px-4 pb-6">
              <ul className="flex flex-col text-lg">
                {navLinks.map((link) => (
                  <li key={link.href} className="border-t border-ink/10">
                    <Link href={link.href} className="block py-4">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`${home}#${SECTION_IDS.contact}`}
                className="mt-2 flex min-h-12 items-center justify-center rounded-[3px] bg-teal-text font-medium text-ground"
              >
                {dict.hero.primaryCta}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
