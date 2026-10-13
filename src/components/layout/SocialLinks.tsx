import { SOCIAL_LINKS } from '@/lib/site/constants'
import { SOCIAL_ICON_PATHS } from './socialIcons'

interface SocialLinksProps {
  label: string
  linkPrefix: string
}

/** Nexto's channels as a row of quiet icons that light up teal on hover and focus. */
export function SocialLinks({ label, linkPrefix }: SocialLinksProps) {
  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-2">
        {SOCIAL_LINKS.map(({ name, icon, href }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${linkPrefix} ${name}`}
              className="flex size-11 items-center justify-center rounded-full text-ink-muted ring-1 ring-ink/15 transition-colors ring-inset hover:text-teal-text hover:ring-teal-text/50 focus-visible:text-teal-text"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-[1.125rem] fill-current">
                <path d={SOCIAL_ICON_PATHS[icon]} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
