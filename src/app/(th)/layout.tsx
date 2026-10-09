import { RootDocument } from '@/components/layout/RootDocument'

export default function ThaiLayout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="th">{children}</RootDocument>
}
