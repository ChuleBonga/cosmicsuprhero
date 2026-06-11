import { ExternalLink, Radio } from "lucide-react";
import { platformLinks, type Release } from "../../data/releases";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { PlayerControls } from "./PlayerControls";
import { TrackList } from "./TrackList";
import { WaveformSignal } from "./WaveformSignal";

type NativeTransmissionPlayerProps = {
  release: Release;
};

function toQueue(release: Release) {
  return (release.tracks ?? []).map((track) => ({
    ...track,
    releaseTitle: release.title,
    chamberSlug: release.slug,
    chamberRole: release.chamber,
  }));
}

export function TransmissionPlayer({ release }: NativeTransmissionPlayerProps) {
  const { activeTrack, playbackState, errorMessage, clearError, unlockAudio, isUnlocked } = useAudioPlayer();
  const queue = toQueue(release);
  const activeTitle = activeTrack?.releaseTitle === release.title ? activeTrack.title : "Awaiting transmission";
  const pending = !queue.some((track) => track.audioSrc);

  return (
    <section className="native-transmission-player" aria-labelledby="native-transmission-heading">
      <div className="native-transmission-player__header">
        <div>
          <p className="section-kicker">Listen in the Archive</p>
          <h2 id="native-transmission-heading">Native Transmission Player</h2>
          <span>{release.chamber}</span>
        </div>
        <div className="native-transmission-player__lamp" aria-hidden="true">
          <Radio size={28} />
        </div>
      </div>

      <div className="native-transmission-player__surface">
        <div className="native-transmission-player__status" role="status" aria-live="polite">
          <span>{playbackState === "pending" || pending ? "Audio file pending" : playbackState}</span>
          <strong>{activeTitle}</strong>
        </div>
        <WaveformSignal />
        <PlayerControls />
        {!isUnlocked ? (
          <button type="button" className="native-transmission-player__unlock" onClick={unlockAudio}>
            Enable the Signal
          </button>
        ) : null}
        {errorMessage ? (
          <div className="native-transmission-player__error" role="alert">
            <p>{errorMessage}</p>
            <button type="button" onClick={clearError}>
              Clear
            </button>
          </div>
        ) : null}
      </div>

      <TrackList tracks={queue} />

      <div className="native-transmission-player__exits" aria-label="External platform exits">
        <a href={release.appleUrl} target="_blank" rel="noreferrer">
          Open on Apple Music <ExternalLink size={14} aria-hidden="true" />
        </a>
        {release.spotifyUrl ? (
          <a href={release.spotifyUrl} target="_blank" rel="noreferrer">
            Open on Spotify <ExternalLink size={14} aria-hidden="true" />
          </a>
        ) : null}
        {release.externalLinks?.spotify ? (
          <a href={release.externalLinks.spotify} target="_blank" rel="noreferrer">
            Open on Spotify <ExternalLink size={14} aria-hidden="true" />
          </a>
        ) : null}
        <a href={platformLinks.youtubeHandle} target="_blank" rel="noreferrer">
          Open on YouTube <ExternalLink size={14} aria-hidden="true" />
        </a>
        <a href={platformLinks.linktree} target="_blank" rel="noreferrer">
          Platform Hub <ExternalLink size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
