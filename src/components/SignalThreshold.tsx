import { motion } from "framer-motion";

const thresholdFragments = [
  { label: "Origin", value: "Port Elizabeth" },
  { label: "Transit", value: "Illinois" },
  { label: "Myth", value: "Arcturus" },
];

export function SignalThreshold() {
  return (
    <section className="signal-threshold" aria-label="Observatory threshold">
      <div className="signal-threshold__field" aria-hidden="true" />
      <motion.div
        className="signal-threshold__inner"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.35 }}
      >
        <div className="signal-threshold__dial" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div>
          <p className="section-kicker">Threshold Protocol</p>
          <p className="signal-threshold__statement">
            One signal enters. Seven emotional rooms begin to answer.
          </p>
        </div>

        <div className="signal-threshold__fragments">
          {thresholdFragments.map((fragment) => (
            <div key={fragment.label}>
              <span>{fragment.label}</span>
              <strong>{fragment.value}</strong>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
