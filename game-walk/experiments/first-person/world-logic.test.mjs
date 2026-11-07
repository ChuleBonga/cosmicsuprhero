import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD,groundHeight,groundNormal,halfWidth,initialState,stepMovement,canInspect,inspectDistance,narrativeBeat,atEnd} from './world-logic.mjs';
test('world and ground geometry are finite with normalized normals',()=>{
 for(let z=-117;z<=26;z+=3)for(let x=-10;x<=10;x+=2){
  assert.ok(Number.isFinite(groundHeight(x,z)));
  let n=groundNormal(x,z);assert.ok(Math.abs(Math.hypot(n.x,n.y,n.z)-1)<1e-6);
 }
});
test('physics rejects unstable variable timesteps',()=>assert.throws(()=>stepMovement(initialState(),1,0,0,.1),RangeError));
test('60Hz simulation agrees at 30/60/120Hz render cadences',()=>{
 function simulate(fps){let s=initialState(),acc=0;for(let i=0;i<fps*4;i++){acc+=1/fps;while(acc+1e-9>=1/60){s=stepMovement(s,1,0,0);acc-=1/60;}}return s;}
 const a=simulate(30),b=simulate(60),c=simulate(120);
 for(const k of ['x','y','z','distance']){assert.ok(Math.abs(a[k]-b[k])<1e-7, k);assert.ok(Math.abs(c[k]-b[k])<1e-7,k);}
});
test('walking moves toward negative Z',()=>{
 let s=initialState();for(let i=0;i<180;i++)s=stepMovement(s,1,0,0);
 assert.ok(s.z<17);assert.ok(s.distance>6);
});
test('release of controls brakes rather than sliding',()=>{
 let s=initialState();for(let i=0;i<80;i++)s=stepMovement(s,1,0,0);
 for(let i=0;i<80;i++)s=stepMovement(s,0,0,0);
 assert.equal(s.vz,0);
});
test('diagonal input does not exceed straight speed',()=>{
 let a=initialState(),b=initialState();for(let i=0;i<180;i++){a=stepMovement(a,1,0,0);b=stepMovement(b,1,1,0);}
 assert.ok(Math.abs(a.distance-b.distance)<.1);
});
test('path boundaries prevent walking through cliffs',()=>{
 let s=initialState();for(let i=0;i<900;i++)s=stepMovement(s,0,1,0);
 assert.ok(Math.abs(s.x)<=halfWidth(s.z)-WORLD.radius+.002);
});
test('artifact requires physical closeness and facing',()=>{
 let s=initialState();assert.equal(canInspect(s),false);
 s={...s,x:1.3,z:WORLD.artifact.z+1.7};
 assert.ok(inspectDistance(s)<WORLD.inspectDistance);
 assert.equal(canInspect(s,0),true);assert.equal(canInspect(s,Math.PI),false);
});
test('relic base is not walk-through',()=>{
 let s=initialState();for(let i=0;i<2100;i++)s=stepMovement(s,1,0,0);
 const dist=Math.hypot(s.x-WORLD.artifact.x,s.z-WORLD.artifact.z);
 assert.ok(dist>=1.82+WORLD.radius-.02);
});
test('story beats are one uninterrupted spatial journey',()=>{
 assert.equal(narrativeBeat(15),'THE ARRIVAL');
 assert.equal(narrativeBeat(-14),'THE PASSAGE');
 assert.equal(narrativeBeat(-45),'THE ENCOUNTER');
 assert.equal(narrativeBeat(-92),'THE RETURN');
});
test('there is one terminal location, without required collectibles',()=>{
 let s={...initialState(),z:WORLD.endZ};assert.equal(atEnd(s),true);
 assert.equal(atEnd(initialState()),false);
});
