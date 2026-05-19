import { motion } from "framer-motion";
import { ExternalLink, Flame, Music, Store } from "lucide-react";
import { platformLinks, releases } from "../data/releases";
import { AssetCreditNote } from "./AssetCreditNote";
import { ChamberVisualLayer } from "./ChamberVisualLayer";
import { TransmissionPlayer } from "./TransmissionPlayer";

const badGuys = releases.find((release) => release.title === "Bad Guys Finish Last")!;

export function ShadowChamberPreview() {
  return (
    <section
      id="bad-guys-finish-last"
      className="shadow-section relative overflow-hidden py-16 md:py-24 lg:py-28"
      aria-labelledby="shadow-heading"
    >
      <ChamberVisualLayer visualAssets={badGuys.visualAssets} variant="shadow" />
      <div className="rain-field" aria-hidden="true" />
      <div className="relative z-10 grid items-end gap-9 md:gap-12 xl:grid-cols-[0.98fr_0.82fr]">
        <motion.div
          className="max-w-5xl"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true, amount: 0.12 }}
        >
          <p className="section-kicker text-red-200/70">Shadow Chamber</p>
          <h2 id="shadow-heading" className="section-title shadow-title max-w-5xl">
            Bad Guys Finish Last
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-200 md:mt-8 md:text-xl md:leading-10">
            A reckoning inside the archive. A damaged transmission about ego, betrayal, divine timing, masks,
            contradiction, and the slow work of transformation.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10">
            <a className="button-primary bg-red-200 text-black hover:bg-stone-100" href={badGuys.appleUrl} target="_blank" rel="noreferrer">
              <Music size={18} aria-hidden="true" />
              Listen on Apple Music
            </a>
            <a className="button-secondary" href={platformLinks.linktree} target="_blank" rel="noreferrer">
              <ExternalLink size={18} aria-hidden="true" />
              Open Platform Hub
            </a>
            <a className="button-secondary border-red-200/35 text-red-100" href={platformLinks.elasticStage} target="_blank" rel="noreferrer">
              <Store size={18} aria-hidden="true" />
              Vinyl Pre-Order
            </a>
          </div>
        </motion.div>

        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, rotate: -1.5, y: 30 }}
          whileInView={{ opacity: 1, rotate: -0.4, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2 }}
          viewport={{ once: true, amount: 0.12 }}
        >
          <TransmissionPlayer
            title="Bad Guys Finish Last"
            year="2025"
            frequency="Shadow / Consequence / Mask / Survival"
            condition="Damaged, warm under pressure"
            appleUrl={badGuys.appleUrl}
            embedUrl={badGuys.embedUrl}
            variant="shadow"
          />
          <AssetCreditNote
            credit={badGuys.visualAssets?.credit}
            license={badGuys.visualAssets?.license}
            sourceUrl={badGuys.visualAssets?.sourceUrl}
          />
          <div className="shadow-artifact" aria-hidden="true">
            <Flame className="text-red-200/80" size={34} />
            <span />
            <span />
            <span />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
