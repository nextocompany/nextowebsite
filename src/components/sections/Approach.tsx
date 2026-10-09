import { NetworkStage } from '@/components/network/NetworkStill'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

export function Approach({ dict }: { dict: Dictionary['approach'] }) {
  return (
    <Section id={SECTION_IDS.approach} labelledBy="approach-title">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-12">
        <h2
          id="approach-title"
          data-reveal
          className="text-4xl leading-[1.1] font-medium tracking-tight text-balance sm:text-5xl lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-end th:leading-[1.4] th:tracking-normal"
        >
          {dict.title}
        </h2>
        <NetworkStage
          name="approach"
          className="mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:max-w-none"
        />
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:self-start">
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
