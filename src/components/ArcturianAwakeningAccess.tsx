import { ArrowUpRight, Compass, Headphones, MoveRight } from "lucide-react";
import "./ArcturianAwakeningAccess.css";

/**
 * Homepage entry to the existing isolated game bundle.
 * The game is intentionally not embedded or preloaded on the music homepage.
 * This panel is a production invitation to an explicitly unfinished preview.
 */
export function ArcturianAwakeningAccess() {
  return (
    <section
      id="arcturian-awakening"
      className="awakening-access section-shell"
      aria-labelledby="awakening-access-heading"
    >
      <div className="awakening-access__inner">
        <div className="awakening-access__world" aria-hidden="true">
          <div className="awakening-access__sun" />
          <div className="awakening-access__mountain awakening-access__mountain--far" />
          <div className="awakening-access__mountain awakening-access__mountain--near" />
          <img
            className="awakening-access__traveler"
            src="/play/art/aa_cover_figure.webp"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className="awakening-access__coordinate">01 / A RETURN</span>
        </div>
        <div className="awakening-access__content">
          <p className="section-kicker">A musical world / early access</p>
          <h2 id="awakening-access-heading">Arcturian Awakening</h2>
          <p className="awakening-access__statement">Not an escape. A return.</p>
          <p className="awakening-access__description">
            An early playable passage into the world behind the album. Follow the light,
            explore the landscape, and experience the beginnings of a journey built around
            movement, memory, and music.
          </p>
          <div className="awakening-access__actions">
            <a className="button-primary" href="/play/">
              <Compass size={18} aria-hidden="true" />
              Play the preview
              <MoveRight size={16} aria-hidden="true" />
            </a>
            <a className="button-secondary" href="/play/experiments/movement/lab.html">
              Explore movement study
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <p className="awakening-access__status">
            <span className="awakening-access__status-dot" aria-hidden="true" />
            Development preview. Visuals, animation and soundtrack integration remain unfinished.
            The published preview stays silent until the musical excerpts are approved.
          </p>
          <a
            className="awakening-access__presave"
            href="https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening?utm_source=site&utm_medium=preview&utm_campaign=arcturian-awakening"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Headphones size={15} aria-hidden="true" />
            Pre-save the album without playing
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
