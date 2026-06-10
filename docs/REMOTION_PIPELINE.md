# Remotion Cinematic Render Pipeline

Remotion is integrated as an offline video-rendering pipeline for the Cosmicsuprhero Sacred Observatory Archive.

It is not part of the live visitor runtime. The production website still consumes normal web assets from `public/assets`.

## Purpose

Use Remotion to create reviewable cinematic loops from the current observatory and chamber assets:

- Observatory intro loop
- Seven chamber atmosphere loops
- Short visual tests before committing final `.webm`, `.mp4`, or poster assets

## Commands

```bash
npm run remotion:studio
npm run remotion:render:observatory
npm run remotion:render:soil
npm run remotion:render:all
```

Rendered files go to:

```text
renders/
```

The `renders/` folder is intentionally ignored by Git. Only copy a render into `public/assets/...` after it has been reviewed, compressed, credited, and approved for production use.

## Current Compositions

- `observatory-intro`
- `chamber-celestial-multiverse`
- `chamber-stargazing-vol-3`
- `chamber-just-sounds-really`
- `chamber-enter-aquarius`
- `chamber-soil-and-sun`
- `chamber-songs-i-made-at-night`
- `chamber-bad-guys-finish-last`

## Design Standard

Every render should feel:

- cinematic
- sacred
- human
- emotionally authored
- connected to the seven-chamber archive

Avoid:

- generic sci-fi dashboards
- neon cyberpunk
- fast glitch effects
- superhero imagery
- fake luxury-product showrooms
- anything that turns the archive into a template

## Production Flow

1. Render candidate `.mp4` files to `renders/`.
2. Review motion, crop, readability, and emotional fit.
3. Convert approved clips to web formats using FFmpeg:

```bash
ffmpeg -i renders/observatory-intro.mp4 -c:v libvpx-vp9 -b:v 0 -crf 34 -an public/assets/observatory/observatory-intro.webm
ffmpeg -i renders/observatory-intro.mp4 -c:v libx264 -crf 22 -preset slow -an public/assets/observatory/observatory-intro.mp4
ffmpeg -i renders/observatory-intro.mp4 -ss 00:00:01 -vframes 1 public/assets/observatory/observatory-intro-poster.webp
```

4. Update asset credits when a production render is used.
5. Run:

```bash
npm run check
```

## Guardrails

- No runtime AI.
- No browser audio.
- No autoplay audio.
- No 3D/WebGL requirement for the live site.
- No generated render should be committed unless it is production-approved.
