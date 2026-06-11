import { useId } from "react";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";

type WaveformSignalProps = {
  compact?: boolean;
};

export function WaveformSignal({ compact = false }: WaveformSignalProps) {
  const { playbackState } = useAudioPlayer();
  const gradientId = useId();
  const isActive = playbackState === "playing" || playbackState === "loading";
  const points = compact
    ? "0,22 28,22 42,16 56,28 74,22 100,22 116,18 132,26 160,22 190,22"
    : "0,42 35,42 54,31 72,52 94,42 126,42 148,24 172,60 202,42 238,42 264,33 294,50 330,42 380,42";

  return (
    <div className={`waveform-signal${compact ? " waveform-signal--compact" : ""}`} aria-hidden="true">
      <svg viewBox={compact ? "0 0 190 44" : "0 0 380 84"} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(240,191,114,0.1)" />
            <stop offset="48%" stopColor="rgba(240,191,114,0.9)" />
            <stop offset="100%" stopColor="rgba(240,191,114,0.14)" />
          </linearGradient>
        </defs>
        <polyline className={isActive ? "is-active" : ""} points={points} fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
      </svg>
    </div>
  );
}
