import { useEffect } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { TonalBackground } from './components/TonalBackground'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Proof } from './components/Proof'
import { Shift } from './components/Shift'
import { OperatingModel } from './components/OperatingModel'
import { Services } from './components/Services'
import { Engagement } from './components/Engagement'
import { Embedded } from './components/Embedded'
import { Industries } from './components/Industries'
import { Work } from './components/Work'
import { Reviews } from './components/Reviews'
import { About } from './components/About'
import { FAQ } from './components/FAQ'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'
import { Seo } from './components/Seo'

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
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TonalBackground />
      <Nav />
      <main id="main">
        <Hero />
        <Proof />
        <Shift />
        <OperatingModel />
        <Services />
        <Engagement />
        <Embedded />
        <Industries />
        <Work />
        <Reviews />
        <About />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <Seo />
    </>
  )
}
