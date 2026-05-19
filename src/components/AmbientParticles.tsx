import { motion } from "framer-motion";

const particles = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 61) % 100}%`,
  delay: (index % 9) * 0.8,
  duration: 13 + (index % 8),
  size: 1 + (index % 4),
}));

export function AmbientParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-archive-amber/60 blur-[0.4px]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -34, 10, -18, 0],
            opacity: [0.08, 0.42, 0.18, 0.34, 0.08],
            scale: [1, 1.7, 0.8, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
