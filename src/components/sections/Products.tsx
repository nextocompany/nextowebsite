import { BrandLogo } from '@/components/layout/BrandLogo'
import { Section } from '@/components/ui/Section'
import { StatusChip } from '@/components/ui/StatusChip'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

const CARD = 'flex min-h-72 flex-col justify-between gap-12 rounded-3xl bg-ground-raised p-8 sm:p-10'

export function Products({ dict }: { dict: Dictionary['products'] }) {
  const { endyra, anvira } = dict

  return (
    <Section id={SECTION_IDS.products} labelledBy="products-title" beat="clusters" className="py-24 sm:py-36">
      <h2
        id="products-title"
        className="text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl th:leading-[1.4] th:tracking-normal"
      >
        {dict.title}
      </h2>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        <li className={CARD}>
          <div className="flex items-start justify-between gap-4">
            {/* Endyra as text: the current Endyra logo is off-system. */}
            <h3 lang="en" className="text-4xl font-semibold tracking-tight">
              {endyra.name}
            </h3>
            <StatusChip tone="available">{endyra.status}</StatusChip>
          </div>
          <p className="max-w-sm text-lg text-ink-muted">{endyra.description}</p>
        </li>
        <li className={CARD}>
          <div className="flex items-start justify-between gap-4">
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
