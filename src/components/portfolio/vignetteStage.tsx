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
 * Devices sit straight-on — no 3D poses, no scaling of screen content: UI
 * text rasterizes 1:1 and stays crisp. The laptop is sized so the app window
 * fills its screen at the interiors' native design size.
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
      {/* sm+: hardware. The screen is large enough to host the app window at
          its native size — no scale transform, so text renders 1:1, crisp. */}
      <div className="hidden h-full w-full items-end justify-center pb-7 sm:flex">
        <div className="dev-in relative w-[min(640px,96%)]" style={{ '--d': '0.05s' } as React.CSSProperties}>
          <GroundShadow dark={dark} className="-bottom-3 left-1/2 h-[22px] w-[88%] -translate-x-1/2" />
          <div className="dev-float">
            <LaptopFrame>
              <div className="absolute inset-0" style={{ background: wallpaper }} />
              {/* maximized app — fills the screen edge to edge */}
              <div className="absolute inset-0 flex">{viz()}</div>
            </LaptopFrame>
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
          <TabletFrame>
            <TeraInner />
          </TabletFrame>
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
        <div className="dev-in relative w-[min(540px,90%)]">
          <GroundShadow className="-bottom-4 left-1/2 h-[24px] w-[84%] -translate-x-1/2" />
          <div className="dev-float">
            <TabletFrame landscape>
              <HarborInner />
            </TabletFrame>
          </div>
        </div>
      </div>
    </Scene>
  )
}

function CortexScene() {
  return (
    <Scene wordmark="KIOTEL" bg={studios.cortex} className="items-center justify-center">
      <div className="dev-in relative h-[86%] w-[92%] sm:h-[330px] sm:w-[min(560px,90%)]">
        <GroundShadow className="-bottom-5 left-1/2 h-[24px] w-[86%] -translate-x-1/2" />
        <div className="dev-float h-full [&>*]:shadow-device">
          <CortexViz />
        </div>
      </div>
    </Scene>
  )
}

function BeaconScene() {
  return (
    <Scene wordmark="ELEVANO" bg={studios.beacon} className="items-center justify-center gap-5 sm:gap-9">
      {/* the visitor's phone */}
      <div className="dev-in relative w-[150px] sm:w-[196px]" style={{ '--d': '0.05s' } as React.CSSProperties}>
        <GroundShadow className="-bottom-3 left-1/2 h-[16px] w-[70%] -translate-x-1/2" />
        <div className="dev-float">
          <PhoneFrame>
            <BeaconChatInner />
          </PhoneFrame>
        </div>
      </div>
      {/* the team's phone, a beat later */}
      <div
        className="dev-in relative w-[132px] -translate-y-4 sm:w-[168px] sm:-translate-y-6"
        style={{ '--d': '0.35s', '--fd': '1.2s' } as React.CSSProperties}
      >
        <GroundShadow className="-bottom-3 left-1/2 h-[14px] w-[70%] -translate-x-1/2" />
        <div className="dev-float">
          <PhoneFrame>
            <BeaconLeadInner />
          </PhoneFrame>
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
      <div className="hidden h-full w-full items-end justify-center pb-7 sm:flex">
        <div className="dev-in relative w-[min(640px,96%)]">
          <GroundShadow className="-bottom-3 left-1/2 h-[22px] w-[88%] -translate-x-1/2" />
          <div className="dev-float">
            <LaptopFrame>
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #ECEBFA 0%, #F8F8FE 100%)' }}
              />
              <div className="absolute inset-0 flex">
                <ReputationViz />
              </div>
            </LaptopFrame>
          </div>
          <div
            className="dev-in absolute -bottom-1 right-2 w-[112px]"
            style={{ '--d': '0.5s', '--fd': '1.6s' } as React.CSSProperties}
          >
            <div className="dev-float">
              <PhoneFrame>
                <VantagePushInner />
              </PhoneFrame>
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
