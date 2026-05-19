import { releases } from "../data/releases";
import { ChamberCard } from "./ChamberCard";

export function FrequencyChambers() {
  return (
    <section id="frequency-chambers" className="section-shell py-14 md:py-20 lg:py-24" aria-labelledby="frequency-heading">
      <div className="mb-8 flex flex-col justify-between gap-5 md:mb-10 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Archive Rooms</p>
          <h2 id="frequency-heading" className="section-title">
            Frequency Chambers
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-stone-300 md:text-base md:leading-8">
          Each release opens as a room with its own atmosphere, pressure, memory, and motion.
        </p>
      </div>

      <div className="grid gap-4 md:gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {releases.map((release) => (
          <ChamberCard release={release} key={release.title} />
        ))}
      </div>
    </section>
  );
}
