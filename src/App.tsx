import { useEffect } from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { withMotion } from './lib/motion'
import { TonalBackground } from './components/TonalBackground'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Proof } from './components/Proof'
import { Shift } from './components/Shift'
import { OperatingModel } from './components/OperatingModel'
import { Services } from './components/Services'
import { Engagement } from './components/Engagement'
import { Industries } from './components/Industries'
import { Portfolio } from './components/portfolio/Portfolio'
import { Reviews } from './components/Reviews'
import { About } from './components/About'
import { FAQ } from './components/FAQ'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'
import { Seo } from './components/Seo'
import { ChatWidget } from './components/chat/ChatWidget'
import { BookingProvider } from './components/BookingModal'
import { matchRoute } from './routes'
import { PageSeo } from './pages/PageSeo'

/**
 * Route-aware shell. `path` comes from the SSG entry at build time and from
 * window.location at hydrate, so server and client always agree. The home
 * page is the full single-scroll story; every other route is a focused
 * standalone page (see src/routes.tsx) sharing the same Nav/CTA/Footer/chat.
 * Navigation between pages is plain <a> — full loads of tiny static pages,
 * no client router to maintain.
 */
export default function App({ path = '/' }: { path?: string }) {
  useSmoothScroll()

  // Scroll triggers measure layout up front — recompute once fonts settle.
  useEffect(() => {
    return withMotion(({ ScrollTrigger }) => {
      const refresh = () => ScrollTrigger.refresh()
      const t = setTimeout(refresh, 200)
      if (document.fonts?.ready) document.fonts.ready.then(refresh)
      window.addEventListener('load', refresh)
      return () => {
        clearTimeout(t)
        window.removeEventListener('load', refresh)
      }
    })
  }, [])

  const route = matchRoute(path)

  return (
    <BookingProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TonalBackground />
      <Nav home={!route} />
      <main id="main">
        {route ? (
          <>
            {route.main()}
            <CTA />
          </>
        ) : (
          <>
            <Hero />
            <Proof />
            <Shift />
            <OperatingModel />
            <Services />
            <Engagement />
            <Industries />
            <Portfolio />
            <Reviews />
            <About />
            <FAQ />
            <CTA />
          </>
        )}
      </main>
      <Footer />
      <ChatWidget />
      {route ? <PageSeo route={route} /> : <Seo />}
    </BookingProvider>
  )
}
