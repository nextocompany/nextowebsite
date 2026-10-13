export type Locale = 'th' | 'en'

export interface LinkItem {
  label: string
  href: string
}

export interface ProductCopy {
  name: string
  status: string
  description: string
}

/** One block of a product page, in reading order. */
export type ProductBlock =
  | { kind: 'cards'; title: string; items: ReadonlyArray<{ label?: string; title: string; body: string }> }
  | { kind: 'steps'; title: string; items: ReadonlyArray<{ title: string; body: string }> }
  | { kind: 'list'; title: string; items: ReadonlyArray<string> }
  | { kind: 'callout'; title: string; body: string }

/** A product's own page (/endyra/, /anvira/ and their Thai pages). Only claims the user has confirmed. */
export interface ProductPageCopy {
  meta: { title: string; description: string }
  status: string
  headline: string
  intro: string
  /** Short line under the call to action, e.g. where it is in use. */
  note?: string
  cta: { label: string; subject: string }
  blocks: ReadonlyArray<ProductBlock>
  contactTitle: string
}

export interface ContactTopic {
  label: string
  subject: string
}

export interface Dictionary {
  meta: {
    lang: Locale
    title: string
    description: string
    ogLocale: string
  }
  nav: {
    approach: string
    products: string
    beyond: string
    contact: string
    switchLanguage: string
    switchLanguageLabel: string
    menu: string
  }
  hero: {
    title: string
    subtitle: string
    primaryCta: string
    secondaryCta: string
  }
  partners: {
    label: string
  }
  approach: {
    title: string
    body: string
  }
  howWeWork: {
    title: string
    items: ReadonlyArray<{ title: string; body: string }>
  }
  products: {
    title: string
    /** Link from a product card to its page. */
    learnMore: string
    endyra: ProductCopy
    anvira: ProductCopy
  }
  productPages: {
    endyra: ProductPageCopy
    anvira: ProductPageCopy
  }
  beyond: {
    title: string
    saaniq: { name: string; description: string; linkLabel: string }
    engineering: { title: string; body: string }
  }
  contact: {
    title: string
    intro: string
    topics: ReadonlyArray<ContactTopic>
    emailLabel: string
    lineLabel: string
  }
  closing: string
  footer: {
    /** Name of the social icon row. */
    social: string
    /** Before each channel name in an icon's label, e.g. "Nexto on" + "LinkedIn". */
    socialLinkPrefix: string
    rights: string
    privacy: string
  }
}
