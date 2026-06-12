import { motion } from "framer-motion";
import { ArrowLeft, Radio } from "lucide-react";
import type { ChamberWorld } from "../../data/chamberWorlds";
import type { Release } from "../../data/releases";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { ChamberVisualLayer } from "../ChamberVisualLayer";
import { ChamberAtmosphere } from "./ChamberAtmosphere";

type ChamberStageProps = {
  release: Release;
  world: ChamberWorld;
};

export function ChamberStage({ release, world }: ChamberStageProps) {
  const { activeTrack, playbackState } = useAudioPlayer();
  const isActive = activeTrack?.chamberSlug === release.slug && playbackState === "playing";
  const signalPhrase = release.signalPhrase ?? world.invocation;

  return (
    <section className="chamber-stage section-shell" aria-labelledby="chamber-world-heading">
      <ChamberVisualLayer visualAssets={release.visualAssets} variant={world.variant} priority />
      <ChamberAtmosphere variant={world.variant} active={isActive} />

      <motion.div
        className="chamber-stage__content"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <nav className="chamber-world__crumbs" aria-label="Chamber navigation">
          <a href="/">Observatory</a>
          <span aria-hidden="true">/</span>
          <span>{release.chamber}</span>
        </nav>

        <p className="section-kicker">{world.subtitle}</p>
        <h1 id="chamber-world-heading" className="chamber-world__title">
          {world.worldTitle}
        </h1>
        <p className="chamber-stage__signal">{signalPhrase}</p>
        {release.frequencyTags?.length ? (
          <ul className="chamber-stage__tags" aria-label={`${release.title} frequency tags`}>
            {release.frequencyTags.slice(0, 5).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        <div className="chamber-stage__actions">
          <a className="button-primary" href="#chamber-transmission">
            <Radio size={18} aria-hidden="true" />
            Begin Transmission
          </a>
          <a className="button-secondary" href="/#frequency-chambers">
            <ArrowLeft size={18} aria-hidden="true" />
            Return to Index
          </a>
        </div>
      </motion.div>

      <motion.aside
        className="chamber-stage__instrument"
        initial={{ opacity: 0, y: 24, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: -0.3 }}
        transition={{ duration: 1, delay: 0.18, ease: "easeOut" }}
        aria-label={`${release.title} chamber signal status`}
      >
        <p>Primary Transmission</p>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>{release.status}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{release.year}</dd>
          </div>
          <div>
            <dt>Room Tone</dt>
            <dd>{release.shortVisualDescription ?? release.visual}</dd>
          </div>
          <div>
            <dt>Motion</dt>
            <dd>{release.motionLanguage ?? release.motion}</dd>
          </div>
        </dl>
      </motion.aside>
    </section>
  );
}
