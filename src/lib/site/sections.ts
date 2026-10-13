import type { Dictionary } from '@/lib/i18n'

/** Shared by nav anchors, section ids and (Phase 6) scroll beats. Same on / and /en/. */
export const SECTION_IDS = {
  hero: 'top',
  partners: 'partners',
  intro: 'intro',
  approach: 'approach',
  howWeWork: 'how-we-work',
  products: 'products',
  beyond: 'beyond',
  contact: 'contact',
} as const

type NavKey = keyof Pick<Dictionary['nav'], 'approach' | 'products' | 'beyond' | 'contact'>

export const NAV_SECTIONS: ReadonlyArray<{ key: NavKey; id: string }> = [
  { key: 'approach', id: SECTION_IDS.approach },
  { key: 'products', id: SECTION_IDS.products },
  { key: 'beyond', id: SECTION_IDS.beyond },
  { key: 'contact', id: SECTION_IDS.contact },
]

/**
 * The section the reader is in: the last one whose top has scrolled past `offset`.
 * Returns null while the first section is still active (top of the page needs no hash).
 */
export function activeSectionId(
  sections: ReadonlyArray<{ id: string; top: number }>,
  offset: number,
): string | null {
  const passed = sections.filter((s) => s.top <= offset)
  if (passed.length <= 1) return null
  return passed[passed.length - 1].id
}
