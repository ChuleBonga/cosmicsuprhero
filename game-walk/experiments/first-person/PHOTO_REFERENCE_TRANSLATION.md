# Build 06: Photo-reference translation into Arcturian Awakening

**Purpose:** Treat the photographs supplied during the ongoing physics, world/action, and mobile UX audit as observation studies for realistic world construction. They are not game-ready textures, and they are **not** permission to alter the planet into an Earth woodland. Do not add their original JPEGs to the repository, public site or preview without a separate art/rights decision.

## What the photographs show

### A. Woodland floor and scattered vegetation (first three later reference photos)
- Natural ground is a multi-layer accumulation, not a uniformly tiled material.
- Fine roots, woody fragments, curled leaves, pebbles and damp soil cross one another with different depths and contact shadows.
- Small high-chroma details are scattered irregularly over larger muted fields. Strong variation in orientation, size, occlusion and age prevents procedural repetition.
- Ground detail must be evaluated at **player eye height** and at near-ground pitch: a close-up texture can look convincing in isolation and repetitive from 1.7m above it.

**Planetary translation:** create a small catalog of original stone spalls, brittle mineral plates, sediment chips and sparse unknown non-Earth organic debris only if accepted for the world's ecology. Use instanced 3D for silhouette-bearing fragments; tileable ground textures and decals for microdetail. Do not scatter recognizably Earth maple leaves or terrestrial ferns into the existing isolated ancient planetary world.

### B. Wet ground, pooled water, shallow water and suspended matter (middle reference photos)
- Water is not a flat blue diffuse texture. The image depends on surface reflectance, pooled depth, darker submerged substrate, suspended fragments, algae-sized particles, distortion and ripples.
- Moisture accumulates in low points and contact crevices; it does not appear as arbitrary glossy splashes across elevated surfaces.
- Floating fragments lie in or intersect the surface plane, and water has different roughness from adjacent soil.
- Reflections, ripple scale and specular response depend on view angle.

**Planetary translation:** reserve a potential shallow-water micro-area **only if the artist approves water as part of the world's geography**. For a first prototype, use a small static wetness mask tied to depressions, directional roughness variation and rocks that darken at ground contact. Do not add expensive full-screen water reflection passes or liquid physics simply because the references show puddles. Any actual water plane must align to terrain and player collision and be profiled on the representative phone GPU.

### C. Honey-orange fractured crystalline rock and soft blush/pink mineral macro reference
- Physical crystalline planes create a real shape hierarchy: flat cleavage faces, stepped breaks, granular chips and narrow deep joints.
- The color variation follows the mineral's structure, not uniform noise sprayed across all directions.
- Silhouette edges, contact cavities and layered translucency/roughness are at least as important as high-frequency base-color noise.

**Planetary translation:** retain canonical cobalt indigo geology and the enormous saturated orange-red sun. Introduce local sunlit ochre mineral faces or blush-like veins only as **small supporting accents**; do not repaint the entire landscape peach, pastel pink or pale sandstone. The existing First Contact crystalline vessel is the highest-value candidate for deliberate authored facets and roughness variation.

## Production rules derived from these references

1. **Macro:** believable large silhouette and horizontal/vertical spatial depth; terrain shape and building scale first.
2. **Meso:** geological breaks, surface transitions, contact cavities and strata tied to form.
3. **Micro:** subtle mineral grains, pores, brittle chips, dirt deposits and material roughness, only where the camera gets close enough to benefit.
4. **Physics correspondence:** rocks with meaningful height should receive correct static collider proxies; ground-cover details below the movement step threshold can be decorative but must not visibly float.
5. **Budget:** prefer shared instanced forms, two-to-three near-camera detail sets and baked material masks. Preserve a 60 FPS **target** without claiming it until frame-time p95 has been measured on named devices.
6. **Mobile framing:** ground-detail readability matters more than sheer density. The player's thumbstick and interact control must not block first-person encounters; safe areas, orientation and readable minimum touch targets take priority over decorative UI.
7. **Narrative:** do not turn the five-minute experience into sixteen chapters or mandatory item hunting. *Awaken Now* remains the theme; other song names may inform inspectable artifacts.

## Build 06 status

**Implemented in the branch:** tapered movement corridor, more generous touch inspection range, scrollable mobile intro, reduced HUD/control collisions, touch zoom, score volume in Pause, direct pre-save and corrected artist exits, pointer-lock resume, and source-level mobile regression tests.

**Not implemented in this branch:** actual foliage, water, ripple simulation, physically measured moisture/friction, high-poly photogrammetry, or new in-world environmental interaction. These reference-derived features remain art and physics proposals pending visual feasibility and approval.

**Verification constraint:** build/tests and static preview HTTP checks can pass without a GPU-capable browser or actual phone. A remote mobile page check loaded the entry HTML; in-world composition, graphical rendering, touch ergonomics and frame-time profiling remain unverified.
