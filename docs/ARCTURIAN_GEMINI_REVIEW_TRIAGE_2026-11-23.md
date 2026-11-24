# Arcturian Awakening — Gemini walkthrough triage (23 Nov 2026)

**Status:** review branch; NOT approved for production.  
**Input:** `cosmicsuprhero_in_depth_critique_site_walkthrough.html`, a November 23, 2026 external critique of the live album page and old first-person study.  
**Critical scope boundary:** this source does not evaluate the separate `rebuild/arcturian-awakening-20261113` game. Its author reports WebGL/DevTools access was unavailable. Do not present its game-quality conclusions as browser-verified.

## Confirmed in the main-branch source

- The landing hero and liner note repeated `Not an escape. A return.`; remove duplication without changing the editorial thesis.
- Landing CTA linked directly to `/play/experiments/first-person/index.html`; preserve this legacy endpoint but introduce `/world` as a friendly rewrite, ahead of the catch-all rewrite.
- Some muted labels missed WCAG AA normal-text contrast on the paper background `#f8f6f1`, notably `#986976`, `#876c77`, `#a4886a`; others already pass. Keep contrast changes targeted and do not treat font size alone as contrast.
- The tracklist desktop modal uses very large heading/row spacing and max-height `90svh`. Make normal desktops more compact; allow true overflow on short viewports, rather than hiding required track actions.
- The public game has a text-only WebGL error path even though approved album artwork is already referenced by the landing page. Provide correctly labeled album art on WebGL failure, never pass it off as a game screenshot.

## What to implement on this review branch

1. Differentiate hero copy from the retained liner-note title, with concrete human-scale language tied to verified track names and no invented lyrics.
2. Add clean `/world` and `/world/` rewrites, retaining `/play/` and legacy endpoints for bookmarks.
3. Darken only failing microcopy colors and reduce desktop tracklist height while keeping mobile and short-height scrolling intact.
4. Provide a responsive, clearly captioned fallback still when WebGL initialization fails; keep pre-save and return navigation available.
5. Preserve the separate rebuilding game and the live site until artistic and technical qualification.

## Do not adopt from the critique without separate proof

- **Autoplay or new music:** Public bundle deliberately excludes game audio pending publication/cue clearance. Do not ship guessed stems, synth reproductions, or unclear licenses.
- **Lenis, GSAP, shader overlay:** Adding movement without solving the inhabited-world/NPC gap is neither a measured performance fix nor a direct accessibility improvement. No dependency additions for this pass.
- **Draco/KTX2 “80–90% reduction”:** Not substantiated for our actual GLB/PNG assets. Inventory and benchmark on target devices before selecting codecs.
- **The proposed First Contact copy, dialogue, and December 4 “full world opens” message:** Provisional invented content and a release promise; do not make them game canon. Album release date is not proof of full-game availability.
- **Claims of completed 3D gameplay visual QA:** The critique could not initialize WebGL. Re-run visual QA on current rebuild when available.

## Validation gates before merge

- [ ] Preview build passes the site's Vite + nested game build.
- [ ] In preview, both `/` and `/world` serve expected HTML and absolute `/play/assets/*` dependencies return 200.
- [ ] Inspect at 390×844, 768×1024, 1440×900 and 1920×1080; tracklist can scroll on shorter viewports but never clips final actions.
- [ ] Keyboard: open/close dialog, focus return, visible focus, navigating to game, recovering from WebGL error.
- [ ] Fallback visible with explicit album-art caption when WebGL initialization fails; pre-save and return remain usable.
- [ ] Check labels against WCAG 2.2 AA; document actual rendered color and contrast, including backgrounds/overlays.
- [ ] Check real-game WebGL and real-device FPS separately; not implied by deployment or HTML checks.
- [ ] Release art, character fidelity, world habitation, musical cues, mobile performance, and artist approval remain hard gates.

**No production merge without explicit approval.**
