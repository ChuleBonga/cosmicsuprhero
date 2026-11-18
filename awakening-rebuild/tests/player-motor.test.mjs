import assert from 'node:assert/strict';
import {HALL_ENTRANCE,HALL_INTERIOR,HALL_WALLS,FIELD_BOUNDS,clampedPoint,obstructed,movePlayer,canInspect,distance} from '../src/world/PlayerMotor.ts';
assert.equal(HALL_WALLS.length,5);
assert.deepEqual(HALL_ENTRANCE,{x:10,z:8.4});
assert.equal(HALL_INTERIOR.maxZ,8.4);
assert.equal(obstructed({x:10,z:8.4}),false,'entry is open while listening');
assert.equal(obstructed({x:10,z:8.4},true),true,'door denies access after world consequence');
assert.equal(obstructed({x:15.48,z:5}),true,'hall side wall must collide');
assert.equal(obstructed({x:10,z:4}),false,'player can stand inside hall');
let walk={x:10,z:12},rejected={x:10,z:12},west={x:14,z:12};
for(let i=0;i<12;i++){
 walk=movePlayer(walk,0,-.55);
 rejected=movePlayer(rejected,0,-.55,true);
 west=movePlayer(west,0,-.55);
}
assert.ok(walk.z<8.05,'walking toward the north doorway must cross the open gate');
assert.ok(rejected.z>=8.54,'closed door physically prevents entrance');
assert.ok(west.z>8.6,'cannot pass through the exterior facade');
assert.ok(Math.abs(west.x-14)<1e-10);
const slide=movePlayer({x:14,z:9.1},-5,-5);
assert.ok(slide.x<14,'collision with a wall should permit horizontal movement');
assert.deepEqual(clampedPoint({x:-10,z:90}),{x:FIELD_BOUNDS.minX,z:FIELD_BOUNDS.maxZ});
assert.deepEqual(movePlayer({x:14,z:18},NaN,0),{x:14,z:18});
assert.equal(canInspect({x:10,z:10},{x:10,z:8.6}),true);
assert.equal(canInspect({x:10,z:10},{x:10,z:7.8},true),false,'closed doors block in-world inspection');
assert.equal(canInspect({x:14,z:9},{x:14,z:7.9}),false,'wall blocks physically close evidence');
assert.equal(canInspect({x:15,z:18},{x:15,z:8}),false,'objects remain proximity gated');
assert.equal(canInspect({x:22,z:7},{x:22,z:5.6}),true,'courier case accessible from public path');
assert.ok(distance({x:14,z:18},{x:14,z:17})===1);
for(let z=10;z<19;z+=.5){
 const result=movePlayer({x:14,z},0,-20,true);
 assert.ok(result.x>=FIELD_BOUNDS.minX&&result.x<=FIELD_BOUNDS.maxX);
 assert.ok(result.z>=FIELD_BOUNDS.minZ&&result.z<=FIELD_BOUNDS.maxZ);
 assert.ok(!obstructed(result,true),'controller must never tunnel into a solid wall');
}
console.log('3D Arrival Quarter motor: wall sliding, entry rights, proximity and sight lines passed');
