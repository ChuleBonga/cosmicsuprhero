# PROP-001 / First Contact recording instrument: hard-surface prototype review

**Status:** Built as an offline original GLB candidate; **NOT artist-approved**, **NOT in the game**, **NOT canon**. Evidence package produced in the current session.

## Why this candidate exists
The live game currently displays a cobalt/bronze artifact without a credible connection to the album's music or the community's listening practices. The new candidate is a mechanical recording device with observable reels, magnetic tape spindles, recording head, capstans, transport keys, audio jack, speaker grille, fasteners and hinged strap points. This is a **hypothesis** about the technology, not an approved story decision or a magical replacement item.

## Build evidence
- Offline original 3D hard-surface source: `build_first_contact_recorder.py` (supplied as a review artifact; not yet added to runtime).
- Portable export: `AA_First_Contact_Recorder_PROTOTYPE_v01.glb`.
- Physical size: 0.32745 × 0.1035 × 0.21950 metres; metre unit scale, +Y up.
- Geometry: 80 semantically named parts, 2,502 vertices and 4,692 triangles. 9 distinct base-color material families. GLB exported and successfully read back into a scene.
- Two offscreen VTK proof renders and a review sheet generated. These are **NOT Three.js game screenshots**.

## Current verdict: REVISE
The device reads mechanically and is a genuine 3D object, but the surfaces are too hard-edged; no original UV-baked roughness/normal maps, aged materials, actual tape motion or inspect/repair animations exist. Its exact design and narrative ownership have not been artist approved. It is not ready for `public/` or for replacement of the existing First Contact artifact.

## Acceptance before integration
1. Review artist-supplied 1970s/80s audio-object reference set and approve physical design language.
2. Design physical recording mechanism, repair procedure and correct relationship to Credo or other approved characters; do not invent canon.
3. Improve bevels/edge highlights, material specificity, scratches and dust, repair panel and world-space scale.
4. Create production version with audited GLB material/shader compatibility, appropriate collisions, animation clips, optional LODs and compressed textures.
5. Verify grounded discovery and real object inspection in the live 3D renderer on desktop and 390px viewport; record FPS/p95 and controls.
6. Maintain pre-save accessibility and do not include uncleared music.

## Reference priority
`game-walk/production/CANONICAL_LOOK_LOCK.md` and artist-supplied album PDF are official appearance anchors. The 43-image mood board is documented but its full files need direct review before art approval. Never copy Sony/Walkman trade dress or pretend this prototype establishes Arcturian culture.

**Only promote the register's PROP-001 state after its committed, inspectable source/artifact and acceptance evidence are attached to the real project.**
