import { Radio } from "lucide-react";
import type { Release } from "../../data/releases";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { PlatformExits } from "./PlatformExits";
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
          <h2 id="native-transmission-heading">Transmission Console</h2>
          <span>{release.chamber}</span>
        </div>
        <div className="native-transmission-player__lamp" aria-hidden="true">
          <Radio size={28} />
        </div>
      </div>

      <div className="native-transmission-player__surface">
        <div className="native-transmission-player__status" role="status" aria-live="polite">
          <span>{playbackState === "pending" || pending ? "Archive audio pending" : playbackState}</span>
          <strong>{activeTitle}</strong>
        </div>
        <p className="native-transmission-player__note">
          Artist-owned audio will unlock native playback here. Until then, the console preserves the track sequence and
          keeps platform exits available without pretending an external embed is the archive.
        </p>
        <WaveformSignal />
        <PlayerControls />
        {!pending && !isUnlocked ? (
          <button type="button" className="native-transmission-player__unlock" onClick={unlockAudio}>
            Enable the Signal
          </button>
        ) : pending ? (
          <p className="native-transmission-player__pending-note">
            Audio unlock will activate when artist-owned files are installed for this chamber.
          </p>
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

      <PlatformExits release={release} />
    </section>
  );
}
