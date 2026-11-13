import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createWorkshopStructure} from './workshop-structure.mjs';
import {WORKBENCH} from './waystation-layout.mjs';

const material=()=>new THREE.MeshStandardMaterial();
function setup(){
 const parent=new THREE.Group();
 const station=createWorkshopStructure(parent,{stone:material(),warm:material(),oxide:material()});
 station.root.updateMatrixWorld(true);
 return {parent,station};
}
test('the workshop is a coherent physical structure and not a monolithic podium',()=>{
 const {station}=setup(),names=[];
 station.root.traverse(o=>{if(o.name)names.push(o.name)});
 const flagstones=station.root.getObjectByName('Ground-embedded salvaged flagstones');
 assert.ok(flagstones && flagstones.children.length>=10);
 assert.ok(names.includes('Rear load beam'));
 assert.ok(names.includes('Front load beam'));
 assert.ok(names.includes('Service bench / stone-inset top'));
 assert.ok(names.includes('Tensioned weathered canopy with physical catenary sag'));
 assert.ok(names.includes('Wired listening transport supply'));
 assert.ok(names.includes('Hanging practical service lamp'));
 assert.ok(names.includes('Actual suspended task lamp / local illumination'));
 const lamp=station.root.getObjectByName('Actual suspended task lamp / local illumination');
 assert.ok(lamp.isPointLight && lamp.intensity>=2 && lamp.distance<5);
 assert.ok(!names.some(n=>/altar|ceremonial|glyph|plinth/i.test(n)));
 const box=new THREE.Box3().setFromObject(station.root),size=box.getSize(new THREE.Vector3());
 assert.ok(size.x>=2.7&&size.x<4.6);
 assert.ok(size.y>=2.5&&size.y<3.8);
 assert.ok(size.z>=2.4&&size.z<4.2);
 station.dispose();
});
test('a person may reach the machine and bench without a central obstructing pole',()=>{
 const {station}=setup();
 const top=station.root.getObjectByName('Service bench / stone-inset top');
 assert.ok(Math.abs(top.position.y+.045-WORKBENCH.topY)<.1);
 assert.ok(Math.abs(top.position.x-WORKBENCH.localX)<.001);
 // The front posts are not in the central interaction corridor.
 const front=[...station.root.children].filter(o=>o.name.includes('front / taper-cut upright'));
 assert.equal(front.length,2);
 assert.ok(front.every(o=>Math.abs(o.position.x)>1.2));
 const playerPathX=WORKBENCH.localX;
 assert.ok(Math.abs(playerPathX)<.6);
 station.dispose();
});
test('authored canopy is physically sagging with defined surface normals',()=>{
 const {station}=setup();
 const canopy=station.root.getObjectByName('Tensioned weathered canopy with physical catenary sag');
 const a=canopy.geometry.attributes.position;
 let edge=0,center=0;
 const c=18,r=14;
 edge=a.getY(0);center=a.getY(Math.floor(r/2)*(c+1)+Math.floor(c/2));
 assert.ok(edge-center>.10,'Canopy must hang, not be another flat primitive slab');
 assert.ok(canopy.geometry.attributes.normal);
 for(let i=0;i<a.count;i++)assert.ok(Number.isFinite(a.getY(i)));
 station.dispose();
});
