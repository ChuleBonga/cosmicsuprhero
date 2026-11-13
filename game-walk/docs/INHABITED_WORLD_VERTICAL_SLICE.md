# Arcturian Awakening — Inhabited World Vertical Slice
Status: production design specification, NOT implemented gameplay or approved dialogue
Date: 2026-11-13
Branch: arcturian-inhabited-world-slice-20261113

## Source and boundaries
This document translates the artist's current direction into a concrete, testable milestone. It builds on game-walk/src/scenes/WalkScene.ts, CredoScene.ts, story/JourneyMachine.ts and AlbumJourney.ts as inspected on 2026-11-13. Older game-walk/README.md still describes a gray-box walking test and is not a current visual-quality endorsement.

Fixed canon: one interconnected album game, first track Meditate, final track Finale, Chule, Credo, the return-home/family/memory motivations, and Xaba's later grief context. Color and species anchors: cobalt/indigo sky; giant saturated orange-red sun; ochre-lit dark-blue landforms; blue-skinned humanoids with elongated heads, dark eyes and physically convincing practical textures. No unapproved invented album tracks, quotes from recordings, NPC speech recordings, or replacement world aesthetics.

## First playable settlement: narrative proposal (pending artist approval)
Working location label: THE ARRIVAL QUARTER. This is a proposed production label, not canon place naming. It is a functioning neighborhood near the threshold where Chule's return is noticed. Its purpose is to show everyday life, the social cost of a disrupted memory-keeping practice, and why Credo's words matter. The opening should teach without three lore panels.

**Player's dramatic question:** Why has Chule returned, and why does his arrival matter to these people?

**Location's social question:** Who holds a community's memories when its keepers cannot agree on what should be preserved?

Chule arrives amid ordinary work, not a ceremonial crowd. Residents carry water or supplies, repair shaded market structures, tend textiles, converse in pairs, and make room for one another in narrow lanes. No one stands idle waiting for the player.

## The 6–10 minute encounter
1. **Approach:** third-person silhouette and camera travel into a district visible beyond the current rocky foreground. Music begins only after user interaction and only with cleared assets. A real resident crosses the player's path and continues their routine.
2. **Arrival:** a resident caretaker notices a familiar mark or belonging associated with Chule. She does not immediately trust him. One ordinary, grounded spoken or captioned exchange establishes his absence, not a prophecy.
3. **Choice:** player can respond by asking about family, about the settlement's condition, or choosing to listen first. Different choice gives different context; all options converge to a clear next action so content scope remains bounded.
4. **Useful action:** instead of collecting a glowing random object, Chule assists in restoring a communal listening fixture or salvaging a household memory object. That object has a documented owner, function, history, physical material, and consequence. Interaction must take 20–45 seconds, have keyboard/touch accessibility, and be recoverable after interruption.
5. **Credo lead-in:** the resident explains why Chule should seek Credo, without delivering Credo's words on his behalf. Chule gains access to a populated passage, with bystanders visibly reacting to the restored fixture.
6. **Exit:** checkpoint saves relationship state, repaired fixture, and next objective. Return to the market should show persistent change. No fabricated vocal track or dialogue from the actual musical recording.

### Provisional cast (roles, not approved names)
- **Caretaker**: knows Chule's family; protects communal memory; walks between household and public repair area; can accept or challenge the player's tone.
- **Young repairer**: restores devices for practical reasons and notices when Chule helps; carries tools, kneels, tests connections; provides an observational rather than mystical perspective.
- **Market resident**: sells, prepares, or trades necessary goods; has a schedule and short incidental conversation; establishes economy without quest-marker dialogue.
- **Child and guardian pair**: travel together; show intergenerational life without forcing a story scene; child is not a collectible clue.
- **Credo**: narrative figure approached after the neighborhood incident, not a glowing meter or standalone slider; precise words and voice require approved script/audio.

Three interactable NPCs are enough for the first high-quality slice; the other residents may use authored routine loops, but no static T-pose crowds.

## State contract proposed for implementation
The current JourneyMachine has stages meditate, crossing, first_contact, credo, campfire and a single discovered flag. Preserve old saves and add a separately versioned settlement state or carefully migrated v4 fields; do not repurpose first_contact into a fake encounter completion.
- residentMet: boolean
- responseTone: 'family' | 'community' | 'listen' | null
- repairStarted: boolean
- repairCompleted: boolean
- credoLeadUnlocked: boolean
- residentsReacted: boolean
- encounterCheckpoint: versioned, deterministic snapshot
- Preserve existing audio mute, distance, and discovered facts.
- No completion via skipping to a position threshold.
- Replay/restore must never duplicate dialogue/audio or award progress twice.

