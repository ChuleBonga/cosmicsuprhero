# Arcturian Awakening — source-image fidelity lock
**Reviewed:** 17 November 2026, from the actual exported figure and mountain plate recovered from the project's prior game files.
**Status:** source-grounded art-direction constraints, NOT civilization or character approval.

## Files inspected
- `game-walk/public/art/aa_cover_figure.webp`, 262,416-byte project illustration, copied to `awakening-rebuild/engine-lab/public/references/aa_cover_figure.webp`.
- `game-walk/public/art/aa_mountain_repeat.webp`, 140,836-byte project landscape repeat, copied to `awakening-rebuild/engine-lab/public/references/aa_mountain_repeat.webp`.
- Captured reference viewer: GitHub Actions run [44204092817](https://github.com/ChuleBonga/cosmicsuprhero/actions/runs/44204092817), screenshot `source-reference-comparison.png`.

These images already belong to the project. They are not newly generated concept artwork, not authored 3D meshes, and not a replacement for the higher-resolution civilization references supplied in earlier discussions.

## Visual truths directly observable

| Attribute | Present in recovered image | Required interpretation |
|---|---|---|
| Celestial anchor | One large saturated orange-red sun in the figure composition | Preserve its apparent dominance and orange-red chroma under coherent single-sun lighting |
| Sky | Cobalt/indigo transition, sparse distant stars/texture | Preserve a dark blue environment, never default tan or black sci-fi fog |
| Geography | Angular and rounded hills, gold/ochre edge illumination over dark blue geology | Physically believable mountainous shape and directional light; preserve silhouette contrast |
| Figure | Distinct cobalt-blue humanoid seen mostly in profile | Sculpt needs deliberate species proportions; no assumed rear/front anatomy |
| Face | Dark eye and elongated, smooth cranium | Photoreal makeup texture and eye response without changing silhouette or adding luminous iris |
| Clothing | Weathered burgundy-purple hooded drape | Practical garment construction and convincing cloth motion; do not invent ceremonial armor |
| Character placement | Foreground human-scale figure against vast landscape | Preserve scale contrast while giving inhabitants actual social occupation in the world |

## What the actual files do NOT prove
- Architecture, transportation, buildings, food culture, written language, domestic interiors or public institutions.
- Full-body anatomy, the other side of the face, accurate mouth construction, facial muscle placement and turntable identity.
- Whether the blue-skinned pictured individual is Chule, Credo, or a resident. **Do not silently promote it to the caretaker's identity.**
- Wardrobe construction under the drape, accessories, jewelry, fabric joinery or physical age.
- The soundtrack/license sources or exact dialogue.
- Surface PBR values such as metallicity, IOR, subsurface depth, normal-map strength or exact GPU shader choices.

## Specific source defect
`aa_mountain_repeat.webp` shows **two bright sun discs** across its visible repeating composition. It is a continuity texture, not a final sky panorama. A 3D environment must have one intentionally placed celestial source and must not duplicate sun discs by repeating this plate. Distinct foreground, midground and sky source layers require proper non-repeating segmentation.

## Art decisions enforced in production
1. The album illustration is the actual color and silhouette anchor. Never replace with stock 3D fantasy architecture or neon UI aesthetics.
2. The photographic interpretation is a **production technique**, not permission to redesign the world. Use restrained analog 1976 film texture without shifting cobalt to beige, ochre to uniform yellow or the red sun to white.
3. First character gate: a **single** reference-faithful, physically convincing subject must pass front/profile/rear/lookdev/animation review before generating a population.
4. First environment gate: architectural construction logic has to be approved against the missing civilization references before any 20–30m location is marked visually complete.
5. Character and environment must be tested together in the same lighting and color-management setup; neither is approved based only on a studio render.
6. Native models and sources require asset-manifest IDs, rights/provenance, correct scale, skeleton, UV/texture sets, animation naming, optimization and screenshot evidence.

## Current release verdict
**FAIL for visual-world and NPC performance approval.** There is a clear source-art direction, a working 3D model-review laboratory and a deterministic resident-behavior simulation, but no original approved rigged Arcturian actor or authored inhabited district in the player-facing game.

The image-generation attempt to create a single caretaker from this image through a connected third-party generator was **not submitted** because that provider requires a higher subscription tier. This is a tooling restriction, not a generated asset or a user expense.
