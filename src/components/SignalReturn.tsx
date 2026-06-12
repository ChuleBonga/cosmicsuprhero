import { ArrowUp, Briefcase, Disc3, Instagram, Link as LinkIcon, Music2, Radio, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { pressProof, professionalActions } from "../data/contact";
import { platformLinks } from "../data/releases";

const signalLinks = [
  { label: "Apple Music", href: platformLinks.appleMusic, icon: Music2 },
  { label: "Spotify", href: platformLinks.spotify, icon: Disc3 },
  { label: "YouTube", href: platformLinks.youtubeHandle, icon: Youtube },
  { label: "Instagram", href: platformLinks.instagram, icon: Instagram },
  { label: "Linktree", href: platformLinks.linktree, icon: LinkIcon },
  { label: "Vinyl Artifact", href: platformLinks.elasticStage, icon: Radio },
];

export function SignalReturn() {
  const [isDeepLinked, setIsDeepLinked] = useState(false);

  useEffect(() => {
    const syncHash = () => setIsDeepLinked(window.location.hash === "#signal-return");
    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <footer id="signal-return" className="signal-return section-shell relative overflow-hidden py-16 md:py-24" aria-labelledby="return-heading">
      <div className="signal-return__field" aria-hidden="true" />
      <div className="relative z-10 grid gap-8 md:gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          {isDeepLinked ? (
            <div className="signal-return__deep-link-card" role="note">
              <span>Signal Return detected</span>
              <p>If this is your first stop, begin at the Entry Signal and let the archive open in sequence.</p>
              <a href="#entry-signal">
                <ArrowUp size={14} aria-hidden="true" />
                Start at Entry
              </a>
            </div>
          ) : null}
          <p className="section-kicker">Signal Return</p>
          <h2 id="return-heading" className="section-title">
            Signal Return
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-stone-300 md:mt-6 md:text-lg md:leading-8">
            Follow the signal, book the artist, open a platform, or return to the first transmission.
          </p>
          <a className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-archive-amber hover:text-stone-100 md:mt-8" href="#entry-signal">
            <ArrowUp size={16} aria-hidden="true" />
            Return to Entry Signal
          </a>
          {!pressProof.quote ? (
            <div className="signal-return__press-note">
              <span>Press / proof</span>
              <p>{pressProof.note}</p>
            </div>
          ) : null}
          <div className="signal-return__seal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>

        <nav aria-label="Cosmicsuprhero platform links" className="signal-links">
          {professionalActions.map((link) => (
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              key={link.label}
              aria-label={`${link.label} opens an external platform hub`}
            >
              <Briefcase size={20} aria-hidden="true" />
              <span>{link.label}</span>
              <small>{link.status === "hub" ? "External / Linktree" : "External"}</small>
            </a>
          ))}
          {signalLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.label} aria-label={`${link.label} opens an external site`}>
                <Icon size={20} aria-hidden="true" />
                <span>{link.label}</span>
                <small>External</small>
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
