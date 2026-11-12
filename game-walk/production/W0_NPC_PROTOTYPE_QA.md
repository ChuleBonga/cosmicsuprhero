# W0 / First authored NPC & review-only behavior
**Status:** concept-only 3D candidate; working behavior under review gate; artist approval outstanding. Revision 2026-11-11.

## Purpose and visual authority
Provide the first real, independently active **resident** of the waystation, without inventing the character's name, ancestry, social class, dialogue, spiritual symbolism or relationship to the protagonist. A viable inhabitant should have ordinary tasks and react to a person instead of existing as scenery. Visual references: artist's approved cobalt/indigo/red-sun album artwork and the private 43-reference board. The board's full images are not embedded in the repository; exact look comparison remains outstanding.

## Actual 3D asset (not the same model as the temporary engine proxy)
[W0 original editable Blender/GLB model](https://higgsfield.ai/3d-jutsu/beb20714-b4be-4fc7-bde8-63b435f038be) · settled revision **3**.
- Meter-scale model: about **1.84 m** height, root at feet, blue-green elongated cranium, dark eyes, utilitarian tunic/apron, plain burgundy working wrap, hands and mechanical service tool.
- **41 exported meshes**, all with assigned materials; 10 Blender material roles. Full GLB export has **3 glTF animation clips**, one for subtle root motion and two for arms.
- **Animation was numerically audited at frames 1, 11, 22, 34, 43, 58 and 73 at 24 FPS.** The right hand/tool advances toward the task and returns, with matching start/end positions. This is a basic object/transform rig, not a proper deforming skeleton or lifelike performance.
- Presentation studio floor removed at revision 3. The model is available as an authored GLB and editable Blender scene in the hosted project; it **has not been copied into the website source or visually accepted**.
- glTF export test found **41 mesh primitives**, **33 UV-equipped primitives**, and 3 animation clips. Eight primitives have no UV coordinates; this must be repaired or given deliberately procedural materials before texture baking.
- Hosted GLB ~363 KB; the specific export settings and GPU budget for the final web game remain to be verified. Review cameras/lights remain in the hosted scene and may need exclusion when making a runtime-only export.

## Functionality in current game source
[Worker routine](../experiments/first-person/worker-routine.mjs) and [model proxy](../experiments/first-person/worker-art.mjs), committed on main.

- Normal `/play/` **does not display** W0. It remains unapproved art.
- Hidden review URL: `https://cosmicsuprhero.vercel.app/play/experiments/first-person/index.html?art-review=inhabitants`.
- The gameplay test harness instantiates a cheaper **different** procedural worker silhouette only when review mode is requested. It works independently for recurring cycles, notices a visitor, and acknowledges a deliberate E/touch interaction before returning to work.
- The prototype has no named character, recorded lines, scripted quest, completed relationship, social conflict, or consequence. It is neither a finished NPC nor a populated civilization.

## Verification status
- **PASS:** GitHub/Vercel production build checks including the added behavior, art geometry and review pose tests; compiled 3D bundle serves HTTP 200 and contains review-only worker code.
- **PASS (Blender structure):** authored character dimensions, count, material assignments, separate pose tracks and export content inspected.
- **BLOCKED (browser visual):** the public browser session failed with `ERR_SOCKS_CONNECTION_FAILED` before it could enter the live scene. Therefore no in-game worker screenshot, correct lighting, foot/hand contact, mobile layout, actual NPC interaction, or frame-time result may be claimed from that run.
- **NOT PASSED:** resemblance and material quality against original album/reference images; full NPC rig and task animation; character independence beyond simple deterministic states; physical phone performance.

## Next acceptance work
1. Compare the actual **Blender** model with approved character art and full references. Reject or refine anatomy, face, cloth and character silhouette; do not approve simply because it resembles a person.
2. Replace the engine proxy with the cleaned, production GLB after asset transfer and shader/UV/pivot audit. Retain only one authoritative source for that character.
3. Build true work interaction with the station: hand reaches and makes meaningful contact; independent schedule plus world response. Improve movement, gait, actual task objects, interruption and recovery.
4. Design a distinct second inhabitant and tangible social relationship. Confirm the `why now` story and voice/line approval before writing named NPC dialogue.
5. Inspect player-scale desktop and 390×844 mobile screens and record measured on-device p95/frame budget before allowing public activation.

**Do not publicize this as a finished populated game.** The live homepage and album release/pre-save remain independent.
