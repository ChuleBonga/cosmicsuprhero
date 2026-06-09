# Cosmicsuprhero Final Product Roadmap

This roadmap turns the current observatory prototype into a public final product without bloating the live site.

The rule: generation and rendering happen offline; the React/Vite site only ships optimized assets and careful interaction.

## Current State

- React + Vite one-page observatory archive.
- Seven chamber architecture is complete.
- Chamber `visualAssets` system is in place.
- Cinematic arrival infrastructure exists for a future clean observatory intro loop.
- Local test video support exists and must remain ignored.
- The v1.4 branch adds ritual entrance, Signal Threshold, Frequency Index, and a stronger Observatory room.

## Final Product Definition

The final site should feel like:

- entering a sacred sonic observatory;
- passing through a signal-acquisition ritual;
- discovering seven emotional chambers as one connected archive;
- listening through artifact frames, not generic widgets;
- leaving through a deliberate Signal Return.

It should not become:

- a heavy WebGL demo;
- a linktree;
- a normal artist portfolio;
- a runtime AI product;
- a browser-audio experiment.

## Implementation Lanes

### Lane 1: Production Cinematic Arrival

Goal: replace local/watermarked test media with clean production assets.

Files:

```text
public/assets/observatory/observatory-intro-poster.webp
public/assets/observatory/observatory-intro.webm
public/assets/observatory/observatory-intro.mp4
```

Acceptance:

- `src/data/observatoryIntro.ts` production config can be switched to `enabled: true`.
- No missing requests in production.
- Reduced-motion users receive poster/static fallback.
- Hero text remains readable on desktop and mobile.
- Video is muted, looping, `playsInline`, and never has audio.

### Lane 2: Scroll Choreography

Goal: make the page unfold like a continuous transmission.

Implemented starting point:

- GSAP + ScrollTrigger is lazy-loaded in `src/components/ScrollChoreography.tsx`.
- It is disabled for `prefers-reduced-motion`.
- It only animates decorative/media layers and index fragments.
- It does not wrap the site, alter native scroll, move buttons into canvas, or change iframe behavior.

Recommended direction if choreography deepens:

- Keep ScrollTrigger as a narrow enhancement layer.
- Avoid full-page smooth-scroll wrappers unless there is a proven need.

Why GSAP:

- ScrollTrigger is the right tool for scroll-linked reveals, pinned threshold moments, and timeline-based section choreography.
- The current implementation still uses `gsap.context()` cleanup through a local effect, while loading GSAP dynamically to protect the initial bundle.

Keep this narrow:

- Do not wrap the whole site in a fake scroll container.
- Do not add smooth-scroll libraries until there is a clear need.
- Respect `prefers-reduced-motion`.
- Keep links, buttons, iframes, and native scroll behavior intact.

First GSAP targets:

- EntrySignal title/metadata reveal.
- SignalThreshold dial and coordinates.
- Observatory receiver-room entrance.
- Frequency Chamber stagger/reveal.
- Signal Return closing ritual.

### Lane 3: Chamber Cinematic Assets

Goal: give the chambers true physical atmosphere without new runtime systems.

Priority order:

1. Soil and Sun chamber loop.
2. Bad Guys Finish Last chamber loop.
3. Songs I Made At Night chamber loop.
4. Enter Aquarius chamber loop.
5. Celestial Multiverse chamber loop.
6. Stargazing, Vol. 3 chamber loop.
7. Just Sounds Really chamber loop.

Each chamber can eventually receive:

```text
poster.webp
texture.webp
background.webm
background.mp4
```

Only reference video assets after files exist.

### Lane 4: Offline Asset Pipeline

Preferred production pipeline:

```text
ComfyUI or Diffusers
-> keyframes / chamber concepts
-> Blender for cinematic depth, camera, lighting, and render loops
-> FFmpeg for webm/mp4/poster.webp
-> React/Vite consumes optimized files from public/assets
```

ComfyUI is useful because its server API accepts workflows through `/prompt`, exposes queue/history routes, and supports WebSocket progress. That makes it a good repeatable asset engine, not a live-site dependency.

Blender is the central 3D/rendering hub. Its command-line mode can render animations in the background with `--background` and `--render-anim`, which is useful for repeatable loop production.

Vite serves exact static filenames from `public/` at the root path, which is why the observatory/chamber asset system uses `/assets/...` URLs.

### Lane 5: QA And Launch Hardening

Every release should pass:

- `npm run validate:assets`
- `npm run build`
- or `npm run check` for both
- desktop screenshot QA
- mobile 390px screenshot QA
- reduced-motion QA
- no horizontal overflow
- no console app errors
- no failed local asset requests
- Apple embeds remain readable inside artifact frames
- production config does not request missing media

## Tool Research Notes

### Website Runtime Candidates

- Current runtime: React, Vite, Tailwind CSS, Framer Motion.
- Optional next runtime dependency: GSAP + `@gsap/react`, only for scroll choreography.
- Avoid for now: Three.js, React Three Fiber, Lenis, tsParticles, browser audio, runtime AI.

### Offline / Asset Pipeline Candidates

- ComfyUI: repeatable node graphs and server API for asset generation.
- Hugging Face Diffusers: scripted image/video generation and automation.
- Blender: 3D scene assembly, camera movement, cinematic render loops.
- FFmpeg: web-ready transcodes and posters.
- Hunyuan3D / TRELLIS.2 / Wonder3D: offline image-to-3D experiments for later chamber artifacts.

## Immediate Next Steps

1. Add clean observatory intro assets.
2. Enable production intro in `src/data/observatoryIntro.ts`.
3. Run full video QA.
4. Add the first chamber loop for Soil and Sun.
5. If the scroll still feels too static, add a small GSAP ScrollTrigger layer.
6. Final production deploy.

## Source Links

- GSAP React docs: https://gsap.com/resources/React/
- GSAP ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- ComfyUI server routes: https://docs.comfy.org/development/comfyui-server/comms_routes
- Vite static assets: https://vite.dev/guide/assets.html
- MDN prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- FFmpeg libvpx/VP9 docs: https://ffmpeg.org/ffmpeg-codecs.html#libvpx
- Blender command-line rendering docs: https://docs.blender.org/manual/en/4.0/advanced/command_line/arguments.html
