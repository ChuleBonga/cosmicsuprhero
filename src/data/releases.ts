export type ReleaseStatus = "Main Chamber" | "Featured Chamber" | "Latest Transmission";

export type ReleaseVisualAssets = {
  heroImage?: string;
  secondaryImage?: string;
  artifactImage?: string;
  posterImage?: string;
  backgroundVideoWebm?: string;
  backgroundVideoMp4?: string;
  textureImage?: string;
  credit?: string;
  license?: string;
  sourceUrl?: string;
  generationNote?: string;
};

export type Release = {
  slug: string;
  title: string;
  year: string;
  type: "Album";
  chamberRole?: string;
  emotionalIdentity?: string;
  visualLanguage?: string;
  motionLanguage?: string;
  frequencyTags?: string[];
  description?: string;
  chamber: string;
  mood: string;
  visual: string;
  motion: string;
  appleUrl: string;
  spotifyUrl: string;
  externalLinks?: {
    appleMusic?: string;
    spotify?: string;
  };
  embedUrl?: string;
  visualAssets?: ReleaseVisualAssets;
  visualPrompt?: string;
  videoPrompt?: string;
  assetCredit?: {
    credit?: string;
    license?: string;
    sourceUrl?: string;
  };
  status: ReleaseStatus;
};

export const releases: Release[] = [
  {
    slug: "celestial-multiverse",
    title: "Celestial Multiverse",
    year: "2022",
    type: "Album",
    chamber: "Cosmological Expansion",
    mood: "scale, fragments, inherited memory, signal interruptions",
    visual: "star maps, telescope glow, floating archive cards",
    motion: "orbit and drift",
    chamberRole: "Cosmological expansion chamber",
    emotionalIdentity: "archive scale, inherited memory, oral transmission, recovered signal interruptions",
    visualLanguage: "antique star maps, telescope glass, deep space, floating archive cards, monolithic memory structures",
    motionLanguage: "orbit, drift, archive fragments moving like old transmissions",
    frequencyTags: ["Multiverse", "Archive Scale", "Inherited Memory", "Signal Interruption"],
    description: "A large-scale expansion room where inherited memory and cosmic archive fragments begin to orbit the same signal.",
    appleUrl: "https://music.apple.com/za/album/celestial-multiverse/1634384249",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/celestial-multiverse/1634384249",
    },
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      heroImage: "/assets/chambers/celestial-multiverse/celestial-multiverse-hero.webp",
      artifactImage: "/assets/chambers/celestial-multiverse/arcturian-artifact.webp",
      posterImage: "/assets/chambers/celestial-multiverse/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/celestial-multiverse/background.webm",
      // backgroundVideoMp4: "/assets/chambers/celestial-multiverse/background.mp4",
      textureImage: "/assets/chambers/celestial-multiverse/texture.webp",
      credit: "Celestial Multiverse chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/celestial-multiverse/celestial-multiverse-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
    },
    visualPrompt:
      "Public-domain cosmic observatory chamber with antique star maps, telescope glass, drifting archive cards, galaxy dust, inherited-memory fragments, and intermittent recovered-signal interference.",
    videoPrompt:
      "Slow archive cards, telescope-glass glints, star-map coordinates, and cosmic dust drifting through a warm human memory field.",
    assetCredit: {
      credit: "Celestial Multiverse chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/celestial-multiverse/celestial-multiverse-hero.webp",
    },
    status: "Main Chamber",
  },
  {
    slug: "stargazing-vol-3",
    title: "Stargazing, Vol. 3",
    year: "2022",
    type: "Album",
    chamber: "Intimate Star Field",
    mood: "lonely, suspended, reflective, cosmic intimacy",
    visual: "blue-black sky, distant lights, slow constellations",
    motion: "floating and quiet",
    chamberRole: "Intimate star-field chamber",
    emotionalIdentity: "suspension, loneliness, observation, peaceful cosmic intimacy",
    visualLanguage: "quiet blue-black sky, distant lights, soft constellations, restrained cosmic warmth",
    motionLanguage: "slow drift and suspended stillness",
    frequencyTags: ["Stargazing", "Suspension", "Observation", "Quiet Field"],
    description: "A quiet observational room where distance, loneliness, and soft starlight become intimate rather than enormous.",
    appleUrl: "https://music.apple.com/za/album/stargazing-vol-3/1650779094",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/stargazing-vol-3/1650779094",
    },
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      heroImage: "/assets/chambers/stargazing-vol-3/stargazing-vol-3-hero.webp",
      posterImage: "/assets/chambers/stargazing-vol-3/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/stargazing-vol-3/background.webm",
      // backgroundVideoMp4: "/assets/chambers/stargazing-vol-3/background.mp4",
      textureImage: "/assets/chambers/stargazing-vol-3/texture.webp",
      credit: "Stargazing, Vol. 3 chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/stargazing-vol-3/stargazing-vol-3-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
    },
    visualPrompt:
      "Blue-black intimate star field with distant pin lights, suspended night air, soft constellations, quiet reflective space, and subtle cosmic loneliness without neon or sci-fi gloss.",
    videoPrompt:
      "Sparse stars breathing quietly, distant lights blinking, and blue-black night air drifting with peaceful suspension.",
    assetCredit: {
      credit: "Stargazing, Vol. 3 chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/stargazing-vol-3/stargazing-vol-3-hero.webp",
    },
    status: "Main Chamber",
  },
  {
    slug: "just-sounds-really",
    title: "Just Sounds Really",
    year: "2022",
    type: "Album",
    chamber: "Sound Object Room",
    mood: "minimal, textural, stripped, experimental",
    visual: "signal lines, blank space, subtle waveform objects",
    motion: "small pulses and micro-movements",
    chamberRole: "Minimal sound-object room",
    emotionalIdentity: "restraint, residue, emptiness, experimental honesty",
    visualLanguage: "blank dark material, single object, quiet signal lines, tactile texture, narrow light",
    motionLanguage: "almost still, tiny pulses, waveform residue",
    frequencyTags: ["Sound Object", "Minimal", "Residue", "Restraint"],
    description: "A stripped room where sound is treated as an object before mythology arrives.",
    appleUrl: "https://music.apple.com/za/album/just-sounds-really/1658052127",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/just-sounds-really/1658052127",
    },
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      heroImage: "/assets/chambers/just-sounds-really/just-sounds-really-hero.webp",
      posterImage: "/assets/chambers/just-sounds-really/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/just-sounds-really/background.webm",
      // backgroundVideoMp4: "/assets/chambers/just-sounds-really/background.mp4",
      textureImage: "/assets/chambers/just-sounds-really/texture.webp",
      credit: "Just Sounds Really chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/just-sounds-really/just-sounds-really-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
    },
    visualPrompt:
      "Minimal experimental sound-object room with blank dark space, faint analog signal lines, soft waveform sculptures, paper texture, and tiny pulsing details that feel tactile and stripped down.",
    videoPrompt:
      "A nearly still sound object under one beam of light with faint signal-line pulses and slow dust.",
    assetCredit: {
      credit: "Just Sounds Really chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/just-sounds-really/just-sounds-really-hero.webp",
    },
    status: "Main Chamber",
  },
  {
    slug: "enter-aquarius",
    title: "Enter Aquarius",
    year: "2023",
    type: "Album",
    chamber: "Threshold Ritual",
    mood: "ascension, planetary movement, celestial weather, impermanence",
    visual: "electric blue, violet, cosmic gold, storm particles",
    motion: "gravity shifting and slow lift",
    chamberRole: "Threshold ritual chamber",
    emotionalIdentity: "ascension, transformation, celestial weather, impermanence",
    visualLanguage: "impossible concrete stairways, violet-blue pressure, electric gold, brutalist threshold weather",
    motionLanguage: "gravity shift, portal-like lift, slow ascent",
    frequencyTags: ["Threshold", "Aquarius", "Ascension", "Spiritual Weather"],
    description: "A threshold room where concrete, weather, and frequency shift the body toward another state.",
    appleUrl: "https://music.apple.com/za/album/enter-aquarius/1682262161",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/enter-aquarius/1682262161",
    },
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      heroImage: "/assets/chambers/enter-aquarius/enter-aquarius-hero.webp",
      secondaryImage: "/assets/chambers/enter-aquarius/enter-aquarius-portrait.webp",
      posterImage: "/assets/chambers/enter-aquarius/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/enter-aquarius/background.webm",
      // backgroundVideoMp4: "/assets/chambers/enter-aquarius/background.mp4",
      textureImage: "/assets/chambers/enter-aquarius/texture.webp",
      credit: "Enter Aquarius chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/enter-aquarius/enter-aquarius-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
    },
    visualPrompt:
      "Threshold ritual chamber with electric blue, violet, and cosmic gold weather, slow planetary lift, storm particles, celestial pressure, and a feeling of impermanence and ascent.",
    videoPrompt:
      "Violet-blue storm particles and subtle gold threshold light moving through impossible concrete as gravity slowly shifts upward.",
    assetCredit: {
      credit: "Enter Aquarius chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/enter-aquarius/enter-aquarius-hero.webp",
    },
    status: "Main Chamber",
  },
  {
    slug: "soil-and-sun",
    title: "Soil and Sun",
    year: "2023",
    type: "Album",
    chamber: "Earth Memory Chamber",
    mood: "South African memory, prayer, sunlight, taxis, river, walking, ancestry",
    visual: "dust, amber light, concrete, old photo textures, warm haze",
    motion: "slow, grounded, human",
    chamberRole: "Earth memory chamber",
    emotionalIdentity: "earth, prayer, ancestry, walking, taxis, sunlight, becoming human",
    visualLanguage: "amber sunlight, dust, concrete, South African transit memory, river edges, old photo warmth",
    motionLanguage: "slow, grounded, human, heat and dust moving gently",
    frequencyTags: ["Soil", "Sun", "Prayer", "Transit", "Ancestry"],
    description: "A warm archive of movement, prayer, soil, sunlight, and the sound of becoming human.",
    appleUrl: "https://music.apple.com/za/album/soil-and-sun/1714215266",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/soil-and-sun/1714215266",
    },
    embedUrl: "https://embed.music.apple.com/za/album/soil-and-sun/1714215266",
    visualAssets: {
      heroImage: "/assets/chambers/soil-and-sun/soil-and-sun-hero.webp",
      secondaryImage: "/assets/chambers/soil-and-sun/soil-and-sun-walk.webp",
      artifactImage: "/assets/chambers/soil-and-sun/sound-system-speaker.webp",
      posterImage: "/assets/chambers/soil-and-sun/poster.webp",
      textureImage: "/assets/chambers/soil-and-sun/texture.webp",
      credit: "Soil and Sun chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/soil-and-sun/soil-and-sun-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
    },
    visualPrompt:
      "Warm earth-memory chamber with amber sunlight, dust, concrete, South African transit textures, river-edge prayer, old photo grain, walking routes, taxi-window haze, and ancestral softness.",
    videoPrompt:
      "Slow dust movement, amber sunlight breathing across concrete, road heat shimmer, taxi-window glow, and river-prayer softness.",
    assetCredit: {
      credit: "Soil and Sun chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/soil-and-sun/soil-and-sun-hero.webp",
    },
    status: "Featured Chamber",
  },
  {
    slug: "songs-i-made-at-night",
    title: "Songs I Made At Night",
    year: "2024",
    type: "Album",
    chamber: "Nocturnal Reflection",
    mood: "migration, insomnia, private thought, moonlight, inner drift",
    visual: "dark blues, airport glass, laptop glow, night streets",
    motion: "floating, slow, dreamlike",
    chamberRole: "Nocturnal reflection chamber",
    emotionalIdentity: "night, migration, insomnia, private thought, inner drift",
    visualLanguage: "blue-black room, laptop glow, airport glass, cassette archive, city lights through window",
    motionLanguage: "floating, slow, dreamlike, window reflections breathing",
    frequencyTags: ["Night", "Migration", "Insomnia", "Private Thought"],
    description: "A nocturnal room of private thoughts, migration memory, and late-night sound fragments.",
    appleUrl: "https://music.apple.com/za/album/songs-i-made-at-night/1769362916",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/songs-i-made-at-night/1769362916",
    },
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      heroImage: "/assets/chambers/songs-i-made-at-night/songs-i-made-at-night-hero.webp",
      secondaryImage: "/assets/chambers/songs-i-made-at-night/nocturnal-portrait.webp",
      posterImage: "/assets/chambers/songs-i-made-at-night/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/songs-i-made-at-night/background.webm",
      // backgroundVideoMp4: "/assets/chambers/songs-i-made-at-night/background.mp4",
      textureImage: "/assets/chambers/songs-i-made-at-night/texture.webp",
      credit: "Songs I Made At Night chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/songs-i-made-at-night/songs-i-made-at-night-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
    },
    visualPrompt:
      "Nocturnal reflection chamber with airport glass, laptop glow, moonlit streets, migration insomnia, deep blue interior drift, private thought, and slow dreamlike motion.",
    videoPrompt:
      "Soft window reflections, laptop glow, distant city lights, cassette dust, and blue-black stillness moving slowly.",
    assetCredit: {
      credit: "Songs I Made At Night chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/songs-i-made-at-night/songs-i-made-at-night-hero.webp",
    },
    status: "Main Chamber",
  },
  {
    slug: "bad-guys-finish-last",
    title: "Bad Guys Finish Last",
    year: "2025",
    type: "Album",
    chamber: "Shadow Chamber",
    mood: "ego collapse, grief, contradiction, antihero reflection, spiritual consequence",
    visual: "dim ember, wet pavement, cracked glass, rain particles, red-black darkness",
    motion: "heavy, distorted, emotionally dense",
    chamberRole: "Shadow chamber",
    emotionalIdentity: "shadow, fracture, consequence, ego collapse, grief, masks, transformation",
    visualLanguage: "red-black wet concrete, cracked glass, rain particles, dim ember, damaged archive pressure",
    motionLanguage: "heavier, distorted, pressured, damaged-transmission movement",
    frequencyTags: ["Shadow", "Consequence", "Mask", "Survival", "Transformation"],
    description: "A damaged transmission about ego, betrayal, divine timing, masks, contradiction, and transformation.",
    appleUrl: "https://music.apple.com/za/album/bad-guys-finish-last/1818998518",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/bad-guys-finish-last/1818998518",
    },
    embedUrl: "https://embed.music.apple.com/za/album/bad-guys-finish-last/1818998518",
    visualAssets: {
      heroImage: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp",
      secondaryImage: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-portrait.webp",
      posterImage: "/assets/chambers/bad-guys-finish-last/poster.webp",
      textureImage: "/assets/chambers/bad-guys-finish-last/texture.webp",
      credit: "Bad Guys Finish Last chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
    },
    visualPrompt:
      "Shadow chamber with dim ember, wet pavement, cracked glass, rain streaks, red-black darkness, antihero reflection, ego collapse, betrayal, masks, and spiritual consequence.",
    videoPrompt:
      "Rain drifting across red-black wet concrete, cracked glass light shifting, ember pulse under shadow, and slow damaged-transmission pressure.",
    assetCredit: {
      credit: "Bad Guys Finish Last chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp",
    },
    status: "Latest Transmission",
  },
];

export const trackJourney = [
  "Intro",
  "I Am an African",
  "Midday",
  "Offering At the River",
  "Taxi Ride Home",
  "Pedestrian",
  "Rising",
  "Prayers Heard",
  "Eternity",
  "Soil and Sun",
  "Soil and Sun (Melo Mix)",
  "Outro",
];

export const platformLinks = {
  youtubeHandle: "https://www.youtube.com/@cosmicsuprhero",
  youtubeChannel: "https://www.youtube.com/channel/UCFxYdvRH1li1sLWH-WaQEtQ",
  appleMusic: "https://music.apple.com/za/artist/cosmicsuprhero/1576832784",
  spotify: "https://open.spotify.com/artist/4ZwmYFCjIpufY4XT66JEcn",
  linktree: "https://linktr.ee/Cosmicsuprhero",
  instagram: "https://instagram.com/cosmicsuprhero",
  elasticStage: "https://elasticstage.com/cosmicsuprhero",
};
