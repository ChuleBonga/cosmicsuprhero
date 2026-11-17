# CHR-002 — Caretaker: first authored resident

**Classification:** production character specification, v0.1. **Not approved art, not an existing model.** This is a role brief and measurable production contract; no invented name, speech recording, or canonical ethnicity is supplied here.

## Character's reason to exist
The caretaker manages a communal memory practice and personally remembers Chule's family. She must be busy before Chule arrives and return to her work afterward. She has a concrete stake in whether people disclose a record that not everyone knew survived. Her help and willingness to speak change after the player's behavior. She cannot exist merely as a stationary quest indicator.

## Source hierarchy
1. Artist-supplied album illustration and actual civilization reference images. Their full-resolution source material must be attached and identified before appearance sign-off.
2. The existing project identity and game narrative briefs: cobalt/indigo skies, giant orange-red celestial sun, blue humanoids with elongated heads and dark eyes, ochre geological bounce, weathered burgundy/purple fabric and restrained 1976 film realism.
3. This document's provisional design proposals, which cannot override source images.

**Do not infer an alien's facial anatomy directly from the human Cosmicsuprhero likeness-lock document.** That source may guide emotional truth, not species anatomy.

## Silhouette and material contract
- The head must preserve the album-world cranial shape and eye placement. Test front, profile, rear and three-quarter under neutral illumination before fine sculpting.
- Blue skin must contain plausible anatomical structure, color irregularity, controlled roughness, age and microdetail. No uniform plastic blue shader, glass eyes, luminous irises or superhero anatomy.
- Clothing is motivated by daily civic work: physically constructible, worn burgundy-purple textile, readable closures and layered overlaps; wear follows handling, sun exposure and movement.
- Every adornment or technology element must have a job and be supported by reference or an approved cultural design rule. Do not add generic gold ornaments, mystical decals, armor, or arbitrary glowing components.
- Her age and social responsibility should be clear through subtle posture, gait, clothing repairs and how residents react to her, not exaggerated wrinkles or caricature.
- Working test scale: 1.75 m total height **for engine calibration only**, subject to visual reference.
- Build under the world’s red-orange directional light and blue ambient sky. Neutral studio render must still reveal convincing face, anatomy, cloth and materials.

## Required source and runtime files
```
assets/characters/CHR-002/rev01/
  source.blend                 # original editable topology, materials and rig
  reference/                  # licensed/artist-supplied images, IDs, notes
  lookdev-front.png
  lookdev-profile.png
  lookdev-back.png
  lookdev-three-quarter.png
  face-emotion-sheet.png
  animation-contact-sheet.png
  npc-caretaker.glb            # valid glTF 2.0, meters, +Y up
  provenance.json
  review.json
```

## Rig and animation contract
The armature must provide body locomotion and gestures, eye aim, jaw/mouth performance and believable hand contact. Clothing must not clip at shoulders, wrists, knees, or during turns. Named animation clips to export and play independently:

| Clip | Performance purpose | Acceptance |
|---|---|---|
| `idle_work` | Performs a believable task without player | Works as ambient life, breath and attention remain subtle |
| `walk` | Changes location with specific objective | Feet contact ground without sliding; matches controller speed |
| `notice_chule` | Recognition and social hesitation | Emotion readable at default gameplay camera |
| `listen` | Holds eye-line and makes space for response | Natural stillness, responsive gaze |
| `speak` | Covers dialogue without robotic lip motion | Timing suitable for approved lines/captions |
| `refuse_help` | Reacts after harmful behavior | Differing behavioral outcome, not just changed caption |
| `offer_help` | Helps after earned trust | Allows real later access to Credo |
| `handle_record` | Manipulates a tangible community object | Hands meet object with correct contact/pivots |
| `return_to_task` | Resumes working life after conversation | No visible teleport or repeated arrival loop |

Do not assume generic canned Mixamo animation will solve the acting style. Retargeting is acceptable only after human review of pose, feet, hands, face and cloth.

## Critical test scenes
1. Neutral turntable, diffuse light: full body, head close-up, front/profile/back/three-quarter.
2. Album lighting: character within shadowed cobalt/ochre exterior and giant red sun key. Compare against the supplied illustration.
3. Social blocking: three residents cross the frame doing different work; the caretaker begins occupied and notices Chule.
4. Decision consequences: the caretaker either brings Chule toward the listening hall or withholds that help. The difference must occur in playable space and survive reload.
5. 390×844 mobile: face and gesture remain legible during actual dialogue, with safe area and subtitles.
6. 1920×1080 desktop: no dark-eye flattening, background blending, wardrobe aliasing, or skin-gloss overexposure.
7. Animation failure fallback: broken or missing clip gives safe idle and captioned response, not invisible character.

## Numeric and rights checks
- Validate GLB using Khronos glTF Validator; document skeleton count, skinned mesh count, named clips, triangle count, draw calls, material count, texture dimensions and load timings.
- Provisional character budget: 25k–60k triangles at close range, lower LOD target established *from appearance at actual gameplay size*, not solely decimation ratio.
- PBR channels: base color treated as sRGB; roughness/metal/normal as non-color. Microdetails may require mapped normal texture, not flat blue.
- No licensed photo, voice recording, or source-model use without a recorded license and applicable permissions.
- UI, physics, save state and dialogue should not import this character until art review passes **all** visuals, animation and real camera tests.

## Art decision record: November 17, 2026
- **No approved character concept in the accessible source repository.**
- **No CHR-002 Blender model, rig, textures or runtime GLB exists.**
- One image-generation attempt generated an unrelated promotional collage with invented UI/status and was explicitly **rejected, not integrated**.
- A licensed, generic third-party humanoid may be used **only in automated renderer tests**; it must not be mistaken for Arcturian character art.
- Do not mark this character done on the strength of a successful npm build, a text description or a flat portrait.

**Acceptance authority:** artist/reference review and gameplay-camera evidence. The renderer is a delivery mechanism, not the identity source.
