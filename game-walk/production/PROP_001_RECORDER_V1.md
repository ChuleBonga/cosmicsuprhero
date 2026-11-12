# PROP-001 / First Contact portable recorder / candidate v1
Date: 2026-11-11 / Status: 3D model **built, creative/engine acceptance pending**

**Source:** Original mechanically plausible 3D design, **not** a Sony/Walkman product replica. The exact provenance and whether this is Xaba's or another character's recording device remain unapproved narrative decisions. This candidate is **not** what the visitor currently inspects on the live site; the current cobalt artifact is unchanged.

**3D asset review:** https://higgsfield.ai/3d-jutsu/b78a7bcc-c294-4da7-bd7c-20e9e252c530

3D Jutsu project: `b78a7bcc-c294-4da7-bd7c-20e9e252c530`, settled revision `2`, original built operation `first-contact-original-recorder-v2`. Scene exported as GLB (~473 KB), editable Blender source held by the 3D Jutsu project. A rendered review artifact was produced and published (~700x511 pixels). **The agent could verify the Blender scene structurally but did not directly inspect the rendered PNG**; visual judgment remains blocked, not passed. The interactive scene widget has been shown to the artist.

## Structural QA completed
- Dimensions of the hero shell: **0.315 x 0.190 x 0.055 m**; project set in metric units.
- 85 mechanical scene meshes; 14 reel-related objects; 8 materials; 2,616 triangle faces were originally reported including the studio floor; runtime mesh triangle count requires recount after cleanup.
- 86 meshes have UV maps; no armature. The **STUDIO floor has been removed in revision 2**. The GLB retains the review camera/lights and has not yet been imported into the live runtime.
- Original cobalt housing, burgundy strip, mechanical dual reels, physically distinguishable speaker, actuator buttons, service contacts, fasteners and side grips.
- Current materials are simple Principled roughness/metallic values, not approved UV-baked PBR textures. No animation exists for reel drive, transport buttons or insertion.
- Audio, ownership, narrative role, control behaviors, physical clearance and final material appearance remain undecided.

## Required QA before scene integration
1. Artist compares model preview to the official album artwork, the recorder reference imagery and approved mechanical concept; accept/revise silhouette and materials.
2. Confirm export-only prop collection, excluding review camera/lights; verify pivot, hierarchy and scale.
3. Review 3D model from front, profile and back at natural hand-held scale, inspect for intersections, bevel/shading and UV material issues.
4. Produce optimized runtime .glb with no studio scenery; check Three.js GLTFLoader, draw calls, texture/memory budget, WebGL rendering and device quality.
5. Add actual mechanic: discover, inspect, interact, bring to relay if story approves, no collection softlock. Do not replace existing approved First Contact automatically.
6. Recheck user-approved narrative role, recording rights and pre-save flow before any public update.

**Disposition:** Built technical **prototype only**, no production approval or release status. It must not be used as evidence that NPCs, settlement or narrative have been implemented.
