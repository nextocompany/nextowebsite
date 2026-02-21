import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Products } from '@/components/sections/Products'
import { HowWeWork } from '@/components/sections/HowWeWork'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Products />
        <HowWeWork />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
