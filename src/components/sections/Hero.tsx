import { NetworkStage } from '@/components/network/NetworkStill'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'
import { PartnerBar } from './PartnerBar'

interface HeroProps {
  dict: Dictionary['hero']
  partners: Dictionary['partners']
}

/** One sentence over the full-screen network; the story continues on scroll. */
export function Hero({ dict, partners }: HeroProps) {
  return (
    <section
      id={SECTION_IDS.hero}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden"
    >
      <NetworkStage name="hero" className="absolute inset-0 -z-10 opacity-45" />
      <div className="mx-auto flex w-full max-w-page grow flex-col justify-center px-4 py-20 sm:px-8">
        <h1
          id="hero-title"
          className="max-w-[16ch] text-[2.75rem] leading-[1.05] font-medium tracking-tight text-balance sm:text-7xl lg:text-8xl th:max-w-[20ch] th:leading-[1.3] th:tracking-normal"
        >
          {dict.title}
        </h1>
      </div>
      <div className="mx-auto w-full max-w-page px-4 pb-8 sm:px-8">
        <PartnerBar dict={partners} />
      </div>
    </section>
  )
}
