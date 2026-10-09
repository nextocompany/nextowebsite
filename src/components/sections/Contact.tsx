import { ButtonLink } from '@/components/ui/ButtonLink'
import { Section } from '@/components/ui/Section'
import type { Dictionary } from '@/lib/i18n'
import { buildMailto } from '@/lib/site/contact'
import { CONTACT_EMAIL, LINE_ID, LINE_URL } from '@/lib/site/constants'
import { SECTION_IDS } from '@/lib/site/sections'

export function Contact({ dict }: { dict: Dictionary['contact'] }) {
  return (
    <Section id={SECTION_IDS.contact} labelledBy="contact-title" className="py-24 sm:py-36">
      <h2
        id="contact-title"
        className="text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl th:leading-[1.35] th:tracking-normal"
      >
        {dict.title}
      </h2>
      <p className="mt-6 max-w-xl text-lg text-ink-muted">{dict.intro}</p>
      <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {dict.topics.map((topic, index) => (
          <li key={topic.subject}>
            <ButtonLink href={buildMailto(topic.subject)} variant={index === 0 ? 'primary' : 'secondary'} className="w-full sm:w-auto">
              {topic.label}
            </ButtonLink>
          </li>
        ))}
      </ul>
      <dl className="mt-14 grid gap-6 border-t border-ink/15 pt-8 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-ink-muted">{dict.emailLabel}</dt>
          <dd className="mt-1 font-mono text-lg select-all">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-teal-text">
              {CONTACT_EMAIL}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-ink-muted">{dict.lineLabel}</dt>
          <dd className="mt-1 font-mono text-lg select-all">
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-teal-text">
              {LINE_ID}
            </a>
          </dd>
        </div>
      </dl>
    </Section>
  )
}
