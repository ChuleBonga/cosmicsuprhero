# Arcturian Awakening / release website

Production: https://cosmicsuprhero.vercel.app/
Artist: Cosmicsuprhero
Release link: https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening

## Creative decision

Replace the former catalog-first Observatory landing with an album-first, editorial experience. The main page progresses through the title, concise narrative, a tactile listening window, the album's three movements, the official listening link, the person behind the music, and selected previous releases. No blocking introduction, autoplay, WebGL, authentication, analytics, or runtime AI.

## Visual system

Warm chalk, deep evergreen/black, weathered material and deliberately constrained typography. Art direction references Awwwards mobile guidance and the choreography of Guillaume Colombel and Emotion Agency without copying their layouts or palette. Typography: Barlow Condensed for editorial emphasis; DM Sans for prose; IBM Plex Mono for small information. Archive images are temporarily reused from existing project-owned image paths, not presented as final album cover art.

## Interactive behavior

The Listening Window responds to keyboard, touch-accessible range input, +/- buttons, and reset. The two physical leaves reveal a photographed archive environment. It starts at zero without a loading gate or WebGL. The listener may use the album link before interacting. The visual exercise is explicitly NOT an album audio player.

## Known gaps / honest status

- Await final approved Arcturian Awakening artwork and audio/stems for genuine musical-reactive interactions.
- The four listed track titles are selected landmarks, not an official complete tracklist. Verify against the released distributor metadata.
- Manual iPhone 17 Pro Max and Instagram-in-app-browser screenshots, tap/drag tests, VoiceOver, and network-restricted QA are not yet complete. The Vercel build and public content fetch are verified.
- The original experimental app code remains in the repository for preservation, but is no longer imported by the production entry point. A cleanup of dead code and full static type checks should follow once final art/audio is integrated.

## Regression checklist

- Open production in Safari, Instagram browser, and Chrome; confirm a visible hero without loading overlay.
- Tap Experience; adjust range from 0 to 100, observe leaves opening and status changing to Revealed. Test +/- and Reset.
- Check 320, 375, 390, 430px and desktop widths: no horizontal scroll, no nav overlap, buttons accessible.
- Confirm each asset loads and that Spotify/YouTube/album links resolve.
- Test keyboard Tab, arrow keys on slider, reduced motion, low-power mode, content with external fonts blocked.
- Check OG preview for the correct album name and artist. Replace provisional archive image with official album cover once approved.
