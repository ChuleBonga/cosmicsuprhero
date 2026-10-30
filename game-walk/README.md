# Arcturian Awakening — gray-box walk test

**Independent Vercel preview project.** No code on this branch replaces the public album landing page. Production pre-save unchanged.

Acceptance scope: Phaser 3 + TypeScript + Vite, touch the sun on original cover to begin, hold left/right or use arrow keys/A-D to walk, five independent parallax groups, camera follow, Awaken Now low-pass opens as distance increases, collision-based First Contact pickup triggers 25-second excerpt with score ducking, local progress persistence.

The character and landscape geometry are intentionally placeholders; approved separated illustration and sprites remain to be provided. No click-to-collect hotspots or encounter system.

Audio paths are local to the separate preview project. Score and pickup MP4/AAC assets must be copied from the approved attached pack into /public/media and never be replaced with a master recording. OGG fallbacks can be provided later for wider codec coverage.

Run `npm install && npm run build` from `game-walk/`.

Performance gate: under 3 MB before first interactive, targeting 60 fps on midrange phones. Only physical-device measurements can pass frame-rate acceptance. First interactive excludes deferred audio, which begins after user gesture.
