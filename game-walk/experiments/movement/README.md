# Movement R&D experiment (isolated, not game-integrated)

This folder is an experiment, **not a replacement for** `src/scenes/WalkScene.ts`.
It was created after reviewing PR #3 (`feat/awakening-first-listening-20261104`).

## Reproduce

Requires Node 22+, no dependencies.

```bash
node --test game-walk/experiments/movement/movement-model.test.mjs
```

Initial local run (2026-11-05): 5 tests passed. The code was run in an isolated Node 22 environment. The **game's** Vite build, browser runtime, mobile controls, and visuals have not been validated by these tests.

## Current game's issues demonstrated by source inspection

- `WalkScene.ts`: horizontal movement uses an update delta clamped to 0.05 seconds; no fixed simulation tick, no real terrain collider, ground is a constant Y coordinate.
- `GrayboxWorld.ts`: three tiled landscapes plus stars and dust, no height data and no playable slope mesh; `WORLD_WIDTH = 120_000` but the new First Contact scene exits near x=1510.
- `startFollow(..., .10, .10)` is subject to a Phaser report about refresh-rate dependent camera lerp. This is a reported risk requiring reproduction, not a measured bug in this game.
- The logic has coyote/jump-buffer state, but the ground never meaningfully ends except through the canvas boundaries; core terrain cases have not been exercised.
- `alien-walk` is selected by velocity threshold, not by foot-contact phase. No animation contact data exists.

## What this model tests

1. Fixed 60 Hz simulation under render rates of 30, 60, and 120 Hz.
2. Snap-to-ground on shallow slopes represented by a height function.
3. Velocity damping on input release.
4. A ballistic jump/landing arc.
5. Walking off a ledge into airborne state.

These are deterministic *logic* checks, not guarantees of believable animation or real physics. Every numeric parameter is a **tuning candidate** in logical pixels, not a measured physical property.

## What it intentionally does NOT solve

- Polygon/mesh collision, moving platforms, steep contact response, stair stepping, or dynamic bodies.
- Animation blending, actual feet/hips IK, sprite atlas pivots, and cloth/cape follow-through.
- Variable-duration gamepad/touch gestures, first-tap audio, or mobile controls.
- Multiplayer/network determinism.
- Real-device performance.
- Current world art quality or the unresolved pixel-art vs. high-fidelity 2.5D direction.

## Repositories and research inspected

- Godot official 2D platformer demo: https://github.com/godotengine/godot-demo-projects/tree/master/2d/platformer
  - Reference implementation for slope snapping, character state, collision, and camera bounds.
  - Study techniques only; do not port Godot engine code into Phaser.
- Rapier JavaScript character-controller docs: https://rapier.rs/docs/user_guides/javascript/character_controller/
  - Slope limits, automatic stepping, snap-to-ground, colliders.
  - A decision candidate if a measured experiment demonstrates that hand-written collision is insufficient.
- Phaser camera lerp report: https://github.com/phaserjs/phaser/issues/7352
  - Validate camera behavior under fixed camera displacement at 30/60/120 Hz.
- Glenn Fiedler, Fix Your Timestep!: https://gafferongames.com/post/fix_your_timestep/
  - Fixed simulation steps and bounding frame-time accumulation.

## Next engineering experiment before integration

1. A live slope/step/platform test scene must use exactly the proposed protagonist dimensions and a real render camera.
2. Separate input intention, physics velocity, collision resolution, and animation state.
3. Compare 30/60/120 Hz recorded paths; measure grounded contacts and unintended foot sliding.
4. Add tests for coyote jump, buffered landing jump, blocked steep slope, step clearance, and save/resume.
5. Add the correct sprite pivots and animation contact frames.
6. Review desktop and physical mobile captures.
7. Integrate into Phaser only after the vertical slice passes; never merge this experimental code directly into production.

**Source/asset safety:** preserve artist originals; do not publish master WAV files or replace approved assets. Main, live site, and PRs #2/#3 remain untouched.
