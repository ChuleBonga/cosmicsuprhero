import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const base='experiments/first-person/';
const files=await Promise.all(['index.html','world.css','world.mjs'].map(p=>readFile(base+p,'utf8')));
const [html,css,world]=files;
test('all major user states have an accessible album pre-save path',()=>{
 assert.match(html,/<div class="entry-actions">[\s\S]*?share\.amuse\.io\/album\/cosmicsuprhero-arcturian-awakening/);
 assert.match(html,/<section class="end"[\s\S]*?share\.amuse\.io\/album\/cosmicsuprhero-arcturian-awakening/);
 assert.match(html,/<div class="pause-overlay"[\s\S]*?share\.amuse\.io\/album\/cosmicsuprhero-arcturian-awakening/);
 assert.match(html,/id="presave-rail" hidden/);
 assert.match(world,/presaveRail\.hidden=false/);
});
test('exit and album links never trap visitors on isolated game-host root',()=>{
 assert.doesNotMatch(html,/href="\/"/);
 assert.match(html,/href="https:\/\/cosmicsuprhero\.vercel\.app\/"/);
});
test('mobile input and inspection affordances are real touch targets',()=>{
 for(const id of ['touch-stick','touch-stick-thumb','look-stick','look-stick-thumb','r-action','l-action','take-tape','inspect','zoom-in','zoom-out','pause-score-volume','pause','resume'])
  assert.match(html,new RegExp('id="'+id+'"'),id);
 assert.match(world,/availableAction\(motion,journey,coarse,yaw\)/);
 assert.match(world,/inspectionRig\.setZoom/);
 assert.match(world,/pauseScoreVolume\.addEventListener/);
 assert.match(css,/min-width:48px;min-height:48px/);
 assert.match(css,/\.shoulder-button\{[^}]*min-height:48px/);
 assert.match(css,/\.toolbar button,\.toolbar a,\.soundbar button\{min-height:44px\}/);
});
test('portrait, short-screen and landscape layouts include safe-area offsets and scrolling',()=>{
 assert.match(html,/viewport-fit=cover/);
 assert.match(css,/\.intro,\.end\{[\s\S]*?overflow-y:auto/);
 assert.match(css,/@media\(max-width:760px\) and \(orientation:landscape\)/);
 assert.match(css,/@media\(max-height:610px\) and \(orientation:portrait\)/);
 assert.match(css,/env\(safe-area-inset-bottom\)/);
 assert.match(css,/\.inspect-interaction\{position:relative/);
});
test('music controls do not permanently cover mobile gameplay',()=>{
 assert.match(css,/@media\(pointer:coarse\)\{[\s\S]*?\.soundbar label,\.soundbar input,\.soundbar #score-state\{display:none\}/);
 assert.match(css,/\.presave-rail\{top:calc\(env\(safe-area-inset-top\)/);
});

test('interaction priorities remain visible and touch capture is cleared on pause',()=>{
 assert.match(world,/priorityStageUntil/);
 assert.match(world,/announceStage\('CASSETTE RECOVERED'\)/);
 assert.match(world,/updateStage\(timestamp\)/);
 assert.doesNotMatch(world,/\$\('stage'\)\.textContent=narrativeBeat\(motion\.z\)/);
 assert.match(world,/stickPointer=null/);
 assert.match(world,/lookStickPointer=null/);
 assert.match(world,/releasePointerCapture/);
});
test('preview conserves rendering work when idle',()=>{
 assert.match(world,/if\(started&&\(!paused\|\|inspecting\|\|pickupElapsed>=0\|\|relayElapsed>=0/);
});
