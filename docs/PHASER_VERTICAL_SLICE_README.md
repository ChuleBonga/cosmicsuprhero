# Arcturian Awakening — Phaser 3 playable vertical slice

**Branch target:** `arcturian-phaser-vertical-slice` / Vercel **preview only**. Never merge or promote without artist approval and physical mobile QA.

## State of the build

- The **Prologue** and **Encounter I / The Name** are coded and playable. The walk, checkpoint, light pickup, gathering three motes and jukebox unlock logic are implemented. World terrain and player are explicitly **procedural placeholders** awaiting the approved illustration's separated layers and proper sprite sheets.
- **AudioDirector** is built around the revised direction: *Awaken Now* is the continuous filtered score, while *First Contact* and *Xaba* are short interrupting pickups with duck/crossfade. Its public source path expects `/audio/v1/aa_awaken_now_score_loop_45s.m4a`. It is not populated if this own-hosted approved asset isn't available. Silence is the correct fallback, not a synthesized impostor. A **seamless loop** has not yet been approved.
- **ProgressManager** stores the scene, recovered tracks and save-point safely even when localStorage is blocked. Pause menu includes Jukebox, Sound, accessibility toggle and non-gated pre-save.
- Future scenes `EncounterVoice`, `EncounterFaith`, `Finale`, `FreeRoam` and optional stars are specified in the asset spec but **not** falsely presented as playable here.

## Run locally

```bash
npm install
npm run dev
npm run check
npm run preview
```

This is a separate Vite entry point. In the preview branch it replaces `index.html`, `package.json`, and `vite.config.ts` while preserving the production branch untouched. `vercel.json` is preview-branch-only and does not rewrite audio requests to the index.

## Input

- Mobile: hold on right half of the game to walk right; left half for walking back. Release to stop. Tap context actions when close. During The Name, sweep across light motes or press the Gather action three times.
- Desktop: A/D or arrow keys to walk; E/Space to interact. Pause icon opens the menu.
- Memory pickup excerpt only plays if its signed-off `src` is configured in `src/config/tracks.ts` and actually hosted. Do **not** add placeholder songs or entire masters.

## Source layering / performance

The **asset handoff v2** is the binding specification. Preserve original sleeve palette and figure identity. All runtime art must be optimized WebP with correct alpha, combined initial art budget ≤850 KB. Runtime Phaser 3.90.0 (explicitly pinned, not Phaser 4). Phaser JS is lazy loaded after Begin; no audio is requested until first gesture. Target <3,000,000 bytes to first interactive, <3 seconds on a mid-range phone over 4G and 60fps on physical devices. Desktop simulation/bundle bytes are *not* equivalent to device certification.

## Remaining QA gates

1. Approved, owned-hosted score excerpt with musically sound loop and approved First Contact + Xaba clips.
2. Replace procedural placeholders with the actual artist's sky/mountain/figure atlas and frame-test walking feel.
3. Measure `npm run check:budget`, cold-4G first-interactive network transfer, and actual 5-minute mid-range phone frame pacing.
4. iPhone Safari and Instagram in-app browser audio unlock, mute, tab switch, reduced motion, rotation, blocked storage, touch targets, no stuck progression.
5. Artist reviews story text and audio decisions, then expressly approves promotion. **No automatic production deployment.**
