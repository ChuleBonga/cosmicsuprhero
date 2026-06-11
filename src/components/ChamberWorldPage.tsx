import { ArrowLeft, ArrowRight, ArrowUpRight, Disc3, Headphones } from "lucide-react";
import { useEffect } from "react";
import { AmbienceLayer } from "./audio/AmbienceLayer";
import { TransmissionPlayer as NativeTransmissionPlayer } from "./audio/TransmissionPlayer";
import { ChamberStage } from "./chambers/ChamberStage";
import { getAdjacentChambers, type ChamberWorld } from "../data/chamberWorlds";
import type { Release } from "../data/releases";
import { releases } from "../data/releases";
import { AssetCreditNote } from "./AssetCreditNote";

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
  const pageImage = release.visualAssets?.heroImage ?? release.visualAssets?.posterImage ?? "/assets/og/cosmicsuprhero-og.webp";

  useEffect(() => {
    const absoluteUrl = `${window.location.origin}${window.location.pathname}`;
    const absoluteImage = pageImage.startsWith("http") ? pageImage : `${window.location.origin}${pageImage}`;

    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", pageDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", pageTitle);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", pageDescription);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", absoluteUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute("content", absoluteImage);
    document.querySelector('meta[property="og:image:secure_url"]')?.setAttribute("content", absoluteImage);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", pageTitle);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", pageDescription);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", absoluteImage);
  }, [pageDescription, pageImage, pageTitle]);

  return (
    <main className={`chamber-world chamber-world--${world.variant}`} aria-labelledby="chamber-world-heading">
      <ChamberStage release={release} world={world} />

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
          <AmbienceLayer ambience={release.ambience} />
          <NativeTransmissionPlayer release={release} />
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

      {release.tracklist?.length ? (
        <section className="chamber-world__tracklist section-shell" aria-labelledby="chamber-tracklist-heading">
          <div>
            <p className="section-kicker">Track Journey</p>
            <h2 id="chamber-tracklist-heading">Sequence of the Room</h2>
            <p>
              Tap a title when artist-owned audio files are added. For now, the sequence acts as the room map.
            </p>
          </div>
          <ol>
            {release.tracklist.map((track, index) => (
              <li key={`${track}-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>
                  {track}
                  {release.tracks?.[index]?.visualCue ? <small>{release.tracks[index].visualCue}</small> : null}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="chamber-world__archive section-shell" aria-label={`${release.title} recovered archive`}>
        <details className="chamber-world__archive-note">
          <summary>
            <span>Recovered Room Logic</span>
            <strong>{world.thresholdLabel}</strong>
          </summary>
          <div>
            <p>{release.longArchiveNote ?? world.spatialPremise}</p>
            <ul>
              {world.emotionalPhysics.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </details>

        <details className="chamber-world__archive-note">
          <summary>
            <span>Hidden Field Notes</span>
            <strong>{release.title}</strong>
          </summary>
          <div className="chamber-world__field-notes">
            {world.fieldNotes.map((note, index) => (
              <article key={note}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </details>
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
