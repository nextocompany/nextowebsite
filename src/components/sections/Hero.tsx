import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

export function Hero({ dict }: { dict: Dictionary['hero'] }) {
  return (
    <Section id={SECTION_IDS.hero} labelledBy="hero-title" beat="hero" className="pt-16 pb-20 sm:pt-28 sm:pb-28">
      <h1
        id="hero-title"
        className="max-w-5xl text-[2.5rem] leading-[1.08] font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl th:leading-[1.35] th:tracking-normal"
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
    </Section>
  )
}
