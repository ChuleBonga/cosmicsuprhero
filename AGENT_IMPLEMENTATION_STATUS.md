# Arcturian Awakening — implementation reality check

**Recorded:** November 3, 2026
**Authoritative creative directive:** [AGENT_DIRECTIVE.md](./AGENT_DIRECTIVE.md)
**Current development branch:** `arcturian-arrival1-environment-20261103`
**Production branch:** `main` — do not merge without release approval.

This file is an implementation status record, not an amendment to the artist's directive.

## Repository discrepancies to resolve without destructive migration

- The repository currently has `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, and `src/styles.css`, rather than the proposed `vite.config.js`, `src/main.jsx`, and `src/index.css`.
- The public album landing is currently rendered from root `index.html` with `src/arcturian-world.js` / `src/arcturian-world.css`. React also exists for the earlier Observatory application, but `Hero.jsx` / `Archive.jsx` / `Releases.jsx` are not the live landing page. Update the true entrypoint; do not create duplicate pages.
- The standalone Phaser game lives in `game-walk/` and is copied to `dist/play/` by `scripts/embed-game.mjs` during `npm run build`.
- The game is currently authored at **480 × 270** logical pixels. Do not silently change to a 1920 × 1080 framebuffer: test GPU cost, logical input coordinates and sprite scaling first.
- The source directive describes both a fixed 16:9 authored image and portrait game occupancy of 58% screen height without cropping. The portrait camera must be specifically re-authored/tested to reconcile these, not scaled blindly.
- Treat the five "arrivals" and the sixteen ordered songs as the **full future journey**. The present Chapter I slice does not qualify for the earned finale reward.

## Current development branch

- Full-color artist-derived textured atmosphere, terrain, sun and rocks are included as `game-walk/public/art/arrival/*.webp`. This does **not** establish final visual approval.
- First Contact walk is staged and shorter; full album environments are not implemented.
- Name/email direct-access form exists, with optional marketing-consent checkbox.
- Name/email are **not** stored in localStorage. Client-side persistence of contact details is rejected for privacy and security reasons, notwithstanding the draft reference.
- `api/presave-access.js` is a provider-dependent draft that returns an unavailable state when unconfigured. Its working CRM integration, privacy notices, rate limiting, double-opt-in and mailing-list semantics must be verified before accepting live visitor details.
- Blessing/reveal UI is implemented for the server-confirmed success path, not a fake successful submission. When the provider is unavailable, the form remains disabled.
- Earned-gate predicate is tested, but the actual sixteen-track finale has not been built.
- Do not publish mastered recordings or third-party spoken samples before playback excerpts/cut-points and promotional use rights are approved.

## Mandatory outstanding acceptance checks

1. Compare actual desktop and portrait game captures with the approved First Contact visual reference.
2. Create responsive portrait composition and measure the **gameplay** area; verify character and landmark remain visible without accidental crop.
3. Remove obsolete bitmap title/banner and assemble the editorial HUD with readable and accessible interaction targets.
4. Confirm no unintended source-code emoji, and measure full-color asset fidelity.
5. Test completed movement and audio scenes, save/resume, browser interruptions and mute/keyboard/touch paths.
6. Validate only the direct-access success response reveals the exact approved blessing and pre-save URL; no PII in browser storage.
7. Build the remaining story and finale, including all sixteen stars, before presenting the earned route as available.
8. Confirm hosting terms, API configuration and real-device performance; keep release on `main` separate from reviewed previews.

**Do not equate successful TypeScript compilation, Vercel READY status, or beautiful single screenshots with production approval.**
