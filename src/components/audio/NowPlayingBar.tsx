import { Pause, Play } from "lucide-react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { PlayerControls } from "./PlayerControls";
import { WaveformSignal } from "./WaveformSignal";

export function NowPlayingBar() {
  const { activeTrack, playbackState, togglePlayback } = useAudioPlayer();

  if (!activeTrack) return null;

  const isPlaying = playbackState === "playing";

  return (
    <aside className="now-playing-bar" aria-label="Current archive transmission">
      <div>
        <p>{activeTrack.releaseTitle}</p>
        <strong>{activeTrack.title}</strong>
      </div>
      <WaveformSignal compact />
      <button type="button" onClick={() => void togglePlayback()} aria-label={isPlaying ? "Pause transmission" : "Play transmission"}>
        {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
      </button>
      <div className="now-playing-bar__expanded">
        <PlayerControls />
      </div>
    </aside>
  );
}
