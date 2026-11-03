# ARCTURIAN AWAKENING: BUILD BRIEF FOR CHATGPT (v3)

From: Production Direction. To: the build team (ChatGPT).
Status: this brief supersedes all earlier handoffs where they conflict. The artist has locked the style, the audio plan, and the prize.

---

## 0. WHAT IS IN THIS PACKAGE

| Folder | Contents | How to use it |
|---|---|---|
| `audio/` | `score_awaken_now_loop` (ogg + m4a), four `pickup_*` clips (ogg + m4a), `manifest.json` | Real game audio for the preview. Treat the cut points as placeholders until the artist signs off. |
| `reference/style/` | Title screen, scene mock, keeper character sheet | The target look. Mood and style references, NOT production assets. |
| `reference/brand/` | Album cover, 3000 x 3000 | Brand anchor: tan band, cream ground, maroon italic serif title. |
| `reference/world/` | Sun and dunes plate, alien portrait | Source for palette, composition, and character likeness. |
| `reference/memory_plates/` | Two painted rider-over-village images | Future "memory reveal" plates. Not mapped to encounters yet. |
| `palette.json` | Sampled colors | Starting palette. Verify in your art tool. |

Master recordings are not included and must never be requested or hosted publicly.

---

## 1. MISSION

Build a short, finished, emotionally honest browser game that a stranger can start in five seconds, finish in under ten minutes, and walk away from wanting to pre-save the album **Arcturian Awakening** by Cosmicsuprhero.

The album's idea: "Not an escape. A return." The landscape is imagined. The human experiences behind the songs are real.

**The prize is the pre-save link.** It is earned at the end, available from the pause menu at all times, and never a paywall or a trap.

Pre-save URL: `https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening`
Append: `?utm_source=game&utm_medium=<ending|preview|pause>&utm_campaign=arcturian-awakening`. Open in a new tab so game state survives.

One sentence pitch: a quiet pixel-art walking game where you follow the red sun, recover three memories, and wake a song.

---

## 2. NON-NEGOTIABLES

1. **It is a game, not a clickable page.** Hold to walk. A figure moves across scrolling layers. The camera follows. If a player is tapping hotspots on a still image, it has failed.
2. **No fail state.** No health, no damage, no death, no timers, no score. Nothing can be lost.
3. **Awaken Now is the score.** It plays from the first tap to the end. The game literally awakens the song as you progress.
4. **Never fake audio.** If a file is missing, show a silent pickup with a caption. Never synthesize substitute music.
5. **No full master recording on any public URL.** Excerpts and the supplied loop only.
6. **The live site and its pre-save route are never touched.** All work is on a separate preview branch and a separate Vercel preview. Do not merge to main without the artist's written approval after a mobile test.
7. **Real versus placeholder is always declared.** Anything not final is labeled PLACEHOLDER in the code and in your report.
8. **Only measurements count as achieved.** Targets are not results.
9. **No invented names, dialogue, lyrics, or backstory.** If text is needed, use a clearly labeled neutral placeholder and ask the artist.
10. **Mobile first.** Most players arrive from Instagram or YouTube on mid-range phones, in portrait, inside an in-app browser.

---

## 3. THE STYLE LOCK (PIXEL ART)

The artist has chosen pixel art. The references in `reference/style/` define the look.

### 3.1 Pixel rules
- Logical resolution: **480 x 270 landscape** and **270 x 480 portrait**, scaled by whole-number multiples only. No smoothing, no fractional scale.
- Phaser: `pixelArt: true`, `antialias: false`, `roundPixels: true`. Snap the camera and the character to whole logical pixels.
- One pixel size across the whole screen. No mixing large and small pixels.
- Shared palette of 32 colors or fewer, plus up to 8 glow colors. See `palette.json`.
- Hills use stipple or ordered dither echoing the album cover's grain. No smooth gradients. Sky is flat navy with sparse star dots and a few cross-shaped twinkles.
- The reference mocks are not guaranteed to sit on a true pixel grid. Rebuild everything on a real grid. Any generated art must be reduced to the shared palette and cleaned before it counts as an asset.

