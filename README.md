# Cosmicsuprhero Sonic Observatory

Official first-version website for Cosmicsuprhero: a chamber-based music archive where each release is treated as an emotional room, not a conventional discography card.

Live site: https://cosmicsuprhero.vercel.app/

## Current Foundation

- React + Vite
- Tailwind CSS
- Framer Motion
- iframe-based listening embeds
- local chamber visual assets
- no backend, runtime AI, 3D dependency, or paid external service

## Chamber System

- Soil and Sun: earth, memory, warmth
- Bad Guys Finish Last: shadow, fracture, consequence
- Songs I Made At Night: night, migration, private thought
- Enter Aquarius: threshold, ascension, celestial weather
- Celestial Multiverse: cosmological expansion, archive scale
- Stargazing, Vol. 3: intimate star field, suspension, observation
- Just Sounds Really: sparse sound object, residue, restraint

## Local Development

On Windows PowerShell, use `npm.cmd` if script execution blocks `npm`.

```bash
npm install
npm.cmd run dev
npm.cmd run build
npm.cmd run check
```

`npm.cmd run check` validates referenced public assets and then runs the production build.

## Asset Notes

Chamber assets live in `public/assets/chambers/`. Every visual asset used by the site should be tracked in `src/data/assetCredits.ts` before it is referenced in `src/data/releases.ts`.

Accepted asset sources:

- owned Cosmicsuprhero assets
- generated project assets owned by the artist/project
- public domain assets
- Creative Commons assets with accurate credit and license notes

The current generated cinematic pack is integrated for crop, atmosphere, and layout QA. Treat these images as generated project assets, not documentary photography. Some are temporary integration plates and are intentionally documented for later replacement with cleaner standalone character/world images.

Chamber crop and readiness controls live in `src/data/releases.ts`. Use `focusPosition`, `mobileFocusPosition`, `readiness`, and `replacementNote` before editing components for asset swaps.

## Production Planning

- Final product roadmap: `docs/FINAL_PRODUCT_ROADMAP.md`
- v2 final asset queue: `docs/V2_FINAL_ASSET_QUEUE.md`
- Offline asset pipeline: `docs/ASSET_PIPELINE.md`
- Chamber shot list: `prompts/chamber-shot-list.md`
- Image prompts: `prompts/image-prompts.md`
- Video prompts: `prompts/video-prompts.md`
- Observatory intro prep helper: `scripts/prepare-observatory-intro.ps1`
