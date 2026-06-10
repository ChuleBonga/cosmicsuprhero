import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export type RemotionVariant = "cosmic" | "earth" | "shadow" | "night" | "aquarius" | "sound";

export const variantPalettes: Record<
  RemotionVariant,
  {
    primary: string;
    secondary: string;
    veil: string;
    label: string;
  }
> = {
  cosmic: {
    primary: "rgba(240, 191, 114, 0.62)",
    secondary: "rgba(124, 111, 213, 0.34)",
    veil: "rgba(3, 4, 8, 0.62)",
    label: "Archive Scale",
  },
  earth: {
    primary: "rgba(240, 169, 86, 0.7)",
    secondary: "rgba(145, 90, 42, 0.32)",
    veil: "rgba(16, 9, 4, 0.58)",
    label: "Earth Memory",
  },
  shadow: {
    primary: "rgba(210, 70, 52, 0.58)",
    secondary: "rgba(91, 9, 15, 0.44)",
    veil: "rgba(8, 2, 4, 0.68)",
    label: "Shadow Pressure",
  },
  night: {
    primary: "rgba(139, 164, 255, 0.54)",
    secondary: "rgba(24, 34, 83, 0.42)",
    veil: "rgba(2, 6, 18, 0.64)",
    label: "Night Drift",
  },
  aquarius: {
    primary: "rgba(132, 137, 255, 0.6)",
    secondary: "rgba(40, 187, 199, 0.32)",
    veil: "rgba(7, 7, 24, 0.62)",
    label: "Threshold Weather",
  },
  sound: {
    primary: "rgba(234, 224, 208, 0.42)",
    secondary: "rgba(80, 78, 72, 0.28)",
    veil: "rgba(5, 5, 5, 0.68)",
    label: "Sound Object",
  },
};

export function GrainField({ opacity = 0.22 }: { opacity?: number }) {
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.34) 0 1px, transparent 1.8px), radial-gradient(circle at 76% 66%, rgba(240,191,114,0.26) 0 1px, transparent 1.8px)",
        backgroundSize: "34px 34px, 53px 53px",
        mixBlendMode: "screen",
      }}
    />
  );
}

export function ScanLines({ opacity = 0.2 }: { opacity?: number }) {
  return (
    <AbsoluteFill
      style={{
        opacity,
        background:
          "repeating-linear-gradient(0deg, transparent 0 9px, rgba(244,234,217,0.07) 10px 11px), repeating-linear-gradient(90deg, transparent 0 58px, rgba(240,191,114,0.05) 59px 60px)",
        mixBlendMode: "overlay",
      }}
    />
  );
}

export function SignalRings({ variant = "cosmic" }: { variant?: RemotionVariant }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const palette = variantPalettes[variant];
  const rotation = interpolate(frame, [0, durationInFrames], [-8, 16]);
  const pulse = interpolate(Math.sin((frame / durationInFrames) * Math.PI * 2), [-1, 1], [0.76, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "grid",
        placeItems: "center",
        transform: `translateX(490px) translateY(-12px) rotate(${rotation}deg) scale(${pulse})`,
        opacity: 0.54,
      }}
    >
      <div
        style={{
          width: 560,
          height: 560,
          borderRadius: "50%",
          border: `1px solid ${palette.primary}`,
          boxShadow: `0 0 90px ${palette.secondary}, inset 0 0 80px rgba(240,191,114,0.08)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: `1px solid ${palette.secondary}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.primary}, rgba(0,0,0,0) 68%)`,
          filter: "blur(4px)",
          opacity: 0.34,
        }}
      />
    </AbsoluteFill>
  );
}

export function RenderLabel({ label, variant }: { label: string; variant: RemotionVariant }) {
  const palette = variantPalettes[variant];

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 58,
        display: "flex",
        gap: 18,
        alignItems: "center",
        color: palette.primary,
        fontFamily: "Inter, Segoe UI, sans-serif",
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 42, height: 1, background: palette.primary }} />
      {label}
    </div>
  );
}
