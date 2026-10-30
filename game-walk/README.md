# Arcturian Awakening — Phaser Gray-Box Walk Test

This is an isolated **Phaser 3.90 / TypeScript / Vite** project under `game-walk/`, maintained exclusively on branch `phaser-walk-five-layer-20261029`. It does not import, replace, or route the live Cosmicsuprhero website.

## Test objective

1. The **Title** scene shows the supplied album poster and the single instruction “Touch the sun to begin.” The sun alone is the pointer target (Enter/Space also support keyboards).
2. Touching the sun unlocks playback of the **approved 45s Awaken Now edit**. No audio is fetched until this gesture. Web Audio filters open according to **distance actually walked**.
3. In the **Walk** scene, hold the left or right half of the touchscreen to move. A/D and left/right arrows work on desktop. Release to decelerate and stop. The camera follows the player and five individual registered background layers scroll with different factors.
4. Walk into the physical **First Contact** pickup around world coordinate x=1160. Collision (not click) starts the approved 25s excerpt and ducks the score; after it ends, the score returns by fade.
5. Progress persists through guarded localStorage. M toggles mute and R resets progress.

## Art status

The five parallax layers and humanoid are **procedural gray-box placeholders**, not finished album layers/sprites. The Title uses the original user-supplied album poster, resized as `aa_album_poster.webp`. No fake lyrics or generated character likeness.

See `/mnt/data/arcturian-vertical-slice/ASSET_HANDOFF_SPEC_v2.md` in the user handoff for exact production layer/sheet filenames and dimensions.

## Audio hosting and bootstrapping

This isolated preview deploys approved short excerpts to its own static Vercel asset CDN:
`/audio/score_awaken_now_loop.m4a` (45s) and `/audio/pickup_first_contact.m4a` (25s). No unreleased full master is included. A temporary, explicitly scoped media-archive bootstrap is used during Vercel builds; the generated deployment is static and independent after publishing. **For reproducibility, migrate these two approved files to permanent versioned source-controlled/artist-owned storage before final acceptance.** No other pickup tracks are shipped in this first build.

## Run

```bash
cd game-walk
npm install
npm run dev
npm run build
```

Build verifies TypeScript and asserts the compressed first-interactive estimate is strictly below 3,000,000 bytes. The current baseline measures around 400KB for compressed JS/CSS/HTML and initial poster. Streaming audio is delayed until first tap.

**Performance acceptance:** target 60fps on midrange devices (fallback 30fps when prolonged frame times exceed budget), under 3MB to interactive, under 15MB lifetime. Physical iPhone/Android frame-time and first-interactive QA has not yet been performed.

## Production protection

Do not merge this branch or route the separate preview project to `cosmicsuprhero.vercel.app` before an explicit user review and approval. The existing live pre-save route remains unchanged.
