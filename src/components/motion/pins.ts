import { setPin } from '@/lib/motion/pinStore'
import { activeStep } from '@/lib/motion/steps'
import { SECTION_IDS } from '@/lib/site/sections'

type ScrollTriggerClass = typeof import('gsap/ScrollTrigger').ScrollTrigger

/** Pin the column where the sections sit side by side and fit the screen. */
export const PIN_MEDIA = '(min-width: 1024px) and (min-height: 640px)'
/** Stacked screens hold the stage in the top half instead (globals.css [data-hold]). */
export const NARROW_MEDIA = '(max-width: 1023.98px)'
/** Wide but short screens: nothing is held; How we work plays as its stage passes. */
export const SHORT_MEDIA = '(min-width: 1024px) and (max-height: 639.98px)'

/** Scroll held per pin, in viewport heights: one for the split, more for three steps. */
const APPROACH_LENGTH = '+=100%'
const HOW_WE_WORK_LENGTH = '+=150%'

/** The page column of a section, if it fits the screen (a pinned column taller than the screen hides its own text). */
function fittingColumn(sectionId: string): HTMLElement | null {
  const column = document.getElementById(sectionId)?.querySelector<HTMLElement>('.grid-column') ?? null
  return column && column.scrollHeight <= window.innerHeight ? column : null
}

/**
 * Pins a section's page column (not the section, so anchors and the language
 * switch keep its real top) and reports progress to the network.
 * Earlier sections refresh first: each spacer moves every trigger after it.
 */
function pinColumn(
  ScrollTrigger: ScrollTriggerClass,
  column: HTMLElement,
  length: string,
  refreshPriority: number,
  onProgress: (progress: number) => void,
) {
  return ScrollTrigger.create({
    trigger: column,
    start: 'top top',
    end: length,
    pin: column,
    // The sections are flex columns, where ScrollTrigger would otherwise skip the spacing.
    pinSpacing: true,
    anticipatePin: 1,
    refreshPriority,
    onUpdate: (self) => onProgress(self.progress),
    onRefresh: (self) => onProgress(self.progress),
  })
}

/** Holds Approach on screen while the network splits into data and people and rejoins. */
export function pinApproach(ScrollTrigger: ScrollTriggerClass) {
  const column = fittingColumn(SECTION_IDS.approach)
  if (!column) return
  setPin('approach', 0)
  const pin = pinColumn(ScrollTrigger, column, APPROACH_LENGTH, 2, (p) => setPin('approach', p))
  return () => {
    pin.kill()
    setPin('approach', undefined)
  }
}

/**
 * Holds How we work on screen for its three steps; the item being told stays
 * bright and the others dim. Falls back to the stage's own pass if it doesn't fit.
 */
export function pinHowWeWork(ScrollTrigger: ScrollTriggerClass) {
  const column = fittingColumn(SECTION_IDS.howWeWork)
  if (!column) return followHowWeWorkStage(ScrollTrigger)
  const list = column.querySelector<HTMLElement>('[data-steps]')
  const items = Array.from(list?.querySelectorAll<HTMLElement>('[data-step]') ?? [])
  const show = (progress: number) => {
    setPin('howWeWork', progress)
    const current = activeStep(progress)
    items.forEach((item, i) => (item.dataset.current = String(i === current)))
  }
  if (list) list.dataset.stepping = 'on'
  show(0)
  const pin = pinColumn(ScrollTrigger, column, HOW_WE_WORK_LENGTH, 1, show)
  return () => {
    pin.kill()
    if (list) delete list.dataset.stepping
    items.forEach((item) => delete item.dataset.current)
    setPin('howWeWork', undefined)
  }
}

/**
 * Narrow screens: a held stage sticks to the top half of the screen (CSS) and
 * the beat's progress is the text passing the middle of the screen, from its
 * first line to the end of the block. The text fades out there, under the network.
 */
function holdStage(
  ScrollTrigger: ScrollTriggerClass,
  sectionId: string,
  refreshPriority: number,
  onProgress: (progress: number) => void,
) {
  const stage = document.getElementById(sectionId)?.querySelector<HTMLElement>('[data-hold]')
  const block = stage?.parentElement
  if (!stage || !block) return
  const texts = Array.from(block.querySelectorAll<HTMLElement>('[data-under-hold]'))
  if (texts.length === 0) return
  // The stage's bottom edge once it holds: the middle of the screen.
  const line = () => stage.offsetHeight
  const cut = () => {
    for (const text of texts) text.style.setProperty('--hold-cut', `${line() - text.getBoundingClientRect().top}px`)
  }
  const pin = ScrollTrigger.create({
    trigger: texts[0],
    start: () => `top top+=${line()}`,
    endTrigger: block,
    end: () => `bottom top+=${line()}`,
    refreshPriority,
    onUpdate: (self) => onProgress(self.progress),
    onRefresh: (self) => onProgress(self.progress),
  })
  // The text can sit under the stage before and after the hold too, so the cut follows the whole pass.
  const pass = ScrollTrigger.create({
    trigger: block,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: cut,
    onRefresh: cut,
  })
  return () => {
    pin.kill()
    pass.kill()
    for (const text of texts) text.style.removeProperty('--hold-cut')
  }
}

/** Narrow screens: both pins hold their stage in the top half while the text passes below. */
export function holdNarrow(ScrollTrigger: ScrollTriggerClass) {
  setPin('approach', 0)
  setPin('howWeWork', 0)
  const approach = holdStage(ScrollTrigger, SECTION_IDS.approach, 2, (p) => setPin('approach', p))
  const howWeWork = holdStage(ScrollTrigger, SECTION_IDS.howWeWork, 1, (p) => setPin('howWeWork', p))
  return () => {
    howWeWork?.()
    approach?.()
    setPin('approach', undefined)
    setPin('howWeWork', undefined)
  }
}

/**
 * Wide but short screens (or a column too tall to pin): How we work's three
 * steps play as the stage itself passes through the screen, and no text is dimmed.
 */
export function followHowWeWorkStage(ScrollTrigger: ScrollTriggerClass) {
  const stage = document.querySelector<HTMLElement>('[data-stage="how-we-work"]')
  if (!stage) return
  setPin('howWeWork', 0)
  const pass = ScrollTrigger.create({
    trigger: stage,
    start: 'top 85%',
    end: 'bottom 30%',
    refreshPriority: 1,
    onUpdate: (self) => setPin('howWeWork', self.progress),
    onRefresh: (self) => setPin('howWeWork', self.progress),
  })
  return () => {
    pass.kill()
    setPin('howWeWork', undefined)
  }
}
