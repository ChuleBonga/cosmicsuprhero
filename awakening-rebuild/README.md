# Arcturian Awakening — clean restart

**Status: mechanics laboratory, not a finished game.** New source tree, new architecture, no reuse of the Phaser walking scene. The old production website and game remain unaffected.

## Why this exists
Previous builds passed CI while failing the actual artistic acceptance criteria: no believable civilization, no production NPCs, no meaningful player agency, and a world largely made of procedural cliffs, primitives and random objects. This code is deliberately not another walk-and-pick-up demo.

## Current implementation
- Three.js r187 + latest stable Vite and TypeScript at project start
- A stationary narrative encounter, where player gathers three testimonies
- Requires ordering evidence to reconcile conflicting accounts
- Wrong interpretation impacts trust; no hard softlock
- Final ethical decision branches into two different outcomes
- Deterministic pure state machine, event-log save/restore and tests
- Accessible HTML controls, keyboard and touch
- Deliberately nonrepresentational Three.js **lighting calibration**, not a counterfeit city
- Approved glTF world and humanoid models remain **unavailable**, so no fake NPC renders

## Source-of-truth and creative limits
The illustrated album world must retain cobalt/indigo sky, massive saturated orange-red sun, ochre-lit dark-blue landscapes, elongated blue-skinned inhabitants, and lived-in civilization. The playable story must answer: Why has Chule returned? Why is Credo important? What does the community stand to lose? How does the music shape what the player can do?

The current scenario statements and artifact names are *provisional*. They are not original artist dialogue, cleared audio, or official album canon.

## Local development
Node >=22.12.0. From this directory: `npm install`, `npm run dev`, `npm run build`.
The production path is intentionally separate. Do not merge without creative and technical gates.

## Mandatory next asset milestones
1. Obtain the approved civilization and album-art reference source files at usable resolution; document a shared camera and scale reference.
2. Author a location bible describing dwellings, public works, economy, social activity, materials, clothing, technology, lighting, and inhabitants.
3. Produce **one approved** original resident model as `.glb` (including clean topology, physically based textures, skeleton, facial controls, gestures, idle/walk/talk animation). No generic model substituted as canon.
4. Produce a coherent inhabited district with animated residents and visible daily activities, then integrate via asset manifest.
5. Replace the lighting calibration with an art-reviewed 3D level; render first-person and third-person desktop/mobile captures.
6. Integrate music with explicit artist clearance. Sequence starts `Meditate` and ends `Finale`; do not invent or substitute tracks.
7. Test camera, animation, input, performance, save state, narrative branches, accessibility and emotional comprehension with real users.

## Quality gate
No appearance claim without in-engine screenshots compared to supplied artwork. No gameplay claim without an observed playthrough. No production deployment from this branch. A build passing is only a technical gate.

## Current exclusions
No background playback, no unlicensed models, no synth imitation of the artist's music, no expensive assets/API usage without approval, no fake 3D humanoids and no claim of full civilization. A GLB loading interface is present but cannot be approved without real art.
