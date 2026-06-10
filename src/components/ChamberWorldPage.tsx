import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Disc3, Headphones, Home, Radio } from "lucide-react";
import { useEffect } from "react";
import { getAdjacentChambers, type ChamberWorld } from "../data/chamberWorlds";
import type { Release } from "../data/releases";
import { releases } from "../data/releases";
import { AssetCreditNote } from "./AssetCreditNote";
import { ChamberVisualLayer } from "./ChamberVisualLayer";
import { TransmissionPlayer } from "./TransmissionPlayer";

type ChamberWorldPageProps = {
  release: Release;
  world: ChamberWorld;
};

function chamberHref(slug: string) {
  return `/chambers/${slug}`;
}

export function ChamberWorldPage({ release, world }: ChamberWorldPageProps) {
  const { previous, next } = getAdjacentChambers(release);
  const pageTitle = `${release.title} | Cosmicsuprhero Chamber`;
  const pageDescription = `${world.subtitle}: ${world.invocation}`;

  useEffect(() => {
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", pageDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", pageDescription);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", pageTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", pageDescription);
  }, [pageDescription, pageTitle]);

  return (
    <main className={`chamber-world chamber-world--${world.variant}`} aria-labelledby="chamber-world-heading">
      <ChamberVisualLayer visualAssets={release.visualAssets} variant={world.variant} />

      <section className="chamber-world__hero section-shell">
        <motion.div
          className="chamber-world__intro"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <nav className="chamber-world__crumbs" aria-label="Chamber navigation">
            <a href="/">
              <Home size={15} aria-hidden="true" />
              Observatory
            </a>
            <span aria-hidden="true">/</span>
            <span>{release.chamber}</span>
          </nav>

          <p className="section-kicker">{world.subtitle}</p>
          <h1 id="chamber-world-heading" className="chamber-world__title">
            {world.worldTitle}
          </h1>
          <p className="chamber-world__invocation">{world.invocation}</p>

          <div className="chamber-world__actions">
            <a className="button-primary" href="#chamber-transmission">
              <Radio size={18} aria-hidden="true" />
              Begin Chamber Transmission
            </a>
            <a className="button-secondary" href="/#frequency-chambers">
              <ArrowLeft size={18} aria-hidden="true" />
              Return to Index
            </a>
          </div>
        </motion.div>

        <motion.aside
          className="chamber-world__artifact"
          initial={{ opacity: 0, rotate: -1.25, y: 24 }}
          animate={{ opacity: 1, rotate: -0.35, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          aria-label={`${release.title} artifact metadata`}
        >
          <p>Recovered Chamber</p>
          <dl>
            <div>
              <dt>Year</dt>
              <dd>{release.year}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{release.type}</dd>
            </div>
            <div>
              <dt>Frequency</dt>
              <dd>{release.chamber}</dd>
            </div>
            <div>
              <dt>Motion</dt>
              <dd>{release.motion}</dd>
            </div>
          </dl>
        </motion.aside>
      </section>

      <nav className="chamber-world__index section-shell" aria-label="Seven chamber signal index">
        {releases.map((item, index) => (
          <a
            key={item.slug}
            href={chamberHref(item.slug)}
            aria-current={item.slug === release.slug ? "page" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item.title}
          </a>
        ))}
      </nav>

      <section className="chamber-world__body section-shell" aria-label={`${release.title} chamber world`}>
        <div className="chamber-world__spatial">
          <p className="section-kicker">{world.thresholdLabel}</p>
          <h2>Emotional Physics</h2>
          <p>{world.spatialPremise}</p>
          <ul>
            {world.emotionalPhysics.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="chamber-world__notes">
          <p className="section-kicker">Field Notes</p>
          <div>
            {world.fieldNotes.map((note, index) => (
              <article key={note}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="chamber-transmission" className="chamber-world__transmission section-shell">
        <div className="chamber-world__object-list">
          <p className="section-kicker">Room Objects</p>
          <h2>Artifacts Inside the Chamber</h2>
          <div>
            {world.artifactNotes.map((artifact) => (
              <span key={artifact}>{artifact}</span>
            ))}
          </div>
        </div>

        <div className="chamber-world__player">
          <TransmissionPlayer
            title={release.title}
            year={release.year}
            frequency={release.chamber}
            condition={release.status}
            appleUrl={release.appleUrl}
            embedUrl={release.embedUrl}
            variant={world.variant === "shadow" ? "shadow" : world.variant === "earth" ? "earth" : "cosmic"}
          />
          <AssetCreditNote
            credit={release.visualAssets?.credit}
            license={release.visualAssets?.license}
            sourceUrl={release.visualAssets?.sourceUrl}
          />
          <a className="chamber-world__listen-link" href={release.appleUrl} target="_blank" rel="noreferrer">
            <Headphones size={16} aria-hidden="true" />
            Listen on Apple Music
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="chamber-world__footer section-shell" aria-label="Adjacent chambers">
        <a href={chamberHref(previous.slug)}>
          <ArrowLeft size={17} aria-hidden="true" />
          <span>
            Previous Chamber
            <strong>{previous.title}</strong>
          </span>
        </a>
        <div>
          <p>{world.returnSignal}</p>
          <a href={release.appleUrl} target="_blank" rel="noreferrer">
            <Disc3 size={16} aria-hidden="true" />
            Open Platform Transmission
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <a href={chamberHref(next.slug)}>
          <span>
            Next Chamber
            <strong>{next.title}</strong>
          </span>
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
