# ARCTURIAN AWAKENING — MASTER ARCHITECTURE, DESIGN & COPY SPECIFICATION

## 1. PROJECT IDENTITY & EXECUTIVE MANDATE
You are the Lead Systems Architect, Graphics Engineer, and Creative Technologist building **Arcturian Awakening** for **Cosmicsuprhero**[span_0](start_span)[span_0](end_span)[span_1](start_span)[span_1](end_span). 

**Core Philosophy:**
* **"Not an escape. A return."**
* This project is an intentional experiment in spatial and sonic immersion—sonically setting the landscape for space, memory, family, and spiritual return.
* Every environment must contain a memory of something.
* **STRICT ZERO-BUDGET CONSTRAINT:** Do not introduce any paid APIs, commercial shader libraries (do not use LYGIA due to commercial licensing restrictions), or paid cloud dependencies. Use 100% open-source, MIT-licensed code, procedural WebGL shaders, and native Web Audio API.
* **STRICT ZERO-EMOJI POLICY:** Emojis are strictly banned across the entire codebase, UI, buttons, modals, and copy. Everything must look intentional, editorial, and handcrafted.

---

## 2. REPOSITORY GROUND TRUTH & TECH STACK
Do not hallucinate a Next.js migration unless explicitly instructed. Work within the existing repository architecture:
* **Main Website Stack:** React 18 (\`^18.3.1\`), Vite 5 (\`^5.4.10\`), Tailwind CSS 3 (\`^3.4.14\`).
* **Main Website Files:**
  * \`index.html\`, \`vite.config.js\`, \`vercel.json\`, \`tailwind.config.js\`
  * \`src/main.jsx\`, \`src/App.jsx\`, \`src/index.css\`
  * \`src/components/Hero.jsx\`, \`MusicEmbed.jsx\`, \`Releases.jsx\`, \`Archive.jsx\`, \`Visuals.jsx\`, \`Footer.jsx\`
* **Game Engine Stack (\`/play/\` route):** Phaser 3 + TypeScript (\`main.ts\`, \`TitleScene.ts\`, \`WalkScene.ts\`, \`GrayboxWorld.ts\`).
* **Deployment:** Vercel static build (\`npm run build\` -> \`dist\`), using SPA rewrite rules in \`vercel.json\`.

---

## 3. DESIGN SYSTEM, COLOR TOKENS & TYPOGRAPHY LOCK

### 3.1 Global CSS Variables (\`src/index.css\` & \`tailwind.config.js\`)
All website sections, game HUD overlays, and modals must strictly use these tokens:
\`\`\`css
:root {
  --bg: #080807;           /* Deep Obsidian */
  --panel: #12110f;        /* Archive Panel Dark */
  --bronze: #9b7a5f;       /* Primary Accent / Borders */
  --bronze-light: #c4a07e; /* Highlights / Active States */
  --faded: #6f5a48;        /* Muted Eyebrows / Secondary Text */
  --cream: #d8c7b0;        /* Primary Display Text */
  --cream-dim: #a89278;    /* Body Copy */
  --border: rgba(155, 122, 95, 0.2);

  /* Game Environment & HUD Specific Tokens */
  --cosmos-deep: #0b0e1a;
  --cosmos-nebula: #1c162e;
  --sun-core: #e84a1b;     /* Blazing Red-Orange Sun[span_2](start_span)[span_2](end_span)[span_3](start_span)[span_3](end_span) */
  --sun-amber: #f59e0b;    /* Rim Lighting & Active Button Glow[span_4](start_span)[span_4](end_span)[span_5](start_span)[span_5](end_span) */
  --Violet-crown: #7c3aed; /* Meditate Gateway Corona */
}
\`\`\`

3.2 Typography Rules
 * Display / Titles: 'Cormorant', Georgia, serif (font-style: italic, font-weight: 700).
 * Body / Narrative / Subtitles: 'Cormorant Garamond', Georgia, serif (font-weight: 400 and italic).
 * UI / HUD / Eyebrows: Tracked uppercase serif or clean geometric sans for micro-labels (font-size: 0.65rem, letter-spacing: 0.35em to 0.45em, text-transform: uppercase).
 * STRICT PROHIBITION: Remove all blocky 8-bit/arcade bitmap fonts from TitleScene.ts and WalkScene.ts. Do not render an opaque tan horizontal banner across the middle of the screen. All game titles and HUD elements must match the refined vector aesthetic of the approved First Contact master reference image.
4. VIEWPORT & MOBILE PRESENTATION ARCHITECTURE
4.1 Why Previous Builds Failed
 * Allowing HTML elements to flow vertically turned the game into a broken mobile scroll with oversized bitmap text.
 * Locking a raw 16:9 canvas inside a 390 x 844 portrait phone screen without surrounding design shrunk the playable view to 364 x 205 pixels (only 24% of screen height).
4.2 The Solution: Adaptive Observatory Frame
Lock the entire /play/ route inside a 100dvw x 100dvh non-scrolling viewport (overflow: hidden; touch-action: none; user-select: none; background: #080807;).
 * Desktop & Landscape (window.innerWidth >= window.innerHeight):
   * Render the Phaser canvas at a locked 1920 x 1080 internal resolution (Phaser.Scale.FIT), centered, with the custom SVG HUD overlay (GameHUD.tsx) mapped directly over the 16:9 coordinate space.
 * Mobile Portrait (window.innerHeight > window.innerWidth):
   * Implement the 3-Tier Sacred Observatory Portrait Layout so 100% of the vertical screen feels intentionally designed:
     * Top Tier (14% dvh): Observatory Header (PROLOGUE / FIRST CONTACT flanked by horizontal bronze SVG lines with diamond endpoints, plus the top-right [ II ] pause/archive button).
     * Center Tier (58% dvh): The Phaser Viewport Container. Instead of shrinking the whole 16:9 width into a tiny strip, adjust the Phaser camera zoom dynamically (camera.setZoom(1.38)) and adjust aspect framing so the canvas fills 100% of the mobile width and 58% of the vertical height, keeping the traveler, the sun, and the monolith large, immersive, and detailed.
     * Bottom Tier (28% dvh): The Interactive Deck (background: linear-gradient(180deg, #080807 0%, #12110f 100%), border-top: 1px solid rgba(196, 160, 126, 0.25)). Houses the custom SVG chamfered action buttons ([ ENTER THE JOURNEY ], [ DIRECT ACCESS ], or in-game [ FIRST CONTACT ] / [ LISTENING ]), touch-movement zones, and subtitle lyric band.
5. REBUILDING THE VISUAL ENGINE (GrayboxWorld.ts, TitleScene.ts, WalkScene.ts)
5.1 Purge Low-Color Indexed Downsampling
 * CRITICAL FIX: Previous terrain assets were downsampled to 10, 11, and 18 distinct RGB colors. Delete those stripped candidates immediately.
 * Export and render all environment layers as 24-bit full-color RGB + 8-bit Alpha WebP assets. Preserve the rich pixel-art stippling, warm amber dune highlights, deep indigo-purple mountain shadows, and atmospheric haze of the master reference artwork.
 * Total initial asset payload for the Prologue must stay under 25MB.
5.2 Authored 6-Plane Depth Stack (Replacing GrayboxWorld.ts)
Replace procedural star loops and repeating 3-band textures with a 6-plane authored parallax scene:
 * Plane 0 — Cosmic Vault (scrollFactor: 0.02): Deep space gradient (#06070d to #1c162e) with painted Milky Way dust in the upper-left quadrant, plus 60 star sprites driven by a custom sine-wave alpha shader for slow, organic twinkling.
 * Plane 1 — The Red-Orange Sun (scrollFactor: 0.05): Positioned at x: 78%, y: 34%. Rendered with a multi-layered radial emissive glow (#e84a1b core bleeding into #9a1b1b atmospheric clouds) and a subtle WebGL post-FX bloom pass.
 * Plane 2 — Far Mountain Ridgelines (scrollFactor: 0.15): Sharp, angular desert peaks in dark violet-grey with crisp amber rim-lighting along the sun-facing ridges.
 * Plane 3 — Mid-Ground Sweeping Dunes (scrollFactor: 0.40): Interlocking golden-orange and umber sand dunes (#d97706 highlights, #451a03 shadow faces) featuring high-density pixel stippling and wind-swept ridges.
 * Plane 4 — Walkable Ridge & Landmarks (scrollFactor: 1.00): Dark craggy rock ledge, sparse golden desert scrub, the protagonist, and the carved stone monolith on the right featuring a pulsing gold astrological glyph.
 * Plane 5 — Foreground Occluders (scrollFactor: 1.25): Dark silhouette rock outcroppings at the bottom-left and bottom-right edges (height: 180px at 1080p, not 18px) that pass in front of the traveler to frame the camera.
5.3 Protagonist Integration & Presence
 * Resolution: Upgrade sprite frames from 32 x 52 to 128 x 200 pixels so the traveler matches the pixel density of the ridge.
 * Anatomy & Outfit: Blue-skinned Arcturian traveler in a weathered tunic and tattered maroon cape (#6b1d2f in shadow, #b91c1c on sun-lit edges).
 * Grounding: Attach a dynamic elliptical contact shadow (rgba(8, 8, 7, 0.8)) beneath the boots that conforms to terrain height.
 * Secondary Motion: Implement an 8-frame idle cape-flutter animation driven by desert wind, even when player velocity is 0.
6. COMPLETE 16-TRACK ALBUM NARRATIVE & 5-ARRIVAL LEVEL DESIGN
6.1 Authoritative 16-Track Sequence
 * Meditate
 * First Contact
 * Precipice
 * Credo's Words
 * Dawning
 * Rustic Fire
 * Xaba
 * Mama Calls Me Chule
 * Chords for Pondering
 * Peace for the Soul
 * Songs Sent to God
 * Emancipated
 * The World Is Ours
 * Awaken Now
 * Gloriously
 * Finale
6.2 Fixing Level Pacing (Replacing the 8,450-Unit Empty Walk)
Compress the total world walk distance from 8,450 empty units to 2,400 densely authored units. Never allow more than 10 seconds of walking without a camera framing shift, landmark discovery, or musical state transition.
ARRIVAL I: The Weight of Silence (Units 0 – 400)
 * Tracks: 1. Meditate -> 2. First Contact
 * Staging: The traveler wakes on the rocky ridge facing the distant red-orange sun. No tutorial pop-ups.
 * Audio / Visual Cue: Ambient wind and Meditate open the scene. Subtle violet-blue light particles drift above the traveler's head.
 * Authorized Lyric Subtitles (Timed fade-in/out):
   * "Welcome, beloved traveler of light."
   * "Above your head, imagine a glowing sphere of soft violet-blue light—this is the gateway to Arcturian consciousness..."
   * "You are safe. You are seen. You are remembered."
ARRIVAL II: First Contact & The Ancient Archive (Units 400 – 900)
 * Tracks: 2. First Contact, 3. Precipice, 4. Credo's Words
 * Staging: The traveler reaches the carved stone monolith on the ridge. Interacting with [ FIRST CONTACT ] pulses the golden glyph on the rock face and sends a warm shockwave across the dunes.
 * Audio / Visual Cue: The low-pass filter on the score opens from 450Hz to 1600Hz. Petroglyphs along the canyon wall illuminate softly.
 * Authorized Lyric Subtitles (Credo's Words):
   * "The first encounter between Africans and extraterrestrial beings occurred more than 7,000 years ago..."
   * "It is said that a door opened in this strange metallic sphere..."
   * "People of this world. We are the Numu people."
ARRIVAL III: Recognition & Grief (Units 900 – 1,450)
 * Tracks: 5. Dawning, 6. Rustic Fire, 7. Xaba
 * Staging: The desert descends into a shadowed basin. Three scattered embers of memory hover over ancient ruins.
 * Interaction: As the traveler approaches each light, movement speed gently slows (155 -> 95 units/sec) to create emotional weight. Collecting all three weaves them into a unified harmonic chord (Xaba), illuminating the basin behind the traveler.
ARRIVAL IV: The Voice & Human Warmth (Units 1,450 – 1,950)
 * Tracks: 8. Mama Calls Me Chule, 9. Chords for Pondering, 10. Peace for the Soul
 * Staging: A narrow canyon where cosmic static obscures the path. The camera eases closer to the traveler (zoom: 1.25) for emotional intimacy.
 * Interaction: The player uses the [ LISTENING ] mechanic—standing still to tune through analog interference until a warm, deeply human voice and live keys cut through the cold void.
 * Authorized Lyric Subtitles (Chords for Pondering):
   * "You can hear his voice... Yes. It's faint but I can hear it."
   * "That's why I whisper a lot of times. That's why I talk softly. Because he talks to me softly, see."
ARRIVAL V: The Faith & The Turnaround Finale (Units 1,950 – 2,400)
 * Tracks: 11. Songs Sent to God, 12. Emancipated, 13. The World Is Ours, 14. Awaken Now, 15. Gloriously, 16. Finale
 * Staging: A windswept summit ridge. The traveler protects a fragile golden flame against gusts of wind while climbing toward the horizon.
 * Authorized Lyric Subtitles (Songs Sent to God):
   * "Music is a spiritual language, and it represents the people of earth..."
   * "The human man is a formidable force. Forged by the power of Christ of God from dust. Brought onto this plane through breath. Redeemed. Unstoppable."
 * The Turnaround Climax (Unit 2,400):
   * The traveler reaches the summit and stops moving forward.
   * The traveler turns 180 degrees to face left (looking back at the path traveled).
   * The camera smoothly pulls back to a grand wide shot, revealing every landmark visited along the ridge now glowing and connected by a thread of golden light.
   * The Web Audio BiquadFilter opens completely to 20,000Hz (unfiltered master fidelity) as Awaken Now, Gloriously, and Finale peak.
   * Sixteen stars ignite in the upper cosmos in a deliberate constellation—one for each track on Arcturian Awakening.
   * The player holds to release their carried light skyward, organically unveiling the pre-save portal in the center of the sky.
7. DUAL-GATE CONVERSION ARCHITECTURE (PRE-SAVE & EMAIL CAPTURE)
Visitors must have two intentional pathways to access the album pre-save link. Both pathways must feel like part of the Sacred Observatory archive.
Pathway A: The Earned Journey (Completing Arrival V)
 * When the 16 stars ignite at the end of the game, render the primary golden octogonal CTA in the center of the frame:
   * Button Label: SEND YOUR LIGHT BACK — UNLOCK PRE-SAVE
 * Clicking opens the official album pre-save URL directly without requiring an email form.
Pathway B: The Direct Access Gate (Name & Email Capture)
 * Where it lives:
   * Immediately visible on the /play/ Title Screen alongside the journey button:
     * Primary Button: [ ENTER THE JOURNEY ]
     * Secondary Button: [ DIRECT ACCESS ]
   * Accessible at any point during gameplay via the top-right [ II ] archive menu button.
   * Accessible directly from the main website landing page (Hero.jsx and Archive.jsx).
 * Modal UI Specification (DirectAccessModal.tsx):
   * Backdrop: rgba(8, 8, 7, 0.88) with backdrop-filter: blur(8px).
   * Card Container: max-width: 480px, background: #12110f, border: 1px solid rgba(196, 160, 126, 0.35), padding: 3rem 2.5rem.
   * Eyebrow: SACRED OBSERVATORY — DIRECT ARCHIVE ACCESS
   * Headline (Cormorant italic, 2rem, #d8c7b0): Bypass the Ridge
   * Subcopy (Cormorant Garamond, 1.05rem, #a89278): "Complete the playable passage to unlock the album naturally, or enter your name and email below for immediate access to the Arcturian Awakening pre-save."
   * Form Fields:
     * Name (required, text input, bottom border 1px solid #9b7a5f, transparent bg, #d8c7b0 text).
     * Email Address (required, email input, bottom border 1px solid #9b7a5f, transparent bg, #d8c7b0 text).
     * Submit Button: [ UNLOCK PRE-SAVE ACCESS ]
 * Post-Submission Blessing State (MANDATORY):
   * Upon form submission (store lead in localStorage and POST to the configured serverless/webhook endpoint), smoothly fade out the form inputs and display this exact message in 'Cormorant Garamond', italic, 1.3rem, color #d8c7b0, followed by the unlocked pre-save button:
   > "Thank you for taking a moment to get on the site. Your time is appreciated, and I hope you enjoy the music. Peace and overwhelming love and blessing to you."
   > 
   * Unlocked CTA Button: [ PROCEED TO ALBUM PRE-SAVE ]
8. REFERENCE CODE IMPLEMENTATIONS
8.1 Custom SVG HUD & Chamfered Buttons (GameHUD.tsx)
Use this structure so the title screen and HUD match the exact geometry of the master First Contact artwork:
import React from 'react';

interface GameHUDProps {
  chapterTitle?: string;
  showTitleEmblem?: boolean;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  onPauseClick: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  chapterTitle = 'PROLOGUE   /   FIRST CONTACT',
  showTitleEmblem = true,
  primaryLabel = 'ENTER THE JOURNEY',
  secondaryLabel = 'DIRECT ACCESS',
  onPrimaryClick,
  onSecondaryClick,
  onPauseClick,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-10 select-none z-20">
      {/* TOP BAR */}
      <div className="relative flex items-center justify-center w-full">
        <div className="flex items-center gap-4">
          <svg width="90" height="6" viewBox="0 0 90 6" className="opacity-75">
            <line x1="0" y1="3" x2="84" y2="3" stroke="#c4a07e" strokeWidth="1" />
            <circle cx="86" cy="3" r="2" fill="#f59e0b" />
          </svg>
          <span className="text-[11px] md:text-xs tracking-[0.38em] uppercase text-[#d8c7b0] font-light">
            {chapterTitle}
          </span>
          <svg width="90" height="6" viewBox="0 0 90 6" className="opacity-75">
            <circle cx="4" cy="3" r="2" fill="#f59e0b" />
            <line x1="6" y1="3" x2="90" y2="3" stroke="#c4a07e" strokeWidth="1" />
          </svg>
        </div>

        {/* PAUSE / DIRECT ARCHIVE TRIGGER [ II ] */}
        <button
          onClick={onPauseClick}
          aria-label="Open Archive Menu"
          className="pointer-events-auto absolute right-0 top-0 w-10 h-10 border border-[#9b7a5f]/50 bg-[#080807]/60 text-[#d8c7b0] font-serif text-sm tracking-widest flex items-center justify-center hover:border-[#f59e0b] transition-colors"
        >
          II
        </button>
      </div>

      {/* CENTER ASTROLABE & TITLE EMBLEM */}
      {showTitleEmblem && (
        <div className="flex flex-col items-center text-center my-auto">
          <svg width="260" height="95" viewBox="0 0 260 95" className="overflow-visible mb-[-18px]">
            <defs>
              <linearGradient id="goldArc" x1="0%" y1="100%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(196,160,126,0)" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="rgba(196,160,126,0)" />
              </linearGradient>
            </defs>
            <path
              d="M 35 85 A 95 95 0 0 1 225 85"
              fill="none"
              stroke="url(#goldArc)"
              strokeWidth="1.5"
            />
            <line x1="130" y1="0" x2="130" y2="42" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="130" cy="18" r="3.5" fill="#fde68a" />
          </svg>

          <h1
            className="text-3xl md:text-6xl tracking-[0.28em] uppercase text-[#f5e7c5] font-serif font-normal"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.9)' }}
          >
            ARCTURIAN
          </h1>

          <div className="flex items-center gap-4 mt-2">
            <span className="w-12 h-[1px] bg-[#c4a07e]/60" />
            <span className="text-xs md:text-base tracking-[0.45em] uppercase text-[#d8c7b0]">
              AWAKENING
            </span>
            <span className="w-12 h-[1px] bg-[#c4a07e]/60" />
          </div>
        </div>
      )}

      {/* BOTTOM ACTION DECK */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-2xl">
          {/* PRIMARY CHAMFERED BUTTON */}
          <button
            onClick={onPrimaryClick}
            className="pointer-events-auto relative group w-64 h-12 flex items-center justify-center transition-transform active:scale-95"
            style={{ filter: 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.45))' }}
          >
            <svg viewBox="0 0 260 48" className="absolute inset-0 w-full h-full">
              <polygon
                points="14,2 246,2 258,14 258,34 246,46 14,46 2,34 2,14"
                fill="rgba(18, 17, 15, 0.82)"
                stroke="#f59e0b"
                strokeWidth="1.6"
              />
            </svg>
            <span className="relative z-10 text-xs tracking-[0.28em] uppercase text-[#f5e7c5]">
              {primaryLabel}
            </span>
          </button>

          {/* SECONDARY CHAMFERED BUTTON */}
          <button
            onClick={onSecondaryClick}
            className="pointer-events-auto relative group w-64 h-12 flex items-center justify-center transition-transform active:scale-95"
          >
            <svg viewBox="0 0 260 48" className="absolute inset-0 w-full h-full">
              <polygon
                points="14,2 246,2 258,14 258,34 246,46 14,46 2,34 2,14"
                fill="rgba(18, 17, 15, 0.72)"
                stroke="rgba(196, 160, 126, 0.45)"
                strokeWidth="1.2"
              />
            </svg>
            <span className="relative z-10 text-xs tracking-[0.28em] uppercase text-[#d8c7b0] group-hover:text-[#f5e7c5]">
              {secondaryLabel}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

8.2 Cinematic Subtitle & Lyric Band (SubtitleBand.tsx)
Adapt the approved Remotion LyricOverlay.tsx pattern into a live React component for spoken word transmissions (Meditate, Credo's Words, Chords for Pondering, Songs Sent to God):
 * Font: 'Cormorant Garamond', italic, clamp(1.1rem, 2.2vw, 1.65rem), color #F5E7C5.
 * Text Shadow: 0 2px 18px rgba(0,0,0,0.85), 0 0 22px rgba(0,0,0,0.5).
 * Underline: Center-outward animated gold line (rgba(255, 214, 150, 0.85)) with a 5px glowing center diamond node.
8.3 Web Audio Dynamic Frequency Controller (AudioFilterManager.ts)
Ensure mobile Safari audio unlocks cleanly on the first tap and dynamically opens the frequency spectrum as the player progresses through the 5 Arrivals:
export class AudioFilterManager {
  private ctx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;

  public initOnUserGesture(audioElement: HTMLAudioElement): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
    const source = this.ctx.createMediaElementSource(audioElement);

    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = 480; // Starts distant and muffled

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0.85;

    source.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);
  }

  public setArrivalProgression(normalizedProgress: number): void {
    if (!this.ctx || !this.filterNode) return;
    // Exponentially map 0..1 progress from 480Hz to 20,000Hz
    const minFreq = 480;
    const maxFreq = 20000;
    const targetFreq = minFreq * Math.pow(maxFreq / minFreq, Math.min(1, Math.max(0, normalizedProgress)));
    this.filterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.8);
  }
}

9. MAIN WEBSITE COPY DECK OVERHAUL (src/components/)
Keep the existing minimal dark palette (#080807), the film grain overlay, the cross-motif framing, and the Cormorant Garamond typography, but replace generic placeholder copy with this intentional voice:
9.1 src/components/Hero.jsx
 * Eyebrow: COSMICSUPRHERO — SACRED OBSERVATORY
 * Title: Arcturian Awakening
 * Lead Copy:
   > "Not an escape. A return."
   > "An experiment in immersion—sonically setting the landscape for space, memory, and the quiet rooms within. Sixteen tracks built from live keys, sampled frequencies, and spoken transmissions."
   > 
 * Primary Button (link-btn with amber border accent): ENTER THE JOURNEY (Routes to /play/)
 * Secondary Button (link-btn): DIRECT PRE-SAVE ACCESS (Opens DirectAccessModal)
9.2 src/components/Archive.jsx
 * Eyebrow: TRANSMISSION ARCHIVE
 * Section Heading: The Architecture of Return
 * Body Copy:
   > "Music is a spiritual language. Every chord progression, voice note, and ambient frequency on Arcturian Awakening was composed to inhabit a physical space."
   > "Rather than reading about the record, you are invited to walk through its landscape. Step onto the ridge, tune through the interference, and recover what was carried from the beginning—or request direct entry to the pre-save archive."
   > 
9.3 src/components/Releases.jsx (Featured Release Card)
 * Title: Arcturian Awakening (16-Track LP)
 * Descriptor: "Meditative electronic-jazz, live keys, and cosmic transmissions. Featuring 'Meditate', 'First Contact', 'Xaba', 'Mama Calls Me Chule', 'Awaken Now', and 'Gloriously'."
10. MANDATORY SELF-EVALUATION & QA GATES (DO NOT SKIP)
Before committing or deploying to Vercel, you must verify every item below:
 * The Visual Benchmark Gate: Compare a live 1920 x 1080 screenshot of /play/ against the master First Contact reference image. Does it have the deep starry nebula, the blazing red-orange sun with atmospheric bloom, multi-layered warm amber dunes, foreground rock occluders, grounded blue traveler with maroon cape, glowing monolith rune, and octagonal SVG buttons? If it looks like flat 10-color bands or bitmap text on a tan rectangle, REJECT THE BUILD.
 * Color Depth Verification: Inspect the generated/loaded terrain PNG/WebP files and confirm they preserve full 24-bit color gradients (minimum 2,000+ distinct tonal shades per scene, strictly zero 10–18 color indexed downsampling).
 * Mobile Portrait Fill Gate: Test /play/ at 390 x 844 (iPhone). Confirm the 3-Tier Observatory Frame utilizes 100% of the viewport cleanly, with the game canvas occupying at least 55–60% of the vertical height without horizontal cropping of the protagonist or monolith.
 * Zero-Emoji Audit: Run a workspace search for any Unicode emoji characters across all .ts, .tsx, .js, .jsx, and .css files. Confirm 0 occurrences.
 * Dual-Gate & Blessing Verification:
   * Verify clicking [ DIRECT ACCESS ] opens the Name + Email modal, and submitting displays the exact blessing: "Thank you for taking a moment to get on the site. Your time is appreciated, and I hope you enjoy the music. Peace and overwhelming love and blessing to you." alongside the unlocked pre-save link.
   * Verify walking to unit 2,400 triggers the 180-degree turnaround, illuminates the path behind the traveler, ignites all 16 stars in the sky, and reveals the pre-save link organically.
