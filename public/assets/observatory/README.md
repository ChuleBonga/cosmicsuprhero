# Observatory Intro Assets

Production cinematic arrival files should live here:

- `observatory-intro.webm`
- `observatory-intro.mp4`
- `observatory-intro-poster.webp`

The site will not request these files until `enabled` is set to `true` in
`src/data/observatoryIntro.ts`. Keep this disabled while assets are missing or watermarked.

For local crop/motion testing only, place watermarked files in:

- `public/assets/observatory/local-test/`

Then run Vite with:

```bash
VITE_OBSERVATORY_INTRO_TEST=true
```

Do not commit watermarked test files.
