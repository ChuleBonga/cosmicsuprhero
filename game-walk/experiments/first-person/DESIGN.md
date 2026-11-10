# ARCTURIAN AWAKENING — DESIGN.md

**Status:** Working visual and interaction contract for the separate first-person browser-game prototype. Not a claim of final-art approval.

## Source of truth

One continuous, approximately five-minute first-person musical journey by Cosmicsuprhero, leading naturally toward the album pre-save. The visitor is the protagonist. **Awaken Now** is the designated theme of this game study; album tracks may become optional physical discoveries, not mandatory chapters. The pre-save must remain accessible at any point.

The **artist-supplied Arcturian Awakening artwork** is canonical. This file adds design principles from the 43 supplied mood-board images in `more.zip`, but those images are **not cleared game assets**. Do not copy, publicly deploy or redistribute them without explicit usage rights.

## Six visual anchors

1. **Cobalt and indigo atmosphere.** Saturated cobalt sky, dark navy shadow, believable distance. No generic tan sky or stock nebula.
2. **Immense saturated orange-red sun.** The sun is a major compositional presence. Never silently replace it with yellow/white or overpower it with bloom.
3. **Blue geology with ochre light.** Physically credible weathered rock, strata, fractures, dust and contact. Ochre selectively catches the sun while shadow stays blue.
4. **Ancient architecture with construction logic.** Monumental in scale but credible in thickness, gravity, joints, wear and structure. No mass-produced identical sci-fi temples.
5. **Handheld sound technology as archaeology.** Tactile buttons, cassettes, old recorder forms, scratched viewing windows, worn mechanical seams and metal contacts. Original devices, not Sony/iPod/Walkman reproductions or brand logos.
6. **Dignified ancestral humanity.** Afrofuturist portraiture and African cultural references suggest care in silhouette, textile, ornament and human presence. Never decorate generic alien structures with culturally meaningful Xhosa/Kemet marks without research and the artist's approval.

## Reference extraction from the user's 43-image ZIP

| Reference | What to learn | What not to copy |
| --- | --- | --- |
| `more/download (1)–(3).jpeg` | Blue-toned faces, layered jewelry, identity and skin/material detail | Specific face, costume or character likeness |
| `more/download (5)–(8).jpeg`, `Inspiration/cassette tape.jpeg`, `CD Insta 4.jpeg`, `Enigma.jpeg`, `Sony Walkman.jpeg`, `Sony's new Walkman idea.jpeg`, `Joe Gudgeon photography.jpeg` | Tangible industrial music objects, switches, grills, seams, physical wear | Product trademarks, labels, exact trade dress |
| `Inspiration/Ciudad futurista irreal.jpeg`, `download (10).jpeg`, `download (16).jpeg`, `Stellar Wonders Merch Shop...jpeg` | Monumental scale, layered settlements, physically rooted architecture | Direct reconstruction of an unrelated artwork |
| `Inspiration/download (1)–(9).jpeg`, `Max ✦ (@MaxVOAO) on X.jpeg`, `Instagram.jpeg` | Solitude, silhouette, expansive paths, environmental storytelling | Substituting the approved cobalt and red-sun world with an unrelated green fantasy landscape |
| `XHOSA LOVE LETTER...jpeg`, `Ankh African symbol of life.jpeg`, `Mentuhotep II...jpeg`, `Sacrf-ICE.jpeg` | Visual rhythm, heritage and meaning with provenance | Literal reuse of unverified religious or cultural signs as ornamental glyphs |
| `Arturo Tedeschi _ AI Architecture Midjourney.jpeg`, Observatory/space interior references | Frame-within-frame, contrast between intimate objects and enormous space | Turning the whole world into a showroom |

**Reference rights:** the supplied images may have external artists, AI provenance, social-media overlays and trademarks. They remain private visual references. Do not place source images in the public GitHub repository.

## Working palette (approximate coding targets, NOT sampled from canonical artwork)

