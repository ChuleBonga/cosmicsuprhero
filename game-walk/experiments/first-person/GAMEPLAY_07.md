# Build 07 — Media-driven player agency and dual-stick mobile UX

## Corrected goal
The visitor should do more than walk and look. Make the music tangible: uncover a physical, inspectable **First Contact cassette**, recover it, optionally bring it to a compatible listening relay, and see the world respond. This is one continuous path to the **Arcturian Awakening pre-save**, not a sixteen-part song quest. **Awaken Now** remains the only game music cue and continues throughout the experience. No unapproved new track files were added.

## Interaction flow
1. **Approach cassette.** The original stone plinth remains physically solid. The cassette lies in its shallow display tray at approximately real compact-media scale. On phone the nearby R1 action changes to EXAMINE; desktop players use E.
2. **Examine.** Same actual cassette geometry is magnified in the viewing camera. The model has visible black tape spools, metal hubs, label, machine screws and an album/artist name. Rotate with drag or arrow keys, zoom with wheel, +/- or on-screen buttons. Audio ducks, not replaced.
3. **Take cassette.** A deliberate button moves the state from inspected to collected, removes the physical source from the pedestal, updates the media status and provides a brief on-screen confirmation. **L1** (or Q) then reopens the saved tape.
4. **Find the receiver.** Walk toward z=-82. The small original analogue listening relay is at x=2.15, visibly to the side of the route. It is collidable and does not block straight travel.
5. **Insert cassette.** When near it with the tape recovered, R1 becomes INSERT (E on desktop). The cassette is placed in the physical receiver, its small light and nearby architectural marks respond, and the world changes. No extra song plays.
6. **Continue.** Player can still reach the end, and the album pre-save is always available. Collection, relay insertion, and repeating the scene are optional. A missing tape never prevents the ending.

## Mobile virtual controller
- **L · MOVE** lower-left analogue stick: walk/strafe with a center dead zone and normalised diagonals.
- **R · LOOK** lower-right analogue stick: continuous camera velocity with independent captured pointer and touch dead zone. Two thumbs can move and look simultaneously. A swipe on the world canvas is still a fallback.
- **L1 · TAPE/LOG** shoulder immediately above the left stick: review the recovered physical cassette, disabled until available.
- **R1 · USE / EXAMINE / INSERT** shoulder above the right stick: context-aware real action, disabled when out of range.
- **Desktop** WASD + mouse, E interact, Q tape/log, Escape pause, M music mute. Touch tap targets are at least approximately 44–48 CSS pixels under the reviewed mobile breakpoints.
- Screen center stays available for world imagery; music and pre-save remain in the safe-area-aware top UI and pause/intro/end states.

## Geometry and performance contracts
- `cassette-art.mjs` creates physically solid 3D album media. Actual world width is ~0.148m, enlarged **only during inspection**.
- Clear shell, opaque bulk, viewing window, labelled carrier, two actual reels, twelve instanced spokes, and instanced screws. This avoids dozens of separate draw calls in a phone browser.
- `journey-actions.mjs` is pure state logic for examined, recovered and installed; any attempt to collect uninspected media or install without collecting is rejected.
- `WORLD_OBSTACLES` includes the relay's matching 0.82m circular static footprint, away from the corridor center.
- `cassette-art.test.mjs`, `journey-actions.test.mjs`, mobile contracts and existing motion/collision tests run in the Vercel build.

## Limitations still open
1. **No device-tested 60 FPS**, no measured GPU memory or validated phone landscape/portrait ergonomics. Vercel build success is not proof of gameplay quality.
2. The tape label is an original Canvas2D texture created once at runtime; it does not replace the authored PBR stone/material maps or require playing an unapproved track.
3. Collection is visible through inspection, removal and UI state; there is **not yet** a detailed first-person hand animation or real multi-body physics.
4. The sound system plays only the existing artist loop `score_awaken_now_loop.m4a` after visitor entry. First Contact is a named physical medium, *not* an extra audio file.
5. The receiver is a simple physical interaction, not a mandatory puzzle, and the journey is still substantially shorter than the intended five-minute narrative.
6. This remains a **draft review feature branch**. It does not replace the live homepage or public game; release requires artist visual approval, mobile control tests and explicit audio-rights confirmation.

## QA / acceptance
```bash
cd game-walk
npm run test:cassette
npm run test:journey-actions
npm run test:mobile-ui
npm run test:first-person
npm run build
```
Physical-phone review checklist: try 320x568, 390x844, 430x932, 667x375 landscape; move/look with simultaneous thumbs; use R1 close to the tape; rotate and zoom; take tape; trigger L1 log; insert into relay; walk to end without collecting; pause/restart; confirm music remains Awaken Now; inspect orientation, focus, safe areas and FPS telemetry.
