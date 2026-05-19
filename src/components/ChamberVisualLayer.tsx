import { useEffect, useState } from "react";
import type { ReleaseVisualAssets } from "../data/releases";

export type ChamberVisualVariant = "cosmic" | "earth" | "shadow" | "night" | "aquarius" | "sound";

type ChamberVisualLayerProps = {
  visualAssets?: ReleaseVisualAssets;
  variant?: ChamberVisualVariant;
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

export function ChamberVisualLayer({ visualAssets, variant = "cosmic" }: ChamberVisualLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasVideo = Boolean(visualAssets?.backgroundVideoWebm || visualAssets?.backgroundVideoMp4);
  const hasPoster = Boolean(visualAssets?.posterImage);
  const hasTexture = Boolean(visualAssets?.textureImage);
  const shouldRenderVideo = hasVideo && !prefersReducedMotion;

  return (
    <div className={`chamber-visual-layer chamber-visual-layer--${variant}`} aria-hidden="true">
      {shouldRenderVideo ? (
        <video
          className="chamber-visual-layer__video"
          muted
          loop
          playsInline
          autoPlay
          poster={visualAssets?.posterImage}
          preload="metadata"
        >
          {visualAssets?.backgroundVideoWebm ? <source src={visualAssets.backgroundVideoWebm} type="video/webm" /> : null}
          {visualAssets?.backgroundVideoMp4 ? <source src={visualAssets.backgroundVideoMp4} type="video/mp4" /> : null}
        </video>
      ) : null}

      {hasPoster ? (
        <img
          className={`chamber-visual-layer__poster${shouldRenderVideo ? " chamber-visual-layer__poster--reduced" : ""}`}
          src={visualAssets?.posterImage}
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
