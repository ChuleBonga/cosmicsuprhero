import { MotionConfig } from "framer-motion";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { NowPlayingBar } from "./components/audio/NowPlayingBar";
import { AmbientParticles } from "./components/AmbientParticles";
import { ArchiveNav } from "./components/ArchiveNav";
import { EntrySignal } from "./components/EntrySignal";
import { FeaturedSoilAndSun } from "./components/FeaturedSoilAndSun";
import { FrequencyChambers } from "./components/FrequencyChambers";
import { GrainOverlay } from "./components/GrainOverlay";
import { Observatory } from "./components/Observatory";
import { ArcturianAwakeningAccess } from "./components/ArcturianAwakeningAccess";
import { ScrollChoreography } from "./components/ScrollChoreography";
import { ShadowChamberPreview } from "./components/ShadowChamberPreview";
import { SignalLoader } from "./components/SignalLoader";
import { SignalReturn } from "./components/SignalReturn";
import { SignalThreshold } from "./components/SignalThreshold";
import { TransmissionMarquee } from "./components/TransmissionMarquee";
import { Vessel } from "./components/Vessel";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import { getChamberWorld } from "./data/chamberWorlds";

const ChamberWorldPage = lazy(() =>
  import("./components/ChamberWorldPage").then((module) => ({ default: module.ChamberWorldPage })),
);

function getCurrentPath() {
  return window.location.pathname;
}

function HomeArchive() {
  useEffect(() => {
    const title = "Cosmicsuprhero | Sacred Sonic Observatory";
    const description =
      "Cosmicsuprhero is an atmospheric instrumental music artist building a sacred sonic observatory from South African memory, beat-work, ambient soul, and cosmic reflection.";

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
  }, []);

  return (
    <main className="relative z-10">
      <EntrySignal />
      <TransmissionMarquee
        items={[
          "Transmission active",
          "Frequency locked",
          "Archive breathing",
          "Memory preserved",
          "No autoplay",
          "Choose the signal",
        ]}
      />
      <SignalThreshold />
      <Observatory />
      <ArcturianAwakeningAccess />
      <FrequencyChambers />
      <TransmissionMarquee
        tone="cosmic"
        items={[
          "Cosmological expansion",
          "Intimate star field",
          "Sound object room",
          "Threshold ritual",
          "Earth memory",
          "Nocturnal reflection",
          "Shadow chamber",
        ]}
      />
      <FeaturedSoilAndSun />
      <ShadowChamberPreview />
      <TransmissionMarquee
        tone="shadow"
        items={["Ego", "Mask", "Consequence", "Prayer", "Transit", "Return", "Awakening"]}
      />
      <Vessel />
    </main>
  );
}

function ChamberNotFound() {
  useEffect(() => {
    document.title = "Chamber Not Found | Cosmicsuprhero";
  }, []);

  return (
    <main className="chamber-world chamber-world--not-found" aria-labelledby="chamber-world-heading">
      <section className="chamber-world__hero section-shell">
        <div className="chamber-world__intro">
          <p className="section-kicker">Signal Drift</p>
          <h1 id="chamber-world-heading" className="chamber-world__title">
            Chamber Not Found
          </h1>
          <p className="chamber-world__invocation">
            This transmission does not resolve inside the current archive. Return to the frequency index and choose a
            known chamber.
          </p>
          <div className="chamber-world__actions">
            <a className="button-primary" href="/#frequency-chambers">
              Return to Frequency Index
            </a>
            <a className="button-secondary" href="/">
              Return to Observatory
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(getCurrentPath);
  const chamberMatch = useMemo(() => path.match(/^\/chambers\/([^/]+)\/?$/), [path]);
  const chamberRoute = chamberMatch ? getChamberWorld(decodeURIComponent(chamberMatch[1])) : undefined;
  const isChamberPath = Boolean(chamberMatch);
  const isHomePage = !isChamberPath;

  useEffect(() => {
    const syncPath = () => setPath(getCurrentPath());
    window.addEventListener("popstate", syncPath);

    return () => {
      window.removeEventListener("popstate", syncPath);
    };
  }, []);

  useEffect(() => {
    if (!isHomePage) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    };

    const timeoutId = window.setTimeout(scrollToHash, 80);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [isHomePage, path]);

  return (
    <MotionConfig reducedMotion="user">
      <AudioPlayerProvider>
        <div className="min-h-screen overflow-hidden bg-archive-void text-stone-100">
          {isHomePage ? <SignalLoader /> : null}
          {isHomePage ? <ScrollChoreography /> : null}
          <a className="skip-link" href={isHomePage ? "#observatory" : "#chamber-world-heading"}>
            {isHomePage ? "Skip to observatory" : "Skip to chamber"}
          </a>
          <ArchiveNav currentSlug={chamberRoute?.release.slug} />
          <AmbientParticles />
          {chamberRoute ? (
            <Suspense
              fallback={
                <main className="route-suspense section-shell" role="status" aria-live="polite">
                  Opening chamber...
                </main>
              }
            >
              <ChamberWorldPage release={chamberRoute.release} world={chamberRoute.world} />
            </Suspense>
          ) : isChamberPath ? (
            <ChamberNotFound />
          ) : (
            <HomeArchive />
          )}
          <SignalReturn />
          <NowPlayingBar />
          <GrainOverlay />
        </div>
      </AudioPlayerProvider>
    </MotionConfig>
  );
}
