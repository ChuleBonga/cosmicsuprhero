# Arcturian Awakening: Playable Experience Design Guide — Revised v2 (Audio Awakening)

*Production direction memo for the build team. Project: Cosmicsuprhero, Arcturian Awakening (2026). Deliverable: a browser-playable game whose prize is the album pre-save.*

## 1. Mission Brief

Team, here is what we are making and why.

We are not building a website with a game bolted on. We are building a short, finished, emotionally honest game that a stranger can start in five seconds, finish in under ten minutes, and walk away from wanting to pre-save an album. The album artwork is our world: blue mountains, an orange sun, a solitary figure. The album's theme is "Not an escape. A return." Every design decision answers one question: does this make the player feel like they are walking home?

You already have full context on the release and the album. Use it. Every song, name, and story behind the music is source material. Where I name a track below, confirm the pairing against the album notes and adjust.

**One sentence pitch:** A quiet, painterly walking game where you follow the sun, recover three human memories, and send your light back to the album.

**Non-negotiables:**

- The game is finished and polished before it is ambitious. A short game that feels like a console release beats a long one that feels like a demo.
- The pre-save is the prize. It is earned, celebrated, and one tap away. It is never a trap.
- The music is the engine. If the audio is not carrying the player, we have failed.
- It must run well on a mid-range phone. Most of our audience will arrive from Instagram and YouTube on mobile.

## 2. The Prize and the Business Goal

**Primary goal:** pre-save conversions on the Amuse link: https://share.amuse.io/album/cosmicsuprhero-arcturian-awakening

**Secondary goals:** shares, follows (YouTube, Instagram, Spotify), repeat plays, and press-worthy screenshots.

**Prize design rules:**

1. The pre-save is the final object in the world. The player does not click a banner. They perform a final in-game action (sending their light into the sky) and the pre-save appears as the natural next gesture.
2. Never block story progress behind the pre-save. Players finish the game for free. The pre-save is the reward, not the toll.
3. A soft preview appears earlier (after Encounter 2): a quiet, dismissible line that the album is coming and the ending leads to it. This primes intent without interrupting.
4. The link opens in a new tab and the game state stays intact so players can return and keep exploring.
5. Every outbound link carries tracking parameters (utm\_source=game, utm\_medium=ending or utm\_medium=preview, utm\_campaign=arcturian-awakening).
6. A persistent but quiet pre-save icon lives in the corner of the pause menu for players who decide early.

## 3. Design Pillars

Print these. Every review starts here.

1. **Walking is the game.** Traversal is the core verb, the way it is in the best open-world work. Movement must feel good before anything else is built.
2. **Sound is the map.** The player is guided by music and audio, not arrows. Direction, distance, and emotion are carried by sound.
3. **Light is the language.** The sun, fragments of light, and shadow communicate objectives, danger-free tension, and progress.
4. **Human, not fantasy.** The landscape is imagined. The experiences are real. Each encounter must feel personal and specific, never generic sci-fi.
5. **No fail state.** The player cannot die or lose progress. Tension comes from atmosphere and uncertainty, never punishment.
6. **Respect the player's time.** Fast load, instant start, no tutorials that read like manuals, no forced waits.

## 4. What We Take From the Games That Taught Us

I have shipped, shepherded, or survived projects in these families. Here is what I want this team to steal and what I want us to refuse.

**Death Stranding: walking as meaning.** Terrain reading, the weight of carrying something that matters, and the sense of connection across a lonely world. We steal the idea that carrying a memory is the objective. We steal the weight in the character's gait and the way sound and landscape make a long walk emotional. We refuse the complexity: no inventory, no balance management.

**Ghost of Tsushima: guidance without UI.** Wind that points the way, composition that frames every shot, and a HUD that vanishes when you do not need it. We steal the guiding wind: ours is a drifting stream of light motes and a musical swell that grows toward the objective. We steal the photo mode. We refuse the combat.

