# ARCTURIAN AWAKENING — REBUILD CREATIVE ACCEPTANCE CONTRACT
Status: scope and quality gate. Not a claim that the world has been built.
Updated 2026-11-13.

## Why the previous implementation is rejected
The prior product added more distance, terrain, dummy NPC motion and collectible interactions without adding a civilization, emotional relationships, or consequential gameplay. The test suites measured code behaviors, not resemblance to artist references. It was a walking demonstration, not the album game. That approach is retired.

## Non-negotiable visual canon
- Saturated cobalt-blue and indigo sky; immense orange-red sun.
- Dark blue mountainous geology under warm ochre light.
- Blue-skinned humanoids: elongated heads, dark eyes, subtle believable skin texture and anatomy.
- Weathered burgundy and purple fabrics, physically convincing cloth and silhouettes.
- A tactile cinematic quality informed by period-authentic 35mm photography, not plastic CG gloss.
- Architecture, clothing, technology, communities and material culture must be designed **from the artist's supplied civilization reference images**, not generic speculative sci-fi, generic Afrofuturism, desert ruins, arches or repeated monoliths.
- No emoji, no cheap neon, no UI embedded in image textures. The world must have signs of labor, habitation, age, and social use.

## The test for whether this is a *game*
The first approved vertical slice must start during a specific social disruption. Chule must be needed for a reason, and his actions must have costs. A visitor should be able to explain who he is, what he wants, who has something at stake, why Credo matters, and why the player's specific decision mattered.

The current **test dialogue is provisional** and may change with the approved narrative. It does not become canon merely because it exists in the code.

### Gameplay categories required before milestone acceptance
1. **Observation and interaction:** NPCs notice and respond to Chule; their schedules continue outside player interaction.
2. **Interpretation:** player must reconcile conflicting evidence or signals; information has competing sources.
3. **Skill and consequence:** at least one challenge requires mastery, not pressing a prompted action three times. Failure changes the situation without creating a dead end.
4. **Relational choice:** decision changes NPC behavior/dialogue and one later playable state, not only an ending paragraph.
5. **Album integration:** the artist's actual music motivates timing, emotion and discoveries; never invent tracks, lyrics, fictional voices or substitute background music.
6. **World continuity:** player can revisit a changed place and see how inhabitants respond after an event.

Movement is a way to reach an event, not the main event.

## First *art-approved* location
Build a functioning neighborhood, NOT a symbolic obstacle course. Reference design must establish an architectural grammar for houses, places of trade, communal gathering, transportation, communication, repair, food and cloth. District map must show how ordinary residents use those places throughout a daily schedule. Population must have varied occupations, silhouettes, materials, gestures and needs.

Start with a **single fully authored 20–30 m space** containing:
- One credible public gathering place with architectural construction logic;
- Two connected inhabited interiors or working stalls;
- Three fully rigged, individually designed residents, plus supporting background life;
- A social event involving residents without the player being the only moving entity;
- A player-driven challenge with a visible outcome;
- Return path with persistent state.

No volume of procedural filler can substitute for those minimum requirements.

## Asset quality pipeline
A model may enter review only when it has:
- Authoring/reference identifiers and rights provenance;
- Original editable model or documented source;
- Usable glTF/GLB with a sensible coordinate system, scale and pivots;
- PBR materials and correctly color-managed texture maps;
- A clean skeleton and skinning, meaningful eye/facial controls, independently testable idle, walk, gesture and dialogue performances;
- Environmental light and shadow compatibility;
- Mobile LOD and memory budget; actual performance screenshots;
- No model deformation, foot sliding, costume clipping, face drift or disconnected eye direction at gameplay size.

Passing the automated technical gate in src/assetGate.ts is necessary but NEVER sufficient.

## Evaluation rubrics and hard failures
Each reviewer rates visual fidelity, world believability, NPC animation, player agency, narrative clarity, musical integration, mobile legibility, and performance separately. A category with a hard fail blocks approval regardless of average score.

Hard failures:
- Scene is empty of inhabitants or their meaningful behavior.
- Major characters are boxes, stock people, reused sprites or unapproved generated figures.
- Wrong celestial color palette or style drift away from illustration.
- Gameplay is walk -> collect -> continue, or one prompt -> one instant win.
- Player choice only changes a line of copy and not later NPC/world state.
- Spoken material is represented as a real album recording without clearance.
- CI build passes but no visual comparison, no keyboard/touch playthrough, or no measured target-device performance.

## Evidence for a review
For any proposed milestone supply:
1. Source-of-truth reference frame(s), version and artistic notes.
2. Representative 1920x1080 and 390x844 in-engine screenshots, plus a 20–60s gameplay capture.
3. NPC turntable, idle, walking, interaction and facial performance test.
4. Narrative gameplay recording showing at least one unsuccessful attempt and recovered success.
5. Same conversation/path replayed with two contrasting decisions and the later-state difference.
6. Compilation/test results and license/rights manifest.
7. GPU/device conditions, initial transfer bytes, measured frame times and loading states.
8. Specific visual discrepancies and repair actions.

No production deployment or merge without explicit approval after those checks.

## Current milestone verdict
The new Three.js repo is a **mechanics laboratory only**. It currently demonstrates the nonwalking investigation and fail/retry consequences, and has a rendering lighting calibration. It has **zero approved 3D NPC models**, **zero approved building models**, **zero approved character animation clips**, and **zero qualified real-device measurements**. Therefore it unequivocally FAILS visual-world and production-readiness gates. The next deliverable is original visually approved civilian and settlement art, not more scaffolding.

## Technical version selection (verified November 13 2026)
- Three.js 0.187.0; @types/three 0.187.0
- Vite 8.3.8
- TypeScript 7.0.2
Pin for reproducibility; evaluate upgrades after compatibility and security review rather than updating blindly.
