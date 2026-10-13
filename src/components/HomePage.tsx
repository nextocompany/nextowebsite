import { MotionRoot } from '@/components/motion/MotionRoot'
import { NetworkCanvas } from '@/components/network/NetworkCanvas'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { Approach } from '@/components/sections/Approach'
import { Beyond } from '@/components/sections/Beyond'
import { Contact } from '@/components/sections/Contact'
import { Hero } from '@/components/sections/Hero'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { Intro } from '@/components/sections/Intro'
import { Products } from '@/components/sections/Products'
import { getDictionary, type Locale } from '@/lib/i18n'
import { organizationJsonLd } from '@/lib/site/organization'

interface HomePageProps {
  locale: Locale
}

export function HomePage({ locale }: HomePageProps) {
  const dict = getDictionary(locale)

  return (
    <>
      {/* Data, not script: CSP does not apply, and the content is our own constants. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }} />
      <SiteHeader locale={locale} />
      <main>
        <Hero dict={dict.hero} partners={dict.partners} />
        <Intro dict={dict.hero} />
        <Approach dict={dict.approach} />
        <HowWeWork dict={dict.howWeWork} />
        <Products dict={dict.products} />
        <Beyond dict={dict.beyond} />
        <Contact dict={dict.contact} />
      </main>
      <SiteFooter locale={locale} />
      <NetworkCanvas />
      <MotionRoot />
    </>
  )
}
