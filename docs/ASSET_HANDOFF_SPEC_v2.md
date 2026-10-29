# ARCTURIAN AWAKENING — PLAYABLE WORLD ASSET HANDOFF v2.0

**Status:** Approved audio-direction revision; supersedes v1 stem requirements. 2026-10-29. **Production remains untouched.** The Phaser vertical slice lives on a separate preview Git branch. The game is a 2.5D painterly walking experience. Prologue / First Contact and Encounter I / The Name are the only playable scenes required for the first review. Nothing below implies an asset has already been delivered, approved, or licensed except the known album artwork and 45-second *Awaken Now* excerpt.

## 1. Audio-direction lock

**Core verb:** awaken the song. *Awaken Now* is the music that accompanies movement from the first player gesture to the finale. Starts muffled/quiet with low-pass; filters and gain open gradually as the landscape and memories recover. Pickups interrupt it: score ducks, approved 20–30-second clip plays, score crossfades back. No stems are required. Playback may loop, but loop points must be musically approved. **Do not put a full unreleased 2:00 master anywhere public.** The 45-second excerpt already approved is a temporary *preview* score. A musically seamless loop edit and separate official pickup excerpts need explicit artist approval before production launch.

**Narrative pairing (approved):** Prologue pickup = First Contact; The Name = Xaba; The Voice = Mama Calls Me Chule; The Faith = Songs Sent to God; Finale = Awaken Now. Credo’s Words is excluded, optional only after sampled voice clearance. Twelve additional optional stars may unlock other tracks only after individual web approvals; a 16-star roster does **not** imply sixteen licensed clips exist.

## 2. Art source contract

- `art/source/AA_master_artwork_3000x3000.psd` (or `.afdesign`) — private layered source, sRGB, 3000 × 3000, no baked HUD. A lossless 3000 × 3000 PNG may substitute for initial masking but is insufficient for final animation.
- Composition canvas: **2048 × 1152** for world layers; preserve one common registration origin `(0,0)` and export transparent RGBA PNG layer masters. Supply `art/composition/aa_mobile_safearea_1080x1920.png`, 1080 × 1920, with sun, figure and interactive controls marked outside device chrome.
- Required **Prologue / Encounter I** masters (matching 2048×1152 coordinate origin unless marked):

| Exact source filename | Pixels | Exported optimized runtime asset | Target transfer |
|---|---:|---|---:|
| `art/source/aa_00_sky_2048x1152.png` | 2048 × 1152 | `art/world/aa_00_sky.webp` | ≤95 KB |
| `art/source/aa_01_sun_2048x1152.png` | 2048 × 1152 | `art/world/aa_01_sun.webp` | ≤55 KB |
| `art/source/aa_02_mountains_far_2048x1152.png` | 2048 × 1152 | `art/world/aa_02_mountains_far.webp` | ≤130 KB |
| `art/source/aa_03_mountains_mid_2048x1152.png` | 2048 × 1152 | `art/world/aa_03_mountains_mid.webp` | ≤160 KB |
| `art/source/aa_04_ground_2048x1152.png` | 2048 × 1152 | `art/world/aa_04_ground.webp` | ≤190 KB |
| `art/source/aa_05_character_1024x1536.png` | 1024 × 1536 | `art/actor/aa_character_idle.webp` | ≤130 KB |
| `art/source/aa_name_clearing_1536x1024.png` | 1536 × 1024 | `art/encounter1/aa_name_clearing.webp` | ≤155 KB |
| `art/source/aa_light_mote_256x256.png` | 256 × 256 | `art/fx/aa_light_mote.webp` | ≤15 KB |
| `art/source/aa_dust_256x256.png` | 256 × 256 | `art/fx/aa_dust.webp` | ≤15 KB |

Use WebP with alpha for painted transparent layers and texture-tested WebP opaque for sky; no generic fantasy glyphs, heavy vector glows, AI-created replacement character, or emoji. Retain the official cover as visual reference. For the first **functional** gray-box slice, procedural terrain and the official album image may stand in, but mark every placeholder in documentation; do not call that final art.

## 3. Character sprite sheets

| Exact deliverable | Frames | Master cell size | Runtime atlas / metadata |
|---|---:|---:|---|
| `art/actor/source/walk_right/aa_walk_00.png`…`aa_walk_15.png` | 16 | 512×768 RGBA | `art/actor/aa_walk.webp`, `art/actor/aa_walk.json` ≤2048×2048 atlas |
| `art/actor/source/idle/aa_idle_00.png`…`aa_idle_07.png` | 8 | 512×768 RGBA | `art/actor/aa_idle.webp`, `art/actor/aa_idle.json` ≤2048×2048 atlas |
| `art/actor/source/turn/aa_turn_00.png`…`aa_turn_07.png` | 8 | 512×768 RGBA | `art/actor/aa_turn.webp`, `art/actor/aa_turn.json` (later polish) |
| `art/fx/source/mote_00.png`…`mote_11.png` | 12 | 64×64 RGBA | `art/fx/aa_mote.webp`, `art/fx/aa_mote.json` ≤1024×1024 |

