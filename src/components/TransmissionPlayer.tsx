import { ExternalLink, Radio } from "lucide-react";
import { useState } from "react";
import { ArtifactFrame } from "./ArtifactFrame";

type TransmissionPlayerProps = {
  title: string;
  year: string;
  frequency: string;
  condition: string;
  appleUrl: string;
  embedUrl?: string;
  variant?: "earth" | "shadow" | "cosmic";
};

export function TransmissionPlayer({
  title,
  year,
  frequency,
  condition,
  appleUrl,
  embedUrl,
  variant = "cosmic",
}: TransmissionPlayerProps) {
  const [showEmbed, setShowEmbed] = useState(false);

  if (embedUrl) {
    return (
      <div className={`artifact-frame artifact-frame--${variant} artifact-frame--embed`}>
        <div className="artifact-frame__header">
          <div>
            <p className="font-body text-[0.68rem] uppercase tracking-[0.34em] text-archive-amber/70">
              Recovered Transmission
            </p>
            <h3 className="mt-2 font-display text-3xl text-stone-100 md:text-4xl">{`${title}, ${year}`}</h3>
          </div>
          <p className="artifact-frame__seal">External Portal</p>
        </div>

        <div className="artifact-embed-gate">
          <div>
            <p>Apple Music portal</p>
            <span>
              The native archive console is built for artist-owned audio. This external embed opens only when you choose
              to load it.
            </span>
          </div>
          <button type="button" onClick={() => setShowEmbed((value) => !value)} aria-expanded={showEmbed}>
            <Radio size={15} aria-hidden="true" />
            {showEmbed ? "Close Embed" : "Open Embed"}
          </button>
          <a href={appleUrl} target="_blank" rel="noreferrer">
            Open Apple Music <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>

        {showEmbed ? (
          <div className="artifact-embed-shell">
            <iframe
              className="artifact-iframe"
              title={`${title} Apple Music external listening embed`}
              src={embedUrl}
              allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : null}

        <dl className="mt-5 grid gap-3 text-sm text-stone-300 sm:grid-cols-2">
          <div className="border-l border-archive-amber/25 pl-3">
            <dt className="font-body text-[0.62rem] uppercase tracking-[0.24em] text-archive-amber/60">Frequency</dt>
            <dd className="mt-1 leading-relaxed text-stone-200">{frequency}</dd>
          </div>
          <div className="border-l border-archive-amber/25 pl-3">
            <dt className="font-body text-[0.62rem] uppercase tracking-[0.24em] text-archive-amber/60">Condition</dt>
            <dd className="mt-1 leading-relaxed text-stone-200">{condition}</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <ArtifactFrame
      label="Recovered Transmission"
      title={`${title}, ${year}`}
      metadata={[`Frequency: ${frequency}`, `Condition: ${condition}`, "Format: Listening artifact"]}
      appleUrl={appleUrl}
      variant={variant}
    />
  );
}
