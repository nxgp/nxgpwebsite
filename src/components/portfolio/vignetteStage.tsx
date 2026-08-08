import { Scene, PhoneFrame, TabletFrame, LaptopFrame, GroundShadow } from './devices'
import {
  ForgeViz,
  CortexViz,
  OmniViz,
  SentinelViz,
  ReputationViz,
  TeraInner,
  HarborInner,
  BeaconChatInner,
  BeaconLeadInner,
  VantagePushInner,
} from './vignettes'

/**
 * Showcase scenes — each product presented as hardware on a studio stage
 * (gradient backdrop + giant cropped wordmark), the way agency portfolios
 * present real products. Device choice maps to what the product is:
 *
 *   Agent Hub · WD Chat · Convey · Vantage → laptop (enterprise desktop tools)
 *   Mentera · Tera                         → iPad, portrait (clinic hallway device)
 *   Harbor                                 → iPad, landscape (deck tablet)
 *   Kiotel                                 → floating browser window
 *   elevano                                → two phones: the visitor's chat,
 *                                            the team's Slack
 *
 * Phones don't clip on phones, so those scenes render everywhere; laptop and
 * landscape-tablet screens would shrink below legibility at 345px, so on
 * mobile those scenes fall back to the flat app window (the composition
 * already tuned for phones), still on the studio backdrop.
 */

const studios = {
  forge: 'linear-gradient(160deg, #EEF0F8 0%, #DFE3F2 55%, #CFD4EA 100%)',
  tera: 'linear-gradient(160deg, #F1F1FF 0%, #E2E3FB 52%, #D2D4F5 100%)',
  cortex: 'linear-gradient(160deg, #F3F3F6 0%, #E6E7ED 55%, #D8DAE3 100%)',
  omni: 'linear-gradient(165deg, #EDF2FB 0%, #DCE5F6 55%, #CBD8F0 100%)',
  harbor: 'linear-gradient(160deg, #EDF4F6 0%, #DCE9EE 55%, #CCDEE7 100%)',
  convey: 'linear-gradient(160deg, #0B1030 0%, #060B33 60%, #101748 100%)',
  beacon: 'linear-gradient(160deg, #F2F2F4 0%, #E4E4E9 55%, #D4D5DC 100%)',
  keystone: 'linear-gradient(160deg, #F4F1FA 0%, #E7E2F4 55%, #D7D2ED 100%)',
}

