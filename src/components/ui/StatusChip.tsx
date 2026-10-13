interface StatusChipProps {
  /** accent: a product page's own colour (--accent-text, set by data-product). */
  tone: 'available' | 'development' | 'accent'
  children: React.ReactNode
}

const TONES = {
  available: 'text-teal-text ring-teal-text/40',
  development: 'text-ink-muted ring-ink-muted/40',
  accent: 'text-[var(--accent-text)] ring-[color-mix(in_srgb,var(--accent-text)_40%,transparent)]',
} as const

export function StatusChip({ tone, children }: StatusChipProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-sm whitespace-nowrap ring-1 ring-inset en:font-mono en:text-xs en:tracking-wide en:uppercase ${TONES[tone]}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}
