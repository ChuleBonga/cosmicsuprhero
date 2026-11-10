# First Contact — Grounded Discovery Art Specification (Build 06)

## Artist instruction
The user has explicitly rejected the earlier abstract pedestal presentation: **the artifacts found should be on the floor**. The 43-image visual ZIP additionally points toward tangible, weathered, handheld recording technology, physically credible ruins, cobalt/ochre atmospheric landscapes, ancestral dignity and tactile surface workmanship. The actual album art remains the primary visual authority.

## Scene intention
First Contact should feel **found**, not exhibited. A forgotten object has fallen or been exposed by erosion among broken pieces of an old walkway. The visitor notices it from ordinary eye height, approaches naturally, inspects the actual geometry, and continues without a compulsory collection action.

No hovering object. No tall pedestal. No rings of staged glyphs. No mandatory collectible gate. No photorealistic object copied from the mood board.

## Actual Build 06 design
- Keep the original cobalt mineral shell, visible blue inner surface and oxidized metal repairs **as an interim original relic** until an alternative physical recorder-inspired design is artist-reviewed.
- Place the original `core` at **ground height**, rotated to rest on its side, with limited burial, rather than at the previous 2.39 m pedestal offset.
- Eliminate the raised cylindrical plinth, metal seat, stone shoulders, trophy crown and perfect radial inscription display.
- Keep fragments of a degraded pathway near flush with terrain, plus low scattered rubble.
- Retain weathered architecture beyond the traversable corridor as a damaged, asymmetrical ruin rather than symmetrical twin framing.
- Keep the point light quiet: the object is discovered by material contrast and environmental context, not magical beacon intensity.

## Physical contracts
1 unit = 1 metre; +Y up, -Z into the route.
- Root origin remains at `WORLD.artifact` and actual `groundHeight`.
- `CONTACT_SPEC.findRadius` matches the First Contact `WORLD_OBSTACLES` proxy; no invisible 2.36 m plinth collider remains.
- Short decorative stones must not form impassable walls. Taller ruins remain outside the walkable corridor.
- Contact AABB must be near ground; test the bounds, not just the parent's transform.
- Discovery distance is still permissive, with no demand to gaze precisely downward; keep mobile usability.
- Original model/geometry is cloned for tactile inspection; world object remains stationary.

## Later hero-asset alternative (requires artist approval)
Study an **original** weathered portable listening device with real buttons, imperfect casing, exposed mechanism, speaker vents, battery contacts and blue mineral elements. The user's reference images include cassette tape, old audio hardware, several Sony Walkman concepts and modular storage pieces. **Do not copy any commercial device's shape, labels, logos or exact trade dress.** Before replacing the current relic, create two original silhouettes, compare them at game scale and select with artist approval.

## Cultural handling
The provided Xhosa visual references, ankh image, historical Kemet portraiture and Afrofuturist figures convey cultural presence. They are not a public texture atlas or a free set of sacred glyphs. Research meaning and obtain explicit creative direction before using recognizable cultural signs. Avoid aesthetic homogenization of distinct African traditions.

## Tests and acceptance
- `encounter-art.test.mjs`: approximate terrain-to-bounds contact, grounded scale and posture, absence of obsolete altar parts, finite geometry, sensible material setup and off-path ruins.
- `world-logic.test.mjs`: updated collider footprint and existing fixed-step navigation checks.
- Browser review: screenshots from a GPU-capable browser at eye height, approach and inspection, on desktop and portrait phone; ensure the relic is visible and convincingly grounded. Check no hovering, z-fighting, foot skating, navigation traps or excessive darkness.
- Music: visitor-initiated Awaken Now in separate preview; pause/mute/ducking must not prevent progress.
- Performance: inspect draw calls, frame-time p95 and actual device behavior, not just passing compilation.

**Remaining unknowns:** Actual close-up aesthetic quality, physical-phone comfort, perceptual believability and stable 60 FPS. No source image from the user's ZIP is committed or deployed.

See `DESIGN.md` for the world-wide visual contract.
