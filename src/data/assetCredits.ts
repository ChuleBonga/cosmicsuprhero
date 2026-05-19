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
    creator: "Cosmicsuprhero / Codex-generated procedural visual asset",
    license: "Owned/generated project asset",
    notes:
      "Generated locally for the Soil and Sun chamber. Not sourced from third-party copyrighted imagery.",
  },
  {
    title: "Soil and Sun Dust Texture",
    source: "public/assets/chambers/soil-and-sun/texture.webp",
    sourceUrl: "/assets/chambers/soil-and-sun/texture.webp",
    creator: "Cosmicsuprhero / Codex-generated procedural visual asset",
    license: "Owned/generated project asset",
    notes:
      "Generated locally for the Soil and Sun chamber. Not sourced from third-party copyrighted imagery.",
  },
];
