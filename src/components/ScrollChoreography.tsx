import { useEffect } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function ScrollChoreography() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let context: { revert: () => void } | undefined;
    let cancelled = false;

    async function loadChoreography() {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const heroMedia = document.querySelector(".observatory-intro-video__media");
        if (heroMedia) {
          gsap.to(heroMedia, {
            yPercent: 8,
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
              trigger: "#entry-signal",
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        }

        gsap.to(".signal-orb", {
          yPercent: 28,
          xPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: "#entry-signal",
            start: "top top",
            end: "bottom top",
            scrub: 0.9,
          },
        });

        gsap.from(".signal-threshold__dial", {
          opacity: 0.35,
          rotate: -18,
          scale: 0.72,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".signal-threshold",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".signal-threshold__fragments div", {
          opacity: 0,
          x: 26,
          stagger: 0.08,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".signal-threshold",
            start: "top 76%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.to(".star-map", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: "#observatory",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.from(".observatory-room__receiver", {
          opacity: 0.45,
          rotate: -20,
          scale: 0.82,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".observatory-room",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.from(".frequency-index span", {
          opacity: 0,
          y: 14,
          stagger: 0.045,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".frequency-index",
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.to(".frequency-chambers__field", {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: "#frequency-chambers",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }

    void loadChoreography();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [prefersReducedMotion]);

  return null;
}
