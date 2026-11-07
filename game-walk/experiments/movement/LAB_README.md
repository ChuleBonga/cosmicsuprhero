# Movement & Architecture Lab (separate experimental route)

A browser-playable engineering test for terrain-aware movement, visible collision geometry, camera follow, architectural scale, and portrait touch controls. This is **not final game art** and does not modify the approved game's scenes or audio.

## Running

From `game-walk`: `npm run dev`, then visit `/play/experiments/movement/lab.html` (the path requires Vite's `/play/` base). The separate Vercel game preview should serve the same route after a passing build.

- Keyboard: A/D or arrows to walk; Space/Up to jump; G for collider outlines; P pause; R reset.
- Mobile: press and hold the left/right control; tap JUMP.
- The player is a **proportion marker**, not approved character art. Buildings are original **structural blockouts**; collision geometry currently represents the ground only. No original track or unapproved narration is loaded.

## Verification

`node --test game-walk/experiments/movement/terrain.test.mjs` from the repository root. The companion original model tests remain in `movement-model.test.mjs`. These cover terrain continuity, normals, ledge gap, slope traversal, jump/landing, rendering-rate equivalence, and state immutability.

**Not yet validated:** Phaser gameplay integration, browser and real-device capture, music mix, final character rig, mobile thermal performance, material quality, structural architecture, or art-direction approval.

## Release policy

Only experimental routes and the Vite multiple-page build input change. Neither `src/scenes/WalkScene.ts` nor the live site is rewritten. Do not merge this branch to `main` or call it the release game. Replace the original blockout only after the first cinematic frame, movement, audio, and architecture pass review.