Frame names in JSON must match filenames without `.png`. Character frames share one foot pivot at normalized `(0.5,0.94)`; do not add camera jitter by varying feet registration. Walk animation approximately 12–16 fps, with weight and consistent contact; left facing may be a runtime mirror if likeness is preserved. Runtime compression is subject to visual signoff.

## 4. Sound files — pickups, no stems

Store **only cleared short excerpts** in the artist-controlled public media bucket/CDN or the project's versioned static Vercel assets. Publish **no full masters**. Use AAC-LC in `.m4a` as baseline, 44.1 or 48 kHz stereo, approximately 96–128 kbps; provide compatible `.mp3` fallback if Safari/in-app test warrants it. Target ≤−1 dBTP and audition transitions by ear. True loop files require music-matched in/out points, not arbitrary hard truncation.

| Exact public filename (after approval) | Purpose / chapter | Duration | Current status |
|---|---|---:|---|
| `audio/v1/aa_awaken_now_score_loop_45s.m4a` | Continuous score, filtered from first tap; loops in slice | 45 s | **Approved 45s excerpt exists**, but clean loop point **not yet approved** |
| `audio/v1/aa_first_contact_pickup_25s.m4a` | Prologue pickup | 20–30 s | Await clip + web approval |
| `audio/v1/aa_xaba_pickup_25s.m4a` | Encounter I / The Name | 20–30 s | Await clip + web approval |
| `audio/v1/aa_mama_calls_me_chule_pickup_25s.m4a` | Encounter II / The Voice | 20–30 s | Future approval |
| `audio/v1/aa_songs_sent_to_god_pickup_25s.m4a` | Encounter III / The Faith | 20–30 s | Future approval |
| `audio/v1/aa_awaken_now_finale_45s.m4a` | Finale resolved sunrise | ≤45 s | Reuse approved excerpt unless new edit approved |
| `audio/v1/aa_optional_XX_<track-slug>_20s.m4a` | Optional remaining stars, *per track* | 15–25 s | No files licensed yet |

Private source exports: `audio/private/aa_awaken_now_score_loop_APPROVAL.wav`, `audio/private/aa_xaba_pickup_APPROVAL.wav`, etc. **Never commit private sources or an unreleased full master.** Deliver `content/aa_audio_manifest.v2.json` with fields `trackId`, `title`, `src`, `fallbackSrc`, `durationSec`, `loopStartSec`, `loopEndSec`, `artistApprovedForWeb`, `credits`, `captionsSrc`, `waveformOrArtworkOptional`. Missing files do not become autogenerated audio: show an in-game silent pickup plus caption and preserve progression.

**Mix and behavior:** An `AudioDirector` holds HTML Audio / Web Audio graph. Start from user gesture, low-pass ~450Hz, gain ~0.25, optional short convolution/filtered reflection if performant. Ease LPF upward through movement and memory: ~450→1400→3200→11000Hz (tune by listening), reduce wetness, maintain stable perceived loudness; avoid clipping when widening. On pickup enter, duck bed to ~−16dB over 250ms, play excerpt (20–30sec), crossfade score back over 900–1500ms. Pause/resume both; pause menu Jukebox lists only actually approved/discovered pickups. No auto-download of the entire jukebox.

**Hosting:** Artist-controlled versioned origin, own bucket/Vercel project assets. Set correct MIME (`audio/mp4` for `.m4a`; `audio/mpeg` for `.mp3`), `Accept-Ranges: bytes`, CORS for game origin, cache immutable versioned filenames; avoid Creative Cloud share redirects. If storage is unavailable, preview remains silent and the AudioDirector reports the missing asset honestly. Download zero audio until the first tap.

## 5. UI, captions, content, and unlock metadata

