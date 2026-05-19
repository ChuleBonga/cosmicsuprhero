import { motion } from "framer-motion";
import { ArrowUpRight, DoorOpen, Headphones, Orbit } from "lucide-react";
import type { Release } from "../data/releases";

type ChamberCardProps = {
  release: Release;
};

const chamberAccent: Record<string, string> = {
  "Celestial Multiverse": "from-archive-violet/35 via-archive-amber/15 to-transparent",
  "Stargazing, Vol. 3": "from-blue-500/25 via-archive-violet/20 to-transparent",
  "Just Sounds Really": "from-stone-300/12 via-archive-bronze/10 to-transparent",
  "Enter Aquarius": "from-cyan-400/20 via-archive-violet/35 to-archive-amber/10",
  "Soil and Sun": "from-archive-ember/40 via-archive-dust/25 to-transparent",
  "Songs I Made At Night": "from-indigo-500/22 via-blue-950/40 to-transparent",
  "Bad Guys Finish Last": "from-archive-blood/45 via-archive-ember/12 to-transparent",
};

const chamberClass: Record<string, string> = {
  "Celestial Multiverse": "chamber-card--celestial",
  "Stargazing, Vol. 3": "chamber-card--stargazing",
  "Just Sounds Really": "chamber-card--sound-object",
  "Enter Aquarius": "chamber-card--aquarius",
  "Soil and Sun": "chamber-card--soil",
  "Songs I Made At Night": "chamber-card--night",
  "Bad Guys Finish Last": "chamber-card--shadow",
};

function chamberTarget(release: Release) {
  if (release.title === "Soil and Sun") return "#soil-and-sun";
  if (release.title === "Bad Guys Finish Last") return "#bad-guys-finish-last";
  return release.appleUrl;
}

export function ChamberCard({ release }: ChamberCardProps) {
  const target = chamberTarget(release);
  const isInternal = target.startsWith("#");

  return (
    <motion.article
      className={`chamber-card ${chamberClass[release.title]} group`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.16 }}
    >
      <div className={`chamber-card__aura bg-gradient-to-br ${chamberAccent[release.title]}`} aria-hidden="true" />
      <div className="chamber-card__orbit" aria-hidden="true">
        <Orbit size={54} />
      </div>
      <div className="relative z-10 flex min-h-[270px] flex-col justify-between sm:min-h-[320px] lg:min-h-[360px]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="font-body text-[0.66rem] uppercase tracking-[0.28em] text-archive-amber/70">{release.status}</p>
            <span className="rounded-full border border-archive-amber/20 px-3 py-1 font-body text-[0.68rem] uppercase tracking-[0.24em] text-stone-300">
              {release.year}
            </span>
          </div>
          <h3 className="mt-7 font-display text-3xl leading-[0.95] text-stone-100 md:mt-9 md:text-5xl">{release.title}</h3>
          <p className="mt-4 font-body text-xs uppercase tracking-[0.22em] text-archive-amber">{release.chamber}</p>
          <p className="mt-4 max-w-[28rem] text-sm leading-7 text-stone-300 md:mt-5">{release.mood}</p>
        </div>

        <div>
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-archive-amber/35 to-transparent md:my-7" />
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-stone-500 md:mb-5">{release.motion}</p>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-archive-amber px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-archive-amber focus:ring-offset-2 focus:ring-offset-archive-void"
              href={target}
              target={isInternal ? undefined : "_blank"}
              rel={isInternal ? undefined : "noreferrer"}
            >
              <DoorOpen size={15} aria-hidden="true" />
              Enter Chamber
            </a>
            <a
              className="inline-flex items-center gap-2 rounded-full border border-archive-amber/30 px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.15em] text-archive-amber transition hover:border-archive-amber hover:bg-archive-amber/10 focus:outline-none focus:ring-2 focus:ring-archive-amber focus:ring-offset-2 focus:ring-offset-archive-void"
              href={release.appleUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Headphones size={15} aria-hidden="true" />
              Listen
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