| Role | Token |
| --- | --- |
| Abyss shadow | `#050B25` |
| Cobalt atmosphere | `#0C2B64` |
| Dark mountain blue | `#203A69` |
| Distant indigo | `#506282` |
| Orange-red sun | `#DE3D17` |
| Ochre surface light | `#C99961` |
| Oxidized metal | `#7B655C` |
| Readable interface cream | `#E5D6BE` |

Light should model material and scale. Use restrained atmospheric response and analog-film qualities rather than indiscriminate glow, chromatic aberration, random particle storms or decorative gradients. Keep performance costs measurable.

## Composition and physical world

- **Arrival:** one strong planetary vista, path geometry and significant distant landmark. The player immediately understands where to walk.
- **Passage:** convincing ground contact, geological continuity, approaching monumental structures, architectural wear and foreground occlusion. The world must hold together as the camera moves.
- **First Contact:** discover an object **on the floor**, not on an elevated presentation plinth. It lies at a plausible angle in dust, cracked paving or a shallow eroded recess. Surrounding debris gives it provenance. Do not use a hovering collectible or brightly lit trophy.
- **Return:** change the environmental mood with measured sound and light; looking back should reveal the road. Avoid overwhelming a quiet discovery with spectacle.

## Found-object contract

The current cobalt mineral-and-metal artifact can remain temporarily, but **must sit in actual contact with terrain** and lose its elevated altar presentation. A later original portable recorder / audio-memory object is a candidate, **not** an approved replacement. Keep both kinds of visual exploration separate until the artist evaluates them.

The discovery experience must support: notice from normal eye height (~1.7 m), walk up, face and inspect, physically eased close-up with drag/touch/keyboard rotation, an accessible return path, and optional musical response. No collection counter or compulsory pickup. No progression dependency on audio ending.

Accept only when the artifact's actual geometry intersects or rests against terrain as intended; any large-solid scenery has matching collision; and walking past is possible. Review at real-world eye height and mobile FOV, not from a flattering overhead view.

## Interface

World first, UI second. A concise entry, clear interaction, pause and volume, accessibility settings and obvious pre-save route are sufficient. Use one main action per view; buttons for actions and links for navigation. Support focus, Escape, touch targets, reduced motion, keyboard access, interruption recovery and visible instructions. Do not show technical clearance/debug notes to players.

The existing Observatory uses React 18; Astryx is currently a React 19+ beta component library. Borrow its interaction/accessibility review discipline without installing or migrating to Astryx as part of this game-art pass.

## Agent guardrails

Read this document, the current source art and `FIRST_CONTACT_ART_SPEC.md` before changing the encounter. Favor original geometry/materials, factual construction logic and deliberate silhouettes. Avoid generic African visual shorthand, exact copied symbols, copied products, horror tropes, stock CGI and gigantic abstract altar props. Use installed rendering systems unless a measured problem demands a dependency.

No licensed/uncleared music or images may be published. Avoid modifying the production homepage or old `/play/` side-scroller until the new experience is visually reviewed and explicitly approved.

## Quality gates

1. **Visual:** GPU-capable screenshots/videos at desktop and 390×844 portrait, compared side by side with the approved album illustration.
2. **Physical:** measured object-ground contact, geometry/collider fidelity, no invisible walls, tolerable movement and spatial navigation.
3. **Audio:** user gesture to unlock, mute/volume, pause/resume, app background handling, silent fallback and confirmed preview rights.
4. **Accessibility:** keyboard, focus restoration, touch, readable text and reduced motion.
5. **Performance:** named device/browser, real frame-time p95 and GPU/CPU bottlenecks where measurable. A green build is not a performance proof.
6. **Release:** draft PR only; no merge/production release without evidence and approval.

## Build 06 decision

Restage **First Contact as a grounded find** with weathered surrounding soil/paving and a believable resting angle. Remove the existing tall layered altar, adjust the collision proxy, preserve a coherent original artifact silhouette and update physical tests. Only then spend time on more complex cinematic geology, lighting and authored portable-music artifacts.

---
Influences: VoltAgent's `awesome-design-md` documentation approach and selected accessible-component practices from Meta's Astryx. This project's artwork and cultural identity must remain original.