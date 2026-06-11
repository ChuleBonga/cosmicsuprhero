import type { ReleaseAmbience } from "../../data/releases";
import { useChamberAmbience } from "../../hooks/useChamberAmbience";

type AmbienceLayerProps = {
  ambience?: ReleaseAmbience;
};

export function AmbienceLayer({ ambience }: AmbienceLayerProps) {
  const { status, label } = useChamberAmbience({ ambience });

  return (
    <p className="ambience-layer-status" aria-live="polite">
      <span>Room Tone</span>
      {status === "ready" ? label : "Ambience file pending"}
    </p>
  );
}
