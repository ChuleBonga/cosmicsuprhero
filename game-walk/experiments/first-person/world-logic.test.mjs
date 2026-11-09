import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD,groundHeight,groundNormal,halfWidth,WORLD_OBSTACLES,initialState,stepMovement,canInspect,inspectDistance,narrativeBeat,atEnd} from './world-logic.mjs';
import {TAPE} from './journey-actions.mjs';
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
 let a=initialState(),b=initialState();for(let i=0;i<60;i++){a=stepMovement(a,1,0,0);b=stepMovement(b,1,1,0);}
 assert.ok(Math.abs(a.distance-b.distance)<.03);
});
test('path boundaries prevent walking through cliffs',()=>{
 let s=initialState();for(let i=0;i<900;i++)s=stepMovement(s,0,1,0);
 assert.ok(Math.abs(s.x)<=halfWidth(s.z)-WORLD.radius+.002);
});
test('artifact requires physical closeness and facing',()=>{
 let s=initialState();assert.equal(canInspect(s),false);
 s={...s,x:TAPE.x,z:TAPE.z+1.15};
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

test('physical landmarks remain within authored navigable corridor',()=>{
 for(const o of WORLD_OBSTACLES){
  assert.ok(Number.isFinite(o.x)&&Number.isFinite(o.z)&&o.radius>0,o.id);
  assert.ok(Math.abs(o.x)+o.radius<=halfWidth(o.z)+.01,o.id);
 }
});
test('moving forward cannot penetrate physically represented stone landmarks',()=>{
 for(const o of WORLD_OBSTACLES){
  const startZ=o.z+o.radius+WORLD.radius+1.7;
  let s={...initialState(),x:o.x,z:startZ,y:groundHeight(o.x,startZ),vx:0,vz:0};
  for(let i=0;i<280;i++){
   s=stepMovement(s,1,0,0);
   assert.ok(Math.hypot(s.x-o.x,s.z-o.z)>=o.radius+WORLD.radius-.002,o.id+' '+i);
  }
 }
});
test('strafe and forward contacts preserve finite grounded velocity',()=>{
 let s=initialState();
 for(let i=0;i<1600;i++){
  s=stepMovement(s,1, i<500?0:Math.sin(i/40),.045);
  assert.ok(Number.isFinite(s.x)&&Number.isFinite(s.y)&&Number.isFinite(s.z));
  assert.ok(Math.hypot(s.vx,s.vz)<=WORLD.walkSpeed+.0001);
  assert.equal(s.grounded,true);
 }
});

test('corridor walls taper smoothly, with no teleport-width discontinuity',()=>{
 let last=halfWidth(26);
 for(let z=25.95;z>=WORLD.endZ;z-=.05){
  const width=halfWidth(z);
  assert.ok(width>=6.1-1e-6&&width<=8.1+1e-6);
  assert.ok(Math.abs(width-last)<.025,'abrupt path width near '+z.toFixed(2));
  last=width;
 }
});
test('walking along the bank through transitions never produces a lateral jump',()=>{
 let s={...initialState(),x:halfWidth(WORLD.start.z)-WORLD.radius-.03,
     y:groundHeight(halfWidth(WORLD.start.z)-WORLD.radius-.03,WORLD.start.z)};
 let lastX=s.x;
 for(let i=0;i<3200;i++){
  s=stepMovement(s,1,0,.001);
  assert.ok(Math.abs(s.x-lastX)<.09,'wall projection snapped player at '+s.z);
  assert.ok(Math.abs(s.x)<=halfWidth(s.z)-WORLD.radius+.002);
  lastX=s.x;
  if(s.z<WORLD.endZ+5)break;
 }
});
test('mobile contact range supports a forgiving tap without long-distance interaction',()=>{
 const s={...initialState(),x:TAPE.x,z:TAPE.z+1.65};
 assert.equal(canInspect(s,Math.PI),false,'desktop still requires facing');
 assert.equal(canInspect(s,Math.PI,TAPE.radius,-1.1),true,'relaxed touch facing is tested independently');
 const distant={...s,x:TAPE.x+4};
 assert.equal(canInspect(distant,Math.PI,TAPE.radius,-1.1),false);
});
test('full route remains reachable with no required artifact pickup',()=>{
 let s=initialState(),minZ=s.z;
 for(let i=0;i<5200&&!atEnd(s);i++){
  s=stepMovement(s,1,0,0);
  minZ=Math.min(minZ,s.z);
 }
 assert.equal(atEnd(s),true,'player should reach the endpoint by moving forward without mandatory inventory');
 assert.ok(minZ< -100);
});
