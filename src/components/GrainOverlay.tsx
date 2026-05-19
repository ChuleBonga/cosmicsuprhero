export function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.22] mix-blend-screen" aria-hidden="true">
      <div className="grain-overlay h-full w-full" />
      <div className="scanline-overlay absolute inset-0" />
    </div>
  );
}
