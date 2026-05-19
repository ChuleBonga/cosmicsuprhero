import { ArrowUp, Disc3, Instagram, Link as LinkIcon, Music2, Radio, Youtube } from "lucide-react";
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
  return (
    <footer id="signal-return" className="section-shell relative overflow-hidden py-16 md:py-24" aria-labelledby="return-heading">
      <div className="relative z-10 grid gap-8 md:gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="section-kicker">Signal Return</p>
          <h2 id="return-heading" className="section-title">
            Follow the Signal
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-stone-300 md:mt-6 md:text-lg md:leading-8">
            Follow the signal across platforms, listen deeper, or return through the archive.
          </p>
          <a className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-archive-amber hover:text-stone-100 md:mt-8" href="#entry-signal">
            <ArrowUp size={16} aria-hidden="true" />
            Return to Entry Signal
          </a>
        </div>

        <nav aria-label="Cosmicsuprhero platform links" className="signal-links">
          {signalLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                <Icon size={20} aria-hidden="true" />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
