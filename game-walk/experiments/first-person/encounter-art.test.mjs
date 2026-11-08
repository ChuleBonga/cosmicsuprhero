import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createFirstContactEncounter,CONTACT_SPEC} from './encounter-art.mjs';
import {WORLD,WORLD_OBSTACLES,halfWidth,groundHeight} from './world-logic.mjs';

function makeEncounter(){
 const parent=new THREE.Group(),stone=new THREE.MeshStandardMaterial({color:0x7085a8});
 const oxide=new THREE.MeshStandardMaterial({color:0x39465f,roughness:.7,metalness:.2});
 const warm=new THREE.MeshStandardMaterial({color:0xac8367});
 const model=createFirstContactEncounter(parent,{
  x:WORLD.artifact.x,z:WORLD.artifact.z,groundHeight,halfWidth,stone,oxide,warm
 });
 model.root.updateMatrixWorld(true);
 return {model,parent};
}
test('pedestal radius exactly matches navigation collision proxy',()=>{
 const collider=WORLD_OBSTACLES.find(x=>x.id==='first-contact-plinth');
 assert.ok(collider);
 assert.equal(CONTACT_SPEC.plinthRadius,collider.radius);
 assert.equal(CONTACT_SPEC.innerPavingRadius<=collider.radius,true);
});
test('encounter is built at defined world coordinates',()=>{
 const {model,parent}=makeEncounter();
 assert.equal(parent.children.length,1);
 assert.equal(model.root.position.x,WORLD.artifact.x);
 assert.equal(model.root.position.z,WORLD.artifact.z);
 assert.ok(Math.abs(model.root.position.y-groundHeight(WORLD.artifact.x,WORLD.artifact.z))<1e-8);
});
test('the same inspectable core can be cloned without losing geometry',()=>{
 const {model}=makeEncounter();
 const clone=model.core.clone(true);
 const visit=(obj)=>{let count=0;obj.traverse(n=>{if(n.isMesh)count++});return count};
 assert.ok(visit(model.core)>=7);
 assert.equal(visit(clone),visit(model.core));
 assert.ok(model.core.children.some(n=>n.name.includes('cobalt')));
});
test('all encounter positions and geometry vertices remain finite',()=>{
 const {model}=makeEncounter();
 let meshes=0,vertices=0,draws=0;
 model.root.traverse(o=>{
  if(!o.isMesh)return;
  meshes++;draws++;
  const g=o.geometry;
  assert.ok(g&&g.attributes.position,o.name);
  const p=g.attributes.position;
  for(let i=0;i<p.count;i++){
   assert.ok(Number.isFinite(p.getX(i))&&Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)),o.name);
  }
  vertices+=p.count;
 });
 assert.ok(meshes>12&&meshes<52,'reasonable authored mesh / draw count');
 assert.ok(vertices>900&&vertices<55000,'geometric detail within first-slice scope');
});
test('architectural wings remain beyond the physical walking corridor',()=>{
 const {model}=makeEncounter();
 const wings=model.root.getObjectByName('Fractured supporting wings');
 assert.ok(wings);
 const threshold=halfWidth(WORLD.artifact.z)+2;
 const fins=wings.children.filter(o=>o.geometry?.type==='ExtrudeGeometry');
 assert.equal(fins.length,2);
 for(const fin of fins)assert.ok(Math.abs(fin.position.x)>threshold);
});
test('surrounding stones are real instanced objects, not image planes',()=>{
 const {model}=makeEncounter();
 const objects=[];
 model.root.traverse(o=>{if(o.isInstancedMesh)objects.push(o)});
 assert.ok(objects.length>=5);
 const paving=objects.filter(o=>o.name.includes('Buried ring paving'));
 assert.equal(paving.length,2);
 assert.ok(paving.every(p=>p.count>15));
});
test('relic materials are solid physically based surfaces',()=>{
 const {model}=makeEncounter();
 const materials=[];
 model.core.traverse(o=>{if(o.isMesh)materials.push(o.material)});
 assert.ok(materials.some(m=>m.isMeshPhysicalMaterial));
 assert.ok(materials.every(m=>m.transparent!==true));
 assert.ok(materials.every(m=>m.roughness>=0&&m.roughness<=1));
});