Implement pure transition functions first, with tests for choice branches, replay, save restore, reset, missing audio, and invalid state. Only then integrate the Phaser scene. NPC dialogue subtitles and interaction menu are usable by keyboard, mouse, and touch. Include reduced-motion alternatives.

## Visual set-piece asset ledger
Every asset requires: ID, owner/rights, source reference, prompt or art brief, dimensions, native editable source, runtime export, alpha/occlusion notes, LOD plan, and screenshot approval at game camera distance.

| Priority | ID | Deliverable | Proof of quality |
|---|---|---|---|
| P0 | AA-S01 | whole settlement establishing view, daytime, cobalt sky and red sun, identifiable routes and occupied dwellings | coherent district depth; genuinely inhabited; no photobash seams or decorative random towers |
| P0 | AA-S02 | settlement ground-plane/collision and walkable lane | readable route, door scales, physics clearance, not giant flat procedural blocks |
| P0 | AA-C01 | Chule turnaround and locomotion set | stable identity, feet contact, matching scales from all angles |
| P0 | AA-C02 | caretaker model or layered 2.5D performance set | recognizable face/wardrobe, idle, turn, walk, dialogue, reaction |
| P0 | AA-C03 | repairer model/performance set | distinct age, silhouette, occupation, correct handling of tools |
| P0 | AA-P01 | inhabited market/dwelling cluster | lived-in props support believable commerce, household life, and foot traffic |
| P0 | AA-P02 | communal listening fixture and grounded repair animation | visibly understandable purpose, meaningful before/after |
| P1 | AA-C04 | three ambient resident variations | diverse silhouettes and purposeful route loops |
| P1 | AA-P03 | shade canopies, textiles, containers, hand tools | motivated wear/weathering, physically plausible anchoring |
| P1 | AA-A01 | district ambience: footsteps, cloth, wind, daily activity | cleared rights, natural dynamics, no sci-fi sound spam |
| P1 | AA-U01 | readable subtitles and response UI | no emoji, mobile safe-area and keyboard/touch parity |

### Art direction and camera
Anchor the original illustration's blue/ochre/orange-red visual identity, but make structures and inhabitants believable at a human scale. Distinct architectural grammar must be designed from the user's civilization references before production assets are approved. Do not infer cultural designs from generic Afrofuturist tropes. Avoid generic monumental arches, identical pillars, polygon rocks and empty fog. Keep selective analog-film texture, tactile clothing, uneven material aging, physically credible lighting. Establish scale through doors, steps, working people and domestic objects. Third-person perspective is acceptable when it improves people-and-place legibility. No AI-produced still is an animated game-ready character or proof of working NPC behavior.

### Acceptance gate
A cold viewer must be able to answer, without reading a lore document: (1) who lives here, (2) what they do, (3) what Chule wants, (4) why this place reacts to his return, (5) why reaching Credo follows from the encounter. A walk-through must demonstrate resident schedules, dialogue branching, useful action, persistent consequence, and recoverable checkpoint. Compare actual desktop and mobile captures against approved source frames for color, architecture, anatomy, scale, population and material quality. The game must also pass typecheck/tests/build plus tested touch and keyboard navigation, reduced motion, mute and caption handling. Document actual FPS and bytes under named device conditions. No deployment to main and no quality signoff based solely on a passing build.

## Implementation handoff
1. Capture screenshots and benchmark the baseline game from this branch, then inventory loaded art/animations and link them to user-provided references.
2. Write a small pure, tested SettlementEncounter state machine (no Phaser dependency) with migration strategy.
3. Add a real player-interactable resident who follows a schedule, pauses, faces player, converses, then resumes activity; integrate accessible dialogue choice.
4. Add a visibly different, stateful repair interaction and credible object with provenance.
5. Add two further NPC routines and settlement environmental detail; compare in-engine composition with approved reference art.
6. Connect the encounter outcome to the existing Credo scene only after a narrative review; keep existing album order and authorized audio intact.
7. Produce 1280x720 desktop and 390x844 mobile evidence, test reports, and an asset manifest. Do not mark 'done' before visual, narrative, gameplay, and accessibility gates all pass.

## Current verified implementation gaps
As of source inspection: WalkScene.ts creates a primitive plant-like First Contact pickup at x=8450 and advances at a world-x threshold; CredoScene.ts offers a lantern-position slider and explicitly has no cleared Credo narration. Neither implements a populated society, an NPC conversation, or this meaningful repair encounter. This design document does NOT fix those systems by itself.
