import { Compass, Radio } from "lucide-react";
import { releases } from "../data/releases";

type ArchiveNavProps = {
  currentSlug?: string;
};

const waypoints = [
  { label: "Entry", href: "/#entry-signal" },
  { label: "Observatory", href: "/#observatory" },
  { label: "Chambers", href: "/#frequency-chambers" },
  { label: "Return", href: "#signal-return" },
];

export function ArchiveNav({ currentSlug }: ArchiveNavProps) {
  return (
    <nav className="archive-nav" aria-label="Sacred observatory navigation">
      <a className="archive-nav__mark" href="/" aria-label="Return to Cosmicsuprhero observatory entry">
        <Radio size={17} aria-hidden="true" />
        <span>Cosmicsuprhero</span>
      </a>

      <div className="archive-nav__waypoints" aria-label="Archive waypoints">
        {waypoints.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </div>

      <details className="archive-nav__chambers">
        <summary>
          <Compass size={15} aria-hidden="true" />
          Chamber Index
        </summary>
        <div>
          {releases.map((release) => (
            <a
              key={release.slug}
              href={`/chambers/${release.slug}`}
              aria-current={currentSlug === release.slug ? "page" : undefined}
            >
              <span>{release.title}</span>
              <small>{release.chamber}</small>
            </a>
          ))}
        </div>
      </details>
    </nav>
  );
}