### 3.2 Characters
- **Protagonist:** a small blue alien in a maroon hooded cape (see the title screen, scene mock, and `world_alien_portrait`). About 32 x 48 px. 8-frame walk, 4-frame idle for the first slice. Weight in the shoulders, trailing cape, one shared foot pivot so the feet never jitter. Turn frames are deferred.
- **Keepers:** the masked, robed figures with teal patterned ponchos from the keeper sheet. One per encounter (Name, Voice, Faith), each with a distinct silhouette. **They are peaceful.** Replace spears and swords with lanterns, staffs, or instruments. They never attack. Do not invent glyphs that resemble real writing or religious symbols.
- **Pickups:** the glowing teal stalks with amber bulbs from the scene mock. Each holds one song. They pulse faintly and brighten as the player approaches.

### 3.3 Screens and interface
- **Title screen:** as in `style_title_screen_REF`: "CHAPTER I", "ARCTURIAN AWAKENING" in gold pixel type, the tan band behind the title, the red sun above. Replace "[ PRESS START ]" with **"Touch the sun to begin"** on touch devices and "Press any key" on desktop. The sun is the tap target and the audio unlock. Keep the band flat, straight-edged, and slightly translucent so the title reads on a phone.
- **HUD: none.** The hearts, stamina bar, minimap, and inventory in the scene mock are NOT adopted. Allowed: a three-star constellation in pixel form, and a small pause icon. If the artist later wants a game-style HUD, it must be cosmetic and can never go down (for example a "light" meter that only rises). Do not build it unless told.
- **Brand layer (cream screens):** pause menu, jukebox, memory captions, and the pre-save screen sit on the cover's cream ground with maroon italic serif headings (Instrument Serif italic) and DM Sans for controls. The pixel font stays inside pixel scenes. The serif never goes inside pixel scenes. The pixel world and the cream layer meet at the title and finale, as the cover itself does: framed art on cream.
- **Fonts:** self-host WOFF2 subsets or use a bitmap font atlas. Do not load fonts or Tailwind from a CDN at runtime.
- **Memory plates:** later builds only. When a pickup plays, the screen opens to a full-screen painted (non-pixel) image of a real scene. Pixel means imagined, painted means real. Load on demand, 250 KB or less each in WebP. The two supplied rider images are candidates. They are not yet mapped to encounters, and you must not caption or interpret them. Ask the artist.

### 3.4 Effects
- Light motes: 2 x 2 to 4 x 4 pixel particles. Dust puffs: 6 frames. Wind: stepped streaks.
- Sun glow: stepped dither rings, not smooth blur.
- Optional CRT overlay (scanlines, vignette, rounded corners): CSS only, never a shader. Off by default on low-power devices and in reduced-motion mode.

---

## 4. GAME DESIGN

### 4.1 Core loop
Walk toward the sun. Follow the sound and light to a landmark. Do a short, tactile interaction. Recover a memory: the score opens further and the pickup track plays. Rest at a campfire clearing (music softens, progress saves). Repeat.

### 4.2 Controls
- **Touch:** press and hold on the right half of the screen to walk, release to stop. Tap to jump or interact. No on-screen D-pad, no dash, no potion buttons.
- **Desktop:** A/D or arrow keys to walk, Space to jump or interact. Click and hold also walks.
- Controls appear as brief contextual hints that fade after first use. Pause is always available and never loses state.

### 4.3 Movement feel (priority one)
Eased acceleration and deceleration. Footstep dust. Camera lag that catches up on stops. Slower uphill, a short glide downhill. 8-frame walk at about 12 fps with consistent contact. Jump has a short floaty arc, with coyote time (about 100 ms) and jump buffering. Playtest movement before building any encounter.

### 4.4 Structure (target first-run time: 6 to 8 minutes)
| Scene | Role |
|---|---|
| Boot / Title | Immediate display, audio unlock on the sun tap |
| Prologue: First Contact | Learn to walk. First Contact pickup. |
| Encounter I: The Name | Xaba pickup. Mechanic: Gather and Call. |
| Campfire | Shelter, save, soft music |
| Encounter II: The Voice | Mama Calls Me Chule pickup (later build) |
| Encounter III: The Faith | Songs Sent to God pickup (later build) |
| Finale: The Way Back | Awaken Now opens fully. Pre-save moment. (later build) |

