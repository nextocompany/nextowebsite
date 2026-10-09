'use client'

import { useEffect } from 'react'
import 'lenis/dist/lenis.css'
import { splitIntoLines } from './splitLines'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

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

        const ctx = gsap.context(() => {
          heroExit(gsap)
          revealBelowFold(gsap)
        })

        cleanup = () => {
          ctx.revert()
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
