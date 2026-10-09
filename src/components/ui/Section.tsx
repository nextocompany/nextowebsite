interface SectionProps {
  id: string
  labelledBy: string
  className?: string
  children: React.ReactNode
}

/**
 * One "page" of the scroll story: at least a screen tall (below the header),
 * content centred, and a scroll-snap stop at its top.
 */
export function Section({ id, labelledBy, className = '', children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`flex min-h-[calc(100svh-5rem)] snap-start items-center py-16 sm:py-20 ${className}`}
    >
      <div className="mx-auto w-full max-w-page px-4 sm:px-8">{children}</div>
    </section>
  )
}
