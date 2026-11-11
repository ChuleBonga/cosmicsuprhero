# ARCTURIAN AWAKENING / VISION & QUALITY CONTRACT
Version 1.0 · 2026-11-11 · Owner: Cosmicsuprhero (creative approval) · Implementation: game and website team

## Mission

Make **one coherent, inhabited, character-driven interactive album world**, not a collection of monuments, minigames, demos or disconnected art objects. The player should recognize the world of the approved *Arcturian Awakening* artwork, meet believable inhabitants, understand why the protagonist is there, and encounter sound technology with cultural, historical and narrative purpose.

The currently public first-person Three.js path is **a technical baseline**, not an approved aesthetic or a complete story. The album homepage and pre-save must stay independently usable.

## Authority and decision hierarchy

1. The artist's **actual approved album illustration** and explicit recent creative feedback are authoritative for visual identity.
2. The artist-supplied reference board (43 images catalogued in `experiments/first-person/DESIGN.md`) is a **private inspiration set**, not deployable source assets, rights clearance, or a license to blend unrelated cultures.
3. Narrative discussion (returning home, Chule, Credo, Xaba's recorder, archive succession and the community dispute) contains **candidate ideas**. Names, motives, cultural meanings, family relations, character appearances, camera viewpoint, story ending and symbol systems remain provisional until artist-approved.
4. Approved asset specifications and accepted in-engine screenshots outrank prompt prose and standalone concept art.
5. Existing technical implementation must not be treated as approval to preserve weak art or empty interaction.

Keep a decision log for approved canon. No cultural symbols, real-world ritual meanings, Xhosa beadwork codes or Kemetic motifs may be declared as Arcturian canon without historical research and the artist's explicit agreement. Avoid turning African references into generalized decoration.

## Non-negotiable visual anchors

- Cobalt / indigo sky; the immense **saturated red-orange sun**, never replaced by a yellow star or gold bloom.
- Dark blue mountains with believable weathering and limited ochre illumination.
- Original blue-skinned humanoid with elongated-head identity, dark eyes, weathered burgundy-purple cloak as depicted in approved art.
- 1970s practical-effects / 35 mm cinematic materiality: purposeful lensing, restrained halation, natural shadow, physically legible weight, no glossy generic sci-fi effects.
- Human-scaled lived-in places alongside ancient structures: occupation, work, storage, transport, exchange, families, maintenance and visible use.
- Objects have **function, provenance, owner, wear and story consequence**. No unrelated floating crystals, altar trophies or decorative collect-them-all markers.
- Explicitly **no emoji-based gameplay UI**; use a restrained icon family or text, and visible touch/keyboard focus states.

## Narrative acceptance criteria

Every playable location requires: **why it exists**, **who uses it**, **what the player wants**, **who disagrees**, and **what changes after interacting**.

Every named NPC requires: independent goal; routine or activity; relationship to another inhabitant; recognizable silhouette and voice; actual walk/idle/work/gesture states; response to player proximity or action; dialogue state with at least one meaningful consequence. A motionless dummy with a prompt is **not** a completed NPC.

Every principal artifact requires: owner/origin, physical purpose, location, discoverability, readable scale, inspect/use interaction, at least one consequence and a reason it belongs to the album's musical world.

Do not mistake descriptive text for implemented behavior. Story and character decisions requiring artist approval remain marked **PROPOSED** in code and documentation.

## Stage gates: no graduation without evidence

| Gate | Required evidence | Blocked by |
| --- | --- | --- |
| G0 / Reference & canon | Canonical album art available side-by-side; each reference classified by purpose and rights; key story assumptions labeled | Missing reference or invented canon |
| G1 / Art direction | Three approved frame targets (arrival, inhabited settlement, intimate encounter); palette/silhouette/architecture/material comparison; artist accepts look | Off-model sky/sun/characters, generic ruin, copied cultural design |
| G2 / Asset QA | Actual GLB or equivalent, production textures, proper units/pivots/UVs/LOD/rig/animation and collisions; source & rights logged; in-engine visual evidence | Unrigged illustration passing as NPC, floating mesh, missing rights |
| G3 / Story + play | One contiguous entry-to-consequence encounter; functional NPC routines and dialogue state, interaction/persistence; keyboard/touch navigation; no blocking shortcuts | Only walking, examining an unrelated artifact, and ending |
| G4 / Technical + accessibility | Browser screenshots at desktop and mobile including *actual scene*; measured p95 frame time and GPU/CPU clues on named hardware; loading/error/recovery, keyboard/focus/touch/reduced motion, audio rights | Only Vercel green; missing GPU evidence; mobile clipping; uncleared sound |
| G5 / Public candidate | Artist accepts side-by-side comparisons; no P0 bugs; pre-save independently accessible; correct release copy and links; regression and fallback tests | Release pressure, speculative quality claims or unfinished critical flow |

### Evidence record required for every major asset and scene

- Asset ID and reference ID(s); version; creator; license/ownership provenance.
- Current state: `planned`, `concept-only`, `artist-approved`, `built`, `engine-integrated`, `tested`, `released`.
- 3-view turnaround or contact sheet (characters/hero props), plus **in-game** screenshot at true scale. Concepts may be gorgeous but remain `concept-only`.
- Geometry/triangle and texture/memory estimates where applicable; pivot, normal orientation, collision, material, animation checks.
- Evidence of function (short recording or interaction test), desktop and narrow-screen screenshot, accessibility and fallback test.
- Written accept/reject verdict with reasons. **Only the artist approves material art/narrative decisions**.

## Asset production pipeline

Reference classification -> design sheet -> accepted target look -> original sculpt/mesh and retopology -> UV and PBR bake -> rig/animation if needed -> GLB export -> validation -> compressed GPU-friendly texture variants -> browser scene integration -> comparison/interaction tests -> artist approval -> public release.

Use Blender or another asset-authoring tool offline for organic humans, textiles and unique civilization architecture. Export runtime-ready glTF 2.0 / GLB; implement mesh/animation loading with current Three.js GLTFLoader. Use KTX2 / meshopt only when the particular browser/device pipeline is validated. **An image-generation render is not a 3D model**.

## Production safeguards

- The artist asked to see changes at the actual domain, not scattered branch previews. Keep one public journey and work on `main`, but never advertise unapproved asset prototypes as finished. Stage candidate files outside served `public/` assets until accepted, and feature-gate incomplete runtime work.
- Keep working album page, release date, pre-save and game entry intact. Never remove established visitors' paths for an art experiment.
- New narrative or expensive pipeline choices require creative approval; small reversible code, QA and documentation improvements do not.
- Every site change receives a real public browser pass, screenshot comparison and explanation of what was **verified vs unverified**.
- When quality cannot be validated in time, keep the excellent album landing page and publish a clearly labeled art preview or trailer rather than a misleading finished-game claim.

## Current truthful baseline (2026-11-11)

Built: 3D WebGL scene; canyon/causeway, red sun, landscape, found cobalt object; walk/inspect/end interaction; responsive controls; new static roadside repair shelter. Not yet built: characters with purposeful NPC behavior; a true inhabited settlement; meaningful Credo dialogue, community relationships and consequences; final art; approved music; complete five-minute story. Visual QA of roadside shelter and physical-device frame pacing is outstanding.

**Do not mark the release as ready merely because Vercel is READY.**
