import { HomePage } from '@/components/HomePage'
import { buildHomeMetadata } from '@/lib/i18n/metadata'

export const metadata = buildHomeMetadata('th')

export default function ThaiHome() {
  return <HomePage locale="th" />
}
