interface SectionProps {
  id: string
  labelledBy: string
  className?: string
  /** Extra classes on the inner page column (e.g. to centre content in a full-height section). */
  columnClassName?: string
  children: React.ReactNode
}

/** One chapter of the scroll story, framed by the page grid (hairline on top, guides at the column edges). */
export function Section({ id, labelledBy, className = '', columnClassName = '', children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`grid-section ${className}`}>
      <div className={`grid-column mx-auto w-full max-w-page px-4 py-24 sm:px-8 sm:py-36 ${columnClassName}`}>{children}</div>
    </section>
  )
}
