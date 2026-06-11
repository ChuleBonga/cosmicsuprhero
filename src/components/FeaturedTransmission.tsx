import { ArrowUpRight, DoorOpen, Headphones, Radio } from "lucide-react";
import { releases, platformLinks } from "../data/releases";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { WaveformSignal } from "./audio/WaveformSignal";

const featuredRelease = releases.find((release) => release.slug === "soil-and-sun") ?? releases[0];
const featuredTrack = featuredRelease.tracks?.find((track) => track.title === "I Am an African") ?? featuredRelease.tracks?.[0];

export function FeaturedTransmission() {
  const { activeTrack, playbackState, unlockAudio } = useAudioPlayer();
  const isActive = activeTrack?.chamberSlug === featuredRelease.slug;
  const pending = !featuredTrack?.audioSrc;
  const status = pending ? "Archive audio pending" : isActive ? playbackState : "Ready when selected";

  return (
    <aside className="featured-transmission" aria-labelledby="featured-transmission-heading">
      <div className="featured-transmission__header">
        <div>
          <p className="section-kicker">Featured Transmission</p>
          <h2 id="featured-transmission-heading">{featuredRelease.title}</h2>
          <span>{featuredTrack?.title ?? featuredRelease.chamber}</span>
        </div>
        <div className="featured-transmission__lamp" aria-hidden="true">
          <Radio size={24} />
        </div>
      </div>

      <div className="featured-transmission__surface">
        <div className="featured-transmission__status" role="status" aria-live="polite">
          <span>{status}</span>
          <strong>{featuredRelease.signalPhrase ?? featuredRelease.description}</strong>
        </div>
        <WaveformSignal />
      </div>

      <div className="featured-transmission__actions" aria-label="Featured transmission actions">
        <a href={`/chambers/${featuredRelease.slug}`} onClick={unlockAudio}>
          <DoorOpen size={15} aria-hidden="true" />
          Enter Chamber
        </a>
        <a href={featuredRelease.appleUrl} target="_blank" rel="noreferrer">
          <Headphones size={15} aria-hidden="true" />
          Open on Apple Music
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
        <a href={platformLinks.spotify} target="_blank" rel="noreferrer">
          Open on Spotify
          <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
