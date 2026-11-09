# Arcturian Awakening — Quality consolidation sprint 08 (2026-11-09)

## Intent and boundaries

This sprint responds to the critical findings in the independent Build 07 design/engineering audit: inaccessible cassette visibility, interaction prompts detached from the object, loss of important stage feedback, fragile mobile touch capture, missing session progress, and unnecessary GPU rendering when inactive.

**One continuous first-person music experience, not sixteen game chapters.** The experience retains the original cobalt/indigo planet and orange-red sun. Only `Awaken Now` plays as the game theme. The recovered **First Contact** cassette is physical media representing an album track, **not** an added song playback. Keep production `main` untouched pending physical-device/visual approval.

## Implemented fixes

1. **Physically reachable collectible:** The same real-scale ~15 cm compact cassette is now placed on a new front-facing cantilevered shelf at relative monument coordinates (x=0, y=1.36, z=+2.28m), instead of the inaccessible top (y=2.39m, z=0) of a plinth with a 2.36m collision radius. The cassette lies in a tray with supporting stone and a retaining lip. Its short-distance interaction point has moved from the monument's centre to the shelf's front. The camera must face it, using a forgiving mobile facing threshold.
2. **Interaction targeting:** New contact bounds are 1.5m desktop / 1.85m touch for cassette examination and 1.95m for relay insertion. Both honor facing. This replaces the earlier 4–4.65m remote prompts.
3. **Correct feedback:** A persistent priority stage keeps "CASSETTE RECOVERED" and "THE SIGNAL RETURNS" visible for ~3.4s instead of overwriting the label with the region name on the next 60Hz frame. HUD action text is only rewritten when the action changes.
4. **Tactile transitions:** Recovery animates the cassette from the close-up inspection toward the near camera; the recovered tape slides down into the relay slot over a separate short animation. These are deterministic, original motion curves, not a complete player-hand rig or physical simulation.
5. **Geometry:** The translucent spool window now sits in front of its recessed magnetic tape reel geometry. The cassette's front-facing label remains legible in inspection.
6. **Touch recovery:** Pause/blur/cancel releases all captured stick/camera pointers and resets thumb offsets. The landscape shoulder target is restored to 48 CSS px.
7. **Checkpoint continuity:** Optional session-local progress stores only (x,z,yaw,pitch) plus cassette inspection, collection and installation flags. State is bounded, validated, versioned, expires after 12 hours, and gracefully handles disabled/corrupted browser storage. Enter explicitly resumes; **Start a new journey** clears it. Audio never auto-starts without a visitor gesture. Checkpoints clear on completion and restart.
8. **Rendering:** Static intro and pause scenes no longer redraw at 60Hz. One render after static material loading warms texture uploads. On WebGL context loss, audio and gameplay stop while a reload is presented.

## Acceptance and tests

New deterministic regression suites:
- `test:interaction-motion`: bounded pickup and relay transitions, full endpoints, arbitrary frame cadence.
- `test:checkpoint`: expiry, private-mode failures, corruption, contradictory states, no personal data.
- Expanded `test:journey-actions`: close physical contact, facing and collision reachability.
- Expanded `test:encounter`: model shelf placement and readable vertical scale.
- Expanded mobile/source contracts: stage-priority visibility, zero unwanted touch captures, safe-area and action target sizing.

They run in the required `game-walk` Vercel build pipeline with existing movement/score/geometry/material regressions.

## Explicitly NOT done / release gates

- **No physical iOS/Android device testing**, touch comfort measurement, or reliable gameplay capture from a GPU-capable remote browser.
- **No proven 60 FPS** or measured VRAM/GPU cost, no verified load under slow mobile networks.
- The close-up camera motion is **not a hand animation**; no interactive cassette case lid or complex alignment puzzle has been authored.
- The larger game still lacks the intended complete five-minute pacing and finished environmental-response sequence.
- These generated materials, objects, and lighting remain visual-development assets, not signed-off photorealism.
- No new copyrighted track audio, publication, or production deployment. Keep feature draft.

## Mobile manual review order

1. Phone portrait at 320x568, 390x844, 430x932; rotate to landscape 667x375; verify R1/L1 are tappable, intro/inspection scroll, and neither thumb obscures important world content.
2. Simultaneously walk using L and look using R; pause mid-gesture; resume and verify no residual motion.
3. Approach First Contact; object must look like a cassette on the shelf **before** interacting. Prompt should appear when looking toward it and disappear if walking away or looking away.
4. Examine, rotate, take; verify smooth visible transfer, stage message lasting several seconds and soundtrack unchanged.
5. Reach Sunward relay; approach and insert; verify smooth physical slot motion and a convincing response.
6. Reload during exploration, explicitly choose Continue; inspect preserved progress. Then choose Start a new journey and verify a clean reset.
7. Verify pre-save accessible at every stage and without collection.
8. Collect FPS/p95 GPU timings, quality mode, device type, orientation, audio and input observations. Do not merge on the strength of static build tests alone.
