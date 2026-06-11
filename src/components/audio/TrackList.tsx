import { Play, Radio } from "lucide-react";
import type { AudioQueueItem } from "../../context/AudioPlayerContext";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

type TrackListProps = {
  tracks: AudioQueueItem[];
};

export function TrackList({ tracks }: TrackListProps) {
  const { activeTrack, playbackState, playTrack } = useAudioPlayer();

  if (!tracks.length) {
    return (
      <div className="native-tracklist native-tracklist--empty">
        <Radio size={20} aria-hidden="true" />
        <p>Native audio files are pending for this chamber. Platform exits remain open below.</p>
      </div>
    );
  }

  return (
    <ol className="native-tracklist" aria-label="Native transmission tracklist">
      {tracks.map((track) => {
        const isActive = activeTrack?.id === track.id;
        const isPlaying = isActive && playbackState === "playing";
        return (
          <li key={track.id} className={isActive ? "is-active" : undefined}>
            <button type="button" onClick={() => void playTrack(track, tracks)} aria-label={`Select ${track.title}`}>
              <span>{String(track.trackNumber).padStart(2, "0")}</span>
              <strong>{track.title}</strong>
              <small>{track.duration || (track.audioSrc ? "Duration pending" : "Audio file pending")}</small>
              <Play size={15} aria-hidden="true" />
            </button>
            {isActive && track.notes ? <p>{isPlaying ? "Transmission active" : track.notes}</p> : null}
          </li>
        );
      })}
    </ol>
  );
}
