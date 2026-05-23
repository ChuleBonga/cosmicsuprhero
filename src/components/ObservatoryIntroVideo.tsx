import { observatoryIntroAssets } from "../data/observatoryIntro";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function ObservatoryIntroVideo() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasVisualAsset = observatoryIntroAssets.enabled && Boolean(observatoryIntroAssets.posterImage);
  const shouldRenderVideo =
    hasVisualAsset && !prefersReducedMotion && Boolean(observatoryIntroAssets.webm || observatoryIntroAssets.mp4);

  if (!hasVisualAsset) {
    return null;
  }

  return (
    <div className="observatory-intro-video" aria-hidden="true">
      {shouldRenderVideo ? (
        <video
          className="observatory-intro-video__media"
          poster={observatoryIntroAssets.posterImage}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          {observatoryIntroAssets.webm ? <source src={observatoryIntroAssets.webm} type="video/webm" /> : null}
          {observatoryIntroAssets.mp4 ? <source src={observatoryIntroAssets.mp4} type="video/mp4" /> : null}
        </video>
      ) : (
        <img
          className="observatory-intro-video__media"
          src={observatoryIntroAssets.posterImage}
          alt=""
          decoding="async"
        />
      )}
      <div className="observatory-intro-video__veil" />
      <div className="observatory-intro-video__grain" />
    </div>
  );
}
