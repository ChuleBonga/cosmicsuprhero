import { platformLinks } from "./releases";

export const artistIdentity = {
  plainSoundLine:
    "Atmospheric instrumental music where South African memory, beat-work, ambient soul, and cosmic reflection meet.",
  originLine: "Port Elizabeth to Illinois",
  roles: ["Artist", "Producer", "Storyteller", "Sound alchemist"],
  professionalLine: "For press, booking, sync, collaboration, and platform contact, use the active hub until a direct email is confirmed.",
};

export const contactChannels = {
  email: "",
  pressKit: "",
  booking: "",
  collaboration: platformLinks.linktree,
  platformHub: platformLinks.linktree,
};

export const professionalActions = [
  {
    label: "Press / Booking / Sync",
    href: contactChannels.booking || contactChannels.platformHub,
    status: contactChannels.booking ? "active" : "hub",
  },
  {
    label: "Collaboration",
    href: contactChannels.collaboration,
    status: "hub",
  },
  {
    label: "Platform Hub",
    href: contactChannels.platformHub,
    status: "active",
  },
];

export const pressProof = {
  quote: "",
  source: "",
  link: "",
  note: "Press kit pending.",
};
