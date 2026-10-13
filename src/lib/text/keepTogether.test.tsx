import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { th } from '@/lib/i18n/th'
import { keepTogether } from './keepTogether'

const html = (text: string) => renderToStaticMarkup(<>{keepTogether(text)}</>)

describe('keepTogether', () => {
  it('wraps a listed loanword so the line cannot break inside it', () => {
    expect(html(th.beyond.saaniq.description)).toContain('<span class="whitespace-nowrap">รีสอร์ต</span>')
    expect(html(th.products.endyra.description)).toContain('<span class="whitespace-nowrap">ส่องกล้อง</span>')
  })

  it('leaves text without a listed word as it is', () => {
    expect(keepTogether('ระบบบริหารจัดการโรงแรม')).toBe('ระบบบริหารจัดการโรงแรม')
  })

  it('keeps every character of the text', () => {
    const text = th.beyond.saaniq.description
    expect(html(text).replace(/<[^>]+>/g, '')).toBe(text)
  })
})
