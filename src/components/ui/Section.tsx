interface SectionProps {
  id: string
  labelledBy: string
  className?: string
  children: React.ReactNode
}

/** One chapter of the scroll story, framed by the page grid (hairline on top, guides at the column edges). */
export function Section({ id, labelledBy, className = '', children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`grid-section ${className}`}>
      <div className="grid-column mx-auto w-full max-w-page px-4 py-24 sm:px-8 sm:py-36">{children}</div>
    </section>
  )
}
