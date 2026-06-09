import type { CSSProperties } from "react";
import type { ReleaseVisualAssets } from "../data/releases";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type ChamberVisualVariant = "cosmic" | "earth" | "shadow" | "night" | "aquarius" | "sound";

type ChamberVisualLayerProps = {
  visualAssets?: ReleaseVisualAssets;
  variant?: ChamberVisualVariant;
};

export function ChamberVisualLayer({ visualAssets, variant = "cosmic" }: ChamberVisualLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasVideo = Boolean(visualAssets?.backgroundVideoWebm || visualAssets?.backgroundVideoMp4);
  const primaryImage = visualAssets?.heroImage ?? visualAssets?.posterImage;
  const hasPoster = Boolean(primaryImage);
  const hasTexture = Boolean(visualAssets?.textureImage);
  const shouldRenderVideo = hasVideo && !prefersReducedMotion;
  const focusPosition = visualAssets?.focusPosition ?? "50% 50%";
  const mobileFocusPosition = visualAssets?.mobileFocusPosition ?? focusPosition;
  const focusStyle = {
    "--chamber-visual-focus": focusPosition,
    "--chamber-visual-mobile-focus": mobileFocusPosition,
  } as CSSProperties;

  return (
    <div className={`chamber-visual-layer chamber-visual-layer--${variant}`} style={focusStyle} aria-hidden="true">
      {shouldRenderVideo ? (
        <video
          className="chamber-visual-layer__video"
          muted
          loop
          playsInline
          autoPlay
          poster={primaryImage}
          preload="metadata"
        >
          {visualAssets?.backgroundVideoWebm ? <source src={visualAssets.backgroundVideoWebm} type="video/webm" /> : null}
          {visualAssets?.backgroundVideoMp4 ? <source src={visualAssets.backgroundVideoMp4} type="video/mp4" /> : null}
        </video>
      ) : null}

      {hasPoster ? (
        <img
          className={`chamber-visual-layer__poster${shouldRenderVideo ? " chamber-visual-layer__poster--reduced" : ""}`}
          src={primaryImage}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : null}

      {hasTexture ? (
        <img
          className="chamber-visual-layer__texture"
          src={visualAssets?.textureImage}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : null}

      <div className="chamber-visual-layer__css-fallback" />
      <div className="chamber-visual-layer__veil" />
    </div>
  );
}
