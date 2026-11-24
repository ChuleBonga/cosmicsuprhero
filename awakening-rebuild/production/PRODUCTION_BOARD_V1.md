# ARCTURIAN AWAKENING — CONTROLLED PRODUCTION BOARD v1
Original board: 2026-11-17. Scope amended 2026-11-23 to remove sixteen-track gameplay mandate. Branch: `rebuild/arcturian-awakening-20261113`. **Planning artifact only; not a claim that work is completed.**

## What is being built
An original inhabited third-person musical adventure derived from the artist's *Arcturian Awakening* world. The player explores a civilization whose people work and respond independently, encounters a story with personal stakes for Chule and Credo, investigates through physical actions, and sees choices persist. The game is **not required to use 16 tracks or follow the album sequence**. Approved songs may be used selectively as dramatic cues. The first public-evaluation milestone is one coherent inhabited encounter; additional playtime must be earned through gameplay and storytelling.

## Baseline truth
- `src/main.ts` loads no approved NPC or world. Three.js displays a decorative lighting calibration over a text-first witness exercise.
- `src/world/DistrictSimulation.ts` and `src/encounter.ts` contain reusable deterministic logic but no rendered populated city.
- Babylon.js is a separate art/GLB test lab; **do not ship two engines**.
- Asset register: **102 planned IDs, 101 unmade; one PRP-001 GLB technically tested but not artist-approved**. No qualified original rigged resident or accepted playable district.
- Public music website and `main` remain untouched. Old passing CI does not imply visual acceptance.

## Source-of-truth discipline
1. Artist's cover art governs cobalt/indigo sky, one dominant red-orange sun, blue/ochre mountains, elongated blue-skinned figure with dark eyes, worn burgundy cloak, analog cinematic tone.
2. Artist-supplied `more.zip` has **43 inspiration images**: facial/species treatments, occupied architecture, society and clothing, textiles, vintage audio technology and landscapes. They are NOT automatically canon or licensed for publication. Reference decisions must record *retain/adapt/reject* and cultural provenance.
3. Project `Game Build Context.txt`, `Game Journey Summary.txt`, `Game Feature Integration.txt`, `QUALITY_CONTRACT.md`, `CHR-002_CARETAKER_ASSET_SPEC.md`, and album track metadata govern narrative/technical constraints.
4. No source-faithful front/back character geometry can be inferred solely from a profile illustration; multiview art and sign-off required. Protect Xhosa/historical motifs from thoughtless copy/paste.
5. Unknown soundtrack/voice/stem permissions are **pending**, never silently approved.

## Critical-path milestone checklist
### M0 / Creative and production lock — no extra world coding until source grammar exists
- [ ] **M0-01** Annotate all 43 supplied reference images by use, design decision and rights.
- [ ] **M0-02** Write beat board: why Chule returns, why Credo matters, who is affected, player motive, two world-visible consequences. Provisional dialogue stays provisional.
- [ ] **M0-03** Approve one-page architecture/costume/craft/material grammar, species multiview direction, and single-sun/ochre/cobalt lookdev.
- [ ] **M0-04** Identify only the cues this game actually needs; verify masters, excerpt/stem cut points, voices, and public playback rights before inclusion. No track-count requirement.
- [ ] **M0-05** Lay out a cohesive 20–30m Arrival Quarter with hall, household/workshop, trade/circulation, social routines and camera sight lines.
**Gate:** every place and important object has a function and cultural reference; artist signs off on world vocabulary and story premise.

### M1 / First original resident, CHR-002
- [ ] **M1-01** Caretaker front/profile/back/three-quarter design with approved head shape and costume.
- [ ] **M1-02** Editable 3D sculpt, retopo, UV, skin/eyes and constructible cloth.
- [ ] **M1-03** Physically based skin/cloth lookdev in neutral and album lighting; realistic wear.
- [ ] **M1-04** Rig and independent idle_work/walk/notice/listen/speak/offer_help/refuse_help/return_to_task performances, gaze/feet/hand tests.
- [ ] **M1-05** Turntable + actual gameplay scale at 1080p and 390px; glTF validation, rights and art verdict.
- [ ] **ENG-01** Benchmark same representative actor/prop/lighting in Babylon and Three on real hardware. Document single production engine choice. WebGL2 baseline; optional WebGPU based on measured benefit.
**Gate:** no stock humanoid, body deformation, face drift, eye disconnect, cloth clipping, wrong identity or poor acting. Stop expansion if this fails.

