import { describe, expect, it } from 'vitest'
import { buildMailto } from './contact'
import { CONTACT_EMAIL } from './constants'

describe('buildMailto', () => {
  it('addresses the Nexto inbox', () => {
    expect(buildMailto('Engineering services')).toMatch(/^mailto:info@nexto\.co\.th\?subject=/)
    expect(CONTACT_EMAIL).toBe('info@nexto.co.th')
  })

  it('encodes spaces as %20, never +', () => {
    const href = buildMailto('Request a demo')
    expect(href).toBe('mailto:info@nexto.co.th?subject=Request%20a%20demo')
    expect(href).not.toContain('+')
  })

  it('round-trips a Thai subject with tone marks', () => {
    const subject = 'สอบถามข้อมูลผลิตภัณฑ์ที่ใช้ร่วมกับเครื่องมือแพทย์'
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