### 4.5 Encounter designs
- **Prologue:** a gentle slope toward the sun, no obstacles. After about 60 seconds a glowing pickup plant appears on the path holding First Contact. Walking into it plays the excerpt.
- **Encounter I, The Name (Gather and Call):** a clearing with three drifting teal light motes and a peaceful Keeper. The player taps to send out a soft pulse ring. Timed to a gentle pulse in the music, motes drift together. When all three align, they form a simple symbol and the Xaba pickup blooms. Missed timing is forgiving: motes drift back and try again. The symbol must be a neutral placeholder until the artist approves its meaning.
- **Encounter II, The Voice (later):** a dark canyon at dusk. A faint, filtered fragment of Mama Calls Me Chule is heard in the distance with stereo and distance-based audio. The player walks toward it and tunes it clear with a slow drag. Emotional peak: slow the camera, let the music breathe.
- **Encounter III, The Faith (later):** a wind-swept ridge. The player carries a small flame upward. Gusts threaten it; holding shields it. At each shrine, release a spark. A dimmed flame simply relights at the last shrine. No death.
- **Finale (later):** the sun rises fully, the figure turns and sees the lit path behind. Sixteen stars appear. The player holds to send light into the sky, Awaken Now opens fully, and the pre-save button appears as part of the sky. Free roam continues after.

### 4.6 Pause menu (cream screen)
Resume, Sound, Jukebox, Accessibility, Pre-save. Six items maximum. Pre-save is always available and preserves progress on the outbound link.

---

## 5. AUDIO SYSTEM

### 5.1 The idea
**Awaken Now is the one continuous score. The game awakens it.** The other songs are pickups the player finds. No stems exist or are needed. The effect comes from filtering, ducking, and crossfading full mixes.

### 5.2 Files supplied (`audio/`)
| File | Role | Notes |
|---|---|---|
| `score_awaken_now_loop` | Continuous score | 45 s, from 0:30 to 1:15 of the song, 3 s equal-power seam, about -20 LUFS. Test cut: loop point not musically approved. |
| `pickup_first_contact` | Prologue pickup | 25 s, from 2:00.4 in the source, about -16 LUFS |
| `pickup_xaba` | Encounter I pickup | 25 s, from 1:18.9 |
| `pickup_mama_calls_me_chule` | Encounter II pickup | 25 s, from 2:14.7 |
| `pickup_songs_sent_to_god` | Encounter III pickup | 25 s, from 2:07.7 |

All are OGG Vorbis and AAC m4a, 44.1 kHz stereo. Excerpt start points were chosen by loudness, not musicality, and are placeholders. Final cut points need artist approval. Do not describe the loop as "seamless" until the artist approves it.

### 5.3 Behavior
- **Start:** on the first user gesture, never before. Download **zero audio bytes** before that gesture.
- **Score at start:** low-pass about 450 Hz, gain about 0.25, optional short filtered reflection if cheap.
- **Opening up:** ease the low-pass upward through movement and memory recovery, about 450, then 1400, then 3200, then 11000 Hz (tune by ear). Raise gain gently. Keep perceived loudness stable and avoid clipping.
- **Pickup:** duck the score about 16 dB over 250 ms, play the 20 to 30 second excerpt, then crossfade the score back over 900 to 1500 ms.
- **Pause and background:** pause rendering and audio when the page is hidden or paused, and recover on return (Page Visibility API).
- **Jukebox:** lists only discovered pickups. Never downloads the whole set in advance. Missing or unapproved items show "Preview pending" and are never clickable fake music.
- **Formats:** m4a (AAC-LC) as the iOS Safari baseline, OGG where supported. Test first-touch audio in Safari and in Instagram and TikTok in-app browsers.

### 5.4 Hosting
Artist-controlled static assets on the same Vercel project. Versioned immutable filenames such as `audio/v1/aa_awaken_now_score_loop_45s.m4a`. Correct MIME (`audio/mp4` for m4a), `Accept-Ranges: bytes`, CORS for the game origin. Avoid share-link redirects.

### 5.5 Manifest
Produce `content/aa_audio_manifest.v2.json` with fields: `trackId`, `title`, `src`, `fallbackSrc`, `durationSec`, `loopStartSec`, `loopEndSec`, `artistApprovedForWeb`, `credits`, `captionsSrc`. Set `artistApprovedForWeb` to false for everything until the artist confirms.

---

## 6. WHAT TO DO WITH THE EXISTING PROTOTYPE

