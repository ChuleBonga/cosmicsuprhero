import assert from 'node:assert/strict';
import test from 'node:test';
import {points,gap,WORLD_END,floorAt} from './terrain.mjs';
import {MOTION,createState,stepMotion,simulate} from './movement-model.mjs';
test('geometry has strictly increasing, finite coordinates',()=>{
  for(let i=0;i<points.length;i++){
    assert.ok(Number.isFinite(points[i].x)&&Number.isFinite(points[i].y));
    if(i)assert.ok(points[i].x>points[i-1].x);
  }
});
test('terrain contact at every structural vertex matches visible height',()=>{
  for(const p of points){assert.ok(Math.abs(floorAt(p.x).y-p.y)<1e-8);}
});
test('gap is real space with a non-colliding middle, grounded edges',()=>{
  assert.ok(floorAt(gap.start));assert.equal(floorAt((gap.start+gap.end)/2),null);assert.ok(floorAt(gap.end));
});
test('ground normals are finite and unit length',()=>{
  for(let x=0;x<=WORLD_END;x+=9){const contact=floorAt(x);if(!contact)continue;
    assert.ok(Math.abs(Math.hypot(contact.normal.x,contact.normal.y)-1)<1e-9);
  }
});
test('long level path crosses multiple slopes and remains grounded before the gap',()=>{
  let s=createState(95,floorAt);
  for(let i=0;i<420;i++)s=stepMotion(s,{axis:1,jumpPressed:false},floorAt);
  assert.ok(s.x>900,s.x);assert.ok(s.grounded,s.phase);
});
test('jump arc has a real airborne phase and lands again',()=>{
  let s=createState(300,floorAt),wasAirborne=false;
  for(let i=0;i<100;i++){
    s=stepMotion(s,{axis:0,jumpPressed:i===0},floorAt);
    if(!s.grounded)wasAirborne=true;
  }
  assert.ok(wasAirborne);assert.ok(s.grounded);
  assert.ok(Math.abs(s.y-floorAt(s.x).y)<1e-8);
});
test('fixed timestep produces equivalent results under 30/60/120fps sampling',()=>{
  const drive=fps=>simulate({fps,seconds:2,state:createState(60,floorAt),groundFn:floorAt,
     inputAt:t=>({axis:t<1.2?1:0,jumpPressed:false})});
  const a=drive(30),b=drive(60),c=drive(120);
  for(const k of ['x','y','vx','vy']){
    assert.ok(Math.abs(a[k]-b[k])<1e-7,k+' 30/60');
    assert.ok(Math.abs(c[k]-b[k])<1e-7,k+' 60/120');
  }
});
test('movement model does not mutate caller-owned state',()=>{
  const a=createState(65,floorAt);const serialized=JSON.stringify(a);
  stepMotion(a,{axis:1},floorAt);assert.equal(JSON.stringify(a),serialized);
});