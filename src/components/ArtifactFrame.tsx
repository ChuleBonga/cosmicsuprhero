import { motion } from "framer-motion";
import { Disc3, ExternalLink, Radio } from "lucide-react";

type ArtifactFrameProps = {
  label: string;
  title: string;
  metadata: string[];
  appleUrl: string;
  variant?: "earth" | "shadow" | "cosmic";
};

export function ArtifactFrame({
  label,
  title,
  metadata,
  appleUrl,
  variant = "cosmic",
}: ArtifactFrameProps) {
  return (
    <div className={`artifact-frame artifact-frame--${variant}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-archive-amber/20 pb-5">
        <div>
          <p className="font-body text-[0.68rem] uppercase tracking-[0.34em] text-archive-amber/70">{label}</p>
          <h3 className="mt-2 font-display text-3xl text-stone-100 md:text-4xl">{title}</h3>
        </div>
        <div className="rounded-full border border-archive-amber/25 bg-black/30 p-3 text-archive-amber shadow-ember">
          <Radio size={24} aria-hidden="true" />
        </div>
      </div>

      <motion.div
        className="spectrogram my-5 min-h-[170px] overflow-hidden rounded-md border border-archive-amber/20 sm:my-6 sm:min-h-[220px]"
        initial={{ opacity: 0.65 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="spectrogram__sun" />
        <div className="spectrogram__lines" />
        <div className="spectrogram__wave" />
      </motion.div>

      <dl className="grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
        {metadata.map((item) => {
          const [term, description] = item.split(": ");
          return (
            <div key={item} className="border-l border-archive-amber/25 pl-3">
              <dt className="font-body text-[0.62rem] uppercase tracking-[0.24em] text-archive-amber/60">{term}</dt>
              <dd className="mt-1 leading-relaxed text-stone-200">{description}</dd>
            </div>
          );
        })}
      </dl>

      <a
        className="mt-7 inline-flex items-center gap-2 rounded-full border border-archive-amber/40 bg-archive-ember/10 px-5 py-3 font-body text-sm uppercase tracking-[0.18em] text-archive-amber transition hover:border-archive-amber hover:bg-archive-ember/20 focus:outline-none focus:ring-2 focus:ring-archive-amber focus:ring-offset-2 focus:ring-offset-archive-void"
        href={appleUrl}
        target="_blank"
        rel="noreferrer"
      >
        <Disc3 size={17} aria-hidden="true" />
        Listen on Apple Music
        <ExternalLink size={15} aria-hidden="true" />
      </a>
    </div>
  );
}
