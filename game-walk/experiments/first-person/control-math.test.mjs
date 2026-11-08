import test from 'node:test';
import assert from 'node:assert/strict';
import {stickVector,lookDelta} from './control-math.mjs';
test('joystick ignores centre noise without accidental movement',()=>{
 for(let d=-4;d<=4;d++) {
  const v=stickVector(d,d);
  assert.equal(v.right,0);assert.equal(v.forward,0);
 }
});
test('right, forward, back and left mapping is unambiguous',()=>{
 assert.ok(stickVector(39,0).right>.99);
 assert.ok(stickVector(0,-39).forward>.99);
 assert.ok(stickVector(0,39).forward<-.99);
 assert.ok(stickVector(-39,0).right<-.99);
});
test('diagonal touch input never exceeds normal walking speed',()=>{
 for(const [x,y] of [[120,120],[-39,-39],[4,100],[22,-18]]){
  const v=stickVector(x,y);
  assert.ok(Math.hypot(v.right,v.forward)<=1+1e-9);
  assert.ok(Math.hypot(v.visualX,v.visualY)<=39+1e-9);
 }
});
test('invalid contacts are neutral',()=>{
 assert.deepEqual(stickVector(NaN,4),{right:0,forward:0,visualX:0,visualY:0});
});
test('look sensitivity scales horizontal and vertical motion',()=>{
 const a=lookDelta(60,40,1),b=lookDelta(60,40,.5);
 assert.equal(a.yaw,2*b.yaw);assert.equal(a.pitch,2*b.pitch);
 assert.ok(a.yaw>0);assert.ok(a.pitch<0);
});
test('invert changes vertical only and sensitivity is clamped',()=>{
 const a=lookDelta(60,40,1,false),b=lookDelta(60,40,1,true);
 assert.equal(a.yaw,b.yaw);assert.equal(a.pitch,-b.pitch);
 assert.equal(lookDelta(60,40,2).yaw,lookDelta(60,40,1.7).yaw);
});
