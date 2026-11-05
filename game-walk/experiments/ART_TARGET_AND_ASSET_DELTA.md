# Arcturian Awakening: asset gap and visual target investigation (2026-11-05)

**Scope:** review of `game-walk/` on branch `feat/awakening-first-listening-20261104`, compared with `game-walk/ASSET_SPEC.md`, `source/BRIEF.md`, `source/SOURCE_INDEX.json`, and the newer artist-provided high-fidelity 2.5D side-view reference.

**Status:** non-production investigation. This document creates **no new approved art** and does not claim any generated image is game-ready.

## Confirmed files on the checked branch

| Asset | Files present | Technical status |
|---|---|---|
| Character | `protagonist_atlas.png`, `keeper_atlas.png` | Functional small atlases; not approved character-performance rigs |
| World | `far_tile.png`, `middle_tile.png`, `near_tile.png` | Repeatable scenery; not authored collision or independent complete scene planes |
| Derived artwork | `aa_cover_figure.webp`, `aa_mountain_repeat.webp` | Source/visual aids, not a complete production environment |
| Preview sound | `score_awaken_now_loop.m4a`, `pickup_first_contact.m4a`, `pickup_xaba.m4a` | Artist approval remains pending in manifest; current AudioDirector only fetches First Contact |
| Story/UI | Generated Phaser shapes, rectangles, text | Functional placeholders, not final production art |

`ASSET_SPEC.md` calls for five independent 2048×1152 RGBA layers, a 1024×1536 character master, walk frames 00–15, idle frames 00–07, matching sprite atlases, and a portrait safe-area guide. Those deliverables do not appear in the current `game-walk/public/art` inventory.

`source/SOURCE_INDEX.json` points to an artist source vault and three candidate terrain layers in `art_candidates/revision3`; these should be retrieved, compared, and reused **before** generating replacements. The vault is not verified or reproduced by this branch review.

## Creative conflict to resolve through an A/B visual experiment

- Earlier `source/BRIEF.md` explicitly says the artist selected strict 32-color pixel art, logical 480×270/270×480 resolution, alien sprite of approximately 32×48 px, and mostly flat world layers.
- Recent artist guidance supplied a high-fidelity, architectural, side-view 2.5D reference. The requested bar is convincing geometry, lighting, animation, depth, and environment construction.
- The earlier spec also describes the entire experience as a no-fail quiet walking game with Awaken Now as the continuous score. A later sixteen-track narrative plan makes Meditate the opening cue and includes an eventual battle.

Do not silently treat either old or new documents as approved final canon. Prototype one **single identical opening shot** in two approaches: (A) authoritatively refined pixel art; (B) Blender-authored painterly/pre-rendered 2.5D. Compare at actual desktop and phone size using identical camera framing, source palette, staging, and character silhouette. The newer reference informs the target; copying its characters, composition, or architecture is prohibited.

## First vertical slice: asset creation and validation matrix

| Order | Asset deliverable | Dependencies | Pass criterion |
|---|---|---|---|
| 0 | Preserve original source vault and image/recording provenance | Artist archives | Inputs cataloged, SHA256 recorded, no overwrites |
| 1 | Target composition keyframe: red sun, desert threshold, solitary human-scale protagonist | Album art, newer reference | Approved emotional and spatial hierarchy; no text baked in |
| 2 | Scene architecture blockout: playable ground, silhouettes, doorway/landmark, depth | Keyframe, movement footprint | Plausible supports, sightlines, scale, navigation |
| 3 | Terrain contact mesh or 2D height/collision outline | Blockout | Slope, ledge, landings, and interactions match rendered stage |
| 4 | Hero master character/rig or consistent atlas | Approved identity | Side views, same anatomy/foot pivot, no frame jitter |
| 5 | Movement clips: idle, accelerate, walk, brake, turn, jump, fall, land, listen | Rig/master | Contact timing follows actual fixed-step movement |
| 6 | Distant/middle/near/occlusion layer renders | Stage/camera | Correct masks and perspective, no visible repeating seams |
| 7 | Surface materials and authored light/shadows | Stage geometry | Consistent scale, normal/roughness where relevant, controlled haze |
| 8 | First Contact landmark: intact, proximity, active, recovered | Narrative/music cue | Interaction readable without giant debug labels |
| 9 | VFX: dust, light, weather, music-driven reveal | Music timeline | Controlled density, appropriate reduced-motion fallback |
| 10 | Sound: approved excerpt(s), ambience, synchronized changes | Artist clearance | No masters shipped, gesture unlock, iOS playback verified |
| 11 | HUD/pause/accessible prompts and safe-area variants | Stage/mobile camera | Readable at portrait size, keyboard and touch work |

### Asset pipeline

1. **Retrieve and review existing source art** first (including the source vault). Do not regenerate strong assets.
2. Establish one original cinematic target frame that belongs to this album, not a copy of the reference.
3. Author geometry/animation in Blender or create properly separated source-layer paintings according to the approved art route.
4. Export named source assets with pivots, masks, geometry/collision files, dimensions, and provenance.
5. Optimize with a repeatable build and compare before/after screenshots. Candidate tools: Blender glTF exporter, glTF Transform, WebP/AVIF/PNG depending on purpose.
6. Validate each asset **inside the real game camera** and on an actual phone before claiming it is finished.

### Enforced gates

- An attractive AI scene image is **not** a parallax pack, a mesh, a rig, a collision map, or a working game asset.
- A passing Vite build is **not** evidence of visual fidelity.
- 3D and 2D options must be compared before new runtime dependencies are accepted.
- No unapproved image/audio is shipped; no production merge or deployment.
- Default to a smaller finished 60–90 second scene rather than new chapters.

## Next proof of work

Before replacing `GrayboxWorld.ts`, create two same-camera static preview frames from existing source material and the user’s high-fidelity reference direction; explicitly record which components are drawable/collidable/animated in each. Reconcile the pixel-vs-2.5D decision through those prototypes and carry forward only approved assets.
