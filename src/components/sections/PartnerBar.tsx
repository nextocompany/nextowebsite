import type { Dictionary } from '@/lib/i18n'
import { DEVICE_PARTNERS } from '@/lib/site/constants'
import { SECTION_IDS } from '@/lib/site/sections'

/** "Working with" row at the foot of the hero. Names as text until logos and consent arrive. */
export function PartnerBar({ dict }: { dict: Dictionary['partners'] }) {
  return (
    <div
      id={SECTION_IDS.partners}
      className="flex flex-col gap-3 border-t border-ink/15 pt-6 sm:flex-row sm:items-baseline sm:gap-10"
    >
      <h2 className="text-sm text-ink-muted en:font-mono en:text-xs en:tracking-wide en:uppercase">{dict.label}</h2>
      <ul className="flex flex-wrap gap-x-10 gap-y-2" lang="en">
        {DEVICE_PARTNERS.map((name) => (
          <li key={name} data-partner={name} className="text-2xl font-semibold tracking-tight">
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
