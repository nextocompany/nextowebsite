import { NetworkStage } from '@/components/network/NetworkStill'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

export function Approach({ dict }: { dict: Dictionary['approach'] }) {
  return (
    // Full-height from lg up so MotionRoot can pin it while the network splits.
    <Section
      id={SECTION_IDS.approach}
      labelledBy="approach-title"
      className="lg:flex lg:min-h-svh lg:flex-col"
      columnClassName="lg:flex lg:flex-1 lg:flex-col lg:justify-center"
    >
      {/* data-hold / data-under-hold: on narrow screens the stage holds the top half while the text passes (pins.ts). */}
      <div data-hold-tail className="grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-x-12">
        <h2
          id="approach-title"
          data-reveal
          data-under-hold
          className="text-4xl leading-[1.1] font-normal tracking-tight text-balance sm:text-5xl lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-end th:leading-[1.4] th:tracking-normal"
        >
          {dict.title}
        </h2>
        <NetworkStage
          name="approach"
          hold
          className="mx-auto aspect-[4/3] w-full lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1"
        />
        <div data-fade data-under-hold className="lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:self-start">
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
