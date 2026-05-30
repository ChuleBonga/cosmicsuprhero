import { releases } from "../data/releases";
import { ChamberCard } from "./ChamberCard";

const signalMap = ["Port Elizabeth", "Illinois", "Arcturus", "Soil", "Night", "Shadow", "Threshold", "Multiverse"];

export function FrequencyChambers() {
  return (
    <section
      id="frequency-chambers"
      className="frequency-chambers section-shell relative overflow-hidden py-14 md:py-20 lg:py-24"
      aria-labelledby="frequency-heading"
    >
      <div className="frequency-chambers__field" aria-hidden="true" />

      <div className="relative z-10 mb-8 grid gap-5 md:mb-10 lg:grid-cols-[1fr_0.74fr] lg:items-end">
        <div>
          <p className="section-kicker">Frequency Index</p>
          <h2 id="frequency-heading" className="section-title">
            Frequency Chambers
          </h2>
        </div>
        <div className="frequency-chambers__intro">
          <p>
            Seven chambers, one signal. Each release opens as a division of the same observatory field, tuned by
            pressure, memory, motion, and light.
          </p>
        </div>
      </div>

      <div className="frequency-index relative z-10" aria-label="Signal map">
        <p>Signal Map</p>
        <div>
          {signalMap.map((node) => (
            <span key={node}>{node}</span>
          ))}
        </div>
      </div>

      <div className="frequency-chambers__grid relative z-10 grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {releases.map((release) => (
          <ChamberCard release={release} key={release.title} />
        ))}
      </div>
    </section>
  );
}
