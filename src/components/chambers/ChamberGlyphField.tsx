import type { ChamberVisualVariant } from "../ChamberVisualLayer";

type ChamberGlyphFieldProps = {
  variant: ChamberVisualVariant;
};

export function ChamberGlyphField({ variant }: ChamberGlyphFieldProps) {
  return (
    <div className={`chamber-glyph-field chamber-glyph-field--${variant}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
