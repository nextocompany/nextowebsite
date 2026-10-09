import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { SECTION_IDS } from '@/lib/site/sections'

export function HowWeWork({ dict }: { dict: Dictionary['howWeWork'] }) {
  return (
    <Section id={SECTION_IDS.howWeWork} labelledBy="how-title">
      <h2 id="how-title" className="text-sm text-ink-muted en:font-mono en:text-xs en:tracking-wide en:uppercase">
        {dict.title}
      </h2>
      {/* Not numbered: these are principles, not steps. */}
      <ul className="mt-6 grid gap-10 md:grid-cols-3 md:gap-8">
        {dict.items.map((item) => (
          <li key={item.title} className="border-t border-ink/15 pt-6">
            <h3 className="text-xl font-medium">{item.title}</h3>
            <p className="mt-3 text-ink-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
