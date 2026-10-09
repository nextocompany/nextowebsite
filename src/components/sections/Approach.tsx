import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

export function Approach({ dict }: { dict: Dictionary['approach'] }) {
  return (
    <Section id={SECTION_IDS.approach} labelledBy="approach-title" beat="approach" className="py-24 sm:py-36">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <h2
          id="approach-title"
          className="text-4xl leading-[1.1] font-medium tracking-tight text-balance sm:text-5xl lg:col-span-7 th:leading-[1.4] th:tracking-normal"
        >
          {dict.title}
        </h2>
        <div className="lg:col-span-5 lg:pt-3">
          {/* The two hemispheres of the Nexto brain: logic (teal) and human judgment (coral). */}
          <div aria-hidden="true" className="mb-6 flex gap-2">
            <span className="h-1 w-12 rounded-full bg-teal" />
            <span className="h-1 w-12 rounded-full bg-coral" />
          </div>
          <p className="text-lg text-ink-muted">{dict.body}</p>
        </div>
      </div>
    </Section>
  )
}
