import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createWaystation} from './waystation-art.mjs';
import {WAYSTATION,WORLD_OBSTACLES,groundHeight,halfWidth,initialState,stepMovement} from './world-logic.mjs';
function site(){
 const root=new THREE.Group(),stone=new THREE.MeshStandardMaterial(),warm=new THREE.MeshStandardMaterial(),oxide=new THREE.MeshStandardMaterial();
 const station=createWaystation(root,{groundHeight,stone,warm,oxide});
 station.root.updateMatrixWorld(true);return station;
}
test('shelter has a matching collider beside the traversable path',()=>{
 const s=site(),o=WORLD_OBSTACLES.find(o=>o.id==='waystation');
 assert.ok(o);assert.equal(o.radius,s.footprintRadius);
 assert.equal(o.x,WAYSTATION.x);assert.equal(o.z,WAYSTATION.z);
 assert.ok(Math.abs(o.x)+o.radius<=halfWidth(o.z));
 assert.ok(Math.abs(s.root.position.y-groundHeight(o.x,o.z))<1e-8);
});
test('human-scale workplace has no collectible markers or ceremonial altar',()=>{
 const s=site();let count=0,labels=[];
 s.root.traverse(o=>{
  if(!o.isMesh)return;count++;labels.push(o.name);
  const p=o.geometry.attributes.position;
  for(let i=0;i<p.count;i++)assert.ok(Number.isFinite(p.getX(i))&&Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)));
 });
 for(const name of ['Listening workbench','Unpowered repairable listening shell','Folded weathered cloth','Roadside walking repairs'])assert.ok(labels.includes(name),name);
 assert.ok(count>=12&&count<25);
 assert.ok(!labels.some(s=>/altar|plinth|magic|glyph/i.test(s)));
 const box=new THREE.Box3().setFromObject(s.root);
 assert.ok(box.max.y-box.min.y<5);
});
test('center route remains open past the roadside shelter',()=>{
 let s={...initialState(),x:0,z:WAYSTATION.z+6,y:groundHeight(0,WAYSTATION.z+6)};
 for(let i=0;i<430;i++)s=stepMovement(s,1,0,0);
 assert.ok(s.z<WAYSTATION.z-7);
});

test('real task mechanism exists only in opted-in worker review scene',()=>{
 const materials={stone:new THREE.MeshStandardMaterial(),warm:new THREE.MeshStandardMaterial(),oxide:new THREE.MeshStandardMaterial()};
 const parent=new THREE.Group();
 const normal=createWaystation(parent,{groundHeight,...materials});
 assert.equal(normal.repair,null);
 const review=createWaystation(parent,{groundHeight,...materials,reviewWorker:true});
 assert.ok(review.repair);
 assert.ok(review.root.getObjectByName('Visible mechanical drive shafts'));
 assert.ok(review.repair.getState().rotations===0);
 assert.equal(review.root.getObjectByName('Unpowered repairable listening shell').visible,false);
 assert.equal(review.root.getObjectByName('Physical ventilation slots').visible,false);
 assert.equal(normal.root.getObjectByName('Unpowered repairable listening shell').visible,true);
 normal.dispose();review.dispose();
});
