import test from 'node:test';
import assert from 'node:assert/strict';
import {PICKUP_SECONDS,INSERT_SECONDS,pickupPose,insertionPose} from './interaction-motion.mjs';
test('transitions are bounded and deterministic at arbitrary frame rates',()=>{
 for(const seconds of [PICKUP_SECONDS,INSERT_SECONDS])assert.ok(seconds>=.5&&seconds<=1.5);
 for(const fn of [pickupPose,insertionPose]){
  assert.deepEqual(fn(-3),fn(0));
  assert.deepEqual(fn(3),fn(1));
  const sample=fn(.45);assert.ok(Object.values(sample).every(Number.isFinite));
 }
});
test('pickup moves the player-held physical cassette toward the lower near camera',()=>{
 const a=pickupPose(0),b=pickupPose(1);
 assert.ok(b.x<a.x&&b.y<a.y&&b.z>a.z);
 assert.ok(b.scale<a.scale);
});
test('relay tape inserts downward rather than materializing in final socket',()=>{
 const a=insertionPose(0),b=insertionPose(1);
 assert.ok(a.y>b.y);
 assert.equal(b.y,.78);
 assert.ok(b.glow>a.glow);
});
