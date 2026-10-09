import Link from 'next/link'
import { getDictionary, type Locale } from '@/lib/i18n'

interface SiteFooterProps {
  locale: Locale
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const dict = getDictionary(locale)

  return (
    <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-sm text-ink-muted sm:px-8">
      <p>{dict.footer.rights}</p>
      <Link href="/privacy/" className="hover:text-ink">
        {dict.footer.privacy}
      </Link>
    </footer>
  )
}
