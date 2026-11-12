# W0 / Blender character GLB in the single game, review-gated
**Status: ENGINE-INTEGRATED FOR ART REVIEW ONLY, NOT APPROVED OR RELEASED TO NORMAL VISITORS** · 2026-11-12

## Asset provenance
- Original editable Blender source: [Higgsfield W0 project](https://higgsfield.ai/3d-jutsu/beb20714-b4be-4fc7-bde8-63b435f038be), **revision 3**.
- Original export: 363,068 bytes. Production review export: **361,816 bytes**, SHA256 \`72ebfb14d96210fa318e4ec0afd95accd531abc9d30fe79cc71859664440a4e9\`.
- Only the character scene root remains. Staging camera, two studio lights and \`KHR_lights_punctual\` have been removed without altering mesh buffers or three authored animation channels.
- Character has 41 GLB meshes, three transform animation clips, original material factors and about 1.84 m nominal height. Not a deforming skeletal rig, facial performance or final NPC.
- Artifact is source controlled as a set of 16 ordered binary source fragments under \`game-walk/source-assets/w0-r3-review/\`. This is a transport workaround. \`scripts/assemble-w0-review.mjs\` recreates and checksum-verifies the **one** GLB before Vite builds; the browser receives ONE hashed model asset, not fragments.
- The compiled model is imported with Three.js \`GLTFLoader\` from \`experiments/first-person/worker-gltf.mjs\` only for the W0 internal art-review URL. There is no hidden dependence on an expiring hosted URL.
- Material/art fidelity not yet accepted; 41 drawables still require performance optimization, detail/UV audit and actual in-game visual comparison.

## In-game review
- One game, one normal route \`/play/\` remains unchanged.
- Review W0 directly: \`https://cosmicsuprhero.vercel.app/play/experiments/first-person/index.html?art-review=inhabitants\`.
- The former procedural worker \`worker-art.mjs\` is no longer instantiated in \`world.mjs\`. It remains as historical source/test evidence; the review intentionally fails visibly rather than substituting it if the GLB cannot load.
- W0's position and orientation share a single construction-layout contract with the waystation workbench. Feet are grounded using the loaded mesh's actual bounding box. The worker faces the repair workbench and can react to player presence.
- Three authored actions (two arm channels and subtle root movement) are played by \`AnimationMixer\` when working, faded while attending; deterministic behavioral states (working, noticing, acknowledging, returning) remain independent of animation.
- The work gesture is still rudimentary. A real tool-contact scene, foot IK, dialog, approved NPC relationship and actual lived-in city population have not been built.

## Acceptance and failure
- Build checksum, GLB structure, game physics and route QA are mandatory. Missing or damaged source fails the build; a browser loading error remains in the review diagnostic and does not mask itself behind a proxy.
- Browser screenshots at 1200×900 and 390×844, actual inspect/greet interaction, player eye-height, material fidelity against original album art, collision/foot/tool intersection and real hardware frame-time tests are outstanding until independently verified.
- Only the user/artist can approve a new character identity or its wider publication.
- No generated speech or uncleared recording enters the normal game. Existing pre-save route stays independent of WebGL.