/** Laptop on the studio floor; flat app window on phones. */
function LaptopScene({
  id,
  wordmark,
  dark = false,
  wallpaper,
  viz,
}: {
  id: keyof typeof studios
  wordmark: string
  dark?: boolean
  wallpaper: string
  viz: () => React.ReactNode
}) {
  return (
    <Scene wordmark={wordmark} bg={studios[id]} dark={dark}>
      {/* phones: the flat window composition, already tuned for 345px */}
      <div className="flex h-full w-full p-3 sm:hidden">{viz()}</div>
      {/* sm+: hardware. The app window renders at its designed 640×400 and is
          scaled into the screen like a product screenshot — no reflow, no
          per-scene fitting. Laptop width is fixed so the math is exact. */}
      <div className="hidden h-full w-full items-end justify-center px-4 pb-7 sm:flex">
        <div className="dev-in relative w-[600px] max-w-full" style={{ '--d': '0.05s' } as React.CSSProperties}>
          <GroundShadow dark={dark} className="-bottom-3 left-1/2 h-[22px] w-[88%] -translate-x-1/2" />
          <div className="dev-float">
            <div className="sm-tilt-l">
              <LaptopFrame>
                <div className="absolute inset-0" style={{ background: wallpaper }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-[400px] w-[640px] shrink-0 origin-center scale-[0.8]">{viz()}</div>
                </div>
              </LaptopFrame>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  )
}

function TeraScene() {
  return (
    <Scene wordmark="MENTERA" bg={studios.tera} className="items-center justify-center">
      <div className="dev-in relative w-[min(280px,82%)] sm:w-[320px]">
        <GroundShadow className="-bottom-4 left-1/2 h-[24px] w-[80%] -translate-x-1/2" />
        <div className="dev-float">
          <div className="sm-tilt-r">
            <TabletFrame>
              <TeraInner />
            </TabletFrame>
          </div>
        </div>
      </div>
    </Scene>
  )
}

function HarborScene() {
  return (
    <Scene wordmark="HARBOR" bg={studios.harbor}>
      {/* phones: flat window */}
      <div className="flex h-full w-full p-3 sm:hidden">
        <div className="flex h-full w-full flex-col overflow-hidden rounded-inner border border-line bg-surface shadow-sm">
          <HarborInner />
        </div>
      </div>
      {/* sm+: deck tablet, landscape */}
      <div className="hidden h-full w-full items-center justify-center px-8 sm:flex">
        <div className="dev-in relative w-[min(520px,88%)]">
          <GroundShadow className="-bottom-4 left-1/2 h-[24px] w-[84%] -translate-x-1/2" />
          <div className="dev-float">
            <div className="sm-tilt-l">
              <TabletFrame landscape>
                <HarborInner />
              </TabletFrame>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  )
}

function CortexScene() {
  return (
    <Scene wordmark="KIOTEL" bg={studios.cortex} className="items-center justify-center">
      <div className="dev-in relative h-[86%] w-[92%] sm:h-[330px] sm:w-[min(540px,88%)]">
        <GroundShadow className="-bottom-5 left-1/2 h-[24px] w-[86%] -translate-x-1/2" />
        <div className="dev-float h-full">
          <div className="sm-tilt-r h-full [&>*]:shadow-device">
            <CortexViz />
          </div>
        </div>
      </div>
    </Scene>
  )
}

function BeaconScene() {
  return (
    <Scene wordmark="ELEVANO" bg={studios.beacon} className="items-center justify-center gap-4 sm:gap-8">
      {/* the visitor's phone */}
      <div className="dev-in relative w-[150px] sm:w-[196px]" style={{ '--d': '0.05s' } as React.CSSProperties}>
        <GroundShadow className="-bottom-3 left-1/2 h-[16px] w-[70%] -translate-x-1/2" />
        <div className="dev-float">
          <div className="[transform:perspective(1300px)_rotateY(8deg)_rotate(-3deg)]">
            <PhoneFrame>
              <BeaconChatInner />
            </PhoneFrame>
          </div>
        </div>
      </div>
      {/* the team's phone, a beat later */}
      <div
        className="dev-in relative w-[132px] -translate-y-4 sm:w-[168px] sm:-translate-y-6"
        style={{ '--d': '0.35s', '--fd': '1.2s' } as React.CSSProperties}
      >
        <GroundShadow className="-bottom-3 left-1/2 h-[14px] w-[70%] -translate-x-1/2" />
        <div className="dev-float">
          <div className="[transform:perspective(1300px)_rotateY(-9deg)_rotate(4deg)]">
            <PhoneFrame>
              <BeaconLeadInner />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </Scene>
  )
}

function VantageScene() {
  return (
    <Scene wordmark="VANTAGE" bg={studios.keystone}>
      {/* phones: flat window */}
      <div className="flex h-full w-full p-3 sm:hidden">
        <ReputationViz />
      </div>
      {/* sm+: laptop with the phone catching the pushes beside it */}
      <div className="hidden h-full w-full items-end justify-center px-4 pb-7 sm:flex">
        <div className="dev-in relative w-[600px] max-w-full">
          <GroundShadow className="-bottom-3 left-1/2 h-[22px] w-[88%] -translate-x-1/2" />
          <div className="dev-float">
            <div className="sm-tilt-l">
              <LaptopFrame>
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, #ECEBFA 0%, #F8F8FE 100%)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-[400px] w-[640px] shrink-0 origin-center scale-[0.8]">
                    <ReputationViz />
                  </div>
                </div>
              </LaptopFrame>
            </div>
          </div>
          <div
            className="dev-in absolute -right-7 bottom-[-6px] w-[112px]"
            style={{ '--d': '0.5s', '--fd': '1.6s' } as React.CSSProperties}
          >
            <div className="dev-float">
              <div className="[transform:perspective(1200px)_rotateY(-10deg)_rotate(5deg)]">
                <PhoneFrame>
                  <VantagePushInner />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  )
}

const SCENES: Record<string, () => React.ReactNode> = {
  forge: () => (
    <LaptopScene
      id="forge"
      wordmark="AGENT HUB"
      wallpaper="linear-gradient(135deg, #E9EAFF 0%, #F7F8FF 100%)"
      viz={ForgeViz}
    />
  ),
  tera: TeraScene,
  cortex: CortexScene,
  omni: () => (
    <LaptopScene
      id="omni"
      wordmark="WD CHAT"
      wallpaper="linear-gradient(135deg, #E4ECFB 0%, #F5F8FE 100%)"
      viz={OmniViz}
    />
  ),
  harbor: HarborScene,
  convey: () => (
    <LaptopScene
      id="convey"
      wordmark="CONVEY"
      dark
      wallpaper="linear-gradient(135deg, #0A0F2E 0%, #131A45 100%)"
      viz={SentinelViz}
    />
  ),
  beacon: BeaconScene,
  keystone: VantageScene,
}

export default function VignetteStage({ id }: { id: string }) {
  const SceneFor = SCENES[id]
  return SceneFor ? <SceneFor /> : null
}
