# Babylon.js asset QA harness

Separate diagnostic tool; not a playable scene or art approval. Built against the current stable Babylon.js 9.37.0. Loads a user-selected local GLB into an orbit camera without server upload, inspects mesh counts, skeletons, clips, materials and textures. Has wireframe and animation toggles, and a no-WebGL fallback.

The source work stays on the isolated game-rebuild branch. A model with all technical fields present may still visually fail the Arcturian references. This is intentionally a review gate, not a stock-asset marketplace or a generic world demo.

Build from this directory with npm install and npm run build. No source licensed albums, voices or 3D NPCs are bundled.
