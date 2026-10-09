interface SectionProps {
  id: string
  labelledBy: string
  className?: string
  children: React.ReactNode
}

export function Section({ id, labelledBy, className = '', children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={className}>
      <div className="mx-auto max-w-page px-4 sm:px-8">{children}</div>
    </section>
  )
}