### M2 / One inhabited and functional physical place
- [ ] **M2-01** Approved architectural grammar rendered as meaningful hall/site, not generic arches.
- [ ] **M2-02** Two authentic occupied interior/work stalls with task-specific props.
- [ ] **M2-03** Album-consistent sky, one orange-red sun, ochre over cobalt terrain and authored practical lighting.
- [ ] **M2-04** Courier and apprentice individually designed/rigged with specific work actions.
- [ ] **M2-05** Map resident routines, gaze, navmesh and post-choice consequences into actual animated scene.
- [ ] **M2-06** Rework generic civic receiver as authentic, worn cultural object once its technology/function is defined. Existing PRP-001 is unapproved reference tooling.
- [ ] **M2-07** Record one third-person inhabited scene with three active residents, recognizable daily life, grounded props and continuous camera.
**Gate:** architecture and inhabitants belong to the supplied world, and NPCs act without the player. Compare actual 1920x1080 and 390x844 screenshots to references.

### M3 / Replace questionnaire with game
- [ ] **M3-01** Third-person locomotion, collision, safe camera, input hints and touch behavior.
- [ ] **M3-02** Convert text witnesses to physical observation, dialogue staging and evidence interaction in the world.
- [ ] **M3-03** One meaningful inference/signal challenge with consequences and recoverable failure.
- [ ] **M3-04** Two persistent world responses, changed NPC behavior and location access after choice.
- [ ] **M3-05** Playtest opening to Credo lead-in, including both paths, interruptions and reloads.
**Gate:** witness story is experienced through people/places; choices visibly affect a later playable state; no walk→collect→continue substitute.

### M4 / Album, UX and emotional direction
- [ ] **M4-01** Artist-approved cue selection and timing only where the playable story benefits, with intentional user-started playback and a meaningful muted alternative.
- [ ] **M4-02** Cleared ambient work, tactile foley and voiced performances where available, captions/transcripts always.
- [ ] **M4-03** Nonintrusive subtitle, journal, prompts, touch/keyboard/controller and accessible alternative.
- [ ] **M4-04** Pause/options, reduced motion, mute, loading/retry/save; accessible pre-save link without game-completion gate.
**Gate:** readable 390px UI, no unnecessary HUD/emoji/quest arrows; full experience remains understandable without audio.

### M5 / Quality qualification and isolated preview
- [ ] **M5-01** Actual device GPU/frame-time, memory, loading and texture/bundle measurements; target 60fps capable desktop and tested 30fps mobile fallback; initial interaction under ~3MB where practicable.
- [ ] **M5-02** Player comprehension and interaction tests, keyboard/touch, Safari/Chrome, screenshots, clips and 4/5 per-category art/UX scores with no hard failures.
- [ ] **M5-03** Separate private preview with checked artifact checksum and rollback, explicit artist approval.
**Gate:** one real full playthrough, no broken branches, no character/world/rights/performance hard fails. Passing CI alone is insufficient.

### M6 / Self-contained game and public release
- [ ] **M6-01** Expand only when the story and playtesting justify new chapters and locations. Do not map gameplay one-to-one to songs or mass-generate assets before first-slice approval.
- [ ] **M6-02** An earned ending and transformed world, with the album link still accessible. Do not require the recording titled Finale or a sixteen-stage arc.
- [ ] **M6-03** Complete rights/credits/accessibility/security/hosting validation and explicit production approval.
**Gate:** end-to-end release-qualified product, not a technical preview.

## Visual/interaction acceptance rubric
Reuse `QUALITY_CONTRACT.md`: visual source fidelity, civilization believability, NPC acting, agency, narrative/album integration, UX/accessibility, performance. Each category must score at least 4/5; the following always block approval: empty world, fake/stock character art, identity drift, no independent citizen life, text-only consequences, no in-engine comparison, uncleared audio, broken mobile or absent playthrough. Do not replace this evidence with a design-board image.

## Production work packet, required for each accepted ticket
`ticket ID | exact source refs | editable art/code | exported asset | in-engine capture | 390px + 1080p proof | actual interaction recording | license status | technical tests | art verdict | problems | repair commit`.

## Operating constraints
Preserve existing working code where it helps; no new framework without measured benefit. Commit to isolated branch and inspect real device output. Stop and repair a failing art gate before making additional NPCs or locations. Explicit consent is required for expenses, external voices, likeness/canon changes, main branch merges and public publishing. A polished screenshot without gameplay, or a passing build without art, is never “finished.”

## First implementation sequence, in order
1. Reference taxonomy and visual grammar, plus short narrative why-board.
2. One 3D character from approved full-body multiview, with rigged performance.
3. One real civic place (not terrain filler) with that working resident; source/art screenshot comparison.
4. Decide Babylon vs Three based on identical in-game assets.
5. Add courier/apprentice and real dialogue, evidence challenge, world consequence and music.
6. Full chapter test, fix, qualify and only then deploy the separate release candidate.

**The next meaningful proof is:** a source-faithful Arcturian caretaker performing a real task in a built civic location, noticing Chule and responding in a captured third-person scene. No more generic GLB tools as a substitute for that.
