'use client'

import { useEffect } from 'react'

/** Below this the header slides away while reading down and comes back on the way up. */
const NARROW = '(max-width: 1023.98px)'
/** Scroll px either way before the header moves, so small jitters don't toggle it. */
const SLACK = 8

/**
 * Hides the sticky header (data-autohide) while scrolling down on narrow
 * screens, where it would cover the held network, and shows it again on any
 * scroll up, near the top, while its menu is open or while it has focus.
 */
export function HeaderAutoHide() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-autohide]')
    if (!header) return
    const narrow = window.matchMedia(NARROW)
    let last = window.scrollY

    const show = (shown: boolean) => {
      header.dataset.hidden = String(!shown)
    }
    const onScroll = () => {
      const y = window.scrollY
      const busy = header.matches(':focus-within') || header.querySelector('details[open]') !== null
      if (!narrow.matches || busy || y < header.offsetHeight) {
        show(true)
        last = y
      } else if (y > last + SLACK) {
        show(false)
        last = y
      } else if (y < last - SLACK) {
        show(true)
        last = y
      }
    }
    const onFocus = () => show(true)

    window.addEventListener('scroll', onScroll, { passive: true })
    header.addEventListener('focusin', onFocus)
    return () => {
      window.removeEventListener('scroll', onScroll)
      header.removeEventListener('focusin', onFocus)
      delete header.dataset.hidden
    }
  }, [])

  return null
}
