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
export const assetCredits: AssetCredit[] = [];