**Resident Evil: pacing and safe rooms.** Tension and release in deliberate waves, and the relief of a quiet room with a save tone. We steal the rhythm of rising unease followed by shelter. Our safe rooms are campfire clearings where the music softens and the game saves. We refuse jump scares and resource anxiety.

**Days Gone: momentum and time of day.** The feeling of moving fast through a lit, living world, and weather and time that change the mood. We steal a short, optional momentum mechanic (a downhill glide) and a sky that shifts with progress. We refuse the length and the slow opening. Our first thirty seconds must be strong.

**Cyberpunk: world density and identity.** A world with a clear voice, interface design that carries brand, and small details that reward looking closely. We steal the idea that UI is part of the art direction. We also steal the lesson that shipping with unfinished systems costs trust: scope down, polish up, and test on real devices before announcing anything.

## 5. Player Fantasy and Narrative Frame

You are the figure in the artwork. You wake on a ridge under a low orange sun. Something is calling. You do not know what, only that it feels like home. You walk toward the light.

Along the way, the landscape gives back what you carried before you forgot: a name, a parent's voice, a question of faith. Recovering them is not a quest log. It is remembering. At the end, the way back is visible, because you have lit it yourself.

**Tone:** reverent, warm, quiet, a little mysterious. Never cheesy, never preachy. Text is minimal and poetic. Voice and music do the heavy lifting.

**Structure:** Prologue, three Encounters, and The Way Back (Finale). This mirrors the site's promise: "Three encounters. One way back."

## 6. Core Loop (v2)

1. **Move** across the painterly terrain. As the player moves, the real *Awaken Now* excerpt literally awakens: start quiet and low-pass, progressively open the cutoff and stereo image; do not fake an audio visualization.
2. **Listen** for a real, artist-approved short musical pickup. Sound, contrast and light guide the player, not quest arrows.
3. **Engage** a short, tactile encounter, collect the physical record fragment or fallen star.
4. **Recover** the memory: fade *Awaken Now* into the background, play 20–30 seconds of an approved track excerpt, then crossfade into the filtered score again. No stem layering.
5. **Shelter** at a clearing: save progress and add the pickup to the pause-menu jukebox, replayable only if its excerpt is approved and hosted.
6. **Repeat** with increasing musical brightness and emotional clarity; use approved *Awaken Now* for the return. No full unreleased masters on a public site.

## 7. Controls and Input

One or two inputs maximum. A player must understand controls from motion alone.

**Mobile (primary):**

- Press and hold on the right side of the screen to walk. Release to stop.
- Tap to jump or interact.
- Drag to aim or sweep during interactions.
- Optional haptics on footsteps, light pickups, and the sunrise.

**Desktop:**

- Arrow keys or WASD to walk, Space to jump or interact, mouse to aim or sweep.
- Click and hold also works to walk, so mouse-only players are covered.

**Gamepad:** optional stretch goal. Left stick and one button.

**Rules:**

- Touch targets are at least 48 px.
- Controls appear as brief contextual hints and fade after first use.
- Pause is always available and never loses state.

## 8. Game Structure and Timing

Target first-run playtime: **6 to 8 minutes.** Full exploration with hidden stars: **10 to 12 minutes.**

| Segment | Target time | Purpose |
| --- | --- | --- |
| Title and audio unlock | 0:00 to 0:20 | Hook and start the music |
| Prologue: First Contact | 0:20 to 1:30 | Teach walking, set mood |
| Encounter I | 1:30 to 3:00 | First memory |
| Campfire 1 | 3:00 to 3:30 | Relief, save |
| Encounter II | 3:30 to 5:00 | Emotional peak |
| Campfire 2 and pre-save preview | 5:00 to 5:30 | Prime the prize |
| Encounter III | 5:30 to 7:00 | Transcendence |
| The Way Back and pre-save | 7:00 to 8:00 | Payoff and conversion |

## 9. Level and Encounter Design (v2)

### Prologue: First Contact

