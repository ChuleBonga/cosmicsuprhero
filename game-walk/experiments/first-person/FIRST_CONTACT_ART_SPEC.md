# First Contact — Encounter Art Bible (Build 04)

## Creative intention
First Contact should feel like an object with physical weight, provenance, and a reason to occupy this location. Its first encounter should change how the visitor perceives the environment, without inventing new album lore or adding a required quest. This is **a five-minute first-person story toward the album pre-save**, not a horror game or an inventory simulator.

The principal influences remain the supplied *Arcturian Awakening* visual identity:
- Deep cobalt and indigo sky, huge red-orange sun, indigo mountains in ochre sunlight.
- Weathered, ancient, isolated planetary atmosphere.
- Physically coherent stone, mineral, oxidized metal, sun direction and scale.
- Restrained late-1970s cinematic sci-fi presence; no generic glowing loot, ornate sci-fi widgets, or copied game props.

## Authored asset grouping
All dimensions are in **metres**, +Y up and -Z forward. Root placed at the existing First Contact obstacle center: (x=-0.9, z=-35) with height derived from groundHeight.

### 1. The listening plaza
- Buried concentric stone paving rings at radii ~3.1m and ~4.4m, with deliberately missing modules.
- The pavers are near flush with underlying terrain: not unmodeled stair obstacles.
- Additional tessellated stone and radial inscriptions remain within the plinth's physical collision area.
- Two broken load-bearing stone wings beyond the playable corridor suggest architectural scale without presenting unmodeled obstacles to the player.

### 2. The pedestal
- Tapered, weathered base with **2.36m collision radius**, matching `WORLD_OBSTACLES` exactly.
- Layered mineral/metal seating and a physically continuous vessel contact.
- A small, restrained point-light bounce, not a bloom-driven glow.

### 3. The original vessel
- Irregular cobalt mineral shell with an exposed blue mineral interior.
- Oxidized metal binding fragments, asymmetrical anchor fins, pin-heads and surface repairs.
- Finite original geometry, opaque PBR materials, instanced repeated details.
- The artifact is stationary while in the world. Only visitor examination rotates the close-up geometry.
- One scene object is cloned for examination, retaining the same geometry and materials.

## Tactile interaction
- The visitor must approach and face the object. Existing proximity and facing checks are retained.
- The object eases from farther away into an inspectable close-up, instead of snapping directly into the camera.
- Mouse/touch drag and keyboard arrow keys rotate it. Wheel and +/- keys zoom within safe limits.
- Esc or the visible Return control exits. No collectible count, no need to obtain the object to finish.
- During the examination, *Awaken Now* is attenuated. The subsequent lighting response across the environment is restrained and does not overwrite the composition.

## Integration contracts
- `encounter-art.mjs`: pure Three.js geometry constructor. Does not access DOM or network.
- `inspection-motion.mjs`: render-independent easing and input functions, directly unit testable.
- `world-art.mjs`: imports the original encounter and applies existing material families; remains owner of world lighting and terrain.
- `world.mjs`: keeps playback, input, interaction, camera and render control separate.
- `world-logic.mjs`: owns authoritative physical obstacle dimensions and fixed 60Hz step movement.
- `encounter-art.test.mjs`: checks physically aligned radius, finite geometry, instanced paving, clone fidelity, material properties and structural-wing placement.
- `inspection-motion.test.mjs`: checks input locks, keyboard rotation, bounded zoom and stable easing.

## Art and technical review gates
**Not achieved by a successful build:**
1. Visually compare the live WebGL scene against the supplied album art in a GPU-capable browser. Review at actual player eye height and during object rotation, not merely as an attractive camera still.
2. Refine the prop in a dedicated modelling package (e.g., Blender), bake sculpted microdetail and unique wear into normal/ORM textures, author high-quality UVs, and export production GLB with Meshopt/KTX2 where appropriate.
3. Build a collision test scene showing actual character capsule, prop bounds and paved ground contact at walking and inspection distances.
4. Profile desktop and specific mobile devices. Target p95 frame time <=16.67ms at nominal 60Hz with quality settings and device conditions reported. Do not equate Vite build output or deterministic simulation tests with measured frame performance.
5. Complete the musical and narrative cue sheet for the approved *Awaken Now* excerpt; maintain the existing production audio-publication safeguard.
6. Confirm focus behavior, reduced motion, screen-reader interaction text, touch and mouse ergonomics, load and failure states.

## Production safety
Feature branch / draft review only. The public website and its old /play/ route stay unchanged until actual visual quality, usability, audio rights and performance are approved.
