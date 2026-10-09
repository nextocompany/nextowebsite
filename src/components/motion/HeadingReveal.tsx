'use client'

import { useEffect } from 'react'
import { segmentWords } from '@/lib/text/segment'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const LINE_STAGGER_MS = 90
/** Matches --duration-reveal in globals.css, plus a margin. */
const REVEAL_MS = 1000

/** Wraps the heading's text into one block span per rendered line. */
function splitIntoLines(el: HTMLElement, text: string) {
  const lang = el.closest<HTMLElement>('[lang]')?.lang || 'en'
  const words = segmentWords(text, lang).map((word) => {
    const span = document.createElement('span')
    span.textContent = word
    return span
  })
  el.replaceChildren(...words)

  const lines: string[] = []
  let lastTop = Number.NaN
  for (const span of words) {
    if (span.offsetTop !== lastTop) {
      lines.push('')
      lastTop = span.offsetTop
    }
    lines[lines.length - 1] += span.textContent
  }

  el.replaceChildren(
    ...lines.map((line, i) => {
      const span = document.createElement('span')
      span.className = 'reveal-line'
      span.style.transitionDelay = `${i * LINE_STAGGER_MS}ms`
      span.textContent = line
      return span
    }),
  )
  return lines.length
}

/**
 * Line-by-line reveal for [data-reveal] headings that start below the fold.
 * Server HTML keeps every heading visible; JS only hides what the reader
 * hasn't reached yet, and puts the plain text back once the reveal ends.
 */
export function HeadingReveal() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) return

    const originals = new Map<HTMLElement, string>()
    const timers: number[] = []
    const restore = (el: HTMLElement) => {
      const text = originals.get(el)
      if (text === undefined) return
      el.textContent = text
      delete el.dataset.revealState
      originals.delete(el)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          observer.unobserve(el)
          el.dataset.revealState = 'shown'
          const lines = el.querySelectorAll('.reveal-line').length
          timers.push(window.setTimeout(() => restore(el), REVEAL_MS + lines * LINE_STAGGER_MS))
        }
      },
      { threshold: 0.4 },
    )

    for (const el of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
      if (el.getBoundingClientRect().top < window.innerHeight) continue
      const text = el.textContent ?? ''
      originals.set(el, text)
      splitIntoLines(el, text)
      el.dataset.revealState = 'hidden'
      observer.observe(el)
    }

    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
      ;[...originals.keys()].forEach(restore)
    }
  }, [])

  return null
}
