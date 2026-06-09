import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { AmbientParticles } from "./components/AmbientParticles";
import { EntrySignal } from "./components/EntrySignal";
import { FeaturedSoilAndSun } from "./components/FeaturedSoilAndSun";
import { FrequencyChambers } from "./components/FrequencyChambers";
import { GrainOverlay } from "./components/GrainOverlay";
import { Observatory } from "./components/Observatory";
import { ScrollChoreography } from "./components/ScrollChoreography";
import { ShadowChamberPreview } from "./components/ShadowChamberPreview";
import { SignalLoader } from "./components/SignalLoader";
import { SignalReturn } from "./components/SignalReturn";
import { SignalThreshold } from "./components/SignalThreshold";
import { TransmissionMarquee } from "./components/TransmissionMarquee";
import { Vessel } from "./components/Vessel";

export default function App() {
  useEffect(() => {
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
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen overflow-hidden bg-archive-void text-stone-100">
        <SignalLoader />
        <ScrollChoreography />
        <a className="skip-link" href="#observatory">
          Skip to observatory
        </a>
        <AmbientParticles />
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
            items={[
              "Ego",
              "Mask",
              "Consequence",
              "Prayer",
              "Transit",
              "Return",
              "Awakening",
            ]}
          />
          <Vessel />
        </main>
        <SignalReturn />
        <GrainOverlay />
      </div>
    </MotionConfig>
  );
}
