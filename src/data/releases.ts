export type ReleaseStatus = "Main Chamber" | "Featured Chamber" | "Latest Transmission";

export type ReleaseVisualAssets = {
  posterImage?: string;
  backgroundVideoWebm?: string;
  backgroundVideoMp4?: string;
  textureImage?: string;
  credit?: string;
  license?: string;
  sourceUrl?: string;
};

export type Release = {
  title: string;
  year: string;
  type: "Album";
  chamber: string;
  mood: string;
  visual: string;
  motion: string;
  appleUrl: string;
  spotifyUrl: string;
  embedUrl?: string;
  visualAssets?: ReleaseVisualAssets;
  visualPrompt?: string;
  status: ReleaseStatus;
};

export const releases: Release[] = [
  {
    title: "Celestial Multiverse",
    year: "2022",
    type: "Album",
    chamber: "Cosmological Expansion",
    mood: "scale, fragments, inherited memory, signal interruptions",
    visual: "star maps, telescope glow, floating archive cards",
    motion: "orbit and drift",
    appleUrl: "https://music.apple.com/za/album/celestial-multiverse/1634384249",
    spotifyUrl: "",
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      posterImage: "/assets/chambers/celestial-multiverse/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/celestial-multiverse/background.webm",
      // backgroundVideoMp4: "/assets/chambers/celestial-multiverse/background.mp4",
      textureImage: "/assets/chambers/celestial-multiverse/texture.webp",
      credit: "Celestial Multiverse chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/celestial-multiverse/poster.webp",
    },
    visualPrompt:
      "Public-domain cosmic observatory chamber with antique star maps, telescope glass, drifting archive cards, galaxy dust, inherited-memory fragments, and intermittent recovered-signal interference.",
    status: "Main Chamber",
  },
  {
    title: "Stargazing, Vol. 3",
    year: "2022",
    type: "Album",
    chamber: "Intimate Star Field",
    mood: "lonely, suspended, reflective, cosmic intimacy",
    visual: "blue-black sky, distant lights, slow constellations",
    motion: "floating and quiet",
    appleUrl: "https://music.apple.com/za/album/stargazing-vol-3/1650779094",
    spotifyUrl: "",
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      posterImage: "/assets/chambers/stargazing-vol-3/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/stargazing-vol-3/background.webm",
      // backgroundVideoMp4: "/assets/chambers/stargazing-vol-3/background.mp4",
      textureImage: "/assets/chambers/stargazing-vol-3/texture.webp",
      credit: "Stargazing, Vol. 3 chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/stargazing-vol-3/poster.webp",
    },
    visualPrompt:
      "Blue-black intimate star field with distant pin lights, suspended night air, soft constellations, quiet reflective space, and subtle cosmic loneliness without neon or sci-fi gloss.",
    status: "Main Chamber",
  },
  {
    title: "Just Sounds Really",
    year: "2022",
    type: "Album",
    chamber: "Sound Object Room",
    mood: "minimal, textural, stripped, experimental",
    visual: "signal lines, blank space, subtle waveform objects",
    motion: "small pulses and micro-movements",
    appleUrl: "https://music.apple.com/za/album/just-sounds-really/1658052127",
    spotifyUrl: "",
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    // visualAssets: {
    //   posterImage: "/assets/chambers/just-sounds-really/poster.jpg",
    //   backgroundVideoWebm: "/assets/chambers/just-sounds-really/background.webm",
    //   backgroundVideoMp4: "/assets/chambers/just-sounds-really/background.mp4",
    //   textureImage: "/assets/chambers/just-sounds-really/texture.jpg",
    // },
    visualPrompt:
      "Minimal experimental sound-object room with blank dark space, faint analog signal lines, soft waveform sculptures, paper texture, and tiny pulsing details that feel tactile and stripped down.",
    status: "Main Chamber",
  },
  {
    title: "Enter Aquarius",
    year: "2023",
    type: "Album",
    chamber: "Threshold Ritual",
    mood: "ascension, planetary movement, celestial weather, impermanence",
    visual: "electric blue, violet, cosmic gold, storm particles",
    motion: "gravity shifting and slow lift",
    appleUrl: "https://music.apple.com/za/album/enter-aquarius/1682262161",
    spotifyUrl: "",
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      posterImage: "/assets/chambers/enter-aquarius/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/enter-aquarius/background.webm",
      // backgroundVideoMp4: "/assets/chambers/enter-aquarius/background.mp4",
      textureImage: "/assets/chambers/enter-aquarius/texture.webp",
      credit: "Enter Aquarius chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/enter-aquarius/poster.webp",
    },
    visualPrompt:
      "Threshold ritual chamber with electric blue, violet, and cosmic gold weather, slow planetary lift, storm particles, celestial pressure, and a feeling of impermanence and ascent.",
    status: "Main Chamber",
  },
  {
    title: "Soil and Sun",
    year: "2023",
    type: "Album",
    chamber: "Earth Memory Chamber",
    mood: "South African memory, prayer, sunlight, taxis, river, walking, ancestry",
    visual: "dust, amber light, concrete, old photo textures, warm haze",
    motion: "slow, grounded, human",
    appleUrl: "https://music.apple.com/za/album/soil-and-sun/1714215266",
    spotifyUrl: "",
    embedUrl: "https://embed.music.apple.com/za/album/soil-and-sun/1714215266",
    visualAssets: {
      posterImage: "/assets/chambers/soil-and-sun/poster.webp",
      textureImage: "/assets/chambers/soil-and-sun/texture.webp",
      credit: "Soil and Sun chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/soil-and-sun/poster.webp",
    },
    visualPrompt:
      "Warm earth-memory chamber with amber sunlight, dust, concrete, South African transit textures, river-edge prayer, old photo grain, walking routes, taxi-window haze, and ancestral softness.",
    status: "Featured Chamber",
  },
  {
    title: "Songs I Made At Night",
    year: "2024",
    type: "Album",
    chamber: "Nocturnal Reflection",
    mood: "migration, insomnia, private thought, moonlight, inner drift",
    visual: "dark blues, airport glass, laptop glow, night streets",
    motion: "floating, slow, dreamlike",
    appleUrl: "https://music.apple.com/za/album/songs-i-made-at-night/1769362916",
    spotifyUrl: "",
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      posterImage: "/assets/chambers/songs-i-made-at-night/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/songs-i-made-at-night/background.webm",
      // backgroundVideoMp4: "/assets/chambers/songs-i-made-at-night/background.mp4",
      textureImage: "/assets/chambers/songs-i-made-at-night/texture.webp",
      credit: "Songs I Made At Night chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/songs-i-made-at-night/poster.webp",
    },
    visualPrompt:
      "Nocturnal reflection chamber with airport glass, laptop glow, moonlit streets, migration insomnia, deep blue interior drift, private thought, and slow dreamlike motion.",
    status: "Main Chamber",
  },
  {
    title: "Bad Guys Finish Last",
    year: "2025",
    type: "Album",
    chamber: "Shadow Chamber",
    mood: "ego collapse, grief, contradiction, antihero reflection, spiritual consequence",
    visual: "dim ember, wet pavement, cracked glass, rain particles, red-black darkness",
    motion: "heavy, distorted, emotionally dense",
    appleUrl: "https://music.apple.com/za/album/bad-guys-finish-last/1818998518",
    spotifyUrl: "",
    embedUrl: "https://embed.music.apple.com/za/album/bad-guys-finish-last/1818998518",
    visualAssets: {
      posterImage: "/assets/chambers/bad-guys-finish-last/poster.webp",
      textureImage: "/assets/chambers/bad-guys-finish-last/texture.webp",
      credit: "Bad Guys Finish Last chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/bad-guys-finish-last/poster.webp",
    },
    visualPrompt:
      "Shadow chamber with dim ember, wet pavement, cracked glass, rain streaks, red-black darkness, antihero reflection, ego collapse, betrayal, masks, and spiritual consequence.",
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