- `content/aa_scene_text.en.json`: brief approved text for prologue, The Name, shelter, preview, pause and pending encounters. No fabricated lyrics, ancestral voices or affirmations.
- `content/aa_captions.en.vtt`: captions for approved spoken/lyrical passages (if any; provide meaningful sound description otherwise).
- `content/aa_tracks.json`: exactly 16 album track names from cover; `Credo’s Words` metadata may appear in tracklist, but no pickup/audio until cleared.
- `content/aa_pickups.json`: 4 primary pickup definitions and 12 optional-star slots with `available:false` unless approved; track-to-pickup relationship is data-driven.
- `art/ui/aa_hud_constellation.svg`: 512 × 256 source vector; runtime inline SVG or compact texture.
- `art/ui/aa_controls.svg`: 24 × 24 artboard for authored play/pause/exit icons; stroke-based, no unicode arrows/emojis.
- Typography: Instrument Serif for album/editorial and DM Sans for functional controls; avoid loading heavy new font libraries for the game.

## 6. Vertical-slice definition and delivery rules

- Boot/title is visible immediately using HTML/approved poster image; Phaser loads the playable area. If Phaser fails, never block the pre-save route.
- Prologue: first touch starts music if approved/hosted, hold-to-walk on right half of screen, release-to-stop, keyboard A/D/arrow keys. Walking moves the figure with eased acceleration, parallax, camera drift and terrain-foot contact. *First Contact* pickup can be collected via contextual tap once approved. The title mechanic reveals the music via the AudioDirector, not a fake graphic equalizer.
- Encounter I: walk to a clearing and move or sweep toward three softly lit particles; motes form a human-scale symbolic memory only after artist-approved content. Use a neutral placeholder now; avoid fake voiced content. `Xaba` pickup ducks the score and plays an approved 20–30 sec clip; if not supplied, silent reveal retains story and pause-menu jukebox shows `Preview pending` (never clickable fake music).
- Checkpoint and pause: restore prologue/encounter position, discovered pickups, and audio state; localStorage calls protected with try/catch. Pause menu: Resume, Sound, Jukebox, Accessibility, Pre-save. Always provide pre-save access from the title/pause; preserve progress on outbound link.
- The ending of this **vertical slice** is a clear `Slice complete / Continue in next build` scene, **not** the full finale or an invented pre-save unlock. The real pre-save remains available without completing anything.

## 7. Hard budgets (enforced, not presumed achieved)

| Constraint | Gate |
|---|---|
| Initial transfer | **<3,000,000 B to first interactive**, includes JS/CSS/initial art/fonts; no audio until input |
| Initial interactive time | <3.0s target on representative mid-range 4G **physical device** |
| Frame rate | 60 fps on iPhone 12-class / mid-range Android, with 30 fps fallback and reduced effects |
| Progressive transfer | <15 MB through full experience, all audio excerpts included |
| Initial art | ≤850KB optimized collectively |
| Initial JS/CSS/fonts | ≤1.9MB compressed (prefer far less) |
| Mobile DPR | Clamp to 1.5; reduce effects on low-power profiles |
| Audio before gesture | 0 B |
| Pause in background | Page Visibility API pauses render and audio, recovers on return |
| No game-over/softlock | Every pickup and encounter can be retried; no penalty |

**Proof requirements:** output Vite `dist` transfer-size estimate, Network ResourceTiming after first interactive, real-device 5-minute frame profile, slow-4G test, Safari/Instagram first-touch audio test, 320/390/430 CSS px portrait and desktop tests. Browser screenshots alone cannot prove 60 fps or first-interactive time on real phones.

## 8. Handoff package paths

```
AA_GAME_ASSET_HANDOFF_v2/
  art/source/AA_master_artwork_3000x3000.psd       (PRIVATE)
  art/source/aa_00_sky_2048x1152.png
  art/source/aa_01_sun_2048x1152.png
  art/source/aa_02_mountains_far_2048x1152.png
  art/source/aa_03_mountains_mid_2048x1152.png
  art/source/aa_04_ground_2048x1152.png
  art/source/aa_05_character_1024x1536.png
  art/source/aa_name_clearing_1536x1024.png
  art/actor/source/walk_right/aa_walk_00.png ... aa_walk_15.png
  art/actor/source/idle/aa_idle_00.png ... aa_idle_07.png
  audio/private/aa_awaken_now_score_loop_APPROVAL.wav (PRIVATE)
  audio/private/aa_first_contact_pickup_APPROVAL.wav (PRIVATE)
  audio/private/aa_xaba_pickup_APPROVAL.wav (PRIVATE)
  content/aa_scene_text.en.json
  content/aa_audio_manifest.v2.json
  content/aa_tracks.json
  QA/aa_mobile_safearea_1080x1920.png
  QA/aa_asset_signoffs.csv
```

### Signoff required

Producer: approve the selected score loop, each featured clip and track mapping; art director: approve masks, player likeness, composition; QA: first interactive under 3MB, 60fps target on physical mid-range devices. **Do not merge the preview branch into `main` until user approves the vertical slice after mobile testing.**