# Artist cover palette / real-scene A/B quality review
**Status:** REVIEW-ONLY color / lighting experiment, NOT artist-approved production visuals. 2026-11-12.

## Reason
The official artist-supplied cover has an exceptionally specific palette: uniform cobalt-indigo sky, very large sharp orange-red disk, almost black-blue geological ridges with granular ochre-lit faces, blue-green anatomy and burgundy cloak. The existing Three.js study uses peach/tan terrain, washed stone colors, and a shader sky too dark in some areas. Merely verifying the W0 GLB loads does NOT prove this artwork identity or physical realism.

## Actual A/B test on the same live scene
- **A (existing public look):** `/play/experiments/first-person/index.html?art-review=arrival`.
- **B (candidate):** `/play/experiments/first-person/index.html?art-review=arrival&look=cover`.
- **NPC comparison:** add `&look=cover` to `?art-review=inhabitants`.
- **Default /play:** unchanged. Artwork calibration is enabled only when a **named art-review pose** is requested and the additional `look=cover` flag is explicitly present. This is not an additional visitor experience or a new player choice.

## Changes scoped to B
1. Sky uses sRGB canonical cobalt/indigo and immense orange-red disc with color-space conversion (reduce generic yellow bloom).
2. Ground / cliffs / distant mountains shift from tan/peach/brown to deep blue with localized warm ochre stippling. Geometry, collision and player route remain unchanged.
3. Hemisphere fill is reduced to let directional sunlight model the stone and figure rather than flatten everything. Exposure is modestly lowered; the canonical colors still require GPU screenshot verification.
4. Existing GLB character, entrance, routes, relic, mechanics, music restrictions and pre-save are preserved. No imported external cultural symbols or invented character dialogue.

## What B CANNOT solve
- The 256×256 generated material maps, procedural rock forms and simple character geometry still lack **physically believable scan-quality rock, cloth, skin and mechanical surface detail**.
- No real inhabited settlement or approved social relationships exist. W0 is one anonymous review-only worker, not a population.
- The enormous ring and arch are generic landmarks, not confirmed civilization-specific architectural functions.
- No normal/AO/roughness calibration from photography or actual outdoor lighting reference. Changing a color hex does not give photo-real quality.
- No real physical phone FPS result or approved 1970s film restoration/color pipeline.
- Rejected AI golden-city production infographics are **not approved source art**.

## Gate for deciding
Take two desktop and two 390×844 screenshots **from the actual WebGL scene** with identical camera/pose, before and after palette selection, then compare against the official album artwork. Judge separately (0–5): sky/sun, geological materials, terrain form, architecture, W0 face/garment/anatomy, physical lighting, social life, story consequence and performance. If the new look fails any important item, refine or reject it. Do not promote it to normal visitors from build success alone.

Do not describe this as a finished visual rebuild. It is a bounded, reversible grade/reference-matching test for creative direction.
