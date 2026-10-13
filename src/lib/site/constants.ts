/** Locale-independent facts about Nexto. */
export const CONTACT_EMAIL = 'info@nexto.co.th'
export const LINE_ID = '@nextocompany'
export const LINE_URL = 'https://line.me/R/ti/p/@nextocompany'
export const SAANIQ_URL = 'https://saaniq.com'

/** Each product page's own inbox (decided 2026-10-14; see docs/adr/0001). */
export const PRODUCT_EMAIL = { endyra: 'endyra@nexto.co.th', anvira: 'anvira@nexto.co.th' } as const

/** Nexto's own channels, shown as icons in the footer. */
export const SOCIAL_LINKS = [
  { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/nextocompany' },
  { name: 'LINE', icon: 'line', href: LINE_URL },
  { name: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/nextocompany' },
  { name: 'X', icon: 'x', href: 'https://x.com/nextocomp' },
] as const

export interface Organisation {
  name: string
  /** White, transparent logo in public/partners/; without one the name shows as text. */
  logo?: { src: string; width: number; height: number }
}

/**
 * Customers and partners in the hero "In collaboration with" row (written consent received 2026-10-10).
 * Logos are single-colour white marks made from the partners' files (see public/partners/).
 */
export const WORKING_WITH: ReadonlyArray<Organisation> = [
  { name: 'Meditop', logo: { src: '/partners/meditop.png', width: 170, height: 160 } },
  { name: 'Touch Technologies', logo: { src: '/partners/touch-technologies.png', width: 377, height: 160 } },
  { name: 'Anantariverhills Resort', logo: { src: '/partners/ananta-river-hills.png', width: 202, height: 160 } },
  { name: 'Leaf Lake Kans', logo: { src: '/partners/leaf-lake-kan.png', width: 170, height: 160 } },
  { name: '500 Miles', logo: { src: '/partners/500-miles.png', width: 160, height: 160 } },
  { name: 'VDS Business Center', logo: { src: '/partners/vds.png', width: 232, height: 160 } },
  { name: 'The Enterprise Resources Training', logo: { src: '/partners/ert.png', width: 666, height: 160 } },
  { name: 'Tech It Up', logo: { src: '/partners/tiu.png', width: 792, height: 160 } },
]

export const ENGINEERING_PARTNERS = [
  'Touch Technologies',
  '500 Miles',
  'The Enterprise Resources Training',
  'Tech It Up',
] as const
