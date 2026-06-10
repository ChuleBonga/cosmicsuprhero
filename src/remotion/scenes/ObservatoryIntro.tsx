import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GrainField, RenderLabel, ScanLines, SignalRings } from "./shared";

export function ObservatoryIntro() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / Math.max(1, durationInFrames - 1);
  const imageScale = interpolate(progress, [0, 1], [1.05, 1.13]);
  const driftY = interpolate(progress, [0, 1], [0, -34]);
  const ember = interpolate(Math.sin(progress * Math.PI * 2), [-1, 1], [0.42, 0.72]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#040405", overflow: "hidden" }}>
      <Img
        src={staticFile("assets/observatory/observatory-entry-worldplate.webp")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${imageScale}) translate3d(0, ${driftY}px, 0)`,
          filter: "saturate(0.92) contrast(1.08) brightness(0.72)",
        }}
      />

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 52% 34%, rgba(240,191,114,0.14), transparent 24%), linear-gradient(90deg, rgba(4,4,5,0.92), rgba(4,4,5,0.42) 42%, rgba(4,4,5,0.9)), linear-gradient(180deg, rgba(4,4,5,0.08), rgba(4,4,5,0.9))",
        }}
      />

      <SignalRings variant="earth" />
      <GrainField opacity={0.2} />
      <ScanLines opacity={0.16} />
      <RenderLabel label="Signal acquiring / Archive warming / Transmission open" variant="earth" />

      <div
        style={{
          position: "absolute",
          left: 78,
          bottom: 108,
          maxWidth: 1050,
          color: "#f4ead9",
        }}
      >
        <div
          style={{
            fontFamily: "Inter, Segoe UI, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.34em",
            color: "rgba(240,191,114,0.78)",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          Sacred sonic observatory
        </div>
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 142,
            fontWeight: 700,
            fontStyle: "italic",
            lineHeight: 0.84,
            letterSpacing: "-0.045em",
            textShadow: `0 0 ${90 * ember}px rgba(240,191,114,0.22)`,
          }}
        >
          Cosmicsuprhero
        </div>
        <div
          style={{
            marginTop: 30,
            width: 560,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(240,191,114,0.8), rgba(240,191,114,0.1), transparent)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
