# Observatory Intro Assets

Production cinematic arrival files should live here:

- `observatory-intro.webm`
- `observatory-intro.mp4`
- `observatory-intro-poster.webp`

The site currently uses `observatory-entry-worldplate.webp` as a production-safe static poster/background. Do not wire `observatory-intro.webm` or `observatory-intro.mp4` into `src/data/observatoryIntro.ts` until clean, non-watermarked loops exist.

Candidate stills:

- `observatory-entry-worldplate.webp` is the v0.2 approved temporary Entry Signal / Observatory world plate.
- `signal-listener-portrait.webp` is the v0.2 approved likeness test for The Vessel / narrator / Observatory portrait.
- `signal-listener-wide-01.webp` and `signal-listener-wide-02.webp` are temporary Observatory-only context images.
- `signal-listener-portrait.png` is an observatory / signal-listener identity candidate. It was rejected for Soil and Sun because it remains indoors and observatory-coded. Do not use it as a Soil and Sun chamber asset.

For local crop/motion testing only, place watermarked files in:

- `public/assets/observatory/local-test/`

Then run Vite with:

```bash
VITE_OBSERVATORY_INTRO_TEST=true
```

Do not commit watermarked test files.
