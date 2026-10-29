# Arcturian Awakening — playable audio game scaffold

**This branch is a private Vercel preview and is NOT the public website.** Do not merge into `main` until the physical-phone vertical slice passes the section 18 gates and the artist approves it.

## Approved track-to-encounter mapping

- Score throughout: **Awaken Now** (45-second, 3-second equal-power loop overlap, pending DAW seam approval)
- Prologue pickup: **First Contact** (25 seconds)
- Encounter I — The Name: **Xaba** (25 seconds)
- Encounter II — The Voice: **Mama Calls Me Chule** (25 seconds)
- Encounter III — The Faith: **Songs Sent to God** (25 seconds)
- Credo's Words is not included; clearance is pending.

The supplied `public/media/manifest.json` preserves the artist's source offsets, loudness, and fade decisions. Only the ten supplied OGG/M4A **excerpts** are allowed in `public/media/`. Never upload full masters. The official pre-save URL remains https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening .

## Scope of this deliverable (guide §25, steps 1–2)

An actual Phaser 3.90 + TypeScript + Vite project with lazy engine loading, Boot/Title and registered future scenes, an AudioDirector, ProgressManager, and a preview Title scene. **The Prologue and encounters are not yet implemented gameplay.** The audio controls in Scaffold diagnostics are an engineering-only integration test.

## AudioDirector

- Starts only after a deliberate pointer/click action.
- Decodes from the matching Safari-compatible M4A or OGG fallback, on demand.
- Schedules score sources on the Web Audio clock with three seconds of equal-power overlap.
- Opens from low-pass/near-mono to full range/stereo via genuine four-gain mid-side matrix.
- Pickup fades from silence, ducks score to about -14 dB, returns smoothly after 25 seconds.
- Has mute, pause, resume, disposal, and audio-unavailable silent fallbacks.
- **Audio note:** the source manifest describes a crossfade seam but the final loop point needs a musical listening test. Do not claim seamless looping until approved.

## ProgressManager

Versioned local save, scene/checkpoint, awakened score state, pickup-unlock collection, guarded localStorage access, and event subscriptions. Uses in-memory state if storage is blocked. No accounts or tracking.

## Run

```bash
npm install
npm run verify:media
npm run dev
npm run build
```

## Gate budgets (design guide §18)

- Under **3,000,000 transferred bytes to first interaction**, not just under 3 MB source JS.
- Under **3 seconds on representative mid-range 4G** in a reproducible browser/network profile.
- **60 fps on physical iPhone 12-class and mid-range Android**, instrumented during real movement.
- **30 fps degrade gracefully** with particle/reduced-motion fallback for constrained devices.
- Under **15 MB total progressively loaded media**; sound is only requested after start.
- No full-master assets, no automatic downloads of every pickup and no autoplay.

`scripts/check-budget.mjs` measures compressed shell bundles as an early CI guard, **not** a substitute for real network total, mobile device telemetry, or source auditing. The 60 fps gate cannot be certified by desktop emulation.

## Next (guide §25, step 3)

Build and playtest only Prologue + Encounter I with layered final art and sprite-sheet character. The Title placeholder is not a shipping experience. Add audio-device handoff tests on iOS Safari, Instagram and Android. Keep pre-save site and `main` unchanged until user signoff.
