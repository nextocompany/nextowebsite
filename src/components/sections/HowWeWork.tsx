import { NetworkStage } from '@/components/network/NetworkStill'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

/**
 * Three principles beside the network telling them in order. From lg up the
 * section is full height so MotionRoot can pin it and step through the items.
 */
export function HowWeWork({ dict }: { dict: Dictionary['howWeWork'] }) {
  return (
    <Section
      id={SECTION_IDS.howWeWork}
      labelledBy="how-title"
      className="lg:flex lg:min-h-svh lg:flex-col"
      columnClassName="lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:py-16"
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="how-title" className="text-sm text-ink-muted en:font-mono en:text-xs en:tracking-wide en:uppercase">
            {dict.title}
          </h2>
          {/* Not numbered: these are principles, not steps. */}
          {/* data-steps: while pinned, MotionRoot marks the item being told with data-current. */}
          <ul data-steps className="mt-8 flex flex-col">
            {dict.items.map((item, i) => (
              <li key={item.title} data-step={i} data-fade className="border-t border-ink/15 py-7">
                <h3 className="text-2xl font-medium tracking-tight sm:text-3xl th:tracking-normal">{item.title}</h3>
                <p className="mt-3 max-w-xl text-lg text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <NetworkStage
          name="how-we-work"
          className="mx-auto aspect-square w-full max-w-sm lg:col-span-5 lg:col-start-8 lg:max-w-none"
        />
      </div>
    </Section>
  )
}