Open on the exact artwork. The first tap starts the *Awaken Now* short score **only if the approved excerpt is on artist-controlled storage**. It begins muffled, around 440 Hz low-pass and a restrained gain; walking along the ridge raises its cutoff gradually. An illustrated **First Contact** record fragment is the first physical pickup. On approach, guide with sound and warm light. On collection, duck the score, play an approved 20–30 s *First Contact* excerpt and crossfade back. Pending approval: the pickup remains interactable and captions indicate that the music preview is not yet available.

### Encounter I: The Name

A wide valley of light motes. Sweep or gather three motes, then recover the **Xaba** record fragment. The score opens further, the environment warms, the approved 20–30 s *Xaba* excerpt takes focus, then returns to *Awaken Now*. An artist-approved personal memory appears; until provided, show a neutral, clearly marked placeholder rather than inventing ancestral wording.

### Encounter II: The Voice (future)

The canyon guides the player toward **Mama Calls Me Chule**. Directional audio and gradually improving clarity create a human connection. On recovery, play an approved 20–30 s pickup excerpt, then return the filtered score. Do not pretend an unprovided voice track exists.

### Encounter III: The Faith (future)

Carry the flame through a ridge. Shield, release, and follow the musical pulse. Recover **Songs Sent to God** as a pickup; duck the score for its approved excerpt, then return with the filter mostly open. Do not depict generic shrines as cultural shorthand.

### Finale: The Way Back (future)

The figure turns to see the recovered journey. Sixteen stars may appear as optional **track slots**, not licenses to stream unapproved songs. One sustained hold sends the carried light skyward. *Awaken Now* becomes fully bright and wide, using only the approved edit. The pre-save invitation materializes as an in-world final gesture. A quiet direct pre-save link remains available from pause at all times.

**Vertical-slice scope:** Only the Prologue and Encounter I above are implemented. The full three-encounter finale is a future milestone; never present the prototype as completed game.

## 10. Traversal and Movement Feel

This is where the game is won or lost. Budget real time for it.

- Acceleration and deceleration with easing. The figure should never feel like a sprite sliding on rails.
- Footstep dust, subtle camera bob, and slight camera lag that catches up on stops.
- Terrain-aware animation: slower uphill, a short glide downhill, a gentle stumble on rough ground with no penalty.
- A walk cycle with weight, not just a loop. Shoulders and head carry emotion.
- Optional jump with a short, floaty arc. Coyote time (about 100 ms) and jump buffering so touch input feels forgiving.
- Playtest movement with five people before building any encounter.

## 11. Music as Gameplay — *Awaken Now* Is the Mechanic (v2)

**There are no required stems.** The continuous score is a **musically approved short loop edit of Awaken Now**, not the full unreleased 2:00 master. Start on the first user gesture, audibly distant and muffled. Use a Web Audio low-pass filter, gain and subtle stereo development to move toward a bright/open mix with progress. Filter automation must be guided by listening, not arbitrary EQ values. The approved 45-second excerpt can be used in the vertical slice but its loop point needs specific musical sign-off.

**Track pickups** interrupt the score, not layer over it. First Contact (Prologue), Xaba (Name), Mama Calls Me Chule (Voice), Songs Sent to God (Faith). On recovery: 250ms duck, play 20–30 seconds of that **approved** excerpt, then crossfade the score back over roughly 1–1.5 seconds. If a pickup clip is missing or pending, show a caption and preserve progress; do not fabricate a substitute.

**Jukebox:** Pause menu exposes only discovered tracks. A playable Listen action appears only when its own short, cleared recording exists. Twelve optional stars map to the remaining tracks, but all optional recordings default locked/pending until individually cleared. Credo's Words is **metadata-only** unless sample clearance is explicitly documented.

**Technical:** `AudioDirector` owns one HTMLMediaElement/Web Audio graph, score filter, bed gain, pickup gain, ducking, mute, pause/resume, and background-tab behavior. Source paths are versioned, self-hosted on the artist's own Vercel project or approved storage. No temporary share links, and never commit any complete unreleased master.

## 12. Art Direction, Camera, and Lighting

