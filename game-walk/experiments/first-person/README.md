# Arcturian Awakening — The Sunward Causeway (first-person study)

**Status:** isolated, early 3D scene / **not** approved final artwork / **not** a playable five-minute production game.

## Canonical product brief
- One uninterrupted, approximately five-minute first-person story. The **visitor is the character**.
- End in an emotionally earned invitation to pre-save the album; pre-save must also be accessible at any point.
- **Awaken Now** is the game's theme. No additional album tracks are required to play; song titles may inform meaningful discoverable objects.
- No 16 chapters, survival mechanics, forced item collection, compulsory puzzles, or copied Silent Hill/Resident Evil content.
- Original visual identity: cobalt and indigo sky, huge red-orange sun, deep blue mountains, ochre sun illumination, ancient coherent planetary architecture, authentic geology and material response.
- Quality acceptance: 60 FPS **measured on named target hardware**, with frame-time 95th percentile at or below 16.67 ms under test conditions. Dynamic resolution may be necessary and should be disclosed.
- No public music uploads until licensing/artist approval for the exact web cue and excerpt.

## What has been built here
- Native, browser-executed Three.js 3D scene (no remote GPU or video impostor).
- Procedural actual terrain mesh, coherent canyon boundaries, layered geological faces, distant peak geometry, shared PBR-style procedural material maps, instanced stones, two original monumental gateway configurations, red-orange sun sky shader and distance fog.
- First-person walking with fixed 60 Hz simulation, terrain normals/slope threshold, acceleration/braking normalized for diagonals, hard path boundaries and a physical circular relic collider.
- Real 3D artifact geometry plus physically continuous object inspection: when near and facing the relic, press E or tap Inspect; the inspected model is a clone of the world model, rotated by mouse/touch.
- Desktop WASD and mouse look; coarse-pointer mobile directional pad and drag look; accessible text and focusable controls; pause/restart, safe direct pre-save link, graceful WebGL error copy.
- Optional `?perf` frame-time overlay showing observed mean/p95, draw calls, triangle count, render scale, and world position. The overlay is **not GPU profiling**. Render scale may reduce if measured frame pacing is poor.
- Regression tests in `world-logic.test.mjs` with deterministic 30/60/120 Hz scheduling equivalence, ground and slope validity, boundaries, braking, normalized diagonal travel, inspect proximity/facing, item collision and a single end location.

## Preview route
`/play/experiments/first-person/index.html` (only when this branch is deployed).
No homepage link and no merge to `main` without visual and control acceptance.

## Known limitations — not negotiable
1. **Visual quality not passed.** The geometry is procedurally authored and still lacks photogrammetric source quality, unique sculpted ornament, optimized cinematic textures, detailed surfacing, realistic object transitions, compositional camera review and lighting calibration. A successful build is not a believable AAA-quality frame.
2. **Five-minute journey not built.** This is a shorter exploratory route with one inspectable object and draft prose; the narrative sequence, real emotional reveal, physical artifact semantics, pacing and music score need artist direction and completion.
3. **60 FPS not measured.** Vercel build success, motion tests, and HTTP 200 checks say nothing about steady GPU performance. The browser preview is not visually tested on desktop or physical mobile hardware.
4. **Controller is custom kinematic movement**, not Rapier. In-world base collision uses a circular exclusion zone, so true architectural collision, step and slope penetration, player-ground contact events and ground material responses remain future work.
5. **No authored audio in this build.** Awaken Now is reserved as the score but no approved audio master, public excerpt, cue transitions or spatial sound files have been added.
6. Current texture generation uses 256² CPU canvas maps in the browser. Replace with authored/baked materials and compressed exports after visual acceptance.
7. Procedural 3D may be too expensive in shadowed views on low-end hardware; optimize with merged geometry, instancing, selective light baking, LOD/culling and KTX2/mesh compression where profiling indicates value.

## Build and validation
```sh
cd game-walk
npm ci
npm run test:first-person
npm run build
```
The complete game build must also retain the existing independent Phaser game, the original movement lab and the main album landing. Deployment on a feature branch produces two independent Vercel previews. Neither is equivalent to a user-approved release.

## Next engineering/creative proof
1. Capture actual viewport screenshots at desktop and 390×844 portrait, including first approach and artifact inspection.
2. Replace the blockout-quality gateway and relic with high-fidelity sculpted GLB assets with proper UV/PBR materials, coherent original architectural rules and an asset QA manifest.
3. Capture reproducible frame-time p95, draw-call, triangle and texture-memory estimates under identical test conditions on a selected desktop and phone.
4. Integrate and approve an Awaken Now web cue sheet and a complete five-minute route before any public launch.

## Art note
The surrounding architecture borrows no layout from the user's unrelated game references. The player is first-person and there is no visible pixel-art character in this 3D study.
