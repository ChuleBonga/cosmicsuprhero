# Terrain fidelity QA, November 12, 2026

**Verdict: CONDITIONAL improvement, G1 visual quality still HOLD.**

Comparison is from the *actual deployed WebGL renderer* using a headless Chromium 144 / ANGLE SwiftShader software GPU at 1200×900 and 390×844. This proves rendering, not physical GPU frame rate or cinematic quality.

## Evidence frames
- [Legacy public game at arrival, 640×480 QA capture](qa/terrain-20261112/arrival-public.jpg)
- [Latest indigo cover-grade at same arrival, 640×480 QA capture](qa/terrain-20261112/arrival-cover3.jpg)
- [Latest cover-grade at waystation with original Blender worker, 640×480](qa/terrain-20261112/worker-cover3.jpg)
- [Latest cover-grade on 390×844 mobile touch emulation](qa/terrain-20261112/mobile-cover3.jpg)

All images are deliberately **small QA evidence copies**, not production artwork or reference imagery. The test also captured 1200×900 temporary full-resolution frames. A real hardware GPU run has not been done.

## Quantitative color diagnostic

Same lower-middle screenshot region, x=12%–88%, y=58%–87%, JPEG pixels. A *warm* pixel means R > 1.30×B and R > 1.12×G. A *blue* pixel means B > 1.13×R and B > 0.97×G. This arbitrary but consistent threshold is solely for color-direction regression, not a physical colorimetric measurement.

| Frame | Mean screenshot RGB in region | Warm fraction | Blue fraction |
| --- | --- | ---: | ---: |
| Existing normal game / arrival | (74, 35, 24) | 96% | 3% |
| First neutral-albedo candidate / arrival | (72, 52, 57) | 42% | 4% |
| Final reduced-ochre candidate / arrival | (56, 45, 61) | 2% | 49% |
| Final reduced-ochre candidate / waystation | (37, 30, 46) | 13% | 57% |
| Final reduced-ochre candidate / mobile | (50, 39, 56) | 2% | 56% |

**Interpretation:** The reference-controlled code change removed most of the orange-brown bias and restored dark cool color dominance. It did *not* convincingly reconstruct the real album's granular blue rock/ochre accents. In the final screenshot the foreground still reads flat mauve/indigo rather than detailed fractured stone; highlights are sparse, cliffs remain stylized/too smooth, and the red sun is obscured by the large generic gate.

## Functional evidence
- Both Vercel production checks on commit `5476440` passed.
- Production scene HTML and current game JavaScript/GLB loaded in fresh Chromium without page errors.
- The W0 original GLB still reported `workerLoadStatus=ready` in the hidden inhabitants review, 41 meshes and 3 animation clips.
- Desktop screenshot canvas 1200×900; emulated mobile canvas 390×844. Joystick and drag-to-look affordances were visible in the mobile screenshot, but actual physical-device usability is unverified.
- At the default visitor route, the cover-look option is disabled and the NPC remains unloaded. The album and pre-save routes are preserved.

## Approval gate

**Reject as finished art.** Continue with an authored geology/material pipeline, physically legible construction and better W0 anatomy/lighting; do not add more named cultures or decorate the scene with unrelated AI artifacts. An inhabited settlement and meaningful player-NPC narrative consequence remain unbuilt. The 8/30 overall art-direction HOLD from the critical review stays in force.

### Artist review URLs
- [Current visitor look](https://cosmicsuprhero.vercel.app/play/experiments/first-person/index.html?art-review=arrival)
- [Opt-in cover look](https://cosmicsuprhero.vercel.app/play/experiments/first-person/index.html?art-review=arrival&look=cover)
- [Opt-in worker under cover look](https://cosmicsuprhero.vercel.app/play/experiments/first-person/index.html?art-review=inhabitants&look=cover)
