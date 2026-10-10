/** Locale-independent facts about Nexto. */
export const CONTACT_EMAIL = 'info@nexto.co.th'
export const LINE_ID = '@nextocompany'
export const LINE_URL = 'https://line.me/R/ti/p/@nextocompany'
export const SAANIQ_URL = 'https://saaniq.com'

export interface Organisation {
  name: string
  /** Light-on-dark logo in public/partners/; the name shows as text until it arrives. */
  logo?: { src: string; width: number; height: number }
}

/** Customers and partners in the hero "Working with" row. Written consent received 2026-10-10. */
export const WORKING_WITH: ReadonlyArray<Organisation> = [
  { name: 'Meditop' },
  { name: 'Touch Technologies' },
  { name: '500 Miles' },
]
export const ENGINEERING_PARTNERS = ['Touch Technologies', '500 Miles'] as const