The artist shared a single-file Canvas2D prototype built earlier. Use it as a visual reference only.

**Keep:** the dune, sky, sun and title-screen look; the alien sprite proportions and colors; the glowing mushroom pickups with floating spores; the expanding pulse ring as a gentle call gesture; the CSS-only CRT overlay idea.

**Cut:** hearts, HP, stamina, dash, potions, radar minimap, projectiles, all damage, and the "scrolls" inventory. Cut the synthesized fallback music. Cut the code-drawn fake album card (use the real cover art). Cut every invented keeper name and line of dialogue. Cut the on-screen D-pad and action buttons.

**Fix:** it redraws the dunes pixel by pixel every frame (tens of thousands of draw calls). Pre-render each parallax layer once. Preloading every track on page load must become load-after-first-tap. Remove the runtime Tailwind and font CDN loads. Remove `user-scalable=no`. Fix the `constvariation` typo, which creates an accidental global. Add portrait support. Add the pre-save link (the prototype has none).

---

## 7. TECHNICAL SPEC AND BUDGETS

**Stack:** Phaser 3 with TypeScript and Vite, deployed to a separate Vercel preview. If Phaser threatens the budgets, report measured numbers before proposing a lighter Canvas2D approach with pre-rendered layers.

**Architecture:** scenes Boot, Title, Prologue, Encounter1, SliceComplete (later: Encounter2, Encounter3, Finale, FreeRoam, Pause). A central `AudioDirector` owns the score filter, ducking, and crossfades. A `ProgressManager` owns saves, unlocks, and analytics. Data-driven content (JSON for pickups, text, and unlocks). All `localStorage` access is wrapped in try/catch, and the game works if storage is blocked.

**Budgets (gates, not hopes):**
| Constraint | Gate |
|---|---|
| Transfer to first interactive | under 3,000,000 bytes (JS, CSS, fonts, initial art) |
| Initial art, Prologue set | 400 KB or less |
| Initial JS, CSS, fonts | 1.9 MB compressed or less, prefer far less |
| Time to first interactive | under 3.0 s on a mid-range phone over 4G (physical device) |
| Frame rate | 60 fps on iPhone 12 class and mid-range Android, with a 30 fps fallback and reduced effects |
| Whole experience | under 15 MB progressive transfer, audio included |
| Audio before first tap | 0 bytes |
| Device pixel ratio | clamp to 1.5 |
| Background tab | pause render and audio |

**Proof you must provide:** the Vite `dist` size breakdown, a Network ResourceTiming capture after first interactive, a 5-minute real-device frame profile, a slow-4G test, a Safari and Instagram first-touch audio test, and layout checks at 320, 390, and 430 CSS px portrait plus desktop. Screenshots alone cannot prove frame rate or load time. If you cannot measure something, say "not measured."

**Revised art assets (pixel native):**
- Sky: 480 x 270, with a separate slow star layer.
- Far hills, mid hills, ground: 960 x 270 each, horizontally seamless, with variants so six minutes of walking does not visibly repeat. Portrait versions, or re-composed layers at 270 x 480.
- Protagonist: 32 x 48 frames, 8-frame walk, 4-frame idle. Pickup plant: 3-frame pulse. Mote: 4 frames.
- Format: indexed PNG or lossless WebP. Frame names in JSON match filenames without extension. One shared foot pivot at normalized (0.5, 0.94).

For the first gray-box slice, procedural terrain and placeholder sprites are acceptable if labeled PLACEHOLDER. Do not call placeholders final art.

---

## 8. ACCESSIBILITY AND CARE

- Captions for any voice or lyrics, on by default. If there is no spoken content, provide meaningful sound description.
- Reduced-motion mode (no parallax drift, camera bob, or screen shake). Respect the system setting.
- WCAG AA contrast for all text. One-handed play on mobile. Screen reader labels for menus.
- No flashing. The sunrise is a slow ramp.
- The stories and names behind these songs are real. No stereotyping, no invented "tribal" decoration, no decorative use of cultural elements. When in doubt, ask the artist.

---

## 9. ANALYTICS (no personal data)

`game_loaded`, `audio_started`, `first_walk`, `encounter_started`, `encounter_completed`, `campfire_reached`, `preview_shown`, `preview_clicked`, `finale_reached`, `presave_clicked` (with source), `photo_taken`, `share_clicked`, `hidden_star_found` (with track), and drop-off by scene.