- **Style:** painterly 2.5D, built from layered versions of the album artwork. Parallax with at least five layers (sky, sun, far mountains, mid mountains, foreground and figure).
- **Palette:** anchor on the artwork's blue and orange. Shift the palette per encounter: warm gold (Name), deep indigo with amber (Voice), pale dawn with rose (Faith), full sunrise (Finale).
- **Lighting:** the sun is the master light. It moves slightly with progress. Rim light on the figure. Soft volumetric rays through haze.
- **Camera:** side-scrolling with gentle vertical drift. Slow push-ins for key moments. Always composed like a poster frame, so any screenshot is shareable.
- **Particles:** light motes, dust, wind streaks, embers. Keep counts mobile-friendly.
- **Photo mode:** a pause-menu option that hides the HUD, allows light camera framing and a filter or two, and exports a branded image with the title in a corner. This is free marketing.

## 13. UI and HUD

Nearly invisible. In the spirit of the best minimal-HUD games:

- No health bars, no score, no timers.
- A small constellation in a corner. Three stars light as memories are recovered. Sixteen hidden stars are tracked in the pause menu.
- Contextual prompts appear near the figure and fade.
- Captions for voice and lyrics are on by default, styled to match the world.
- Typography: one elegant serif for titles (consistent with the site's heading style) and one clean sans for UI. Keep line length short for mobile.
- Menus: Resume, Sound, Accessibility, Photo Mode, Tracklist, Pre-save. Six items maximum.

## 14. Onboarding

The first 30 seconds decide everything.

- No tutorial screens. Teach by doing. The first hold-to-walk happens with a single glowing hint.
- Audio begins on the first touch. If audio is blocked, show a single, clear "Tap to begin with music" prompt.
- A returning player resumes from their last campfire, with a "Start over" option.
- Provide a visible, polite "Sound on" suggestion and a mute toggle at all times.

## 15. Pacing and Tension

We use the rhythm of the best horror and adventure pacing without any actual danger.

- Rise: open space, building music, a sense of being watched by the landscape.
- Peak: the encounter, with focus and stillness.
- Release: the campfire, soft music, a saved star.
- Each cycle is slightly longer and more emotional than the last.
- Use silence deliberately. A beat of near silence before a memory lands is worth more than any effect.

## 16. Rewards, Collectibles, and Unlockables (v2)

- **Memory pickups:** The four approved main track mappings are physical record fragments / stars. Collected memories change the landscape and the filtering of *Awaken Now*. Player may replay a clip through the jukebox only after audio clearance.
- **Jukebox:** Discovered tracks appear with their state: `Found / Listen` when an approved clip is hosted, or `Found / Preview pending` when it is not. No inaccessible controls pretending to work.
- **Hidden stars:** Twelve optional track slots remain locked until their artists' 15–25 s snippets are approved; do not auto-generate a second soundtrack or imply a full album stream.
- **Behind the music:** Optional, artist-supplied note or photo unlocked with each main pickup; no invented personal story.
- **Completion reward:** A shareable card is optional after the game is genuinely finished, not in the vertical slice.
- **Pre-save:** Final gesture at the future finale, available quietly in pause at any time. Tracking `utm_source=game`, `utm_medium=ending|preview`, `utm_campaign=arcturian-awakening`.

## 17. Technical Specification

**Recommended stack:**

- **Engine:** Phaser 3 with TypeScript, bundled with Vite.
- **Hosting:** Vercel (matches the current site). Serve assets through the Vercel CDN or the existing CDN.
- **Audio:** Single `AudioDirector` using user-unlocked Web Audio low-pass and gain graph; own-hosted AAC-LC `.m4a` excerpts, MP3 fallback when needed on real iOS/in-app QA. No stems.
- **Animation:** frame-based sprite sheets or skeletal animation (Spine if licensing allows). Keep the walk cycle clean.
- **Shaders and effects:** simple fragment shaders for glow, haze, and color grading. Provide a low-quality fallback.
- **Persistence:** localStorage with try/catch around every read and write. The game must work if storage is empty or blocked.
- **Analytics:** privacy-respecting events (see section 20).
- **Routing:** the game lives at the existing domain. Keep the current landing hero as the title screen so nothing is thrown away.

**Architecture notes:**

- Separate scenes: Boot, Title, Prologue, Encounter1, Encounter2, Encounter3, Finale, FreeRoam, Pause.
- A central AudioDirector controls the Awaken Now score, live filters, pickup ducking and crossfades.
- A ProgressManager owns saves, unlocks, and analytics events.
- Data-driven encounters (JSON config for timing, text, and unlocks) so content can change without code changes.

## 18. Performance Budgets

- **First interactive:** under 3 MB and under 3 seconds on a mid-range phone over 4G.
- **Total streamed assets:** under 15 MB, loaded progressively per encounter.
- **Frame rate:** 60 fps on iPhone 12 class and mid-range Android. Auto-fall back to 30 fps and reduced particles if frame time degrades.
- **Images:** WebP or AVIF with sensible fallbacks. Power-of-two atlases where it helps.
- **Audio:** compressed approved 20–30-second excerpts; stream after user gesture, never predecode the full collection.
- **Memory:** unload prior encounter assets on transition.
- **Battery:** pause rendering when the tab is hidden. Avoid constant full-screen shader work on low-end devices.

## 19. Accessibility and Inclusion

- Captions for all voice and lyrics, on by default.
- Reduced motion mode: removes parallax drift, camera bob, and screen shake.
- Color contrast meets WCAG AA for all text.
- One-handed play on mobile.
- Optional hold-to-toggle for hold-based interactions.
- Screen reader labels for menus and key actions.
- Respect the system's reduced motion and dark mode preferences.
- Avoid flashing effects. The sunrise is a slow ramp, never a strobe.
- Cultural care: the stories and names in this album are real and specific. Present them with respect, no stereotyping, no invented "tribal" visuals, and no decorative use of cultural elements. When in doubt, ask the artist.

## 20. Analytics and Success Metrics

Track these events (no personal data beyond what the host already collects):

- game\_loaded, audio\_started, first\_walk
- encounter\_started and encounter\_completed (1 to 3)
- campfire\_reached
- preview\_shown and preview\_clicked
- finale\_reached
- presave\_clicked (with source: ending or pause menu)
- photo\_taken and share\_clicked
- hidden\_star\_found (with track)
- drop-off point by scene

**Targets for launch week:**

- 60 percent of players who start reach Encounter I.
- 35 percent of starters reach the finale.
- 15 to 25 percent of finishers click pre-save.
- Median session time over 5 minutes.

These are working targets. We tune them after the first thousand sessions.

## 21. Production Plan

Work backward from the release date. Durations assume a small team and are adjustable.

1. **Pre-production (1 week):** lock this guide, collect short, approved pickup excerpts, the approved loop edit, and art layers, decide the encounter-to-track mapping, build a gray-box walk test.
2. **Vertical slice (2 weeks):** one fully polished Prologue and Encounter I, with final-quality movement, audio, lighting, and UI. This is the go/no-go gate. If it does not feel like a real game here, we fix it before building more.
3. **Alpha (2 weeks):** all encounters playable, placeholder polish, pre-save wired, analytics live.
4. **Beta (1 to 2 weeks):** full polish, accessibility, performance tuning, photo mode, hidden stars, device testing.
5. **Gold candidate (1 week):** bug triage, final audio mix, load testing, copy review.
6. **Launch and live-ops:** monitor analytics, fix drop-off points, ship small improvements weekly through the pre-save window.

**Gate reviews:** at the end of each phase, play the build cold with someone who has never seen it. If they cannot finish without help, we are not done.

## 22. QA Checklist

- Test on at least: recent iPhone, older iPhone, mid-range Android, low-end Android, desktop Chrome, Safari, and Firefox.
- Audio unlock works on first tap on iOS and Android.
- Game resumes correctly after switching tabs, receiving a call, or locking the screen.
- Orientation changes do not break layout. Provide a gentle landscape suggestion if needed.
- No soft locks: every interaction can be retried indefinitely.
- Pre-save link opens correctly in every browser and in in-app browsers (Instagram, TikTok, YouTube).
- Offline or blocked storage does not crash the game.
- Load on slow networks shows a graceful loading state, never a blank screen.
- Accessibility checks pass (captions, reduced motion, contrast).

## 23. Risks and Mitigations

- **Scope creep.** Mitigation: the vertical slice gate and a locked feature list. New ideas go in a backlog.
- **Mobile performance.** Mitigation: budgets in section 18, early device testing, quality fallbacks.
- **Audio issues on iOS.** Mitigation: first-tap unlock, format fallbacks, early test.
- **In-app browser quirks.** Mitigation: test inside Instagram and TikTok browsers, provide an "open in browser" hint if needed.
- **Emotional misfires.** Mitigation: review all text and visuals with the artist. These are his stories.
- **Pre-release leaks.** Mitigation: approved short edits and pickups only; never any full unreleased master on public storage.
- **Pre-save fatigue.** Mitigation: one preview, one finale, one quiet pause-menu link. No pop-ups.
- **Over-polishing the wrong thing.** Mitigation: movement feel and the Encounter II moment get priority over everything else.

## 24. Definition of Done

We ship when all of these are true:

1. A first-time player can start within five seconds and finish in under ten minutes without instructions.
2. The game runs smoothly on the target devices and loads within budget.
3. All three encounters, the campfires, the finale, and the pre-save moment work flawlessly.
4. Awaken Now audibly opens as the player progresses; every cleared pickup ducks and crossfades back; the finale excerpt lands emotionally.
5. Captions, reduced motion, and mute are present and working.
6. The pre-save link, tracking, and analytics are verified end to end.
7. The artist has played it and signed off on every story beat.
8. Someone outside the team plays it, gets chills at the Voice encounter, and asks where to pre-save.

## 25. Instructions for ChatGPT: What to Produce

You have the album and release context. Build from this guide in the following order. At each step, show your work and wait for approval before moving on.

1. **Confirm the plan.** Restate the encounter-to-track mapping you recommend, with a one-line reason each, and list any assumptions or questions for the artist.
2. **Project scaffold.** Provide the Phaser 3 plus TypeScript plus Vite project structure, the scene list, and the AudioDirector and ProgressManager skeletons.
3. **Vertical slice.** Deliver the complete Prologue and Encounter I as runnable code with placeholder art slots clearly labeled, movement feel tuned per section 10, and audio hooks ready for the approved score edit and individually cleared short pickup clips.
4. **Asset spec.** Provide an exact list of the art layers, sprite sheets, audio short clips, and text fragments needed, with file formats, dimensions, and naming conventions, so the artist and designers can supply them.
5. **Remaining encounters and finale.** Build in order: Encounter II, Encounter III, Finale with the pre-save moment, then campfires and saves.
6. **Polish pass.** Photo mode, hidden stars, accessibility, analytics, and performance fallbacks.
7. **Deployment notes.** Vercel configuration, caching headers, and a pre-launch QA checklist run against section 22.

**Output rules:**

- Write complete, runnable code, not fragments, and explain how to run and test it.
- Keep every file readable and commented where a decision is non-obvious.
- Never place a full unreleased track in the public assets. Use the approved excerpt and approved short pickup clips only.
- Use the exact pre-save URL from section 2 with the tracking parameters described there.
- If a design choice here conflicts with a technical limit, tell me, propose the closest alternative, and keep the player's emotional experience intact.

**Final word from your PM:** I have watched teams with enormous budgets ship forgettable games and tiny teams ship unforgettable ones. The difference was never the tech. It was whether somebody cared about the feeling of the first thirty seconds and the last thirty seconds. Care about both. Build something a person remembers the way they remember a song from their childhood. Then give them a place to take that feeling home: the pre-save.

Let's make this real.