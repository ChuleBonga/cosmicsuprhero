import assert from 'node:assert/strict';
import {existsSync, readFileSync, statSync, openSync, readSync, closeSync} from 'node:fs';

const html=readFileSync('index.html','utf8');
const script=readFileSync('src/arcturian-world.js','utf8');
assert.match(html, /<script[^>]*src="\/src\/arcturian-world\.js"/, 'Active homepage entry must remain explicit');
assert.doesNotMatch(html, /<audio[^>]*src="https?:\/\//, 'External signed music URLs must not be shipped');
assert.doesNotMatch(html, /https:\/\/at\.adobe\.com\//, 'Expired Adobe redirect must not be shipped');
const tag=html.match(/<audio\b[^>]*id="awaken-audio"[^>]*>/)?.[0];
assert.ok(tag,'Expected accessible homepage audio element');
assert.match(tag, /data-preview-src="\/audio\/awaken-now-preview\.m4a"/, 'Homepage must expect local preview');
assert.doesNotMatch(tag, /\ssrc=/, 'Audio source must not load until availability is confirmed');
assert.match(script, /async function checkPreviewAvailability\(/, 'Audio requires verified local availability');
assert.match(script, /method:"HEAD"/, 'Missing audio needs a cheap availability check');
const enter=script.match(/function startEncounter\(\)\{([\s\S]*?)\n\}/)?.[1]??'';
assert.doesNotMatch(enter,/startMusic\(/, 'Entering an encounter must not autoplay music');
const asset='public/audio/awaken-now-preview.m4a';
if(existsSync(asset)){
  const approval='docs/audio-preview-approval.json';
  assert.ok(existsSync(approval), 'Published preview requires a recorded cut-point/rights approval');
  const record=JSON.parse(readFileSync(approval,'utf8'));
  assert.equal(record.track,'Awaken Now');
  assert.equal(record.publicPreviewApproved,true);
  assert.equal(record.cutPointVerified,true);
  const bytes=statSync(asset).size;
  assert.ok(bytes>=1024&&bytes<=5*1024*1024, 'Only a small, encoded excerpt may be bundled');
  const fd=openSync(asset,'r');
  const header=Buffer.alloc(12);
  try{readSync(fd,header,0,12,0);}finally{closeSync(fd);}
  assert.equal(header.toString('ascii',4,8),'ftyp','Expected real M4A/MP4 asset');
  console.log('Approved bounded local preview ready for bundling.');
}else{
  console.log('No approved local preview present. Homepage will disable playback rather than request an expired URL.');
}
