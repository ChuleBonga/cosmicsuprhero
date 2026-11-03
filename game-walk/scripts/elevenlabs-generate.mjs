import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const USAGE = [
  'ElevenLabs review-only audio generator for Arcturian Awakening.',
  '',
  'Requires Node 22+ and ELEVENLABS_API_KEY in your environment.',
  'From game-walk/:',
  '  node --env-file=.env.local scripts/elevenlabs-generate.mjs --type sfx --id first-contact-chime --text "An airy crystalline signal in a silent valley, no voice, no melody" --duration 3',
  'Add --confirm to actually make the paid API request.',
  'For narration, use --type voice --voice-id <approved-voice-id> --text "<approved line>" --confirm.',
  'Output goes to .audio-review/ for listening and approval, never directly to the public game.',
].join('\n');

function fail(message) {
  console.error('ElevenLabs: ' + message);
  process.exitCode = 1;
}
function parse(args) {
  const opts = {};
  const allowed = new Set(['type', 'id', 'text', 'voice-id', 'duration']);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg === '--confirm') { opts.confirm = true; continue; }
    if (!arg.startsWith('--') || !allowed.has(arg.slice(2)) || !args[i + 1] || args[i + 1].startsWith('--')) {
      throw new Error('Unknown or missing argument: ' + arg + '\n\n' + USAGE);
    }
    const name = arg.slice(2);
    if (Object.hasOwn(opts, name)) throw new Error('Repeated argument: ' + arg);
    opts[name] = args[++i];
  }
  return opts;
}

async function main() {
  const options = parse(process.argv.slice(2));
  if (options.help) { console.log(USAGE); return; }
  const type = options.type;
  const id = options.id;
  const prompt = options.text?.trim();
  if (type !== 'sfx' && type !== 'voice') throw new Error('--type must be sfx or voice');
  if (!id || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(id)) throw new Error('--id must be 1–64 lowercase letters, digits, underscores or hyphens');
  if (!prompt || prompt.length < 5 || prompt.length > 400) throw new Error('--text must contain 5–400 characters');
  if (type === 'voice' && (!options['voice-id'] || !/^[a-zA-Z0-9_-]{8,100}$/.test(options['voice-id']))) {
    throw new Error('Voice generation requires a valid --voice-id for a voice you have permission to use');
  }
  if (type === 'voice' && options.duration !== undefined) throw new Error('--duration only works with sfx');
  const duration = options.duration === undefined ? undefined : Number(options.duration);
  if (type === 'sfx' && duration !== undefined && (!Number.isFinite(duration) || duration < 0.5 || duration > 12)) {
    throw new Error('--duration must be between 0.5 and 12 seconds');
  }
  const request = type === 'sfx'
    ? { path: '/v1/sound-generation?output_format=mp3_44100_128', body: { text: prompt, model_id: 'eleven_text_to_sound_v2', loop: false, ...(duration === undefined ? {} : { duration_seconds: duration }) } }
    : { path: '/v1/text-to-speech/' + encodeURIComponent(options['voice-id']) + '?output_format=mp3_44100_128', body: { text: prompt, model_id: 'eleven_multilingual_v2' } };
  const destination = resolve('.audio-review', id + '.mp3');
  if (!options.confirm) {
    console.log('PREVIEW ONLY. No network request or credits used.');
    console.log(JSON.stringify({ type, id, text: prompt, durationSec: duration ?? null, output: destination, requiresApproval: true }, null, 2));
    console.log('Repeat with --confirm to generate review audio.');
    return;
  }
  // Check for existing output BEFORE a billable API request.
  try {
    await access(destination);
    throw new Error('Review file already exists: ' + destination + '. Choose a new --id before spending credits.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('Missing ELEVENLABS_API_KEY. Copy .env.example to .env.local and load with node --env-file=.env.local. Never commit the key.');
  if (typeof fetch !== 'function') throw new Error('Requires Node.js with built-in fetch (Node 22+ recommended).');
  const response = await fetch('https://api.elevenlabs.io' + request.path, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify(request.body),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) {
    // Never print response bodies: some API errors may contain request/account details.
    throw new Error('Generation failed: HTTP ' + response.status + '. Check key access, quotas, voice permissions and your ElevenLabs dashboard.');
  }
  const mediaType = response.headers.get('content-type') ?? '';
  if (!mediaType.startsWith('audio/') && !mediaType.startsWith('application/octet-stream')) {
    throw new Error('Unexpected response type: ' + mediaType);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.length || bytes.length > 20_000_000) throw new Error('Unexpected audio file size; nothing saved');
  await mkdir(resolve('.audio-review'), { recursive: true });
  await writeFile(destination, bytes, { flag: 'wx' });
  await writeFile(resolve('.audio-review', id + '.json'), JSON.stringify({
    id, type, prompt, model: request.body.model_id,
    voiceId: type === 'voice' ? options['voice-id'] : null,
    createdAt: new Date().toISOString(), bytes: bytes.length,
    status: 'REVIEW REQUIRED; not cleared for publication',
  }, null, 2) + '\n', { flag: 'wx' });
  console.log('Review audio saved to ' + destination + '. Listen, check rights, and approve before publishing. No files were added to public/.');
}
main().catch(err => fail(err.message));
