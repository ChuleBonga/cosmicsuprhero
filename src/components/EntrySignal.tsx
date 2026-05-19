import { motion } from "framer-motion";
import { ArrowDown, Headphones, RadioTower } from "lucide-react";
import { platformLinks } from "../data/releases";

const signalRows = ["SIGNAL DETECTED", "SOURCE: COSMICSUPRHERO", "STATUS: AWAKENING"];

export function EntrySignal() {
  return (
    <section
      id="entry-signal"
      className="section-shell relative flex min-h-[84svh] items-center overflow-hidden py-10 md:min-h-[90svh] md:py-14"
      aria-labelledby="entry-heading"
    >
      <div className="absolute inset-0 bg-radial-signal" aria-hidden="true" />
      <div className="ember-source" aria-hidden="true" />
      <div className="signal-orb" aria-hidden="true" />
      <div className="signal-constellation" aria-hidden="true" />
      <motion.div
        className="signal-ring left-[7%] top-[15%] h-32 w-32 md:h-56 md:w-56"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />
      <motion.div
        className="signal-ring bottom-[10%] right-[4%] h-48 w-48 opacity-40 md:h-80 md:w-80"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />

      <div className="relative z-10 grid w-full items-center gap-8 md:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        >
          <div className="mb-7 space-y-2 border-l border-archive-ember/40 pl-4 font-body text-[0.66rem] uppercase tracking-[0.3em] text-archive-amber/80 md:mb-10 md:text-[0.7rem] md:tracking-[0.34em]">
            {signalRows.map((row, index) => (
              <motion.p
                key={row}
                className="broken-signal"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.24 }}
              >
                {row}
              </motion.p>
            ))}
          </div>

          <h1 id="entry-heading" className="hero-title">
            COSMICSUPRHERO
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 md:mt-8 md:text-2xl md:leading-10">
            A living sonic observatory for memory, spirit, shadow, and transmission.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-10">
            <a className="button-primary" href="#observatory">
              <ArrowDown size={18} aria-hidden="true" />
              Enter the Observatory
            </a>
            <a className="button-secondary" href={platformLinks.appleMusic} target="_blank" rel="noreferrer">
              <Headphones size={18} aria-hidden="true" />
              Listen Now
            </a>
          </div>
        </motion.div>

        <motion.div
          className="signal-console"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.45 }}
          aria-hidden="true"
        >
          <div className="console-core">
            <RadioTower className="mx-auto text-archive-amber" size={44} />
            <div className="mt-8 space-y-3">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
