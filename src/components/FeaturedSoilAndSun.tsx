import { motion } from "framer-motion";
import { Footprints, SunMedium } from "lucide-react";
import { releases, trackJourney } from "../data/releases";
import { ChamberVisualLayer } from "./ChamberVisualLayer";
import { FieldNote } from "./FieldNote";
import { TransmissionPlayer } from "./TransmissionPlayer";

const fieldNotes = [
  "Some songs are not written. They are remembered by the body.",
  "A taxi ride can be a prayer if you are listening closely enough.",
  "The sun does not explain itself. It simply touches everything.",
];

const soilAndSun = releases.find((release) => release.title === "Soil and Sun")!;

export function FeaturedSoilAndSun() {
  return (
    <section
      id="soil-and-sun"
      className="soil-section relative overflow-hidden py-16 md:py-24 lg:py-28"
      aria-labelledby="soil-heading"
    >
      <ChamberVisualLayer visualAssets={soilAndSun.visualAssets} variant="earth" />
      <div className="earth-haze" aria-hidden="true" />
      <div className="relative z-10 grid gap-9 md:gap-12 xl:grid-cols-[0.92fr_1.08fr]">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true, amount: 0.12 }}
        >
          <p className="section-kicker">Earth Memory Chamber</p>
          <h2 id="soil-heading" className="section-title soil-title">
            Soil and Sun
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-100 md:mt-8 md:text-xl md:leading-9">
            A warm archive of movement, prayer, soil, sunlight, and the sound of becoming human.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-5">
            <div className="memory-slab">
              <SunMedium size={26} aria-hidden="true" />
              <p>Sunlight caught on concrete, river edges, taxis, and old photo warmth.</p>
            </div>
            <div className="memory-slab">
              <Footprints size={26} aria-hidden="true" />
              <p>Walking as observation. Transit as ritual. The body as recording device.</p>
            </div>
          </div>

          <div className="mt-8 md:mt-12">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-archive-amber/75">Track Journey</p>
            <ol className="mt-5 grid gap-2 text-sm text-stone-300 sm:grid-cols-2">
              {trackJourney.map((track, index) => (
                <li className="track-row" key={track}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {track}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        <div className="space-y-8">
          <TransmissionPlayer
            title="Soil and Sun"
            year="2023"
            frequency="Earth / Prayer / Transit / Sun"
            condition="Warm, grounded, intact"
            appleUrl={soilAndSun.appleUrl}
            embedUrl={soilAndSun.embedUrl}
            variant="earth"
          />

          <div>
            <p className="mb-5 font-body text-xs uppercase tracking-[0.28em] text-archive-amber/75">Hidden Field Notes</p>
            <ul className="grid gap-4">
              {fieldNotes.map((note, index) => (
                <FieldNote key={note} index={index}>
                  {note}
                </FieldNote>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
