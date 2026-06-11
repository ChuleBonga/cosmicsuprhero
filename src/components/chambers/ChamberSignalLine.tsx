import type { ChamberVisualVariant } from "../ChamberVisualLayer";

type ChamberSignalLineProps = {
  variant: ChamberVisualVariant;
  active?: boolean;
};

export function ChamberSignalLine({ variant, active = false }: ChamberSignalLineProps) {
  return (
    <div className={`chamber-signal-line chamber-signal-line--${variant}${active ? " is-active" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}
