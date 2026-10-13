import { describe, expect, it } from 'vitest'
import { en } from './en'
import { th } from './th'

function keyPaths(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') return [prefix]
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keyPaths(item, `${prefix}[${index}]`))
  }
  return Object.entries(value).flatMap(([key, child]) =>
    keyPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('dictionaries', () => {
  it('Thai and English have exactly the same keys', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(th).sort())
  })

  it('has no empty strings in either language', () => {
    for (const dict of [th, en]) {
      const empty = keyPaths(dict).filter((p) => {
        const v = p.split(/\.|\[|\]/).filter(Boolean).reduce<unknown>(
          (acc, k) => (acc as Record<string, unknown>)[k],
          dict,
        )
        return typeof v === 'string' && v.trim() === ''
      })
      expect(empty).toEqual([])
    }
  })

  it('declares the right html lang', () => {
    expect(th.meta.lang).toBe('th')
    expect(en.meta.lang).toBe('en')
  })
})
