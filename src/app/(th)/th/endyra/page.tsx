import { ProductPage } from '@/components/ProductPage'
import { buildProductMetadata } from '@/lib/i18n/metadata'

export const metadata = buildProductMetadata('th', 'endyra')

export default function ThaiEndyra() {
  return <ProductPage locale="th" product="endyra" />
}
