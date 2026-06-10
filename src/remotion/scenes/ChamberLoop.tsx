import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GrainField, RenderLabel, ScanLines, SignalRings, type RemotionVariant, variantPalettes } from "./shared";

export type ChamberLoopProps = {
  title: string;
  chamber: string;
  mood: string;
  motion: string;
  year: string;
  variant: RemotionVariant;
  heroImage?: string;
  textureImage?: string;
};

export function ChamberLoop({ title, chamber, mood, motion, year, variant, heroImage, textureImage }: ChamberLoopProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const palette = variantPalettes[variant];
  const progress = frame / Math.max(1, durationInFrames - 1);
  const imageScale = interpolate(progress, [0, 1], [1.04, 1.12]);
  const driftX = interpolate(progress, [0, 1], [-24, 24]);
  const titleGlow = interpolate(Math.sin(progress * Math.PI * 2), [-1, 1], [0.12, 0.28]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#040405", overflow: "hidden" }}>
      {heroImage ? (
        <Img
          src={staticFile(heroImage)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${imageScale}) translate3d(${driftX}px, 0, 0)`,
            filter: "saturate(0.86) contrast(1.12) brightness(0.6)",
          }}
        />
      ) : null}

      {textureImage ? (
        <Img
          src={staticFile(textureImage)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.2,
            mixBlendMode: "overlay",
            filter: "contrast(1.18) grayscale(0.3)",
          }}
        />
      ) : null}

      <AbsoluteFill
        style={{
          background:
            `radial-gradient(circle at 74% 34%, ${palette.secondary}, transparent 26%), radial-gradient(circle at 24% 18%, ${palette.primary}, transparent 18%), linear-gradient(90deg, rgba(4,4,5,0.9), ${palette.veil} 46%, rgba(4,4,5,0.86)), linear-gradient(180deg, rgba(4,4,5,0.05), rgba(4,4,5,0.92))`,
        }}
      />

      <SignalRings variant={variant} />
      <GrainField opacity={0.24} />
      <ScanLines opacity={variant === "sound" ? 0.28 : 0.16} />
      <RenderLabel label={`${palette.label} / ${year}`} variant={variant} />

      <div
        style={{
          position: "absolute",
          left: 74,
          bottom: 86,
          width: 1120,
          color: "#f4ead9",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, Segoe UI, sans-serif",
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.34em",
            color: palette.primary,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          {chamber}
        </div>
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: title.length > 20 ? 112 : 142,
            fontWeight: 700,
            lineHeight: 0.84,
            letterSpacing: "-0.04em",
            maxWidth: 1060,
            textShadow: `0 0 84px rgba(240,191,114,${titleGlow})`,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.74fr) minmax(0, 0.52fr)",
            gap: 44,
            marginTop: 34,
            maxWidth: 1040,
            color: "rgba(244,234,217,0.78)",
            fontFamily: "Inter, Segoe UI, sans-serif",
            fontSize: 23,
            lineHeight: 1.5,
          }}
        >
          <p style={{ margin: 0 }}>{mood}</p>
          <p style={{ margin: 0, color: "rgba(240,191,114,0.7)" }}>{motion}</p>
        </div>
      </div>
    </AbsoluteFill>
  );
}
