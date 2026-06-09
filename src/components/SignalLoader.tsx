import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const stages = ["Signal acquiring", "Archive warming", "Transmission open"];

export function SignalLoader() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = prefersReducedMotion ? 520 : 1900;
    const startedAt = performance.now();

    const intervalId = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(intervalId);
        window.setTimeout(() => setIsVisible(false), prefersReducedMotion ? 80 : 320);
      }
    }, prefersReducedMotion ? 80 : 44);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion]);

  const activeStage = useMemo(() => {
    if (progress >= 78) return stages[2];
    if (progress >= 42) return stages[1];
    return stages[0];
  }, [progress]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="signal-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.65, ease: "easeInOut" }}
          role="status"
          aria-live="polite"
          aria-label={`${activeStage}, ${progress} percent`}
        >
          <div className="signal-loader__field" aria-hidden="true" />
          <div className="signal-loader__panel">
            <p className="signal-loader__label">{activeStage}</p>
            <div className="signal-loader__track" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="signal-loader__meta">{progress}% loaded</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