Working targets for launch week: 60 percent of starters reach Encounter I, 35 percent reach the finale, 15 to 25 percent of finishers click pre-save.

---

## 10. TRACKS AND OPTIONAL STARS

The album has 16 tracks: Meditate, First Contact, Precipice, Credo's Words, Dawning, Rustic Fire, Xaba, Mama Calls Me Chule, Chords for Pondering, Peace for the Soul, Songs Sent to God, Emancipated, The World Is Ours, Awaken Now, Gloriously, Finale.

- Awaken Now is the score, not a pickup.
- Four story pickups: First Contact, Xaba, Mama Calls Me Chule, Songs Sent to God.
- **Credo's Words is excluded** until the artist confirms recording and sampled-voice clearance. It may appear in the tracklist as metadata only.
- The remaining 11 tracks are optional hidden pickups, each unlocking only after its own web approval. A 16-star display does not imply sixteen licensed clips exist. Create the data slots with `available: false`.

---

## 11. DELIVERABLES, IN ORDER

**Do not write more handoff or planning documents. The next thing the artist wants to see is something running.**

### Build 1: Vertical slice (the current task)
On a separate preview branch and Vercel preview:
1. Title screen per section 3.3 (tan band, "Touch the sun to begin" audio unlock).
2. Prologue: hold-to-walk on a pixel-grid scrolling landscape with at least five parallax layers, camera follow, eased movement, dust.
3. Awaken Now starts muffled on the first tap and opens as the player progresses.
4. The First Contact pickup on the path: the score ducks, the excerpt plays, the score crossfades back.
5. Encounter I with the Gather and Call mechanic and the Xaba pickup.
6. A campfire save point, a cream-screen pause menu with Jukebox and Pre-save, and a "Slice complete, continue in next build" scene.
7. The pre-save link live from the pause menu.
8. Portrait (270 x 480) and landscape (480 x 270).

### Build 2: Encounters II and III. Build 3: Finale, memory plates, photo mode, hidden stars, accessibility pass, analytics, QA.

### Acceptance test for Build 1 (the artist will run this on a phone)
1. First tap starts Awaken Now, muffled and distant.
2. Holding the right half of the screen walks the figure; release stops.
3. At least four layers scroll at different speeds and the camera follows.
4. The music gets brighter as the player progresses.
5. The First Contact pickup appears, the score ducks, and the excerpt plays, then the score returns.
6. Encounter I can be completed and retried without penalty.
7. No hearts, health, stamina, or damage anywhere.
8. Pre-save opens in a new tab from the pause menu, and the game resumes intact.
9. Smooth after a full minute of walking.
10. Nothing audible or downloaded before the first tap.

If you cannot deliver any item, say which one and why. Do not substitute something else.

---

## 12. HOW TO REPORT BACK

Every report ends with these four lists:
1. **Real:** what works and how you verified it (measured numbers only).
2. **Placeholder:** everything temporary.
3. **Not verified:** anything you could not test.
4. **Need from the artist:** at most five specific questions.

Ask rather than guess when anything in this brief conflicts with another instruction or with a technical limit. Propose the closest alternative that keeps the player's emotional experience intact.

**First questions to expect the artist to answer:**
1. Do the four excerpt start points sound right, or which moments should replace them?
2. Which 45 seconds of Awaken Now does the public site currently use, and is the loop edit approved?
3. What should the Encounter I symbol mean, and what text (if any) appears?
4. Which memory plate belongs to which encounter, if any?
5. Is the cosmetic-only "light" meter wanted, or no HUD at all?

---

## 13. DEFINITION OF DONE (FOR THE FULL GAME)

1. A first-time player starts within five seconds and finishes in under ten minutes without instructions.
2. It runs smoothly on target devices and loads within budget, with measured proof.
3. All three encounters, campfires, finale, and pre-save moment work flawlessly.
4. The score opens as designed and the final moment lands emotionally.
5. Captions, reduced motion, and mute work.
6. The pre-save link, tracking, and analytics are verified end to end.
7. The artist has played it and signed off on every story beat and every audio cut.
8. Someone outside the team plays it, feels something at the Voice encounter, and asks where to pre-save.

Build something a person remembers the way they remember a song from childhood. Then give them a place to take that feeling home.
