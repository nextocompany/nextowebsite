import { BrandLogo } from '@/components/layout/BrandLogo'
import { NetworkStage } from '@/components/network/NetworkStill'
import { Section } from '@/components/ui/Section'
import { StatusChip } from '@/components/ui/StatusChip'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

const CARD = 'flex flex-col justify-between gap-6 rounded-3xl bg-ground-raised p-6 sm:min-h-56 sm:gap-10 sm:p-10'

export function Products({ dict }: { dict: Dictionary['products'] }) {
  const { endyra, anvira } = dict

  return (
    <Section id={SECTION_IDS.products} labelledBy="products-title">
      <h2
        id="products-title"
        data-reveal
        className="text-4xl leading-[1.1] font-normal tracking-tight sm:text-5xl th:leading-[1.4] th:tracking-normal"
      >
        {dict.title}
      </h2>
      <NetworkStage name="products" className="mt-8 aspect-[2/1] w-full md:aspect-[4/1]" />
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        <li data-fade className={CARD}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3>
              <BrandLogo basePath="/brand/endyra-logo" alt={endyra.name} width={194} height={40} className="h-10 w-auto" />
            </h3>
            <StatusChip tone="available">{endyra.status}</StatusChip>
          </div>
          <p className="max-w-sm text-lg text-ink-muted">{endyra.description}</p>
        </li>
        <li data-fade className={CARD}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3>
              <BrandLogo basePath="/brand/anvira-wordmark" alt={anvira.name} width={165} height={42} className="h-10 w-auto" />
            </h3>
            <StatusChip tone="development">{anvira.status}</StatusChip>
          </div>
          <p className="max-w-sm text-lg text-ink-muted">{anvira.description}</p>
        </li>
      </ul>
    </Section>
  )
}
