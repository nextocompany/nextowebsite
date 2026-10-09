import { NetworkStage } from '@/components/network/NetworkStill'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

/** Where the scattered network gathers into the Nexto brain, and what Nexto does. */
export function Intro({ dict }: { dict: Dictionary['hero'] }) {
  return (
    <Section id={SECTION_IDS.intro} labelledBy="intro-lead" className="py-24 sm:py-36">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p
            id="intro-lead"
            data-reveal
            className="text-2xl leading-snug font-medium text-balance sm:text-3xl lg:text-4xl th:leading-[1.6]"
          >
            {dict.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`#${SECTION_IDS.contact}`}>{dict.primaryCta}</ButtonLink>
            <ButtonLink href={`#${SECTION_IDS.products}`} variant="secondary">
              {dict.secondaryCta}
            </ButtonLink>
          </div>
        </div>
        <NetworkStage
          name="intro"
          className="mx-auto aspect-square w-full max-w-72 sm:max-w-sm lg:col-span-5 lg:max-w-none"
        />
      </div>
    </Section>
  )
}
