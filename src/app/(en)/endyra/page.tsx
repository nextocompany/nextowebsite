import { ProductPage } from '@/components/ProductPage'
import { buildProductMetadata } from '@/lib/i18n/metadata'

export const metadata = buildProductMetadata('en', 'endyra')

export default function EnglishEndyra() {
  return <ProductPage locale="en" product="endyra" />
}
