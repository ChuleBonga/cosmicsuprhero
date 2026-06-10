import { Composition } from "remotion";
import { releases } from "../data/releases";
import { ChamberLoop, type ChamberLoopProps } from "./scenes/ChamberLoop";
import { ObservatoryIntro } from "./scenes/ObservatoryIntro";

const fps = 30;
const width = 1920;
const height = 1080;
const loopDurationSeconds = 12;
const durationInFrames = fps * loopDurationSeconds;

function assetPath(path?: string) {
  return path?.replace(/^\//, "");
}

function chamberPropsForRelease(release: (typeof releases)[number]): ChamberLoopProps {
  return {
    title: release.title,
    chamber: release.chamber,
    mood: release.mood,
    motion: release.motion,
    year: release.year,
    variant:
      release.slug === "soil-and-sun"
        ? "earth"
        : release.slug === "bad-guys-finish-last"
          ? "shadow"
          : release.slug === "songs-i-made-at-night" || release.slug === "stargazing-vol-3"
            ? "night"
            : release.slug === "enter-aquarius"
              ? "aquarius"
              : release.slug === "just-sounds-really"
                ? "sound"
                : "cosmic",
    heroImage: assetPath(release.visualAssets?.heroImage ?? release.visualAssets?.posterImage),
    textureImage: assetPath(release.visualAssets?.textureImage),
  };
}

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="observatory-intro"
        component={ObservatoryIntro}
        durationInFrames={durationInFrames}
        fps={fps}
        width={width}
        height={height}
      />

      {releases.map((release) => (
        <Composition
          key={release.slug}
          id={`chamber-${release.slug}`}
          component={ChamberLoop}
          durationInFrames={durationInFrames}
          fps={fps}
          width={width}
          height={height}
          defaultProps={chamberPropsForRelease(release)}
        />
      ))}
    </>
  );
}
