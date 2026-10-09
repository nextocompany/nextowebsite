import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { DEVICE_PARTNERS } from '@/lib/site/constants'
import { SECTION_IDS } from '@/lib/site/sections'

export function PartnerBar({ dict }: { dict: Dictionary['partners'] }) {
  return (
    <Section id={SECTION_IDS.partners} labelledBy="partners-title">
      <div className="flex flex-col gap-3 border-y border-ink/15 py-6 sm:flex-row sm:items-baseline sm:gap-10">
        <h2 id="partners-title" className="text-sm text-ink-muted en:font-mono en:text-xs en:tracking-wide en:uppercase">
          {dict.label}
        </h2>
        <ul className="flex flex-wrap gap-x-10 gap-y-2" lang="en">
          {DEVICE_PARTNERS.map((name) => (
            <li key={name} data-partner={name} className="text-2xl font-semibold tracking-tight">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
