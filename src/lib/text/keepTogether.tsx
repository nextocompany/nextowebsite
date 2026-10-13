import { Fragment, type ReactNode } from 'react'

/**
 * Thai words a line should not break inside: loanwords the browser's
 * dictionary splits (รี|สอร์ต) and compounds that read as one term (ส่อง|กล้อง).
 * Add a word here when a new one turns up in the copy.
 */
export const KEEP_TOGETHER: ReadonlyArray<string> = ['รีสอร์ต', 'ส่องกล้อง']

/** The text with each KEEP_TOGETHER word in a no-wrap span; the words themselves are unchanged for search. */
export function keepTogether(text: string, words: ReadonlyArray<string> = KEEP_TOGETHER): ReactNode {
  const found = words.filter((word) => text.includes(word))
  if (found.length === 0) return text
  const pattern = new RegExp(`(${found.join('|')})`)
  return text.split(pattern).map((part, i) =>
    found.includes(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}
