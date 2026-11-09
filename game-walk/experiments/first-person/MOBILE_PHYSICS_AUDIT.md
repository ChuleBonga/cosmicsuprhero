# Build 06: physics, world actions, and mobile-first UX audit

Date: 2026-11-08. Review-only branch based on `feat/awakening-authored-materials-20261108`. This is a **source-code and CI audit**, not proof of visual/60 FPS quality on named hardware.

## Reviewed references

The user supplied autumn lake photographs and close-up mineral/stone photographs. These establish expectations for (a) near/middle/far depth cues, believable scale and naturally framed horizons, and (b) surface occlusion, cracks, mineral transitions, nonuniform erosion and varied edge profiles. The images were **not** automatically embedded into the game, converted into copyright-unclear textures, or presented as renders of Arcturian Awakening.

## High-priority defects found and repaired

| System | Before | Now / acceptance contract |
|---|---|---|
| Corridor physics | `halfWidth(z)` snapped instantly from 7.5m to 6.1m, then to 8.1m at two discrete Z positions | Smooth cubic transition across 14–15m; tests assert tiny width steps, no sideways position snap and full route reachability |
| First Contact touch | 3.25m activation distance with desktop-facing threshold; available contact band ~0.55m outside plinth collider | Desktop detection range 4.1m with facing requirement; touch up to 4.65m with relaxed facing; cannot trigger remotely |
| Intro viewport | Tall centered content + fullscreen overflow clipping could hide CTAs at short screen heights | Intro/end now scrollable with safe-area padding; pre-save remains available before starting |
| Music vs look surface | Large volume bar and pre-save rail competed with right thumb on portrait phones | Mobile gameplay retains compact music toggle at upper-right; volume slider is available from Pause; pre-save moved to a separate top action rather than the bottom-right look zone |
| Inspection | Mobile overlay text competed with object rotation region; touch zoom not directly accessible | Separate upper reading region and lower drag region on portrait, left/right split in landscape, 48px zoom controls and keyboard focus cycle |
| Return links | `href="/"` resolved to preview game host root, not Cosmicsuprhero site | Explicit artist website return; album pre-save from intro, gameplay, pause, and ending |
| Desktop pause | Resume could leave mouse look unlocked until a second click | On deliberate Resume gesture, request pointer lock immediately with recoverable fallback |
| Music UI accessibility | Initial music toggle `aria-pressed` did not match enabled label | Initial enabled state now reflected in ARIA; settings slider and main slider remain synchronized |

### Mobile layout guide (source CSS, unverified on hardware)
- Portrait <=760px: HUD at safe-area-aware top, reduced compact title, 44px-min Pause/Exit buttons.
- Music toggle: upper-right at roughly top 4.7rem + safe area. Album pre-save below at top 8.1rem + safe area.
- Left thumbstick: 102px visible ring in portrait, 84px in landscape; full touch capture and 16% dead zone.
- Lower-centre inspection prompt: 48px minimum action, positioned above the joystick instead of at the screen bottom.
- Inspection: flexible top description, bottom touch rotation region; explicit 48px zoom buttons, suitable focus sequence, support for shorter portrait and landscape phones.
- Intro and pause screens: allow vertical scrolling without compromising access to the album link.

## Checks actually performed
- Node regression tests for the world, collision and reachability, score, mouse/touch math, encounter art and inspection motion.
- Five new source-level mobile UI contracts for accessibility labels, safe areas, direct navigation, essential controls, and pre-save availability.
- Vercel build (TypeScript, all relevant suites, static asset checks, Vite bundle budget).
- Source-level responsive layout review. A remote 390x844 browser confirmed the page and text load, but automated WebGL creation is unsupported. It did **not** provide an authoritative screenshot of in-world UI or actual touch behavior.

## Important incomplete work
1. A full physics engine has **not** been added. Controller is fixed-step horizontal capsule/contact projection approximated against cylindrical collision zones and groundHeight; no dynamic rigid bodies, mesh-based collisions, jump mechanic or vehicle physics. The design should not pretend otherwise.
2. The current route is ~133.5m end-to-end (start Z=23.5, end Z=-110), which is roughly **47s of unimpeded straight walking** at the 2.85m/s base walk speed. It's still **not** the complete intended five-minute story. Extend meaningful environmental actions and narrative before changing walking speed or adding compulsory inventory steps.
3. No actual iOS Safari / Android Chrome hardware walkthrough, WCAG-assisted navigation inspection, touch thumb ergonomics capture, frame-time p95 GPU telemetry, or 60 FPS certification yet.
4. Album art direction and source photographs demand more credible rock geometry, scanned-like textural breakup and foreground-middle-background composition. This code-focused pass did not make those artistic claims.
5. Pre-save copy / release timing and final Awaken Now cue still require approval before main-site launch.

## QA procedure
Run in `game-walk/`:
```sh
npm run test:first-person
npm run test:controls
npm run test:mobile-ui
npm run build
```

In preview test 390×844, 360×640, 320×568, 667×375 landscape, and at least one real iPhone Safari and mid-tier Android Chrome. Check opening scroll/Enter, left-stick forward and diagonal, right-swipe look, approach-first-contact prompt, tap inspect, rotate/zoom/return, pause volume, mute, direct pre-save from all states, and browser back/exit. Capture p95 frame time only from actual devices.

Production `main` remains unchanged. This branch must remain draft until device-based usability review and an approved art/performance pass.
