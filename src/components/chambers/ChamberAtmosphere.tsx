import type { ChamberVisualVariant } from "../ChamberVisualLayer";
import { ChamberGlyphField } from "./ChamberGlyphField";
import { ChamberSignalLine } from "./ChamberSignalLine";

type ChamberAtmosphereProps = {
  variant: ChamberVisualVariant;
  active?: boolean;
};

export function ChamberAtmosphere({ variant, active = false }: ChamberAtmosphereProps) {
  return (
    <div className={`chamber-atmosphere chamber-atmosphere--${variant}${active ? " is-active" : ""}`} aria-hidden="true">
      <div className="chamber-atmosphere__haze" />
      <div className="chamber-atmosphere__object" />
      <ChamberGlyphField variant={variant} />
      <ChamberSignalLine variant={variant} active={active} />
    </div>
  );
}
