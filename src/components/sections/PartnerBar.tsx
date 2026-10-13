import Image from 'next/image'
import type { Dictionary } from '@/lib/i18n'
import { WORKING_WITH } from '@/lib/site/constants'
import { logoHeightRem } from '@/lib/site/logos'
import { SECTION_IDS } from '@/lib/site/sections'

/**
 * "In collaboration with" row at the foot of the hero: every customer and partner, as a logo or, without one, its name.
 * On phones a 4-column grid of equal cells, on a backing that quiets the network behind it.
 */
export function PartnerBar({ dict }: { dict: Dictionary['partners'] }) {
  return (
    <div
      id={SECTION_IDS.partners}
      className="flex flex-col gap-4 border-t border-ink/15 pt-6 max-sm:-mx-4 max-sm:bg-ground/85 max-sm:px-4 max-sm:pb-4 sm:flex-row sm:items-center sm:gap-10"
    >
      <h2 className="shrink-0 text-sm text-ink-muted en:font-mono en:text-xs en:tracking-wide en:uppercase">
        {dict.label}
      </h2>
      <ul className="grid grid-cols-4 items-center gap-x-4 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-10" lang="en">
        {WORKING_WITH.map(({ name, logo }) => (
          <li key={name} data-partner={name} className="flex justify-center text-2xl font-semibold tracking-tight sm:block">
            {logo ? (
              <Image
                src={logo.src}
                alt={name}
                width={logo.width}
                height={logo.height}
                // Same visual weight for marks and wordmarks; slightly quieter than the headline.
                style={{ height: `${logoHeightRem(logo.width, logo.height)}rem` }}
                className="w-auto max-w-full object-contain opacity-80"
              />
            ) : (
              name
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
