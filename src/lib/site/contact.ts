import { CONTACT_EMAIL } from './constants'

/**
 * mailto link with a pre-filled subject. encodeURIComponent (not URLSearchParams)
 * so spaces become %20; some mail clients show a literal "+" otherwise.
 */
export function buildMailto(subject: string): string {
  if (subject.trim() === '') throw new Error('buildMailto: subject must not be empty')
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
}
