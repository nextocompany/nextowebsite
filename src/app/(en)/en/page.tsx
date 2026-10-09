import { HomePage } from '@/components/HomePage'
import { buildHomeMetadata } from '@/lib/i18n/metadata'

export const metadata = buildHomeMetadata('en')

export default function EnglishHome() {
  return <HomePage locale="en" />
}
