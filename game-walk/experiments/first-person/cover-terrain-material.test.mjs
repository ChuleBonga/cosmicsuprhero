import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {artworkReviewEnabled} from './artwork-calibration.mjs';
const art=readFileSync(new URL('./world-art.mjs',import.meta.url),'utf8');
test('cover palette is opt-in only for a named review camera',()=>{
 assert.equal(artworkReviewEnabled('?look=cover',null),false);
 assert.equal(artworkReviewEnabled('?look=cover&art-review=arrival',{id:'arrival'}),true);
});
test('candidate terrain uses neutral albedo without changing legacy route',()=>{
 assert.ok(art.includes("terrainNeutral=coverLook?materialFamily('neutral',true):null"));
 assert.ok(art.includes('terrain(root,basalt,terrainNeutral??ochre,coverLook)'));
 assert.ok(art.includes("kind==='neutral'?[230,234,238]"));
 assert.ok(art.includes('coverLook?9:36,coverLook?14:64'));
 assert.ok(art.includes('map:coverLook?null:stone.albedo'));
});
test('cover-only neutral textures are disposed',()=>{
 assert.ok(art.includes('terrainNeutral.albedo,terrainNeutral.normal,terrainNeutral.roughness'));
 assert.ok(art.includes('for(const tex of maps)tex.dispose()'));
});
