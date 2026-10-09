import { NetworkStage } from '@/components/network/NetworkStill'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

export function Hero({ dict }: { dict: Dictionary['hero'] }) {
  return (
    <Section id={SECTION_IDS.hero} labelledBy="hero-title" className="pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1
            id="hero-title"
            className="text-[2.5rem] leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl th:leading-[1.35] th:tracking-normal"
          >
            {dict.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink-muted sm:text-xl">{dict.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`#${SECTION_IDS.contact}`}>{dict.primaryCta}</ButtonLink>
            <ButtonLink href={`#${SECTION_IDS.products}`} variant="secondary">
              {dict.secondaryCta}
            </ButtonLink>
          </div>
        </div>
        <NetworkStage
          name="hero"
          className="mx-auto aspect-square w-full max-w-72 sm:max-w-sm lg:col-span-5 lg:max-w-none"
        />
      </div>
    </Section>
  )
}
