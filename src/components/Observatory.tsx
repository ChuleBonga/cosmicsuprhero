import { motion } from "framer-motion";
import { Archive, Compass, Radio, Telescope } from "lucide-react";
import { ManifestoFragments } from "./ManifestoFragments";

const archiveObjects = [
  {
    icon: Archive,
    label: "Memory Index",
    text: "Frequencies, migrations, philosophies, and reflections preserved as living matter.",
  },
  {
    icon: Telescope,
    label: "Recovered Rooms",
    text: "Each release behaves like a chamber with its own emotional gravity.",
  },
  {
    icon: Radio,
    label: "Transmission Console",
    text: "Listening links become artifacts inside the archive, never the whole world.",
  },
  {
    icon: Compass,
    label: "Return Coordinates",
    text: "Earth, shadow, cosmos, and spirit move through the same observatory field.",
  },
];

export function Observatory() {
  return (
    <section id="observatory" className="section-shell relative overflow-hidden py-16 md:py-24 lg:py-28" aria-labelledby="observatory-heading">
      <div className="star-map" aria-hidden="true" />
      <div className="relative z-10 grid items-start gap-9 md:gap-12 lg:grid-cols-[0.78fr_1.22fr]">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <p className="section-kicker">Central Receiver</p>
          <h2 id="observatory-heading" className="section-title">
            The Observatory
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-stone-300 md:mt-8 md:text-lg md:leading-9">
            The Observatory is where frequencies, memories, philosophies, migrations, reflections, and emotional
            transmissions are received and preserved.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            className="observatory-room"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="observatory-room__receiver" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="observatory-room__copy">
              <p>Receiver Room / Active</p>
              <h3>Archive listening field</h3>
              <span>
                Earth memory, night migration, shadow consequence, threshold weather, and cosmological scale are held
                inside one quiet instrument.
              </span>
            </div>
            <div className="observatory-room__coordinates" aria-hidden="true">
              <span>PE / 33.96S</span>
              <span>IL / transit</span>
              <span>ARCTURUS / myth</span>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {archiveObjects.map((object, index) => {
              const Icon = object.icon;
              return (
                <motion.article
                  className="archive-object"
                  key={object.label}
                  initial={{ opacity: 0, y: 36, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -0.4 : 0.4 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.15 }}
                >
                  <Icon className="text-archive-amber" size={25} aria-hidden="true" />
                  <p className="mt-8 font-body text-[0.68rem] uppercase tracking-[0.28em] text-archive-amber/70">
                    {object.label}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{object.text}</p>
                </motion.article>
              );
            })}
          </div>
          <ManifestoFragments />
        </div>
      </div>
    </section>
  );
}
