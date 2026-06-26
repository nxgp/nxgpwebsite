import { useEffect } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { ScrollTrigger } from './lib/gsap'
import { TonalBackground } from './components/TonalBackground'
import { CustomCursor } from './components/CustomCursor'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Proof } from './components/Proof'
import { StudioModel } from './components/StudioModel'
import { HowItWorks } from './components/HowItWorks'
import { Engineering } from './components/Engineering'
import { Portfolio } from './components/Portfolio'
import { Stats } from './components/Stats'
import { Quote } from './components/Quote'
import { Approach } from './components/Approach'
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
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <Proof />
        <StudioModel />
        <HowItWorks />
        <Engineering />
        <Portfolio />
        <Stats />
        <Quote />
        <Approach />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
