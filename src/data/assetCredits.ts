export type AssetCredit = {
  title: string;
  source: string;
  sourceUrl: string;
  creator: string;
  license: string;
  notes: string;
};

// Phase 2: add public-domain or Creative Commons visual assets here as they are sourced.
// Keep every visual file traceable before using it in a chamber's visualAssets field.
export const assetCredits: AssetCredit[] = [
  {
    title: "Soil and Sun Poster Atmosphere",
    source: "public/assets/chambers/soil-and-sun/poster.webp",
    sourceUrl: "/assets/chambers/soil-and-sun/poster.webp",
    creator: "Codex for Cosmicsuprhero",
    license: "Project-owned generated asset",
    notes:
      "Procedural amber sunlight, concrete shadow, and old-photo warmth generated locally for the Soil and Sun chamber.",
  },
  {
    title: "Soil and Sun Dust Texture",
    source: "public/assets/chambers/soil-and-sun/texture.webp",
    sourceUrl: "/assets/chambers/soil-and-sun/texture.webp",
    creator: "Codex for Cosmicsuprhero",
    license: "Project-owned generated asset",
    notes:
      "Procedural dust and earth texture overlay generated locally for subtle warmth and tactile grain.",
  },
];
