import { HeadingReveal } from '@/components/motion/HeadingReveal'
import { NetworkCanvas } from '@/components/network/NetworkCanvas'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Approach } from '@/components/sections/Approach'
import { Beyond } from '@/components/sections/Beyond'
import { Closing } from '@/components/sections/Closing'
import { Contact } from '@/components/sections/Contact'
import { Hero } from '@/components/sections/Hero'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { PartnerBar } from '@/components/sections/PartnerBar'
import { Products } from '@/components/sections/Products'
import { getDictionary, type Locale } from '@/lib/i18n'

interface HomePageProps {
  locale: Locale
}

export function HomePage({ locale }: HomePageProps) {
  const dict = getDictionary(locale)

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <Hero dict={dict.hero} />
        <PartnerBar dict={dict.partners} />
        <Approach dict={dict.approach} />
        <HowWeWork dict={dict.howWeWork} />
        <Products dict={dict.products} />
        <Beyond dict={dict.beyond} />
        <Contact dict={dict.contact} />
        <Closing line={dict.closing} />
      </main>
      <SiteFooter locale={locale} />
      <NetworkCanvas />
      <HeadingReveal />
    </>
  )
}
