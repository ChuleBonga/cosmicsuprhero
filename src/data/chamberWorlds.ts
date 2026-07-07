import type { ChamberVisualVariant } from "../components/ChamberVisualLayer";
import type { Release } from "./releases";
import { releases } from "./releases";

export type ChamberWorld = {
  slug: string;
  variant: ChamberVisualVariant;
  route: string;
  worldTitle: string;
  subtitle: string;
  invocation: string;
  spatialPremise: string;
  emotionalPhysics: string[];
  fieldNotes: string[];
  artifactNotes: string[];
  thresholdLabel: string;
  returnSignal: string;
};

export const chamberWorlds: ChamberWorld[] = [
  {
    slug: "celestial-multiverse",
    variant: "cosmic",
    route: "/chambers/celestial-multiverse",
    worldTitle: "Celestial Multiverse",
    subtitle: "Cosmological Expansion Chamber",
    invocation: "A first expansion into archive scale, where memory learns to orbit.",
    spatialPremise:
      "The room behaves like a suspended archive tower: telescope glass, star charts, floating cards, and inherited signals moving through warm cosmic dust.",
    emotionalPhysics: [
      "Scale is felt as ancestry, not spectacle.",
      "Fragments do not resolve; they orbit until they become language.",
      "Signal interruptions are treated as part of the memory.",
    ],
    fieldNotes: [
      "The archive is larger than the person, but the person gives it temperature.",
      "A constellation can be a family record if you know how to listen.",
      "Expansion begins as a quiet refusal to stay small.",
    ],
    artifactNotes: [
      "Star-map glass",
      "Inherited signal cards",
      "Telescope glow",
      "Arcturian relic",
    ],
    thresholdLabel: "Enter the first expansion",
    returnSignal: "Return from archive scale",
  },
  {
    slug: "stargazing-vol-3",
    variant: "night",
    route: "/chambers/stargazing-vol-3",
    worldTitle: "Stargazing, Vol. 3",
    subtitle: "Intimate Star Field",
    invocation: "A suspended room for looking outward without leaving the body.",
    spatialPremise:
      "The chamber is blue-black and spare, with distant points of light behaving like private thoughts rather than cosmic spectacle.",
    emotionalPhysics: [
      "Distance becomes intimate when the room gets quiet enough.",
      "Suspension is not emptiness; it is held breath.",
      "The stars are not decoration. They are listening positions.",
    ],
    fieldNotes: [
      "Loneliness can soften when it is given enough sky.",
      "Observation is a form of care.",
      "Some lights are only visible because nothing else is moving.",
    ],
    artifactNotes: ["Sparse constellation field", "Distant lights", "Night air", "Quiet coordinate points"],
    thresholdLabel: "Enter the star field",
    returnSignal: "Return from suspension",
  },
  {
    slug: "just-sounds-really",
    variant: "sound",
    route: "/chambers/just-sounds-really",
    worldTitle: "Just Sounds Really",
    subtitle: "Sound Object Room",
    invocation: "The stripped room before mythology arrives.",
    spatialPremise:
      "A minimal concrete chamber holds sound like an object: one beam, faint lines, tactile residue, and the discipline of leaving space empty.",
    emotionalPhysics: [
      "Nothing is added unless the room asks for it.",
      "Silence is treated as material.",
      "The smallest pulse can become architecture.",
    ],
    fieldNotes: [
      "The title is almost a dare: let the sound stand without armor.",
      "Blank space is not unfinished when it is listening.",
      "A single object can hold an entire weather system.",
    ],
    artifactNotes: ["Signal residue", "Pedestal object", "One light beam", "Waveform dust"],
    thresholdLabel: "Enter the sound object",
    returnSignal: "Return from restraint",
  },
  {
    slug: "enter-aquarius",
    variant: "aquarius",
    route: "/chambers/enter-aquarius",
    worldTitle: "Enter Aquarius",
    subtitle: "Threshold Ritual",
    invocation: "A crossing room where concrete begins to behave like weather.",
    spatialPremise:
      "Violet-blue pressure moves through impossible stairways, gold threshold light, and storm particles that lift the body into another frequency.",
    emotionalPhysics: [
      "Transformation is weather before it is identity.",
      "Gravity loosens slowly.",
      "The threshold does not announce itself; it changes the pressure in the room.",
    ],
    fieldNotes: [
      "Crossing can be quiet and still be irreversible.",
      "Some stairways exist only after you have already changed.",
      "Impermanence is not loss. It is motion becoming visible.",
    ],
    artifactNotes: ["Concrete threshold", "Violet weather", "Gold pressure", "Gravity-shift marks"],
    thresholdLabel: "Enter the threshold",
    returnSignal: "Return from ascent",
  },
  {
    slug: "soil-and-sun",
    variant: "earth",
    route: "/chambers/soil-and-sun",
    worldTitle: "Soil and Sun",
    subtitle: "Earth Memory Chamber",
    invocation: "A warm archive of movement, prayer, soil, sunlight, and becoming human.",
    spatialPremise:
      "The chamber is built from road dust, taxi-window light, concrete warmth, speaker memory, river prayer, and ordinary movement made sacred.",
    emotionalPhysics: [
      "The body remembers before the mind explains.",
      "Transit becomes ritual when the listener slows down.",
      "Sunlight does not ask for permission to touch everything.",
    ],
    fieldNotes: [
      "Some songs are not written. They are remembered by the body.",
      "A taxi ride can be a prayer if you are listening closely enough.",
      "The sun does not explain itself. It simply touches everything.",
    ],
    artifactNotes: ["Amber road memory", "Taxi-window warmth", "Sound-system speaker", "River prayer dust"],
    thresholdLabel: "Enter earth memory",
    returnSignal: "Return from soil and sun",
  },
  {
    slug: "songs-i-made-at-night",
    variant: "night",
    route: "/chambers/songs-i-made-at-night",
    worldTitle: "Songs I Made At Night",
    subtitle: "Nocturnal Reflection Chamber",
    invocation: "A private night room for insomnia, migration, laptop glow, and inner drift.",
    spatialPremise:
      "The room sits behind glass: city lights, cassette equipment, airport reflections, blue-black silence, and a desk where thought becomes atmosphere.",
    emotionalPhysics: [
      "Night makes the private self audible.",
      "Migration lives in reflections as much as in distance.",
      "The room moves slowly because the mind is still awake.",
    ],
    fieldNotes: [
      "Some songs happen when nobody is watching the self perform.",
      "A window at night can become an airport even when you are still home.",
      "The laptop glow is not cold if the thought is honest.",
    ],
    artifactNotes: ["Airport glass", "Laptop glow", "Cassette dust", "City-light reflection"],
    thresholdLabel: "Enter the night room",
    returnSignal: "Return from nocturnal drift",
  },
  {
    slug: "bad-guys-finish-last",
    variant: "shadow",
    route: "/chambers/bad-guys-finish-last",
    worldTitle: "Bad Guys Finish Last",
    subtitle: "Shadow Chamber",
    invocation: "A damaged transmission about ego, consequence, masks, and transformation.",
    spatialPremise:
      "The chamber is red-black pressure: wet concrete, cracked glass, rain, dim ember, and a corridor where contradiction has nowhere left to hide.",
    emotionalPhysics: [
      "The room gets heavier when the mask speaks first.",
      "Damage becomes a signal when it stops pretending to be clean.",
      "Consequence is not punishment; it is delayed truth arriving.",
    ],
    fieldNotes: [
      "The villain story breaks when the person underneath starts listening.",
      "A shadow can be a teacher if it stops being a costume.",
      "Warmth under pressure is still warmth.",
    ],
    artifactNotes: ["Cracked glass", "Rain pressure", "Red-black concrete", "Ember under shadow"],
    thresholdLabel: "Enter the reckoning",
    returnSignal: "Return from shadow pressure",
  },
  {
    slug: "game-dev-chamber",
    variant: "aquarius",
    route: "/chambers/game-dev-chamber",
    worldTitle: "Game Dev Chamber",
    subtitle: "Interactive Creation Chamber",
    invocation: "A chamber where code becomes play and rules become playthings.",
    spatialPremise:
      "The chamber resembles a game development studio crossed with a playground: floating code blocks, interactive rule sliders, collision geometry made visible, and physics parameters you can touch and reshape.",
    emotionalPhysics: [
      "Creation is iteration played at full speed.",
      "Rules are most visible when you break them.",
      "Play emerges from constraint, not freedom."
    ],
    fieldNotes: [
      "Every game is a universe with its own laws of physics.",
      "The best mechanics feel discovered, not designed.",
      "Debugging is just talking to your creation until it makes sense."
    ],
    artifactNotes: ["Collision wireframes", "Variable watchers", "Frame rate dials", "Input visualization"],
    thresholdLabel: "Enter the play space",
    returnSignal: "Return from play mode"
  }
];

export function getChamberWorld(slug: string) {
  const release = releases.find((item) => item.slug === slug);
  const world = chamberWorlds.find((item) => item.slug === slug);

  if (!release || !world) return undefined;

  return { release, world };
}

export function getAdjacentChambers(currentRelease: Release) {
  const currentIndex = releases.findIndex((release) => release.slug === currentRelease.slug);
  const previous = releases[(currentIndex - 1 + releases.length) % releases.length];
  const next = releases[(currentIndex + 1) % releases.length];

  return { previous, next };
}
