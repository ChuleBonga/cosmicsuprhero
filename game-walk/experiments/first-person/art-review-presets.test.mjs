import test from 'node:test';
import assert from 'node:assert/strict';
import {parseReviewPose,createReviewMotion,ART_REVIEW_POSE_IDS} from './art-review-presets.mjs';
import {WORLD_OBSTACLES,halfWidth,WORLD} from './world-logic.mjs';
test('no review mode unless explicitly requested in the query',()=>{
 assert.equal(parseReviewPose(''),null);
 assert.equal(parseReviewPose('?foo=bar'),null);
 assert.equal(parseReviewPose('?art-review=unknown'),null);
 assert.equal(parseReviewPose('?art-review=__proto__'),null);
});
test('four deterministic camera positions exist for actual scene inspection',()=>{
 assert.deepEqual(ART_REVIEW_POSE_IDS,['arrival','contact','waystation','inhabitants']);
 for(const id of ART_REVIEW_POSE_IDS){
  const pose=parseReviewPose('?art-review='+id);
  assert.ok(Number.isFinite(pose.x)&&Number.isFinite(pose.z)&&Number.isFinite(pose.yaw));
  const state=createReviewMotion(pose);
  assert.ok(Math.abs(state.x)+WORLD.radius<halfWidth(state.z));
  assert.equal(state.grounded,true);
  assert.ok(Number.isFinite(state.y));
  for(const o of WORLD_OBSTACLES)assert.ok(Math.hypot(state.x-o.x,state.z-o.z)>o.radius+WORLD.radius,o.id);
 }
});
test('waystation view is on the live route beside the shelter, not inside it',()=>{
 const pose=parseReviewPose('?art-review=waystation');
 assert.equal(pose.id,'waystation');
 assert.ok(pose.x>0&&pose.z<0);
 assert.ok(pose.z>-82);
 assert.ok(pose.yaw<0,'camera should face toward left-side shelter');
});

test('inhabitants art review starts beside the public route, not inside the shelter',()=>{
 const p=parseReviewPose('?art-review=inhabitants');
 assert.equal(parseReviewPose(''),null);
 assert.ok(p&&p.x<0&&p.z<-70);
 assert.ok(createReviewMotion(p).grounded);
});

test('inhabitants inspection camera has direct but collision-safe worker proximity',()=>{
 const p=parseReviewPose('?art-review=inhabitants');
 assert.ok(p.z < -77 && p.x < -2);
 assert.ok(createReviewMotion(p).grounded);
 const workerX=-5.46,workerZ=-81.07;
 const d=Math.hypot(p.x-workerX,p.z-workerZ);
 assert.ok(d>3.5&&d<5.2,'camera should reveal full body without intersecting worker or shelter: '+d);
});
