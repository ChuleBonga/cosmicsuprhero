export function ObservatorySceneSpike() {
  return (
    <div className="observatory-scene-spike" aria-hidden="true">
      <div className="oss-depth-field" />
      <div className="oss-ember-wake" />
      <div className="oss-receiver-map">
        <span />
        <span />
        <span />
      </div>
      <div className="oss-signal-dish">
        <span className="oss-dish-ring oss-dish-ring--outer" />
        <span className="oss-dish-ring oss-dish-ring--mid" />
        <span className="oss-dish-ring oss-dish-ring--inner" />
        <span className="oss-dish-beam" />
        <div className="oss-core">
          <span className="oss-core-glow" />
          <span className="oss-core-mark" />
          <span className="oss-core-line" />
          <span className="oss-core-line" />
          <span className="oss-core-line" />
        </div>
      </div>
      <div className="oss-console-slab">
        <span>RX 07</span>
        <span>MEMORY BAND</span>
        <span>NO AUTOPLAY</span>
      </div>
      <div className="oss-foreground-rail">
        <span />
        <span />
      </div>
    </div>
  );
}
