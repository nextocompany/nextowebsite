import Link from 'next/link'
import { NetworkStage } from '@/components/network/NetworkStill'
import { SocialLinks } from './SocialLinks'
import { getDictionary, LOCALE_PATH, type Locale } from '@/lib/i18n'
import { CONTACT_EMAIL, LINE_ID, LINE_URL } from '@/lib/site/constants'
import { NAV_SECTIONS, SECTION_IDS } from '@/lib/site/sections'

interface SiteFooterProps {
  locale: Locale
}

const LINK = 'underline-offset-4 transition-colors hover:text-white hover:underline'

/**
 * The last page: the Nexto brain gathered again above the closing line, then
 * the way around the site and the way to reach us. On phones only the brain,
 * the line and the social links stay: Contact sits just above and the header
 * menu comes back on any scroll up.
 */
export function SiteFooter({ locale }: SiteFooterProps) {
  const dict = getDictionary(locale)
  const home = LOCALE_PATH[locale]

  return (
    <footer className="grid-section relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden text-ink">

      <div className="grid-column mx-auto flex w-full max-w-page grow flex-col px-4 sm:px-8">
      <div className="grid grow items-center gap-12 py-16 sm:gap-16 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {/* The closing stage: the brain gathers here as the footer comes in (NetworkCanvas draws it live). */}
          <NetworkStage name="closing" className="mb-8 aspect-square w-32 sm:w-40 lg:w-48" />
          <p className="text-5xl leading-[1.05] font-medium tracking-tight text-balance sm:text-7xl lg:text-8xl th:leading-[1.3] th:tracking-normal">
            {dict.closing}
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9">
          <nav aria-label={dict.nav.menu} className="max-md:hidden">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
              {NAV_SECTIONS.map(({ key, id }) => (
                <li key={id}>
                  <Link prefetch={false} href={`${home}#${id}`} className={LINK}>
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
              <li>
                <Link prefetch={false} href="/privacy/" className={LINK}>
                  {dict.footer.privacy}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-6">
            <Link
              prefetch={false}
              href={`${home}#${SECTION_IDS.contact}`}
              className="inline-flex min-h-12 items-center max-md:hidden rounded-[3px] bg-mist px-6 font-medium text-charcoal transition-colors hover:bg-white"
            >
              {dict.hero.primaryCta}
            </Link>
            <dl className="flex flex-wrap gap-x-10 gap-y-4 max-md:hidden">
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
            <SocialLinks label={dict.footer.social} linkPrefix={dict.footer.socialLinkPrefix} />
          </div>
        </div>
      </div>

        <p className="border-t border-[color:var(--grid-line)] py-6 text-sm">{dict.footer.rights}</p>
      </div>
    </footer>
  )
}
