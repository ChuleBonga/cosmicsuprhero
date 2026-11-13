import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD_OBSTACLES} from './world-logic.mjs';
import {shouldRenderLandmark} from './world-landmark-policy.mjs';

test('authored W0 workshop cannot be occluded by a duplicate generic stone spire',()=>{
 const ids=WORLD_OBSTACLES.map(o=>o.id);
 assert.ok(ids.includes('waystation'));
 assert.equal(shouldRenderLandmark('waystation',{workerReviewEnabled:true}),false);
 assert.equal(shouldRenderLandmark('waystation',{workerReviewEnabled:false}),true);
 assert.equal(shouldRenderLandmark('first-contact-find',{workerReviewEnabled:true}),false);
 for(const id of ids.filter(x=>!['waystation','first-contact-find'].includes(x))){
  assert.equal(shouldRenderLandmark(id,{workerReviewEnabled:true}),true);
 }
});
