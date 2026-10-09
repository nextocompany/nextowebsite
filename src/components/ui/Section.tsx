interface SectionProps {
  id: string
  labelledBy: string
  /** Phase 6 scroll beat this section drives. */
  beat?: 'hero' | 'approach' | 'clusters' | 'partners'
  className?: string
  children: React.ReactNode
}

export function Section({ id, labelledBy, beat, className = '', children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} data-beat={beat} className={className}>
      <div className="mx-auto max-w-6xl px-4 sm:px-8">{children}</div>
    </section>
  )
}
