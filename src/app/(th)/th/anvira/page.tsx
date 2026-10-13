import { ProductPage } from '@/components/ProductPage'
import { buildProductMetadata } from '@/lib/i18n/metadata'

export const metadata = buildProductMetadata('th', 'anvira')

export default function ThaiAnvira() {
  return <ProductPage locale="th" product="anvira" />
}
