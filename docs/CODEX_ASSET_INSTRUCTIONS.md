# Codex Integration Instructions — Cosmicsuprhero Assets

These assets are for the Cosmicsuprhero Sacred Observatory Archive website.
They are generated cinematic assets. Do not describe them as documentary photography.

## Where to copy
Copy the `public/assets` folder into the existing project root so paths resolve like:

```txt
/public/assets/observatory/observatory-entry-hero.webp
/public/assets/chambers/soil-and-sun/soil-and-sun-hero.webp
```

## Required code updates

1. Extend the chamber/release model to support:

```ts
visualAssets?: {
  heroImage?: string;
  secondaryImage?: string;
  artifactImage?: string;
  textureImage?: string;
  credit?: string;
  generationNote?: string;
};
visualPrompt?: string;
```

2. Add or update `ChamberVisualLayer.tsx` so it:
- renders `visualAssets.heroImage` when available
- renders CSS atmosphere when missing
- supports `secondaryImage` or `artifactImage` only where the design already has room for it
- uses `object-fit: cover`
- uses dark overlays for text readability
- lazy-loads non-hero images
- avoids horizontal overflow
- respects reduced motion

3. Add/update `ObservatoryIntroVideo.tsx` or hero visual layer so the entry hero can use:

```txt
/assets/observatory/observatory-entry-hero.webp
```

as a poster/background fallback before video exists.

## Chamber mapping

- Observatory entry hero: `/assets/observatory/observatory-entry-hero.webp`
- Observatory console portrait: `/assets/observatory/observatory-console-portrait.webp`
- Observatory exterior: `/assets/observatory/observatory-exterior.webp`
- Soil and Sun hero: `/assets/chambers/soil-and-sun/soil-and-sun-hero.webp`
- Soil and Sun walk: `/assets/chambers/soil-and-sun/soil-and-sun-walk.webp`
- Soil and Sun speaker artifact: `/assets/chambers/soil-and-sun/sound-system-speaker.webp`
- Bad Guys Finish Last hero: `/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp`
- Bad Guys Finish Last portrait: `/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-portrait.webp`
- Songs I Made At Night hero: `/assets/chambers/songs-i-made-at-night/songs-i-made-at-night-hero.webp`
- Songs I Made At Night portrait: `/assets/chambers/songs-i-made-at-night/nocturnal-portrait.webp`
- Enter Aquarius hero: `/assets/chambers/enter-aquarius/enter-aquarius-hero.webp`
- Enter Aquarius portrait: `/assets/chambers/enter-aquarius/enter-aquarius-portrait.webp`
- Celestial Multiverse hero: `/assets/chambers/celestial-multiverse/celestial-multiverse-hero.webp`
- Arcturian artifact: `/assets/chambers/celestial-multiverse/arcturian-artifact.webp`
- Stargazing Vol. 3 hero: `/assets/chambers/stargazing-vol-3/stargazing-vol-3-hero.webp`
- Just Sounds Really hero: `/assets/chambers/just-sounds-really/just-sounds-really-hero.webp`
- Open Graph image: `/assets/og/cosmicsuprhero-og.webp`

## Visual rule

Human documentary realism in the foreground.
Impossible sacred architecture in the background.

Avoid generic sci-fi, cyberpunk clichés, superhero aesthetics, neon overload, glossy AI fantasy, corporate portfolio styling.

## Verification

Run:

```bash
npm run build
```

Check:
- no failed image requests
- mobile crops feel intentional
- text remains readable over images
- reduced motion still works
- no horizontal overflow
