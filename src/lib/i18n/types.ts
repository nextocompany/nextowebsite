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
    endyra: ProductCopy
    anvira: ProductCopy
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
    rights: string
    privacy: string
  }
}
