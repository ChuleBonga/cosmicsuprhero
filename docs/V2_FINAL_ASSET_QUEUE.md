# v2 Final Asset Queue

This queue separates public-safe integration assets from final visual-lock assets.

The live site should keep using optimized static files only. New images and videos are produced offline, reviewed, exported, then wired into `visualAssets`.

## Readiness Terms

- `production`: safe final asset.
- `candidate`: public-safe asset that works in layout, but may still be replaced by a stronger final plate.
- `temporary`: useful for testing, but should not be treated as final art direction.

## Immediate Replacements

1. **Just Sounds Really hero**
   - Current site uses the procedural poster/texture atmosphere instead of the v0.1 hero plate.
   - Reason: the v0.1 hero image contains contact-sheet/source residue.
   - Replacement target: clean standalone sparse sound-object room, no labels, no grid, no text.

2. **Celestial Multiverse hero**
   - Current plate is public-safe as a low-opacity card atmosphere, but should be replaced before final visual lock.
   - Replacement target: single cinematic archive-scale world plate, antique star maps, warm human memory, no generic galaxy wallpaper.

3. **Identity-controlled character plates**
   - Soil and Sun walk
   - Bad Guys Finish Last shadow portrait
   - Songs I Made At Night nocturnal portrait
   - Enter Aquarius threshold portrait
   - Celestial Multiverse archive portrait

## Production Intro

The clean observatory video loop is still the biggest worldbuilding unlock.

Expected files:

```text
public/assets/observatory/observatory-intro-poster.webp
public/assets/observatory/observatory-intro.webm
public/assets/observatory/observatory-intro.mp4
```

Do not enable production video in `src/data/observatoryIntro.ts` until all clean files exist and are verified.

## Crop Control

Every chamber can now define:

```ts
focusPosition: "50% 50%",
mobileFocusPosition: "50% 50%",
readiness: "candidate",
replacementNote: "What should be regenerated and why."
```

Use those fields before editing component code. The goal is to make v2 asset swaps data-driven.
