import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cwd = fileURLToPath(new URL('../', import.meta.url));
const script = fileURLToPath(new URL('./elevenlabs-generate.mjs', import.meta.url));
const sample = [
  '--type', 'sfx', '--id', 'test-chime',
  '--text', 'A quiet metallic resonance with a soft fading echo',
  '--duration', '2'
];
function run(args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd, encoding: 'utf8', timeout: 10000,
    env: { ...process.env, ELEVENLABS_API_KEY: '' },
  });
}
test('help works without credential or network access', () => {
  const output = run(['--help']);
  assert.equal(output.status, 0);
  assert.match(output.stdout, /ElevenLabs review-only audio generator/);
});
test('dry run succeeds without API key and is explicitly non-billable', () => {
  const output = run(sample);
  assert.equal(output.status, 0, output.stderr);
  assert.match(output.stdout, /PREVIEW ONLY/);
  assert.match(output.stdout, /No network request or credits used/);
  assert.match(output.stdout, /requiresApproval/);
});
test('confirmed generation refuses missing credentials before any network request', () => {
  const output = run([...sample, '--confirm']);
  assert.equal(output.status, 1);
  assert.match(output.stderr, /Missing ELEVENLABS_API_KEY/);
});
test('invalid asset names are rejected', () => {
  const output = run(['--type', 'sfx', '--id', '../bad', '--text', 'Sound of wind']);
  assert.equal(output.status, 1);
  assert.match(output.stderr, /--id must be/);
});
test('narration requires an explicitly selected approved voice ID', () => {
  const output = run(['--type', 'voice', '--id', 'narration', '--text', 'The planet waits']);
  assert.equal(output.status, 1);
  assert.match(output.stderr, /Voice generation requires/);
});
