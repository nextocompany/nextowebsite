import { segmentWords } from '@/lib/text/segment'

/**
 * Wraps an element's text into one block span per rendered line, splitting
 * words with Intl.Segmenter so Thai never breaks inside a cluster. Returns the
 * line spans; put the original text back with `el.textContent = text`.
 */
export function splitIntoLines(el: HTMLElement, text: string): HTMLElement[] {
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

  const spans = lines.map((line) => {
    const span = document.createElement('span')
    span.className = 'reveal-line'
    span.textContent = line
    return span
  })
  el.replaceChildren(...spans)
  return spans
}
