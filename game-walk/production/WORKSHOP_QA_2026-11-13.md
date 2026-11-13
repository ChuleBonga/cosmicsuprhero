# Arcturian Awakening / W0 mechanical work-study QA — November 13, 2026

**Verdict: ENGINEERING PASS / VISUAL HOLD.** One contiguous world, original album and pre-save preserved. This is a review-only study; no public NPC was promoted.

## What changed on main

- `7d64232`: for the opt-in `?art-review=arrival&look=cover` grade, suppressed the generic arch and circular distant object that had been obscuring the canonical enormous orange-red sun. The original default visitor view still contains those legacy structures. Repositioned W0 review camera closer to the workshop, preserving the scene collider contract.
- `307b6d0`: created a small physically located two-spindle magnetic-transport repair workpiece in the waystation, driven by W0's autonomous behavior states. Engagement raises drive speed, player approach halts work, and returning to work restarts it. Added dedicated unit tests and separate in-world review gating. The normal `/play/` route does not instantiate it.
- `fe11b0a`: actual WebGL screenshot showed the new workpiece overlapping an opaque older shell. Review mode now hides the old shell/rail/vents to reveal the exposed moving apparatus, without changing the ordinary public world.

## Real production QA

A fresh Chromium 144 software-rendered WebGL capture at 1200×900 used this URL:
https://cosmicsuprhero.vercel.app/play/experiments/first-person/index.html?art-review=inhabitants&look=cover

The deployed renderer reported `HTTP 200`, `workerLoadStatus=ready`, `worker.phase=working`, `repair.rpm>0`, `repair.rotations>0`, `scanState.normal=ready`, `scanState.rough=ready`, with **no page errors** in the captured run.

The corrected image contains the original blue-green W0 figure beside the workbench and a now-exposed small mechanical assembly; the old monolithic shell no longer covers the physical workpiece. The animation state did advance. A prior browser test of the normal scene found `worker=null` and `repair=null`, confirming these assets are opt-in only. The build/deployment checks completed on main.

**Important caveat:** The cloud software GPU was extremely slow. No real-hardware 60 FPS, uninterrupted animation smoothness, precise hand-tool contact, or touch-device performance can be claimed from this test. The recorder hardware is not yet synchronized with a real hand/tool contact animation.

## Visual quality, compared to the artist's actual album cover

The open sun vista is an improvement. Original art: deep cobalt-blue sky, enormous saturated red-orange sun, dark indigo and ochre geology, blue-green elongated-headed figure, volumetric burgundy fabric with tangible weight, 1970s practical-film credibility.

Current render, however, has a flat/underspecified foreground, faceted and often wall-like mountains, a worker with simplified mannequin-like anatomy, sparse fabric and unresolved face, a rough block-built shelter, weak light separation between subject and architecture, and no community or inhabited district in view.

- **Composition:** partial improvement, not an approved art direction.
- **Mechanical task causality:** basic behavior implemented, but physical contact/animation integration **not proved**.
- **Character fidelity, architecture and lived-in civilization:** remain **fail/revise**.
- **Overall creative gate:** still **HOLD 8/30** from the independent critical assessment, pending a full side-by-side visual re-evaluation.

## Next production decisions

1. Develop the actual **final character sculpt, facial anatomy, original garment pattern and physical cloth behavior** against the user's full 43-image reference board, not a more colorful primitive silhouette. A usable human expression is essential.
2. Rebuild the waystation as a credible practical shelter and recording-repair workplace with structural joinery, hand contact, a physically connected tape mechanism, power/transport logic and habitation traces. Do not add another generic altar or ring.
3. Establish an inhabited district with readable domestic/work infrastructure, movement patterns, at least two independently motivated NPC roles and an approved causal story. Do not infer culture or dialogue canon from the AI concept boards.
4. Preserve the album homepage/pre-save and single public game route; unlock any new visual feature only after the artist accepts actual in-game screenshots at desktop/mobile scale.
