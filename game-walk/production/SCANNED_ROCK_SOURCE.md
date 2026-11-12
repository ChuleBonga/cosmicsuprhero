# Scanned rocky-ground material / source and quality manifest
**Status:** CC0 review candidate, not yet artist-approved, normal game unchanged.

Source: Poly Haven / Rob Tuytel, [Rocks Ground 01](https://polyhaven.com/a/rocks_ground_01). Public-domain CC0 rock texture, not user mood-board imagery or copied cultural decoration. The static downloaded maps are source-controlled; the public website does not call Poly Haven's live API.

Upstream original 1k OpenGL normal map: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rocks_ground_01/rocks_ground_01_nor_gl_1k.jpg (1,394,176 bytes).
Upstream original 1k roughness map: https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/rocks_ground_01/rocks_ground_01_rough_1k.jpg (437,367 bytes).

Derived review files, processed in Sharp with Lanczos resize and WebP encoding:
- Normal (OpenGL, RGB): 512×512 WebP quality 65, 85,450 bytes, SHA-256 bc803970b2a79357aefc7d7a9b171e4066346eee3cfd0bc7a7d93f9450bda1dd.
- Roughness (grayscale RGB): 256×256 WebP quality 90, 25,842 bytes, SHA-256 94e7bc5ebabfba222c5ab71fe4578a4c6a43797cc5010582a394181ff22292fa.
- Total compressed additional review material: **111,292 bytes**. It remains dynamically loaded *only* when a named art-review camera is combined with look=cover.

The diffuse albedo is not imported: its original earthy/neutral color would conflict with the approved album's cobalt/indigo geology. The existing canonical geological vertex colors remain responsible for the world palette. Normal and roughness are photo-derived to test whether physically plausible surface structure improves the image.

Source code: experiments/first-person/scanned-terrain.mjs. Build reconstruction: scripts/assemble-scan-rock.mjs, with strict pinned SHA-256 and WebP header validation; source binary fragments are under source-assets/polyhaven-rocks-ground-01. Browser uses two normal encoded WebP images, not fragments or external network links. The fallback procedural materials remain in case any texture fails to load.

**Acceptance pending:** In-game A/B screenshot at 1200×900 and 390×844; check repeating pattern, excessive tiled aliasing, correct texture orientation, normal scale, frame-time impact and readback state. If grain becomes glittery or sharp at a distance, reject/reduce. Do not promote this or the unapproved NPC to the normal public game on a green build alone.
