import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { WhatWeDo } from '@/components/sections/WhatWeDo'
import { Focus } from '@/components/sections/Focus'
import { Products } from '@/components/sections/Products'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeDo />
        <Focus />
        <Products />
        <HowWeWork />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
