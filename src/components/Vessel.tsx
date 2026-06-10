import { motion } from "framer-motion";
import { MapPin, Sparkles, Waves } from "lucide-react";

const facts = [
  {
    icon: MapPin,
    text: "From Port Elizabeth, South Africa",
  },
  {
    icon: Sparkles,
    text: "Artist, storyteller, producer, and sound alchemist",
  },
  {
    icon: Waves,
    text: "Music rooted in vulnerability, atmosphere, rhythm, and spiritual reflection",
  },
];

export function Vessel() {
  return (
    <section id="the-vessel" className="section-shell py-16 md:py-24" aria-labelledby="vessel-heading">
      <div className="grid gap-9 md:gap-12 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div
          className="vessel-portrait"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <img
            src="/assets/observatory/signal-listener-portrait.webp"
            alt="Generated cinematic signal-listener portrait of Cosmicsuprhero inside a vintage observatory study"
            loading="lazy"
            decoding="async"
          />
          <div className="vessel-portrait__plate" aria-hidden="true">
            <span>Vessel portrait</span>
            <span>Memory / signal / archive</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <p className="section-kicker">The Vessel</p>
          <h2 id="vessel-heading" className="section-title">
            Narrator of the Signal
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-300 md:mt-8 md:text-xl md:leading-10">
            Cosmicsuprhero is a transmitted identity, a vessel for memory, spirit, contradiction, and cinematic sound.
            The work moves between earth and cosmos, between South African memory and inner mythology, between shadow
            and awakening.
          </p>
          <motion.ul
            className="vessel-list mt-8 md:mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <li key={fact.text}>
                  <Icon size={22} aria-hidden="true" />
                  <span>{fact.text}</span>
                </li>
              );
            })}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
