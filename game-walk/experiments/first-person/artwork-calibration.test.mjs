import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COVER_PALETTE,artworkReviewEnabled} from './artwork-calibration.mjs';
const approved=JSON.parse(readFileSync(new URL('../../production/CANONICAL_PALETTE.json',import.meta.url),'utf8')).tokens;
const byName=Object.fromEntries(approved.map(t=>[t.name,t.hex.toLowerCase()]));
const hex=num=>'#'+num.toString(16).padStart(6,'0');
test('artist-approved palette anchors match measured official source samples',()=>{
 for(const [key,ref] of [['skyCobalt','sky_cobalt'],['sunOrange','sun_lower'],['sunHot','sun_top'],['mountainShadow','mountain_indigo'],['mountainMid','mountain_mid_blue'],['stoneOchre','mountain_ochre_particles'],['faceBlueGreen','face_blue_green'],['cloakBurgundy','cloak_burgundy']]){
  assert.equal(hex(COVER_PALETTE[key]),byName[ref],key);
 }
});
test('cover palette is opt-in ONLY when an art-review camera is requested',()=>{
 const pose={id:'arrival'};
 assert.equal(artworkReviewEnabled('',pose),false);
 assert.equal(artworkReviewEnabled('?look=cover',null),false);
 assert.equal(artworkReviewEnabled('?look=cover&art-review=arrival',pose),true);
 assert.equal(artworkReviewEnabled('?look=generic&art-review=arrival',pose),false);
 assert.equal(artworkReviewEnabled('?art-review=arrival',pose),false);
});
