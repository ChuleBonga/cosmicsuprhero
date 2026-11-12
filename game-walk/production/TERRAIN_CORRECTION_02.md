# Arcturian Awakening · Terrain fidelity correction 02
**Status: experimental review-only. Not art approved.**

### Why the previous look failed
The official album reference uses dark cobalt/indigo geology with localized ochre exposure. In the prior review grade, blue terrain vertex colors were multiplied by an **orange clay diffuse texture** tiled 36×64 times. Cliff colors were similarly multiplied by a very dark basalt diffuse texture. The result looked muddy, granular and unnaturally dark instead of physically convincing.

### Changes limited to ?art-review=...&look=cover
- Generate near-neutral albedo (RGB 230/234/238, restrained variation) for the candidate ground only, allowing geological vertex colors to actually appear in the final rendered diffuse.
- Reduce candidate terrain map repetition from 36×64 to 9×14 and synthetic normal strength from 6 to 2, with a terrain normal scale of 0.38.
- Remove redundant dark basalt albedo multiplication from candidate cliff faces. Preserve roughness/normal detail and reduce normal scale to 0.34.
- Use a gentler directional sun tint/strength in the candidate to reduce unnatural orange wash.
- Keep normal game and album/pre-save routes unchanged; no new public game selection.

### Visual acceptance
Compare the actual live WebGL scene at the same camera before/after and at desktop 1200×900 and narrow mobile 390×844. The desired change is blue geology retaining granular but localized ochre, with less glittering texture and non-clipped cliffs. Reject if the scene becomes flat blue paint or still resembles an orange desert.

### Remaining hard art blockers
Procedural terrain cannot by itself deliver photographed/geologically accurate surfaces; the existing city has no populated district; the single worker model is not art approved; architecture still resembles simple primitives; actual social behavior and narrative consequences are not built. G1 remains HOLD until real rendered comparison and artist approval.
