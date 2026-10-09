import Link from 'next/link'
import { NetworkBackdrop } from '@/components/network/NetworkStill'
import { getDictionary, LOCALE_PATH, type Locale } from '@/lib/i18n'
import { CONTACT_EMAIL, LINE_ID, LINE_URL } from '@/lib/site/constants'
import { NAV_SECTIONS, SECTION_IDS } from '@/lib/site/sections'

interface SiteFooterProps {
  locale: Locale
}

const LINK = 'underline-offset-4 transition-colors hover:text-white hover:underline'

/**
 * The last page: the closing line large over the scattered network the story
 * began with, then the way around the site and the way to reach us.
 */
export function SiteFooter({ locale }: SiteFooterProps) {
  const dict = getDictionary(locale)
  const home = LOCALE_PATH[locale]

  return (
    <footer className="relative isolate flex min-h-[calc(100svh-5rem)] snap-start flex-col overflow-hidden bg-charcoal text-mist [--ink:var(--mist)]">
      <NetworkBackdrop name="hero" className="absolute inset-0 -z-10 opacity-25" />

      <div className="mx-auto grid w-full max-w-page grow items-center gap-16 px-4 py-20 sm:px-8 lg:grid-cols-12">
        <p className="text-5xl leading-[1.05] font-medium tracking-tight text-balance sm:text-7xl lg:col-span-7 lg:text-8xl th:leading-[1.3] th:tracking-normal">
          {dict.closing}
        </p>

        <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9">
          <nav aria-label={dict.nav.menu}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
              {NAV_SECTIONS.map(({ key, id }) => (
                <li key={id}>
                  <Link href={`${home}#${id}`} className={LINK}>
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy/" className={LINK}>
                  {dict.footer.privacy}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-6">
            <Link
              href={`${home}#${SECTION_IDS.contact}`}
              className="inline-flex min-h-12 items-center rounded-full bg-mist px-6 font-medium text-charcoal transition-colors hover:bg-white"
            >
              {dict.hero.primaryCta}
            </Link>
            <dl className="grid gap-4 sm:grid-cols-2 sm:gap-8">
              <div>
                <dt className="text-sm">{dict.contact.emailLabel}</dt>
                <dd className="mt-1 font-mono select-all">
                  <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm">{dict.contact.lineLabel}</dt>
                <dd className="mt-1 font-mono select-all">
                  <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
                    {LINE_ID}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-page px-4 sm:px-8">
        <p className="border-t border-mist/20 py-6 text-sm">{dict.footer.rights}</p>
      </div>
    </footer>
  )
}
