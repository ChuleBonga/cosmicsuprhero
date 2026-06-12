import { ExternalLink } from "lucide-react";
import { platformLinks, type Release } from "../../data/releases";

type PlatformExitsProps = {
  release: Release;
};

type PlatformExit = {
  label: string;
  href: string;
  note: string;
};

function createPlatformExits(release: Release): PlatformExit[] {
  const exits: PlatformExit[] = [
    {
      label: "Apple Music",
      href: release.externalLinks?.appleMusic ?? release.appleUrl,
      note: "External platform",
    },
  ];

  const spotifyHref = release.externalLinks?.spotify ?? release.spotifyUrl;
  if (spotifyHref) {
    exits.push({
      label: "Spotify",
      href: spotifyHref,
      note: "External platform",
    });
  }

  exits.push(
    {
      label: "YouTube",
      href: platformLinks.youtubeHandle,
      note: "Channel exit",
    },
    {
      label: "Platform Hub",
      href: platformLinks.linktree,
      note: "Linktree exit",
    },
  );

  return exits;
}

export function PlatformExits({ release }: PlatformExitsProps) {
  const exits = createPlatformExits(release);

  return (
    <nav className="native-transmission-player__exits" aria-label={`${release.title} external platform exits`}>
      {exits.map((exit) => (
        <a
          href={exit.href}
          target="_blank"
          rel="noreferrer"
          key={`${exit.label}-${exit.href}`}
          aria-label={`Open ${release.title} on ${exit.label}`}
        >
          <span>{exit.label}</span>
          <small>{exit.note}</small>
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}
