import { describe, expect, it } from 'vitest'
import { buildMailto } from './contact'
import { CONTACT_EMAIL } from './constants'

describe('buildMailto', () => {
  it('addresses the Nexto inbox', () => {
    expect(buildMailto('Engineering work')).toMatch(/^mailto:info@nexto\.co\.th\?subject=/)
    expect(CONTACT_EMAIL).toBe('info@nexto.co.th')
  })

  it('encodes spaces as %20, never +', () => {
    const href = buildMailto('Medical device partnership')
    expect(href).toBe('mailto:info@nexto.co.th?subject=Medical%20device%20partnership')
    expect(href).not.toContain('+')
  })

  it('round-trips a Thai subject with tone marks', () => {
    const subject = 'ร่วมเป็นพาร์ทเนอร์ด้านเครื่องมือแพทย์'
    const href = buildMailto(subject)
    expect(href).not.toMatch(/[฀-๿]/)
    expect(decodeURIComponent(href.split('subject=')[1])).toBe(subject)
  })

  it('encodes characters that would break the query', () => {
    expect(buildMailto('A&B?c=d')).toBe('mailto:info@nexto.co.th?subject=A%26B%3Fc%3Dd')
  })

  it('rejects an empty subject', () => {
    expect(() => buildMailto('  ')).toThrow()
  })
})
