import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '@/lib/i18n'
import { organizationJsonLd } from './organization'
import { productJsonLd } from './product'

describe('productJsonLd', () => {
  it('describes each product as software published by Nexto, one id across languages', () => {
    for (const product of PRODUCTS) {
      const [en] = productJsonLd('en', product)['@graph']
      const [th] = productJsonLd('th', product)['@graph']
      expect(en['@id']).toBe(th['@id'])
      expect(en.publisher['@id']).toBe(organizationJsonLd('en')['@id'])
    }
  })

  it('points the breadcrumb and url at the page in its own language', () => {
    const [software, crumbs] = productJsonLd('th', 'endyra')['@graph']
    expect(software.url).toBe('https://nexto.co.th/th/endyra/')
    expect(crumbs.itemListElement[0].item).toBe('https://nexto.co.th/th/')
  })

  it('makes no claims the page does not: no ratings or offers', () => {
    const json = JSON.stringify(productJsonLd('en', 'anvira'))
    expect(json).not.toMatch(/aggregateRating|offers|review/)
    expect(json).not.toContain('</')
  })
})
