import { CONTACT_EMAIL } from './constants'

/**
 * mailto link with a pre-filled subject. encodeURIComponent (not URLSearchParams)
 * so spaces become %20; some mail clients show a literal "+" otherwise.
 */
export function buildMailto(subject: string, address: string = CONTACT_EMAIL): string {
  if (subject.trim() === '') throw new Error('buildMailto: subject must not be empty')
  return `mailto:${address}?subject=${encodeURIComponent(subject)}`
}
