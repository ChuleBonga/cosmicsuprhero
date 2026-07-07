export type ReleaseStatus = "Main Chamber" | "Featured Chamber" | "Latest Transmission";

export type ReleaseTrack = {
  id: string;
  trackNumber: number;
  title: string;
  duration?: string;
  audioSrc?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  isPreviewOnly?: boolean;
  isAudioPending?: boolean;
  notes?: string;
  fieldNote?: string;
  atmosphereCue?: string;
  visualCue?: string;
};

export type ReleaseAmbience = {
  src?: string;
  label?: string;
  description?: string;
  volume?: number;
};

export type ReleaseUISoundProfile = {
  hover?: string;
  select?: string;
  enter?: string;
  return?: string;
  fieldNoteOpen?: string;
  playbackStart?: string;
  playbackPause?: string;
};

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
  readiness?: "production" | "candidate" | "temporary";
  replacementNote?: string;
  focusPosition?: string;
  mobileFocusPosition?: string;
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
  signalPhrase?: string;
  sonicIdentity?: string;
  shortDescription?: string;
  shortVisualDescription?: string;
  longArchiveNote?: string;
  ambience?: ReleaseAmbience;
  uiSoundProfile?: ReleaseUISoundProfile;
  description?: string;
  tracklist?: string[];
  tracks?: ReleaseTrack[];
  chamber: string;
  mood: string;
  visual: string;
  motion: string;
  appleUrl: string;
  spotifyUrl: string;
  externalLinks?: {
    appleMusic?: string;
    spotify?: string;
    youtube?: string;
    platformHub?: string;
  };
  platformLinks?: {
    appleMusic?: string;
    spotify?: string;
    youtube?: string;
    platformHub?: string;
  };
  iframeEmbeds?: {
    appleMusic?: string;
  };
  embedUrl?: string;
  visualAssets?: ReleaseVisualAssets;
  visualPrompt?: string;
  videoPrompt?: string;
  generationNote?: string;
  assetCredit?: {
    credit?: string;
    license?: string;
    sourceUrl?: string;
  };
  status: ReleaseStatus;
};

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

