import { ProductPage } from '@/components/ProductPage'
import { buildProductMetadata } from '@/lib/i18n/metadata'

export const metadata = buildProductMetadata('en', 'anvira')

export default function EnglishAnvira() {
  return <ProductPage locale="en" product="anvira" />
}
