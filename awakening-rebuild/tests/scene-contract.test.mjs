import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {SITES,worldFrame} from '../src/world/DistrictSimulation.ts';
import {INITIAL} from '../src/encounter.ts';
const doc=JSON.parse(readFileSync(new URL('../production/ARRIVAL_QUARTER_SCENE_CONTRACT.json',import.meta.url),'utf8'));
assert.equal(doc.status,'preproduction-provisional-not-approved');
assert.deepEqual([doc.coordinateFrame.widthMetres,doc.coordinateFrame.depthMetres],[30,20]);
assert.equal(doc.roles.length,3);
assert.equal(doc.sites.length,8);
assert.equal(new Set(doc.sites.map(x=>x.id)).size,doc.sites.length);
assert.equal(doc.evidence.length,3);
for(const s of doc.sites){
 assert.deepEqual(s.position,SITES[s.id],s.id+' has drifted from the current source simulation');
 assert.equal(s.approval,'draft');
 assert.ok(s.civicFunction.length>20,'must have authentic place purpose');
 assert.ok(s.assetIds.length&&s.sourceIds.length,'must connect to assets and references');
}
for(const actor of doc.roles){
 assert.ok(actor.assetId.startsWith('CHR-'));
 assert.ok(doc.sites.find(s=>s.id===actor.startSite && s.owner===actor.id));
 assert.match(actor.approval,/pending/);
}
const current=worldFrame(INITIAL,0);
for(const item of doc.evidence){
 const o=current.objects.find(x=>x.id===item.id);
 assert.ok(o,'evidence model missing: '+item.id);
 assert.deepEqual(item.position,o.position,'evidence position has drifted: '+item.id);
 assert.equal(item.owner,o.owner);
}
assert.deepEqual(doc.audio.map(x=>x.track),['Meditate','First Contact',"Credo's Words"]);
assert.ok(doc.audio.every(x=>/pending/.test(x.status)));
assert.equal(doc.acceptance.production,'blocked');
console.log('M0 authored scene contract agrees with live world simulation, 3 evidence locations and source rights.');
