# Cosmicsuprhero Asset Pipeline

This document is for making final visual assets outside the website runtime.

Do not run AI models in the browser or on Vercel. Generate, render, compress, review, then ship optimized files.

Use `prompts/visual-direction.md` as the master art-direction spine before generating any new observatory or chamber assets. Use `prompts/chamber-shot-list.md`, `prompts/image-prompts.md`, and `prompts/video-prompts.md` for the final replacement asset passes.

## Output Contract

## Standalone Generation Rule

For generated world plates, always prompt for one asset at a time:

```text
Create ONE standalone cinematic image only.
No collage.
No grid.
No split panels.
No text.
No labels.
No captions.
No watermark.
This is a single website background asset.
```

Do not generate a full asset set as one image. The output must be a final standalone file that can be saved directly and integrated into the site.

## World Plate Manifest

Use these filenames for the first world-plate batch:

```text
public/assets/world-plates/01_observatory_interior.webp
public/assets/world-plates/02_impossible_stairway.webp
public/assets/world-plates/03_soil_and_sun_road.webp
public/assets/world-plates/04_sound_system_speaker.webp
public/assets/world-plates/05_observatory_exterior.webp
public/assets/world-plates/06_nocturnal_archive_room.webp
public/assets/world-plates/07_shadow_chamber.webp
public/assets/world-plates/08_arcturian_artifact.webp
public/assets/world-plates/09_celestial_archive_tower.webp
public/assets/world-plates/10_sparse_sound_object.webp
```

These are reference/worldbuilding plates first. Integrate them into chambers only after visual review and asset-credit entries.

### Observatory Intro

```text
public/assets/observatory/observatory-intro-poster.webp
public/assets/observatory/observatory-intro.webm
public/assets/observatory/observatory-intro.mp4
```

Target:

- 10 to 15 second seamless loop.
- 16:9 master.
- 1920x1080 minimum web export.
- Muted/no audio.
- Dark enough for title readability.
- No text, no logos, no watermark.

### Chamber Background Loop

```text
public/assets/chambers/<slug>/poster.webp
public/assets/chambers/<slug>/texture.webp
public/assets/chambers/<slug>/background.webm
public/assets/chambers/<slug>/background.mp4
```

Target:

- 8 to 12 second loop.
- Subtle atmosphere, not a fake album cover.
- Must not fight body text or Apple embeds.
- Only reference files in `src/data/releases.ts` after they exist.
- Add asset credit data before use.

## Observatory Intro Prompt

Use this as the master keyframe prompt in ComfyUI, Diffusers, Sora, Veo, Blender concept art, or another generation tool:

```text
Create a cinematic website hero frame, 16:9.

A sacred sonic observatory floating between earth memory and cosmic darkness. In the center is an analog signal receiver, not a planet and not a UFO. It has a warm ember core glowing from inside, surrounded by restrained radio-orbit rings, faint coordinate lines, star-map markings, old archive symbols, dust particles, analog static, and dark architectural silhouettes that create foreground depth.

The scene should feel like an old radio observatory, a sacred listening chamber, and a cosmic archive built to preserve human memory through sound.

Visual style:
cinematic realism, dark archive atmosphere, warm ember light, deep black shadows, bronze and charcoal tones, tactile analog materials, subtle African spiritual memory, restrained sacred mood, premium film still, not glossy.

Composition:
central receiver in the middle third, large dark negative space for website text, deep layered background, foreground silhouettes, no clutter.

Avoid:
text, logo, people, superhero imagery, neon cyberpunk, generic galaxy wallpaper, sci-fi dashboard, UFO, spinning planet, fantasy portal, over-glowing effects, luxury showroom, cartoon style, low resolution, watermark.
```

Animation prompt:

```text
Animate this image into a seamless 10-second cinematic website hero loop.

Motion:
very slow camera drift forward into the observatory, subtle ember breathing in the central signal receiver, radio rings rotating gently, dust and archive particles drifting slowly, faint coordinate lines shifting softly, deep shadows moving slightly like atmospheric haze.

Keep the scene restrained, sacred, cinematic, dark, and human. It should feel like entering a sonic observatory, not watching a sci-fi effect.

No text. No logo. No people. No audio. No fast movement. No zoom jumps. No glitch overload. No spinning planet. No neon cyberpunk.

Make the first and last frame match as closely as possible so the loop feels seamless.
```

## Chamber Loop Directions

### Soil and Sun

Warm, dusty, grounded, human.

```text
Amber sunlight, dust, concrete, taxi-window warmth, river prayer, old photo grain, South African transit memory, soft heat, tactile ground. No cliche, no flag imagery, no fake album cover.
```

### Bad Guys Finish Last

Dark, fractured, cinematic, heavy, warm underneath.

```text
Red-black shadow chamber, rain, cracked glass, wet pavement, ember glow, damaged transmission, spiritual consequence, antihero reflection. Not horror, not cyberpunk, not glossy.
```

### Songs I Made At Night

Night, migration, private thought.

```text
Blue-black nocturnal chamber, airport glass, laptop glow, soft window reflections, moonlit streets, insomnia, migration, inner drift. Dreamlike but grounded, no neon overload.
```

### Enter Aquarius

Threshold, ascent, celestial weather.

```text
Violet-blue threshold ritual, cosmic gold accents, storm particles, gravity shifting, slow ascent, spiritual weather. Restrained and cinematic, not generic sci-fi.
```

### Celestial Multiverse

Cosmological expansion and archive scale.

```text
Antique star maps, telescope glass, deep space, floating archive cards, inherited memory fragments, signal interruptions, cosmic scale with human warmth. No galaxy wallpaper.
```

### Stargazing, Vol. 3

Intimate star field, suspension, observation.

```text
Quiet blue-black sky, sparse distant lights, suspended night air, soft constellations, lonely but peaceful, observational. Minimal cosmic warmth, not huge space art.
```

### Just Sounds Really

Sparse sound object, residue, restraint.

```text
Minimal sound object room, blank dark material, quiet signal lines, waveform residue, tactile texture, small pulses, experimental but human. Less mythic than other chambers.
```

## FFmpeg Preparation

Use the helper script for the observatory intro:

```powershell
.\scripts\prepare-observatory-intro.ps1 -InputVideo "C:\path\to\clean-observatory-loop.mp4"
```

Manual commands:

```powershell
ffmpeg -i public\assets\observatory\observatory-intro.mp4 -c:v libvpx-vp9 -b:v 0 -crf 34 -an public\assets\observatory\observatory-intro.webm
ffmpeg -i public\assets\observatory\observatory-intro.mp4 -ss 00:00:01 -vframes 1 public\assets\observatory\observatory-intro-poster.webp
```

## Production Review Checklist

- No watermark.
- No text baked into video.
- No audio track needed.
- Good crop at desktop and 390px mobile.
- Text remains readable with current veil.
- Poster frame looks strong in reduced-motion mode.
- File sizes are reasonable.
- `npm run build` passes.
- Vercel preview loads without failed asset requests.

## Credit Language

For generated/owned project assets:

```ts
credit: "Observatory intro visuals generated for Cosmicsuprhero",
license: "Owned/generated project asset",
sourceUrl: "/assets/observatory/observatory-intro-poster.webp",
```

Only use "public domain" or "Creative Commons" if the exact source really is public domain or CC and is recorded in `src/data/assetCredits.ts`.
