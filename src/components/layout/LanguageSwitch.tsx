'use client'

import Link from 'next/link'
import type { MouseEvent } from 'react'
import { activeSectionId } from '@/lib/site/sections'

/** Just below scroll-padding-top (5rem) in globals.css, so a section counts once it reaches the header. */
const HEADER_OFFSET = 96

interface LanguageSwitchProps {
  href: string
  hrefLang: string
  label: string
  ariaLabel: string
}

/**
 * Plain link with no JS. With JS, it carries the section the reader is in
 * over to the other language (both locales use the same section ids).
 */
export function LanguageSwitch({ href, hrefLang, label, ariaLabel }: LanguageSwitchProps) {
  function keepSection(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'), (el) => ({
      id: el.id,
      top: el.getBoundingClientRect().top,
    }))
    const id = activeSectionId(sections, HEADER_OFFSET)
    if (!id) return
    event.preventDefault()
    window.location.assign(`${href}#${id}`)
  }

  return (
    <Link
      href={href}
      // Switching is a full page load (other root layout), so a prefetched payload is never used.
      prefetch={false}
      hrefLang={hrefLang}
      lang={hrefLang}
      aria-label={ariaLabel}
      onClick={keepSection}
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full font-mono text-sm text-ink-muted transition-colors hover:text-ink"
    >
      {label}
    </Link>
  )
}
