import Link from 'next/link'
import { BrandLogo } from '@/components/layout/BrandLogo'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { NetworkStage } from '@/components/network/NetworkStill'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import { StatusChip } from '@/components/ui/StatusChip'
import { getDictionary, LOCALE_PATH, type Locale, type Product } from '@/lib/i18n'
import type { ProductBlock } from '@/lib/i18n/types'
import { buildMailto } from '@/lib/site/contact'
import { LINE_ID, LINE_URL, PRODUCT_EMAIL } from '@/lib/site/constants'
import { SECTION_IDS } from '@/lib/site/sections'
import { keepTogether } from '@/lib/text/keepTogether'

const LOGO: Readonly<Record<Product, { basePath: string; width: number; height: number }>> = {
  endyra: { basePath: '/brand/endyra-logo', width: 194, height: 40 },
  anvira: { basePath: '/brand/anvira-wordmark', width: 165, height: 42 },
}

const TONE: Readonly<Record<Product, 'available' | 'development'>> = { endyra: 'available', anvira: 'development' }

const H2 = 'text-3xl leading-[1.15] font-normal tracking-tight sm:text-4xl th:leading-[1.45] th:tracking-normal'

function Block({ block, id }: { block: ProductBlock; id: string }) {
  const title = (
    <h2 id={`${id}-title`} className={H2}>
      {block.title}
    </h2>
  )
  switch (block.kind) {
    case 'cards':
      return (
        <Section id={id} labelledBy={`${id}-title`}>
          {title}
          <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item) => (
              <li key={item.title} className="flex flex-col gap-3 rounded-3xl bg-ground-raised p-6 sm:p-8">
                {item.label && (
                  <p className="text-sm text-teal-text en:font-mono en:text-xs en:tracking-wide en:uppercase">{item.label}</p>
                )}
                <h3 className="text-xl font-medium tracking-tight th:tracking-normal">{item.title}</h3>
                <p className="text-ink-muted">{keepTogether(item.body)}</p>
              </li>
            ))}
          </ul>
        </Section>
      )
    case 'steps':
      return (
        <Section id={id} labelledBy={`${id}-title`}>
          {title}
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {block.items.map((item, i) => (
              <li key={item.title} className="border-t border-ink/15 pt-6">
                <p aria-hidden="true" className="font-mono text-sm text-teal-text">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-xl font-medium tracking-tight th:tracking-normal">{item.title}</h3>
                <p className="mt-2 text-ink-muted">{keepTogether(item.body)}</p>
              </li>
            ))}
          </ol>
        </Section>
      )
    case 'list':
      return (
        <Section id={id} labelledBy={`${id}-title`}>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">{title}</div>
            <ul className="flex flex-col lg:col-span-7">
              {block.items.map((item) => (
                <li key={item} className="border-t border-ink/15 py-4 text-lg first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-4">
                  {keepTogether(item)}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )
    case 'callout':
      return (
        <Section id={id} labelledBy={`${id}-title`}>
          <div className="max-w-3xl border-l-2 border-teal pl-6 sm:pl-8">
            {title}
            <p className="mt-4 text-lg text-ink-muted">{keepTogether(block.body)}</p>
          </div>
        </Section>
      )
  }
}

/** A product's own page: what it does, in the words the user confirmed, and how to reach the team. */
export function ProductPage({ locale, product }: { locale: Locale; product: Product }) {
  const dict = getDictionary(locale)
  const copy = dict.productPages[product]
  const card = dict.products[product]
  const email = PRODUCT_EMAIL[product]
  const mailto = buildMailto(copy.cta.subject, email)

  return (
    <>
      <SiteHeader locale={locale} page={`${product}/`} />
      <main>
        <Section id="overview" labelledBy="product-title">
          <Link
            prefetch={false}
            href={`${LOCALE_PATH[locale]}#${SECTION_IDS.products}`}
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">← </span>
            {dict.products.title}
          </Link>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-4">
                <BrandLogo {...LOGO[product]} alt={card.name} className="h-10 w-auto" />
                <StatusChip tone={TONE[product]}>{copy.status}</StatusChip>
              </div>
              <h1
                id="product-title"
                className="mt-8 text-4xl leading-[1.1] font-normal tracking-tight text-balance sm:text-5xl lg:text-6xl th:leading-[1.4] th:tracking-normal"
              >
                {copy.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-ink-muted sm:text-xl">{keepTogether(copy.intro)}</p>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <ButtonLink href={mailto}>{copy.cta.label}</ButtonLink>
                {copy.note && <p className="text-sm text-ink-muted">{copy.note}</p>}
              </div>
            </div>
            <NetworkStage name="intro" className="mx-auto aspect-square w-full max-w-64 sm:max-w-sm lg:col-span-5 lg:max-w-none" />
          </div>
        </Section>

        {copy.blocks.map((block, i) => (
          <Block key={block.title} block={block} id={`block-${i + 1}`} />
        ))}

        <Section id={SECTION_IDS.contact} labelledBy="product-contact-title">
          <h2 id="product-contact-title" className={H2}>
            {copy.contactTitle}
          </h2>
          <div className="mt-10">
            <ButtonLink href={mailto}>{copy.cta.label}</ButtonLink>
          </div>
          <dl className="mt-14 grid gap-6 border-t border-ink/15 pt-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-ink-muted">{dict.contact.emailLabel}</dt>
              <dd className="mt-1 font-mono text-lg select-all">
                <a href={`mailto:${email}`} className="hover:text-teal-text">
                  {email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-muted">{dict.contact.lineLabel}</dt>
              <dd className="mt-1 font-mono text-lg select-all">
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-teal-text">
                  {LINE_ID}
                </a>
              </dd>
            </div>
          </dl>
        </Section>
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
