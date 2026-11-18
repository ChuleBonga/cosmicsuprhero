# Arcturian Awakening — verified asset production checkpoint
Date: 2026-11-17. Source branch: `rebuild/arcturian-awakening-20261113`.
**Gate verdict: Technical import PASS; creative/civilization acceptance FAIL.**

## 1. Original project receiver (PRP-001)
- Runtime GLB: `awakening-rebuild/engine-lab/public/models/PRP-001-civic-receiver-v04.glb`.
- Editable authoring logic: `awakening-rebuild/engine-lab/tools/generate-civic-receiver.mjs`. The earlier Blender concept remains hosted in 3D Jutsu revision 3. These are distinct sources, not a byte-for-byte Blender export.
- Canonical Node-22 GLB: 182,304 bytes; Git blob SHA `eafb47f432383057b975ce336cd072791d8ee0ee`.
- Babylon import measured 37 scene meshes including importer root, 5 PBR materials, 3 texture images, 5,072 triangles, height 1.92 m, no skeleton, no animations. **Prop, not NPC.**
- The original model failed first visual review: reverse-facing curved geometry and open foundation created a hollow look. Generator triangle winding and bottom/top surfaces were corrected.
- The model remained poorly visible on narrow mobile after first render despite loaded metrics. A `ResizeObserver` and immediate redraw after the stage changes size corrected this.
- The latest Playwright test decodes actual canvas PNG pixels to detect a blank stage. Desktop and mobile tests passed.
- Source glTF geometry has an additional test comparing face winding with intended vertex normals for key mechanical parts. GLB regeneration is compared byte-for-byte in canonical Node 22.
- Automated browser evidence: [Babylon 3D QA run 44211077026](https://github.com/ChuleBonga/cosmicsuprhero/actions/runs/44211077026), screenshot files `PRP-001-original-civic-receiver-desktop.png` and `asset-review-mobile.png` in the Actions artifact.

### Critical artistic review
| Quality criterion | Outcome |
|---|---|
| Full, solid geometry | PASS after correction |
| Basic PBR shader/textures | PASS technically; materials still simplistic |
| Visual readability on desktop | PASS, inspected from screenshot |
| Mobile visibility and controls | PASS, inspected from 390×844 screenshot |
| Faithfulness to source colors | PARTIAL, sampled palette not a validated PBR material library |
| Authentic Arcturian cultural construction | **FAIL**: no approved technical/architectural design grammar |
| Worn surface microdetail, construction seams, fabrication history | **FAIL**: overly clean, generalized form |
| Actual in-game function with characters | **FAIL**: QA turntable only |

**This object may stay in the asset lab but must not be promoted to the final inhabited world.**

## 2. Character source asset REF-CHAR-000
- Extracted from the actual user-project illustration `aa_cover_figure.webp` (768×1152).
- `production/assets/REF-CHAR-000-original-profile-transparent.png` is a transparent source-derived single profile, and `production/assets/REF-CHAR-000-profile-review.png` is the comparison on navy. `REF-CHAR-000-metadata.json` records crop dimensions and source digest.
- The initial cutout was rejected after it amputated the top of the cranium. The manual mask was corrected, re-inspected, and a small ochre terrain contamination removed.
- A separate GitHub Actions authoring workflow reproduced and committed the reference extraction. It is a **profile study only**, with no invented front or rear anatomy.
- The species and figure identity are not a confirmed Caretaker character. Do not assign REF-CHAR-000 to CHR-002 without artist approval.
- A rigged animated NPC with original textures and costume has **not** been produced.

## 3. UX and code
- The Babylon asset viewer now auto-loads the committed project GLB and labels its unapproved status.
- Role-aware validation distinguishes 3D characters from props and environments.
- Original project artwork is preserved for side-by-side review; the landscape repeat contains duplicate suns and must not be deployed as a single-sun sky.
- Main game is still a story mechanics lab, not a populated third-person settlement. Scene-aware citizen routines and post-choice world consequences exist as deterministic source code; no believable 3D civilian performances exist.

## 4. CI and deployment truth
- Clean rebuild tests, authored-asset tests, glTF geometry checks and Babylon browser tests passed at their cited commits.
- A new isolated Vercel QA deployment was requested, but Vercel rejected it with **402 / api-deployments-free-per-day** (daily limit, retry after 86400 seconds). The newest revision is **not** deployed; the existing QA URL points to an older version.
- Vercel CLI fallback was unavailable in the local runtime; there was no safe separately linked source checkout to deploy from an authenticated CLI.
- Public Cosmicsuprhero production website and main branch remain unchanged.

## 5. Next approval gate
Obtain the complete original civilization reference images and approved multiview character design. Produce exactly **one** original resident with textured skin, detailed garment construction, independently named idle/walk/talk/gesture clips and a comprehensible real-world role. Capture neutral turntable and in-game third-person interaction under the album lighting before expanding population. Do not claim that a static generic humanoid passes character quality.
