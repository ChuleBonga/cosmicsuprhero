# ARCTURIAN AWAKENING / ASSET-LED PRODUCTION PLAN
Version 1.0 · 2026-11-11 · Companion: `VISION_AND_QUALITY_GATES.md`, `ASSET_REGISTER.csv`

## Overall delivery approach

**North star:** One place, one community, one emotional encounter, one consequence, rather than a larger empty planet. The studio may extend this into the complete album-world game only once a small inhabited experience is convincingly finished.

The album campaign stays at `https://cosmicsuprhero.vercel.app/`; its pre-save remains accessible even if the player never enters the game. Changes live on `main`, with incomplete asset prototypes unserved/feature-gated, not treated as public release.

## Production Milestones (quality gated, not arbitrary deadlines)

### M0 / Re-establish truth (G0)
- Reopen supplied original album art and all 43 reference images (the repository only catalogs them; not all source images are available to the current tools).
- Categorize landscape, architecture, population, fabric, recording technology and cultural research separately with provenance.
- Establish a three-frame target: Arrival, Inhabited Place, First Contact/character conversation.
- Settle protagonist role/viewpoint and the *why now / what happens otherwise* narrative. **Chule's homecoming, Credo and archive dispute remain candidates until approved.**
- Outputs: canonical reference board, color/silhouette tests, candidate story treatment, decision log. **Do not build further named culture from an unapproved assumption.**

### M1 / Art target & casting (G1)
- Generate/study three original **standalone** environment keyframes and proper turnarounds for the protagonist and at least two NPC roles.
- Create architecture construction-language sheet (material, load path, structural logic, habitation), technology design sheet (repairable recorder and receiving apparatus) and fabric/material sheet.
- Produce simple in-engine comparative composition shots before sculpting the final environment.
- Artist accepts the look and which NPCs/artifacts are narratively relevant. Unapproved drafts stay drafts.

### M2 / First inhabited location (G2)
- Model one recognizable occupied waystation/settlement threshold with rooms, shelter, storage, seating, walkways, sound receiver, and distant lived-in layers.
- Build modular construction set, weathering decals and coherent original material library. Replace blockout geometry where quality is inadequate.
- Build two to three real NPC models **with rigs and animation**, role-specific garments, scale and silhouettes; implement meaningful work/idle/walk/gesture loops.
- Create original repairable recorder and working relay as in-game inspect/use assets rather than generic glowing crystals.
- Validate rig deformation, prop handoffs, normal/roughness maps, collision, accessibility and mobile asset LODs before integration.

### M3 / Character-driven vertical slice (G3)
- Arrival presents settlement activity, direction and a reason to participate.
- NPC reacts to player presence, goes about independent business and exchanges dialogue connected to a credible conflict.
- The protagonist notices a grounded story artifact, then uses/returns it; an NPC responds differently to discovered, ignored or carried states.
- A consequential change occurs in the location (such as a receiver or route becoming available); no song-dependent softlock.
- Persist state, handle repeat visits, closed captions and an optional quiet-mode flow.
- Must be satisfying from playable cause to consequence **without any marketing CTA**. Then the pre-save invitation may follow.

### M4 / Cinematic, audio & performance (G4)
- Camera framing, world scale, atmosphere and lighting judged against album art, not a generic sci-fi benchmark.
- Approve exact musical excerpt/publication rights before adding `Awaken Now` to production; otherwise ship a deliberate silent/artistic sound-design fallback.
- Optimize assets (LOD, instancing, compression, texture sizing); measure real desktop and phone frame time p95, draw calls, texture/heap memory and interaction latency.
- Test keyboard, mouse-look, actual mobile touch, reduced motion, errors and recovery.

### M5 / Public release candidate (G5)
- Review three frozen scenes against reference anchors, plus a real walkthrough from first interaction to meaningful consequence.
- Obtain explicit visual/story and release approval for new art/canon; record acceptance and known limitations.
- Keep only one main game entry. Verify homepage, tracklist, mobile, pre-save, third-party exit links and game fallback.
- For December 4, prioritize an excellent **album campaign** even if the larger playable world has to remain a clearly labeled preview.

## Review cadence and format

For every meaningful game change, report:
1. **Reference target** and artist-approved goal.
2. **Actual assets built**, not just prompts/code.
3. **In-engine comparison** with real desktop and phone-size screenshots.
4. **Player journey result**: who acted, what changed, what failed.
5. **Performance evidence** including device and p95 (or state 'not measured').
6. **Verdict**: accepted/revise/reject, and next action.

Do not celebrate green builds alone. Do not turn an unapproved image into a recurring template by accident.

## Technical target

Current browser runtime: Three.js r187 via `game-walk`. Preserve its working movement and artifact inspection until a demonstrated quality need justifies change.

Preferred authoring: original offline Blender/3D mesh + texture work, with production `.glb` / glTF 2.0 and explicit animation clips. Use Three.js GLTFLoader and validated KTX2/meshopt paths for future optimized files. The repo currently uses procedural geometry; converting to authorable assets is a new pipeline, not a finished feature.

Targets, NOT verified achievements:
- Desktop visual fidelity judged on named hardware plus an aspirational 60 FPS if capable.
- Mobile graceful adaptation / tested 30 FPS path if necessary, not a universal 60 FPS guarantee.
- Progressive loading and meaningful fallbacks; keep the album page independent of WebGL support.
- No lifted third-party reference files or unapproved audio in a published build.

## Scope control

**P0:** Three-frame direction lock; inhabited location; 2–3 functional NPCs; recorder/relay; one real dialogue/interaction/consequence; playable camera and path; technical QA.
**P1:** Additional population, neighborhoods, social systems, narrative branches and musical objects; cinematic transitions and richer audio once cleared.
**P2:** Broader album story, more regions and quest arcs, advanced crowd behavior, larger marketing asset set.

New requests must declare a priority, dependency and quality gate. Anything failing G1–G3 is reworked or cut, not carried forward as decorative filler.
