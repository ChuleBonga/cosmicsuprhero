# CODEX PROMPT: Integrate Asset Handoff v0.2 and Prepare Chamber Pages

You are working on the Cosmicsuprhero Sacred Observatory Archive.

Unzip `cosmicsuprhero_asset_handoff_v0_2.zip`.

Copy the `public/assets` folder into the project root.
Copy or reference the `docs` and `prompts` folders as project documentation.
Do not place the `source/reference` folder in public web output unless explicitly approved; it is a private reference/source folder.

## Critical design rule

This asset pack includes only accepted Observatory and identity-lock assets. It does not include final chamber-page hero images yet.

Do not use rejected collage/contact-sheet images.
Do not use images with baked-in text, labels, titles, or grid layouts.
Do not use the failed golden-hour street image as a character asset.

## Use these assets

- `/assets/observatory/observatory-entry-worldplate.webp`
  Use as Entry Signal / Observatory background world plate if it improves the hero.

- `/assets/observatory/signal-listener-portrait.webp`
  Use for The Vessel / Narrator / Observatory portrait. This is the accepted likeness test.

- `/assets/observatory/signal-listener-wide-01.webp`
  Use only in Observatory contexts.

- `/assets/observatory/signal-listener-wide-02.webp`
  Use only in Observatory contexts.

- `/assets/og/cosmicsuprhero-og-draft.webp`
  Use as draft OG only if no better OG exists.

## Do not pretend final chamber assets exist

For chamber pages whose final hero images are missing, use chamber-specific CSS atmospheres and data-driven placeholders.

Expected future paths:

- `/assets/chambers/soil-and-sun/soil-and-sun-hero.webp`
- `/assets/chambers/bad-guys-finish-last/bad-guys-finish-last-hero.webp`
- `/assets/chambers/songs-i-made-at-night/songs-i-made-at-night-hero.webp`
- `/assets/chambers/enter-aquarius/enter-aquarius-hero.webp`
- `/assets/chambers/celestial-multiverse/celestial-multiverse-hero.webp`
- `/assets/chambers/stargazing-vol-3/stargazing-vol-3-hero.webp`
- `/assets/chambers/just-sounds-really/just-sounds-really-hero.webp`

## Implementation tasks

1. Update the chamber/release data model so every chamber supports:
   - heroImage
   - secondaryImage
   - textureImage
   - visualPrompt
   - generationNote
   - assetStatus
   - credit

2. Create or refine `ChamberVisualLayer` so it:
   - renders `heroImage` if present
   - falls back to chamber-specific CSS atmosphere if missing
   - uses object-fit: cover
   - handles mobile and desktop crops
   - applies dark readability overlays
   - lazy-loads non-critical images
   - avoids horizontal overflow
   - respects reduced motion

3. Create or refine separate chamber pages for:
   - Soil and Sun
   - Bad Guys Finish Last
   - Songs I Made At Night
   - Enter Aquarius
   - Celestial Multiverse
   - Stargazing, Vol. 3
   - Just Sounds Really

4. Do not use Apple Music iframes raw. Wrap them in a dark archival `TransmissionPlayer` or `ArtifactFrame`.

5. Add `The Vessel` or narrator portrait using `/assets/observatory/signal-listener-portrait.webp` if it improves the page.

6. Improve navigation:
   - Observatory index
   - all chamber links
   - previous/next chamber
   - return to Observatory
   - mobile-friendly menu
   - visible focus states

7. Improve responsive typography:
   - no awkward wrapping in long serif chamber titles
   - larger, higher-contrast body copy
   - readable line lengths
   - better mobile spacing

8. Accessibility:
   - semantic headings
   - iframe titles
   - alt text or aria-hidden for decorative visuals
   - focus states
   - contrast
   - reduced-motion support

9. SEO:
   - home metadata
   - chamber metadata
   - OG image draft if appropriate
   - favicon if available

10. Verify:
   - npm run build passes
   - npm run lint/typecheck if available
   - no broken image paths
   - no console errors
   - no horizontal overflow
   - mobile chamber pages readable

## Final response required

Report:
- files changed
- assets connected
- chamber routes created/updated
- assets still missing
- build result
- mobile/desktop screenshots
- deployment URL if deployed

Quality bar:
The site should move from a stylish long-scroll portfolio into a navigable immersive Sacred Observatory Archive.
