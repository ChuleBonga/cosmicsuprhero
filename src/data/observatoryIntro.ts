export type ObservatoryIntroSource = {
  enabled: boolean;
  posterImage?: string;
  webm?: string;
  mp4?: string;
};

const productionIntro: ObservatoryIntroSource = {
  enabled: true,
  posterImage: "/assets/observatory/observatory-entry-hero.webp",
  // Add clean non-watermarked cinematic loops here when available.
  // webm: "/assets/observatory/observatory-intro.webm",
  // mp4: "/assets/observatory/observatory-intro.mp4",
};

const localTestIntro: ObservatoryIntroSource = {
  // Optional local-only test path. Keep watermarked test files ignored by git.
  enabled: import.meta.env.VITE_OBSERVATORY_INTRO_TEST === "true",
  posterImage: "/assets/observatory/local-test/observatory-intro-poster.webp",
  webm: "/assets/observatory/local-test/observatory-intro.webm",
  mp4: "/assets/observatory/local-test/observatory-intro.mp4",
};

export const observatoryIntroAssets = localTestIntro.enabled ? localTestIntro : productionIntro;
