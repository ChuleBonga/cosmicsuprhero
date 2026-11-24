# Arcturian Awakening — December 4 album release gate
**Date:** 2026-11-24. **Candidate branch:** `release/album-first-dec04-2026`. **Status:** candidate only, not production approval.

## Product decision
The December 4 release is the **sixteen-track music album**, not the unapproved 3D game. The game is independent and does not need to follow any track count. Album-first page preserves approved artwork, release date, tracklist, artist and pre-save destination. The rejected first-person walking prototype must not be the primary launch experience, and uncleared game audio must not ship in the album site's build.

## Supplied launch ZIP — accept/reject
Reviewed all eight files in `cosmicsuprhero-launch-patch.zip` (2026-11-24).
- **Adapted:** Small-print contrast and tracklist compacting from `src/arcturian-world.css`.
- **Reference only:** Meditation/ether imagery and the album-subhead ideas from `index.html`. Existing album-first story copy is retained; no more repeated “Not an escape. A return.”
- **Rejected:** Portal veil and hide-until-scroll animation (adds an unnecessary transition and risks invisible text); obsolete game-first CTA and “scored by Awaken Now” claim; game entry / Three.js edits; changed `embed-game.mjs` that requires and ships sound.
- **Safer routing:** `/world` and historical `/play` URLs temporarily redirect to the album landing page, rather than into a rejected or missing 3D scene.

## Gate A: Music/distribution (critical, currently NOT VERIFIED)
- [ ] In Amuse, `Arcturian Awakening` shows **approved and delivered** to intended stores for December 4, 2026. Check the release status from the Music tab. Official guide: https://support.amuse.io/en/articles/107735-approval-process
- [ ] Confirm that the exact Amuse pre-save URL embedded in the site opens and offers Spotify / Apple Music pre-save for real listeners. The public automated fetch returned empty content; it did not independently verify the destination: https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening . Official guide: https://support.amuse.io/en/articles/107695-pre-save
- [ ] If the record appears as an eligible upcoming release in Spotify for Artists, submit one track with accurate pitch context **by November 27**, at least seven days before December 4. Official Spotify guide: https://support.spotify.com/to/artists/article/pitching-music-to-playlist-editors/
- [ ] Verify master files, artwork, 16 song metadata entries, spelling/credits, permissions, and planned release timezone with distributor. No inference from homepage metadata.

## Gate B: Album-only site (candidate code)
- [x] Homepage no longer advertises a finished game and offers an accessible tracklist hero button.
- [x] Original album art, release date, pre-save CTA, artist links and 16-item tracklist retained.
- [x] Added WCAG-AA-targeted small text contrast and more compact desktop tracklist layout based on supplied patch.
- [x] Candidate build command is `vite build`; no nested game build, game-audio embed or external audio injection.
- [ ] Latest Vercel **preview** builds successfully; / returns 200, CSS and JS return 200; /world and /play redirect to album; no /play/assets game bundle; verify server response.
- [ ] Real Chrome/Firefox/Safari and 390x844 / 768x1024 / 1440x900 screenshots; inspect album cover crop and all visible CTA labels.
- [ ] Keyboard and touch: hero and masthead tracklist buttons open dialog, close button and Escape close, focus is restored; 16 songs reachable by scrolling.
- [ ] Release-day test: update pre-save wording to **Listen now** only after confirmed DSP availability and valid listening URLs.
- [ ] Artist visually approves this candidate before changing production alias.

## Gate C: Promotion
- [ ] Prepare one recognizable 9:16 teaser from **approved album art**, actual cleared music excerpt, release date and short caption. Avoid generated visuals falsely presented as game footage.
- [ ] Provide platform-specific launch assets: cover post, vertical teaser, pre-save reminder, release-day stream link post, and a personal note about the meditation/awakening idea. Confirm audio and visual publication rights.
- [ ] QA social profile links and release-day smartlink.

## GO / NO-GO
- Album can launch without the game if **distribution and final master/rights approvals pass**.
- Site may go live after HTML, responsive, interaction, real pre-save and artist visual checks pass.
- **NO-GO for public game** until authentic populated world, character acting, performance and art review pass. Passing automated WebGL tests is not art approval.
- Do not publish this preview or merge it into main without explicit artist approval.
