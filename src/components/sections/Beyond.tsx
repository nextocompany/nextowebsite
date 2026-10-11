import { BrandLogo } from '@/components/layout/BrandLogo'
import { NetworkStage } from '@/components/network/NetworkStill'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { ENGINEERING_PARTNERS, SAANIQ_URL } from '@/lib/site/constants'
import { SECTION_IDS } from '@/lib/site/sections'

export function Beyond({ dict }: { dict: Dictionary['beyond'] }) {
  const { saaniq, engineering } = dict

  return (
    <Section id={SECTION_IDS.beyond} labelledBy="beyond-title">
      <NetworkStage name="beyond" className="mb-10 aspect-[4/3] w-full md:aspect-[4/1]" />
      <h2 id="beyond-title" className="text-sm text-ink-muted en:font-mono en:text-xs en:tracking-wide en:uppercase">
        {dict.title}
      </h2>
      <div className="mt-6 grid gap-12 border-t border-ink/15 pt-10 md:grid-cols-2 md:gap-8">
        <article aria-labelledby="saaniq-title" data-fade>
          <h3 id="saaniq-title">
            <BrandLogo basePath="/brand/saaniq-logo" alt={saaniq.name} width={172} height={40} className="h-10 w-auto" />
          </h3>
          <p className="mt-3 max-w-md text-ink-muted">{saaniq.description}</p>
          <a
            href={SAANIQ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-medium text-teal-text underline decoration-teal-text/30 underline-offset-4 transition-colors hover:decoration-teal-text"
          >
            {saaniq.linkLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </article>
        {/* data-partner-group: beat 4 routes its lines down this column's left gutter. */}
        <article aria-labelledby="engineering-title" data-partner-group data-fade>
          <h3 id="engineering-title" className="text-3xl font-medium tracking-tight th:tracking-normal">
            {engineering.title}
          </h3>
          <p className="mt-3 max-w-md text-ink-muted">{engineering.body}</p>
          <ul lang="en" className="mt-6 flex flex-col gap-2">
            {ENGINEERING_PARTNERS.map((name) => (
              <li key={name} data-partner={name} className="text-lg font-semibold">
                {name}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Section>
  )
}
