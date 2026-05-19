import { motion } from "framer-motion";

const fragments = [
  {
    id: "TRANSMISSION 001",
    text: "A chamber is not a playlist. It is a room with pressure, weather, and memory in the walls.",
    source: "Recovered from the observatory floor",
  },
  {
    id: "TRANSMISSION 002",
    text: "The archive keeps what the body cannot explain: sunlight, distance, grief, rhythm, prayer.",
    source: "Filed under earth and signal",
  },
  {
    id: "TRANSMISSION 003",
    text: "Listening is the ritual. The platform is only the doorway. The room is the work around it.",
    source: "Console note for future chambers",
  },
];

export function ManifestoFragments() {
  return (
    <div className="manifesto-fragments" aria-label="Observatory manifesto fragments">
      {fragments.map((fragment, index) => (
        <motion.article
          className="manifesto-fragment"
          key={fragment.id}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: index * 0.12 }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <p className="manifesto-fragment__id">{fragment.id}</p>
          <p className="manifesto-fragment__text">{fragment.text}</p>
          <p className="manifesto-fragment__source">{fragment.source}</p>
        </motion.article>
      ))}
    </div>
  );
}
