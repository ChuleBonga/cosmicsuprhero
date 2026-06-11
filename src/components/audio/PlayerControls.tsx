import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
}

export function PlayerControls() {
  const {
    activeTrack,
    playbackState,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayback,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleMute,
  } = useAudioPlayer();
  const isPlaying = playbackState === "playing";
  const canSeek = Boolean(activeTrack?.audioSrc && duration > 0);

  return (
    <div className="native-player-controls">
      <div className="native-player-controls__transport">
        <button type="button" onClick={() => void playPrevious()} aria-label="Previous track">
          <SkipBack size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="native-player-controls__primary"
          onClick={() => void togglePlayback()}
          aria-label={isPlaying ? "Pause transmission" : "Play transmission"}
        >
          {isPlaying ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
        </button>
        <button type="button" onClick={() => void playNext()} aria-label="Next track">
          <SkipForward size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="native-player-controls__timeline">
        <span>{formatTime(currentTime)}</span>
        <input
          aria-label="Transmission progress"
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={canSeek ? currentTime : 0}
          disabled={!canSeek}
          onChange={(event) => seek(Number(event.currentTarget.value))}
        />
        <span>{formatTime(duration)}</span>
      </div>

      <div className="native-player-controls__volume">
        <button type="button" onClick={toggleMute} aria-label={isMuted ? "Unmute archive player" : "Mute archive player"}>
          {isMuted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
        </button>
        <input
          aria-label="Archive player volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.currentTarget.value))}
        />
      </div>
    </div>
  );
}
