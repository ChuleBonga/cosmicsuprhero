# PROP-001 / First Contact Recorder Candidate Review
**Date:** 2026-11-11 · **Decision:** do not generate another recorder until the existing candidates are compared against approved source art.

Three substantially overlapping prototypes are now discoverable in the production history. A passing build or good statistics cannot select the winner without visual comparison and design approval.

| Candidate | Evidence | Measurements | Current limitations |
| --- | --- | --- | --- |
| A / original offline model | [Source and QA](PROP_001_RECORDER_PROTOTYPE_QA.md); `AA_First_Contact_Recorder_PROTOTYPE_v01.glb` generated offline and structurally reimported | 0.32745 x 0.1035 x 0.21950 m; 80 semantically named parts; 4,692 triangles; 9 material families | No accepted production material/texture maps, no animation, Three.js integration, story/culture approval. VTK render != in-game render. |
| B / previously hosted Blender candidate | [Original 3D project](https://higgsfield.ai/3d-jutsu/b78a7bcc-c294-4da7-bd7c-20e9e252c530); [v1 notes](PROP_001_RECORDER_V1.md), revision 2 | body about 0.315 x 0.190 x 0.055 m, 85 prop meshes; 8 materials; clean-up removed preview floor | Camera/lights remain in scene; performance export and animation unapproved; render was not directly inspected by assistant. |
| C / alternative R0 hosted candidate | [3D project](https://higgsfield.ai/3d-jutsu/0eda9e71-40bf-4fcc-b651-7f9ad7e507d5); [R0 notes](PROP-001_RECORDER_R0.md), revision 2 | body about 0.274 x 0.185 x 0.084 m; 80 scene meshes, 2,502 faces incl studio; two reels, five transport keys, 11 material names | Studio backdrop remains in exported scene; Blender render not yet independently visually inspected, not engine integrated. |

## Next decision to make (creative director)
- Examine each actual 3D model from front/top, profile, back, and normal gameplay distance; use the original album illustration and the 43-image private device references.
- Pick **one** mechanical architecture and the object's purpose in the story. If none fits the supplied references, reject all three with specific reasons before a new sculpt.
- Do not assume that cassette/reel technology, the artifact's ownership, or a relationship to Credo/Xaba has been approved. Design the story function and object operation together.
- Once selected, create a canonical `PROP-001` production asset with one authorable source, glTF-compatible materials, proper origin / physical scale and no staging objects.
- Validate it in Three.js in the actual environment and inspect interactions at mobile and desktop; only then promote asset state from concept-only.

## Current public status
`PROP-001` remains **concept-only**. The live First Contact object is still the current cobalt find and the public 3D journey and album links remain unchanged. These candidates are **not user-visible as separate experiences on the album site**.

## Immediate strategic correction
Additional art should prioritize **inhabitants and actual daily life**. Building four candidate cassette props before a genuine NPC or inhabited location is a production imbalance. The first settlement and character silhouettes should now receive attention, not more variant recasting of the recorder.
