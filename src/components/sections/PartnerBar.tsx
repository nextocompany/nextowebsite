import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n'
import { WORKING_WITH } from '@/lib/site/constants'
import { SECTION_IDS } from '@/lib/site/sections'

/** "Working with" row at the foot of the hero: every customer and partner, as a logo or, until it arrives, its name. */
export function PartnerBar({ dict }: { dict: Dictionary['partners'] }) {
  return (
    <div
      id={SECTION_IDS.partners}
      className="flex flex-col gap-3 border-t border-ink/15 pt-6 sm:flex-row sm:items-baseline sm:gap-10"
    >
      <h2 className="text-sm text-ink-muted en:font-mono en:text-xs en:tracking-wide en:uppercase">{dict.label}</h2>
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-3" lang="en">
        {WORKING_WITH.map(({ name, logo }) => (
          <li key={name} data-partner={name} className="text-2xl font-semibold tracking-tight">
            {logo ? (
              <Image src={logo.src} alt={name} width={logo.width} height={logo.height} className="h-8 w-auto" />
            ) : (
              name
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
