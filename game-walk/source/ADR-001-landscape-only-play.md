# ADR-001: Landscape-only playable experience

**Status:** Accepted for the current game build
**Date:** 2026-11-03
**Decision authority:** Artist's latest direction: "Can we force the user to go in landscape then?"

## Decision

The playable Arcturian Awakening experience is landscape-only. An authored
full-screen portrait gate asks the visitor to rotate their phone sideways.
The scene cannot be played while the viewport is portrait. Direct album
access remains available from the portrait screen (its registration backend
must be configured and verified before accepting leads).

This latest decision **supersedes** the earlier 14/58/28 portrait gameplay
tiers and the portrait canvas-occupancy requirement in `AGENT_DIRECTIVE.md`.
Do not rebuild or re-enable the three-tier portrait game without the artist's
explicit approval.

## Technical constraints

- Do not claim to rotate an iPhone automatically: iOS Safari does not
  currently provide a dependable `screen.orientation.lock('landscape')`.
- Use `matchMedia('(orientation: portrait)')` for presentation and game-input
  gating; respond to window resize and orientation changes.
- On portrait entry, stop the Phaser game loop, mute/pause active audio,
  release held gesture inputs, and show the rotation gate with helpful text
  about iPhone Portrait Orientation Lock.
- On landscape return, resume the game loop and audio context, restore input,
  and preserve the previous game progress without skipping encounters.
- Use the entire available landscape height for the 16:9 canvas, with title
  and functional buttons overlaid, not stacked outside a small letterbox.
- Do not interfere with a native accessible registration dialog; capture
  only through a verified server-side integration. No contact PII in localStorage.

## Evidence from browser tests

Commit `99a3f863c0ce075050f313f2239081ef21c4300b` built READY on
Vercel as an isolated preview. Headless Chromium tested:
- Portrait 390×844: rotation screen visible, no scrolling;
- Rotated landscape 844×390: gate gone, game title/actions visible;
- Desktop 1440×900: landscape game visible;
- ENTER THE JOURNEY works; upper-right pause opens;
- Returning to portrait restores rotation gate;
- Direct album access dialog remains openable while portrait;
- No JS errors or failed requests in those checks;
- Interrupted hold in portrait requires a fresh landscape gesture.
These are **simulated-browser checks**, not physical iPhone performance tests.

## Follow-up

Do not merge this gameplay preview to `main` without release approval.
The rich terrain, character animation, real audio playback and final narrative
remain separate quality gates. The registration backend remains unconfigured.
