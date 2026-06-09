# Observatory Intro Assets

Production cinematic arrival files should live here:

- `observatory-intro.webm`
- `observatory-intro.mp4`
- `observatory-intro-poster.webp`

The site currently uses `observatory-entry-hero.webp` as a production-safe static poster/background. Do not wire `observatory-intro.webm` or `observatory-intro.mp4` into `src/data/observatoryIntro.ts` until clean, non-watermarked loops exist.

For local crop/motion testing only, place watermarked files in:

- `public/assets/observatory/local-test/`

Then run Vite with:

```bash
VITE_OBSERVATORY_INTRO_TEST=true
```

Do not commit watermarked test files.
