import { motion } from "framer-motion";
import { ArrowUpRight, DoorOpen, Headphones, Orbit } from "lucide-react";
import type { CSSProperties } from "react";
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

function chamberId(release: Release) {
  if (release.slug) return `chamber-${release.slug}`;

  return `chamber-${release.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

function chamberTarget(release: Release) {
  return `/chambers/${release.slug}`;
}

export function ChamberCard({ release }: ChamberCardProps) {
  const target = chamberTarget(release);
  const { visualAssets } = release;
  const cardImage = visualAssets?.heroImage ?? visualAssets?.posterImage;
  const imageFocus = visualAssets?.focusPosition ?? "50% 50%";
  const mobileImageFocus = visualAssets?.mobileFocusPosition ?? imageFocus;
  const readiness = visualAssets?.readiness ?? "candidate";
  const focusStyle = {
    "--chamber-image-focus": imageFocus,
    "--chamber-image-mobile-focus": mobileImageFocus,
  } as CSSProperties;

  return (
    <motion.article
      id={chamberId(release)}
      className={`chamber-card ${chamberClass[release.title]} group`}
      data-chamber-card="true"
      data-release-title={release.title}
      data-release-slug={release.slug}
      data-asset-readiness={readiness}
      style={focusStyle}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.16 }}
    >
      <div className={`chamber-card__aura bg-gradient-to-br ${chamberAccent[release.title]}`} aria-hidden="true" />
      {cardImage ? (
        <img
          className="chamber-card__image pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-[0.14] mix-blend-screen brightness-[0.46] contrast-125 saturate-[0.72] transition-opacity duration-500 group-hover:opacity-[0.2]"
          src={cardImage}
          alt=""
          width={900}
          height={760}
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      {visualAssets?.textureImage ? (
        <img
          className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover opacity-[0.08] mix-blend-overlay contrast-125 grayscale"
          src={visualAssets.textureImage}
          alt=""
          width={900}
          height={760}
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      ) : null}
      <div className="chamber-card__orbit" aria-hidden="true">
        <Orbit size={54} />
      </div>
      <div className="relative z-10 flex min-h-[235px] flex-col justify-between sm:min-h-[300px] lg:min-h-[350px]">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="font-body text-[0.66rem] uppercase tracking-[0.28em] text-archive-amber/70">{release.status}</p>
            <span className="rounded-full border border-archive-amber/20 px-3 py-1 font-body text-[0.68rem] uppercase tracking-[0.24em] text-stone-300">
              {release.year}
            </span>
          </div>
          <h3 className="mt-5 font-display text-[2rem] leading-[0.95] text-stone-100 md:mt-8 md:text-5xl">{release.title}</h3>
          <p className="mt-3 font-body text-xs uppercase tracking-[0.22em] text-archive-amber md:mt-4">{release.chamber}</p>
          <p className="mt-3 max-w-[28rem] text-sm leading-6 text-stone-300 md:mt-5 md:leading-7">
            {release.signalPhrase ?? release.mood}
          </p>
        </div>

        <div>
          <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-archive-amber/35 to-transparent md:my-7" />
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500 md:mb-5">{release.motion}</p>
          <div className="chamber-card__actions flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-archive-amber px-4 py-2.5 font-body text-xs font-semibold uppercase tracking-[0.15em] text-black transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-archive-amber focus:ring-offset-2 focus:ring-offset-archive-void"
              href={target}
              aria-label={`Enter the ${release.title} chamber`}
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
              Open on Apple Music
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
