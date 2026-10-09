interface ButtonLinkProps {
  href: string
  variant?: 'primary' | 'secondary'
  className?: string
  children: React.ReactNode
}

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px'

const VARIANTS = {
  primary: 'bg-teal-text text-ground hover:bg-ink',
  secondary: 'text-ink ring-1 ring-inset ring-ink/25 hover:ring-ink',
} as const

/** Anchor styled as a button: hash links and mailto, never page routes. */
export function ButtonLink({ href, variant = 'primary', className = '', children }: ButtonLinkProps) {
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${className}`}>
      {children}
    </a>
  )
}
