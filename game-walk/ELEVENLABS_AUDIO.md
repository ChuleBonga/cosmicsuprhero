# ElevenLabs audio production for Arcturian Awakening

This is a **build-time review workflow**, not a live voice-generation endpoint. The Phaser game continues using locally hosted, artist-approved audio through its existing `AudioDirector`. No ElevenLabs API key is sent to browsers, no service calls run during gameplay, and the published album/master audio is unchanged.

## Setup

1. From `game-walk/`, run `npx -y @elevenlabs/cli@latest onboard init` on a machine with npm access. Follow the printed onboarding instructions. Alternatively, if you already have a restricted ElevenLabs API key, copy `.env.example` to `.env.local`, replace the placeholder and keep the file private.
2. Use Node.js 22 or later. Check the local generator with `node scripts/elevenlabs-generate.mjs --help`.
3. Run the offline guard tests with `npm run test:audio`, then start with a **dry run**, which consumes no ElevenLabs credits:

   ```sh
   node --env-file=.env.local scripts/elevenlabs-generate.mjs --type sfx --id first-contact-chime --text "A delicate crystalline radio signal emerges from distant starlight, softly resonating, no vocals and no melody" --duration 3
   ```

4. After reviewing the description and your account's pricing/quota, repeat with `--confirm` to make a paid API request. Output is saved in `.audio-review/`, which is Git-ignored and excluded from the Vercel game.

For spoken content, use `--type voice --voice-id YOUR_APPROVED_VOICE_ID --text "APPROVED LINE"`. It also requires `--confirm`. Do **not** clone the artist or anyone else's voice, recreate tracks, or invent spoken memories without permission. Any narration needs approved scripts, consent for the selected voice, and accessibility captions.

## Publishing approved assets

After listening, checking rights and levels, and adding captions where appropriate, manually transfer chosen files to `public/audio/elevenlabs/` and commit only those approved assets. Hook them into the existing Phaser `AudioDirector` as **optional, nonblocking cues** with volume controls and graceful fallback. The generator intentionally never modifies scene logic or uploads automatically.

**Key management:** `ELEVENLABS_API_KEY` is server-side/build-time only. Never use `VITE_ELEVENLABS_API_KEY`, `import.meta.env`, or expose a browser endpoint that can trigger unlimited generation. Restrict key permissions and credits in the ElevenLabs dashboard. Key or quota problems must not interrupt walking, save progress, music, or the pre-save path.

**Status:** Generator and instructions are source code only until a real credential is securely configured, a paid request is explicitly confirmed, and an approved sound is tested in-browser. No voice or SFX outputs are claimed as produced here.

Official references: https://elevenlabs.io/docs/api-reference/authentication and https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert
