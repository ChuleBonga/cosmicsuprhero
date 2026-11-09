# Arcturian Awakening / Original surface materials v1

## Purpose
Replace on-device 256×256 procedural CanvasTexture generation with a deterministic, reproducible **offline** texture bake. This improves the actual material data available for normal/roughness lighting while removing startup computation and a source of garbage collection.

**Four material families:** basalt (cobalt-blue rock), ochre (sun-weathered sediment), oxide (aged metal), and mineral (First Contact stone). These are new original procedural assets, not scans and not reconstructions of copyrighted game textures.

## Exact output contract
Run in `game-walk/`:

```bash
npm run bake:materials
npm run test:materials
npm run build
```

The source is `scripts/bake-first-person-materials.mjs`; the reproducible artifact location is `public/first-person-materials/`.

For each named family the generator writes:
- `*_basecolor.png` — 512×512 PNG in sRGB (color map).
- `*_normal.png` — 512×512 PNG in **linear tangent-space normal** encoding.
- `*_orm.png` — 512×512 PNG in linear data encoding, with Red = approximate occlusion, Green = roughness, Blue = metalness.
- `manifest.json` — family metrics, exact SHA-256 checksums, byte sizes and attribution.

Total: **12 generated images**, 512×512. Uses periodic multi-frequency value noise, warped sedimentary bands, faults, surface pores and age gradients. UV borders are made continuous, and the tests inspect seams and color/normal/roughness contrast. Materials are generated at build time and served as static assets, with no image synthesizer in the browser.

### Physical material setup
Three.js `map` uses sRGB; `normalMap` and `roughnessMap` remain linear. The same ORM image is used as `metalnessMap` for oxidized material surfaces, using Three.js channel conventions.

Terrain uses a separate texture instance with far more UV tiling than original architectural meshes, so repeating the walking surface does **not** inadvertently change detail scale on the First Contact artifact or plinth.

**Important:** These are artist-authored synthetic materials and will not pass photogrammetric realism by themselves. They are a production capability, not proof of final art direction.

## Resource accounting
The generated material pack is checked separately from the earlier Phaser game's initial JS/CSS/HTML estimate.
- Max pack size: **5,000,000 source PNG bytes**, enforced by `scripts/check-budget.mjs`.
- One map size <= **1,500,000 bytes**, enforced by `test:materials`.
- Production WebGL runtime uses uncompressed GPU upload textures with possible mip overhead. These numbers **do not indicate VRAM use**.
- All materials currently load on initial world construction. Streaming by route, KTX2/BasisU transcoding, and shader/material sharing can further reduce load and memory, but have not yet been implemented or validated.
- `?perf` observes frame cadence, draw calls and triangle estimates, not GPU frame timings.

## Review workflow
- Game: `/play/experiments/first-person/index.html`
- WebGL-free material board: `/play/experiments/first-person/materials.html` (original color/normal/ORM maps shown separately and as repeating tile previews)

These paths exist on the isolated Vercel game-preview branch. **Never merge to the live artist website without checking the final material response under actual sunlight, the real camera, real mobile GPU performance and the artist's approval.**

## Remaining release gates
1. Visually inspect generated material maps, then evaluate naturalism under the real in-game cobalt/orange lighting. The CGI-quality or aesthetic approval is not guaranteed by passing tests.
2. Add real unique weathering for hero props, painted edge damage, authored roughness and UV seams, and atlas/mesh optimization. Bake sculpted hi-poly surface normals where relevant.
3. Replace PNGs with compressed KTX2 texture variants only after real device compatibility and memory/performance profiling.
4. Verify volume and timing for the existing `Awaken Now` loop, which still only plays after the visitor enters the separate preview; the main site intentionally excludes game audio.
5. Run 60 FPS tests with named desktop/phone hardware, recording mean/p95 frame times, internal resolution, frame rates and any fallbacks.
