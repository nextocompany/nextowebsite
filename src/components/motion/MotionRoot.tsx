'use client'

import { useEffect } from 'react'
import 'lenis/dist/lenis.css'
import { setApproachPin } from '@/lib/motion/pinStore'
import { SECTION_IDS } from '@/lib/site/sections'
import { splitIntoLines } from './splitLines'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
/** Pin only where Approach sits side by side and fits the screen; stacked or short screens scroll freely. */
const PIN_MEDIA = '(min-width: 1024px) and (min-height: 640px)'
/** How far the reader scrolls while Approach is pinned, in viewport heights. */
const PIN_LENGTH = '+=100%'

/**
 * Smooth scroll (Lenis) and scroll-linked motion (GSAP ScrollTrigger), loaded
 * after hydration. Server HTML keeps everything visible: motion only hides
 * what starts below the fold, and never runs under reduced motion.
 */
export function MotionRoot() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)

        // Lenis honours scroll-padding-top for anchors, so it needs no offset of its own.
        const lenis = new Lenis({ lerp: 0.085, anchors: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        // The pin goes first: it adds a spacer, which moves every trigger after it.
        const mm = gsap.matchMedia()
        mm.add(PIN_MEDIA, () => pinApproach(ScrollTrigger))
        const ctx = gsap.context(() => {
          heroExit(gsap)
          revealBelowFold(gsap)
        })
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        // The browser jumped to the hash before the spacer existed, so land on it again.
        landOnHash(lenis)

        const onFontsReady = () => ScrollTrigger.refresh()
        void document.fonts.ready.then(onFontsReady)

        cleanup = () => {
          ctx.revert()
          mm.revert()
          setApproachPin(undefined)
          gsap.ticker.remove(tick)
          lenis.destroy()
        }
      })
      .catch(() => {
        // Motion is decoration: if the chunks fail to load, the page stays static and fully readable.
      })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return null
}

type Gsap = typeof import('gsap').gsap
type LenisInstance = InstanceType<typeof import('lenis').default>
type ScrollTriggerClass = typeof import('gsap/ScrollTrigger').ScrollTrigger

/**
 * Holds Approach on screen for a viewport of scroll while the network splits
 * into data and people and rejoins. NetworkCanvas reads the progress.
 */
function pinApproach(ScrollTrigger: ScrollTriggerClass) {
  const section = document.getElementById(SECTION_IDS.approach)
  const content = section?.querySelector<HTMLElement>('.grid-column')
  // A section taller than the screen would hide its own text while pinned.
  if (!section || !content || content.scrollHeight > window.innerHeight) return

  setApproachPin(0)
  // Pin the page column, not the section: the section keeps its place in the
  // document, so nav anchors and the language switch still find its real top.
  const pin = ScrollTrigger.create({
    trigger: content,
    start: 'top top',
    end: PIN_LENGTH,
    pin: content,
    // The section is a flex column, where ScrollTrigger would otherwise skip the spacing.
    pinSpacing: true,
    anticipatePin: 1,
    // Refresh before every other trigger, even when matchMedia recreates the pin after a resize.
    refreshPriority: 1,
    onUpdate: (self) => setApproachPin(self.progress),
    onRefresh: (self) => setApproachPin(self.progress),
  })
  return () => {
    pin.kill()
    setApproachPin(undefined)
  }
}

function landOnHash(lenis: LenisInstance) {
  const id = decodeURIComponent(window.location.hash.slice(1))
  const target = id ? document.getElementById(id) : null
  if (!target) return
  // Lenis caches the scroll limit from before the pin spacer existed; without this it stops short.
  lenis.resize()
  lenis.scrollTo(target, { immediate: true, force: true })
}

/** The hero headline lifts, fades and blurs away as the page scrolls past it (after the reference). */
function heroExit(gsap: Gsap) {
  const title = document.querySelector('[data-hero-title]')
  if (!title) return
  gsap.to(title, {
    yPercent: -40,
    opacity: 0,
    filter: 'blur(10px)',
    ease: 'none',
    scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom 35%', scrub: true },
  })
}

const isBelowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight

/** Headings rise in line by line; other marked blocks fade up. Only for what the reader hasn't reached. */
function revealBelowFold(gsap: Gsap) {
  for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    if (!isBelowFold(el)) continue
    const text = el.textContent ?? ''
    const lines = splitIntoLines(el, text)
    gsap.from(lines, {
      yPercent: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onComplete: () => {
        el.textContent = text
      },
    })
  }

  for (const el of document.querySelectorAll<HTMLElement>('[data-fade]')) {
    if (!isBelowFold(el)) continue
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    })
  }
}
