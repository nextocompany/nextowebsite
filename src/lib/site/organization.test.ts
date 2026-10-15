import { describe, expect, it } from 'vitest'
import { organizationJsonLd, websiteJsonLd } from './organization'

describe('organizationJsonLd', () => {
  it('names the company once across both languages, with each page as its url', () => {
    const en = organizationJsonLd('en')
    const th = organizationJsonLd('th')
    expect(en['@id']).toBe(th['@id'])
    expect(en.name).toBe('Nexto')
    expect(en.url).toBe('https://nexto.co.th/')
    expect(th.url).toBe('https://nexto.co.th/th/')
  })

  it('points at a raster logo and every social channel', () => {
    const org = organizationJsonLd('en')
    expect(org.logo).toMatch(/\.png$/)
    expect(org.sameAs).toContain('https://www.linkedin.com/company/nextocompany')
  })

  it('serialises to JSON that cannot close its script tag', () => {
    expect(JSON.stringify(organizationJsonLd('th'))).not.toContain('</')
  })

  it('carries the Thai registered name, so searches for it reach this site', () => {
    expect(organizationJsonLd('th').alternateName).toContain('บริษัท เน็กซ์ทู จำกัด')
  })
})

describe('websiteJsonLd', () => {
  it('names the site Nexto at the root and points at the organization', () => {
    const site = websiteJsonLd('th')
    expect(site.name).toBe('Nexto')
    expect(site.url).toBe('https://nexto.co.th/')
    expect(site.publisher['@id']).toBe(organizationJsonLd('en')['@id'])
    expect(JSON.stringify(site)).not.toContain('</')
  })
})
