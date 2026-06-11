import { useEffect } from "react";
import type { ReleaseAmbience } from "../data/releases";
import { useAudioPlayer } from "./useAudioPlayer";

type UseChamberAmbienceOptions = {
  ambience?: ReleaseAmbience;
  enabled?: boolean;
};

export function useChamberAmbience({ ambience, enabled = true }: UseChamberAmbienceOptions) {
  const { isUnlocked, isMuted } = useAudioPlayer();

  useEffect(() => {
    if (!enabled || !isUnlocked || isMuted || !ambience?.src) return;

    // Future pass: fade chamber room tone in here once approved ambience files exist.
    // Keeping this as a no-op avoids fake audio and respects browser autoplay rules.
  }, [ambience?.src, enabled, isMuted, isUnlocked]);

  return {
    status: ambience?.src ? "ready" : "pending",
    label: ambience?.label ?? "Room tone pending",
  };
}