function slugifyTrack(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createPendingTracks(releaseSlug: string, titles: string[], atmosphereCue: string): ReleaseTrack[] {
  return titles.map((title, index) => ({
    id: `${releaseSlug}-${slugifyTrack(title)}`,
    trackNumber: index + 1,
    title,
    audioSrc: "",
    youtubeUrl: "",
    spotifyUrl: "",
    appleMusicUrl: "",
    isPreviewOnly: false,
    isAudioPending: true,
    notes: "Artist-owned audio file pending for native archive playback.",
    fieldNote: "Artist-owned archive audio pending.",
    atmosphereCue,
    visualCue: atmosphereCue,
  }));
}

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
    signalPhrase: "Memory expands until the archive becomes a sky.",
    shortVisualDescription: "Antique star maps, telescope glass, and inherited archive scale.",
    longArchiveNote:
      "Celestial Multiverse is the first room where the archive becomes larger than the body. It should feel warm at cosmic scale, like inherited memory refusing to stay local.",
    ambience: {
      label: "Archive orbit pending",
      description: "A future low room tone of glass hum, distant dust, and soft coordinate drift.",
    },
    uiSoundProfile: {
      hover: "soft-orbit",
      enter: "archive-open",
      playbackStart: "signal-rise",
    },
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
      readiness: "temporary",
      replacementNote: "Replace with a cleaner single world plate before final visual lock.",
      focusPosition: "50% 52%",
      mobileFocusPosition: "50% 50%",
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
    signalPhrase: "The sky gets close when the room gets quiet.",
    shortVisualDescription: "Blue-black suspension, distant lights, and quiet observational space.",
    longArchiveNote:
      "Stargazing, Vol. 3 should not compete with the larger cosmic chambers. Its power is distance made intimate: sparse points, held breath, and a night field that listens back.",
    ambience: {
      label: "Quiet star field pending",
      description: "A future restrained air bed with distant night texture and sparse signal points.",
    },
    uiSoundProfile: {
      hover: "distant-point",
      enter: "quiet-threshold",
      playbackStart: "low-star",
    },
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
      readiness: "candidate",
      focusPosition: "50% 45%",
      mobileFocusPosition: "50% 50%",
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
    signalPhrase: "Leave only the sound, then listen to what remains.",
    shortVisualDescription: "A sparse object room with one beam, waveform residue, and dark material.",
    longArchiveNote:
      "Just Sounds Really is the discipline chamber. It should resist spectacle. The room is nearly empty because the sound itself is the object.",
    ambience: {
      label: "Minimal residue pending",
      description: "A future almost-silent room tone with tiny waveform ticks and air around one object.",
    },
    uiSoundProfile: {
      hover: "micro-pulse",
      enter: "dry-click",
      playbackStart: "single-line",
    },
    description: "A stripped room where sound is treated as an object before mythology arrives.",
    appleUrl: "https://music.apple.com/za/album/just-sounds-really/1658052127",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/just-sounds-really/1658052127",
    },
    // Add the official iframe embed URL here when this chamber becomes a full room.
    embedUrl: "",
    visualAssets: {
      posterImage: "/assets/chambers/just-sounds-really/poster.webp",
      // backgroundVideoWebm: "/assets/chambers/just-sounds-really/background.webm",
      // backgroundVideoMp4: "/assets/chambers/just-sounds-really/background.mp4",
      textureImage: "/assets/chambers/just-sounds-really/texture.webp",
      credit: "Just Sounds Really chamber atmosphere generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/just-sounds-really/poster.webp",
      generationNote:
        "Using the procedural atmosphere for now because the v0.1 hero plate contains contact-sheet residue and should be regenerated.",
      readiness: "temporary",
      replacementNote: "Regenerate as a clean standalone sparse sound-object room with no labels, no grid, and no contact-sheet residue.",
      focusPosition: "50% 50%",
      mobileFocusPosition: "50% 50%",
    },
    visualPrompt:
      "Minimal experimental sound-object room with blank dark space, faint analog signal lines, soft waveform sculptures, paper texture, and tiny pulsing details that feel tactile and stripped down.",
    videoPrompt:
      "A nearly still sound object under one beam of light with faint signal-line pulses and slow dust.",
    assetCredit: {
      credit: "Just Sounds Really chamber atmosphere generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/just-sounds-really/poster.webp",
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
    signalPhrase: "The pressure changes before the crossing appears.",
    shortVisualDescription: "Violet-blue concrete, gold weather, and slow gravity shift.",
    longArchiveNote:
      "Enter Aquarius is the crossing room. It should feel like concrete discovering weather: spiritual pressure, violet lift, and the moment before an old self loses gravity.",
    ambience: {
      label: "Threshold weather pending",
      description: "A future faint storm bed with violet pressure, gold shimmer, and slow lift.",
    },
    uiSoundProfile: {
      hover: "threshold-glint",
      enter: "gravity-shift",
      playbackStart: "pressure-rise",
    },
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
      readiness: "candidate",
      focusPosition: "48% 48%",
      mobileFocusPosition: "48% 50%",
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
    signalPhrase: "The body remembers the road before the mind explains it.",
    shortVisualDescription: "Amber dust, road heat, transit memory, and ordinary sunlight made sacred.",
    longArchiveNote:
      "Soil and Sun is the human gravity center of the archive. It should stay outside, grounded, and warm: walking, taxis, dust, prayer, sunlight, and body memory without decorative cliche.",
    ambience: {
      label: "Earth room tone pending",
      description: "A future low bed of road air, soft dust, distant transit, and warm outdoor room tone.",
    },
    uiSoundProfile: {
      hover: "dust-rise",
      enter: "sun-warmth",
      fieldNoteOpen: "paper-soft",
      playbackStart: "road-breath",
    },
    description: "A warm archive of movement, prayer, soil, sunlight, and the sound of becoming human.",
    appleUrl: "https://music.apple.com/za/album/soil-and-sun/1714215266",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/soil-and-sun/1714215266",
    },
    embedUrl: "https://embed.music.apple.com/za/album/soil-and-sun/1714215266",
    iframeEmbeds: {
      appleMusic: "https://embed.music.apple.com/za/album/soil-and-sun/1714215266",
    },
    tracklist: trackJourney,
    tracks: createPendingTracks("soil-and-sun", trackJourney, "warm-dust"),
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
      readiness: "candidate",
      focusPosition: "52% 50%",
      mobileFocusPosition: "50% 50%",
    },
    visualPrompt:
      "Warm earth-memory chamber with amber sunlight, dust, concrete, South African transit textures, river-edge prayer, old photo grain, walking routes, taxi-window haze, and ancestral softness.",
    videoPrompt:
      "Slow dust movement, amber sunlight breathing across concrete, road heat shimmer, taxi-window glow, and river-prayer softness.",
    generationNote:
      "Final Soil and Sun character-led hero image is still pending. Current imagery is candidate/fallback atmosphere until a clean outdoor walking photograph preserves likeness.",
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
    signalPhrase: "The private self becomes audible after midnight.",
    shortVisualDescription: "Blue-black room, window glass, laptop glow, and migration thought.",
    longArchiveNote:
      "Songs I Made At Night is the room behind the glass. It should feel private, not performative: desk light, city distance, insomnia, migration, and the self speaking quietly.",
    ambience: {
      label: "Nocturnal room tone pending",
      description: "A future dark air bed with laptop hum, distant city tone, and soft window reflection.",
    },
    uiSoundProfile: {
      hover: "window-glow",
      enter: "night-door",
      playbackStart: "private-hum",
    },
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
      readiness: "candidate",
      focusPosition: "50% 48%",
      mobileFocusPosition: "50% 50%",
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
    signalPhrase: "Consequence is delayed truth arriving in the room.",
    shortVisualDescription: "Red-black pressure, wet concrete, cracked glass, and ember under shadow.",
    longArchiveNote:
      "Bad Guys Finish Last is the chamber of pressure and consequence. It should feel damaged but not theatrical horror: rain, masks, contradiction, grief, and warmth surviving underneath.",
    ambience: {
      label: "Shadow pressure pending",
      description: "A future low damaged-transmission bed with rain pressure, red ember, and corridor air.",
    },
    uiSoundProfile: {
      hover: "cracked-glass",
      enter: "red-pressure",
      fieldNoteOpen: "damaged-paper",
      playbackStart: "ember-hit",
    },
    description: "A damaged transmission about ego, betrayal, divine timing, masks, contradiction, and transformation.",
    appleUrl: "https://music.apple.com/za/album/bad-guys-finish-last/1818998518",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/bad-guys-finish-last/1818998518",
    },
    embedUrl: "https://embed.music.apple.com/za/album/bad-guys-finish-last/1818998518",
    iframeEmbeds: {
      appleMusic: "https://embed.music.apple.com/za/album/bad-guys-finish-last/1818998518",
    },
    visualAssets: {
      heroImage: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp",
      secondaryImage: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-portrait.webp",
      posterImage: "/assets/chambers/bad-guys-finish-last/poster.webp",
      textureImage: "/assets/chambers/bad-guys-finish-last/texture.webp",
      credit: "Bad Guys Finish Last chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
      readiness: "candidate",
      focusPosition: "50% 50%",
      mobileFocusPosition: "52% 50%",
    },
    visualPrompt:
      "Shadow chamber with dim ember, wet pavement, cracked glass, rain streaks, red-black darkness, antihero reflection, ego collapse, betrayal, masks, and spiritual consequence.",
    videoPrompt:
      "Rain drifting across red-black wet concrete, cracked glass light shifting, ember pulse under shadow, and slow damaged-transmission pressure.",
    generationNote:
      "Final chamber hero should be regenerated as a single standalone shadow portrait/world plate with no contact-sheet residue and no fake album-cover look.",
    assetCredit: {
      credit: "Bad Guys Finish Last chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp",
    },
    status: "Latest Transmission",
  },
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
  {
    slug: "game-dev-chamber",
    title: "Game Dev Chamber",
    year: "2025",
    type: "Album",
    chamber: "Interactive Creation",
    mood: "iterative, playful, experimental, systemic",
    visual: "floating code blocks, interactive sliders, visible collision shapes, parameter dials",
    motion: "playful, iterative, responsive",
    chamberRole: "Interactive creation chamber",
    emotionalIdentity: "iteration, playfulness, systems thinking, emergence",
    visualLanguage: "code as visible objects, interactive parameters, collision geometry, feedback loops",
    motionLanguage: "rapid iteration, responsive feedback, playful experimentation",
    frequencyTags: ["Iteration", "Play", "Systems", "Emergence"],
    signalPhrase: "Change the rules and see what plays back.",
    shortVisualDescription: "Floating code, interactive sliders, visible collision shapes.",
    longArchiveNote:
      "The Game Dev Chamber is a space where creation is immediate and tangible. Code becomes visible objects, rules become sliders you can turn, and collisions become visible shapes you can reshape in real time. It\'s a playground for understanding how games work from the inside out.",
    ambience: {
      label: "Iteration loop pending",
      description: "A future tight loop of keyboard clicks, soft notification chimes, and the hum of rapid recompilation.",
    },
    uiSoundProfile: {
      hover: "code-hover",
      enter: "rule-change",
      playbackStart: "compile-start",
    },
    description: "An interactive chamber where game development concepts become tangible and playable.",
    appleUrl: "https://music.apple.com/za/album/game-dev-chamber/placeholder",
    spotifyUrl: "",
    externalLinks: {
      appleMusic: "https://music.apple.com/za/album/game-dev-chamber/placeholder",
    },
    embedUrl: "",
    iframeEmbeds: {
      appleMusic: "https://embed.music.apple.com/za/album/game-dev-chamber/placeholder",
    },
    visualAssets: {
      heroImage: "/assets/chambers/game-dev-chamber/game-dev-chamber-hero.webp",
      secondaryImage: "/assets/chambers/game-dev-chamber/game-dev-chamber-portrait.webp",
      posterImage: "/assets/chambers/game-dev-chamber/poster.webp",
      textureImage: "/assets/chambers/game-dev-chamber/texture.webp",
      credit: "Game Dev Chamber chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/game-dev-chamber/game-dev-chamber-hero.webp",
      generationNote: "Generated cinematic asset; use as mythic archive imagery, not documentary photography.",
      readiness: "candidate",
      focusPosition: "50% 50%",
      mobileFocusPosition: "50% 50%",
    },
    visualPrompt:
      "Interactive creation chamber with floating code blocks, visible collision shapes, interactive parameter sliders, and playful experimentation elements.",
    videoPrompt:
      "Floating code blocks rearranging themselves, collision shapes responding to parameter changes, and playful iterations of game mechanics.",
    assetCredit: {
      credit: "Game Dev Chamber chamber visuals generated for Cosmicsuprhero",
      license: "Owned/generated project asset",
      sourceUrl: "/assets/chambers/game-dev-chamber/game-dev-chamber-hero.webp",
    },
    status: "Main Chamber",
