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
- Procedural actual terrain mesh, coherent canyon boundaries, layered geological faces, distant peak geometry, original offline-baked PBR texture maps, instanced stones, two original monumental gateway configurations, red-orange sun sky shader and distance fog.
- First-person walking with fixed 60 Hz simulation, terrain normals/slope threshold, acceleration/braking normalized for diagonals, hard path boundaries and visible-space collision proxies for the plinth, leaning spire and two waystones. These are custom kinematic contacts, not full rigid-body physics.
- Real 3D artifact geometry plus physically continuous object inspection: when near and facing the relic, press E or tap Inspect; the inspected model is a clone of the world model, rotated by mouse/touch.
- Desktop WASD and mouse look; analog mobile left thumbstick and right-side drag look; accessible text and focusable controls; pause/restart, safe direct pre-save link, graceful WebGL error copy.
- Awaken Now preview music control with visitor-initiated autoplay unlock, looping, volume adjustment, M mute shortcut, pause/resume, and cue ducking. Dedicated transport tests guard audio source and state changes. Only the **separate game project** has the audio; main site embedding still omits all audio.
- A fractured horizon-scale architectural landmark beyond the path, close-up stone sculptures, and corridor walls aligned to the physical walking bounds.
- Optional `?perf` frame-time overlay showing observed mean/p95, draw calls, triangle count, render scale, and world position. The overlay is **not GPU profiling**. Render scale may reduce if measured frame pacing is poor.
- Regression tests in `world-logic.test.mjs` with deterministic 30/60/120 Hz scheduling equivalence, ground and slope validity, boundaries, braking, normalized diagonal travel, inspect proximity/facing, item collision and a single end location.

## Preview route
`/play/experiments/first-person/index.html` on the **independent `arcturian-walk-preview` Vercel project** (only when this branch is deployed). The root website's preview builds this route as well, but intentionally leaves audio out under the existing production protection.
No homepage link and no merge to `main` without visual and control acceptance.

## Known limitations — not negotiable
1. **Visual quality not passed.** The geometry is procedurally authored and still lacks photogrammetric source quality, unique sculpted ornament, optimized cinematic textures, detailed surfacing, realistic object transitions, compositional camera review and lighting calibration. A successful build is not a believable AAA-quality frame.
2. **Five-minute journey not built.** This is a shorter exploratory route with one inspectable object and draft prose; the narrative sequence, real emotional reveal, physical artifact semantics, pacing and music score need artist direction and completion.
3. **60 FPS not measured.** Vercel build success, motion tests, and HTTP 200 checks say nothing about steady GPU performance. The browser preview is not visually tested on desktop or physical mobile hardware.
4. **Controller is custom kinematic movement**, not Rapier. Multiple original sculptural landmarks are now represented by circle-based collision proxies, but full architectural mesh collision, contact events, stair response and ground material responses remain future work.
5. **No authored audio in this build.** Awaken Now is reserved as the score but no approved audio master, public excerpt, cue transitions or spatial sound files have been added.
6. The previous 256² in-browser CanvasTexture generation was replaced in Build 05 with 512² original build-time PBR image maps (basecolor/normal/ORM, four families). These remain synthetic artwork, not photogrammetry; compressed KTX2 and authored sculpt bakes are future work.
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

## Score-preview and publishing guardrails
The user's music direction is explicit: Awaken Now is the game's background theme. The source file was already tracked in the repository, and the game project already served it before this commit. This branch changes the **isolated first-person route** to actually play that loop after an entry gesture. It does not expose a new master recording, introduce other tracks, or remove the root site's audio-exclusion safeguard. A future merge to production would require explicit review of the precise loop, availability, desired edits, and release timing.

## Build 03: space, responsiveness, and architectural detail (November 7, 2026)

### Authored implementation
- Replaced placeholder cone silhouettes with three continuous, irregular, genuinely spatial mountain-ridge meshes.
- Rebuilt two canyon-wall meshes with sedimentary striations, fractures, material variation and spatial geometry aligned to the traversable half-width.
- Added an ancient, partly buried, twin-lane stone causeway with missing/chipped slabs (instanced geometry) and small debris (instanced geometry). The causeway's top surface remains close to the walkable terrain, preserving contact.
- Rebuilt the monumental gateway's markings and repeating structural joints with `InstancedMesh` batching. Environmental glyphs and light subtly respond to the first artifact inspection; no new track or chapter was added.
- Eliminated repeated `Vector3` allocations while preparing normal-map canvas pixels, avoided per-vertex Color cloning across the terrain, and isolated terrain texture repeats from hero object maps.
- Camera positions interpolate between fixed 60 Hz physics steps; look sensitivity, invert-Y, and a steady-camera setting are exposed in pause UI. The mobile d-pad is replaced by a continuous left thumbstick with dead-zone and drag-look on the right.
- Audio still uses the existing, artist-provided `score_awaken_now_loop.m4a` in the separate game preview, only after the Enter gesture. Main site audio exclusion remains in place.
- Added independent, deterministic analog-input regression tests with deadzone, cardinal directions, diagonal bounds, invalid inputs, sensitivity and invert-Y behavior.

### Quality gates and unresolved risks
- **Do not mark visual quality passed.** The artwork now contains richer real geometry but is still procedural production study material rather than hand-sculpted, photogrammetrically grounded final environment art.
- **Do not mark mobile control comfort passed.** Tests cover transforms, not physical-thumb ergonomics on actual hardware.
- **Do not claim 60 FPS.** Dynamic render scaling and an in-app `?perf` view exist, but GPU timings, representative desktop/mobile p95 frame times and actual-device footage remain unverified.
- Browser graphical QA attempt was unsuccessful due to a remote browser service timeout. Preview HTTP checks and passing Vercel build are not a substitute.
- The path remains a short, incomplete study rather than the approved full five-minute experience. No merged production game or altered public website.
- A final website launch still requires confirmation of the audio excerpt / loop rights and timing.

### Regression verification
```bash
cd game-walk
npm run test:first-person
npm run test:score
npm run test:controls
npm run build
```

## Build 05: original texture bake, material streaming and network gate (November 8, 2026)

- `scripts/bake-first-person-materials.mjs` now generates four distinct original material families (basalt, ochre, oxide, mineral) as **512×512 basecolor, tangent normal and packed ORM PNG** maps. It runs at build time; visitors no longer generate thousands of procedural pixels and allocate CanvasTextures on initial load.
- The world loads these original assets from a static `/play/first-person-materials/` path. Blue mineral and oxidized-metal maps extend through the First Contact encounter.
- Terrain and object UV repeat scales are independent. Duplicate images are served through browser caching; the final GPU memory footprint must still be measured.
- Enter remains disabled during material preparation, with an understandable loading message and a **12-second fail-open** so slow networks never lock visitors out of the pre-save or scene.
- A standalone non-WebGL material QA board at `/play/experiments/first-person/materials.html` shows all twelve maps plus repeating tile surfaces.
- A manifest with SHA-256 hashes, dimensional checks, deterministic seams, normal/roughness/metalness channel tests, and a hard **5 MB PNG pack budget** now run in the Vercel preview build.
- This asset pack does **not** constitute photogrammetric AAA quality, KTX2 GPU compression, actual device-verified 60 FPS or a finished five-minute story. No main-site production change and no new music publication.

See `MATERIALS_PIPELINE.md` for reproduction commands, channel conventions and explicit asset quality gates.
