# Arcturian Awakening audio delivery and release gate

## Source of truth

Original mastered recordings and the album archive live in the artist's [Google Drive folder](https://drive.google.com/drive/folders/19S2e4kkT_nLdb3KZolrjFyCMQD9a7KBb?usp=drive_link). Do not serve private Google Drive shares, full WAV masters, expiring Adobe links, or temporary signed CDN URLs as website audio.

The folder lists six individually named WAVs and a ZIP archive. The ZIP contents and the public preview cut points need verification before publication. The six numbered WAV filenames are not evidence of the final album listening sequence.

## Current homepage behavior

- The homepage expects an optional **45-second Awaken Now** excerpt at `public/audio/awaken-now-preview.m4a`.
- It performs a same-origin HEAD check and enables the Listen button only when a media-type asset is actually deployed. An HTML fallback or missing file leaves playback disabled with honest status text.
- Entering the painting does not start audio. Visitors must press Listen themselves.
- The browser stops playback at the 45-second cut point.
- If the file is missing, the rest of the journey remains accessible without sound.

## Publishing a preview: required review

1. Confirm the exact mastered source file and select the 45-second in/out points with the artist.
2. Confirm that the source recording and any underlying samples are cleared for a publicly accessible streaming excerpt.
3. Export a browser-friendly encoded M4A for this excerpt; preserve the original WAV unmodified.
4. Place the verified excerpt at `public/audio/awaken-now-preview.m4a`.
5. Record approval in `docs/audio-preview-approval.json` with:
   - `"track": "Awaken Now"`
   - `"publicPreviewApproved": true`
   - `"cutPointVerified": true`
6. Run `npm run check:audio` and the full build, then test play, pause, seek, replay, broken-source fallback and reduced-motion behavior on desktop and mobile.
7. Deploy only following review and approval.

**Never set those flags true in advance just to bypass the build.** The build rejects an unapproved or oversized audio file; it does not infer rights from file ownership alone.

## Game-specific issue still open

The separate Phaser game's `AudioDirector.ts` requests `/play/audio/pickup_first_contact.m4a`, while `scripts/embed-game.mjs` deliberately excludes the entire directory. This is a separate release decision. Do not remove the packaging exclusion until the First Contact excerpt, cut point and clearance are confirmed. When cleared, package only named, approved, bounded excerpts, not a whole audio directory.

This document does **not** mean the music preview is publicly functional yet. Source connection, encoded asset creation and actual playback verification remain required.
