import { useEffect } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { TonalBackground } from './components/TonalBackground'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Proof } from './components/Proof'
import { OperatingModel } from './components/OperatingModel'
import { Services } from './components/Services'
import { Embedded } from './components/Embedded'
import { Industries } from './components/Industries'
import { Work } from './components/Work'
import { Outcomes } from './components/Outcomes'
import { Reviews } from './components/Reviews'
import { Stats } from './components/Stats'
import { Quote } from './components/Quote'
import { About } from './components/About'
import { FAQ } from './components/FAQ'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'

export default function App() {
  useSmoothScroll()

  // Pinned sections measure layout up front — recompute once fonts settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    const t = setTimeout(refresh, 200)
    if (document.fonts?.ready) document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
    }
  }, [])

  return (
    <>
      <TonalBackground />
      <Nav />
      <main>
        <Hero />
        <Proof />
        <OperatingModel />
        <Services />
        <Embedded />
        <Industries />
        <Work />
        <Outcomes />
        <Reviews />
        <Stats />
        <Quote />
        <About />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
