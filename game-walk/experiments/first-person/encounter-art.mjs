/**
 * Arcturian Awakening / First Contact — an original, physically authored
 * encounter sculpture. Built from reusable THREE geometries and instances.
 *
 * Contract: origin at the existing plinth collider (world-logic.mjs),
 * +Y up, 1 unit = 1 metre. Standing stone elements remain outside the
 * navigable corridor; exterior paving sits nearly flush with the terrain.
 * No downloaded scans, third-party models, or unrelated game iconography.
 */
import * as THREE from 'three';
import {createCassetteArt,CASSETTE_SCALE} from './cassette-art.mjs';

export const CONTACT_SPEC=Object.freeze({
  plinthRadius:2.36, plinthTopY:.37, vesselHeight:2.65,
  innerPavingRadius:2.28, outerPavingRadius:4.8,
  cassetteShelfZ:2.28,cassetteShelfY:1.36
});
const TAU=Math.PI*2;
const stoneNoise=n=>Math.sin(n*12.9898)*43758.5453-Math.floor(Math.sin(n*12.9898)*43758.5453);
function mesh(parent,geometry,material,x=0,y=0,z=0,shadow=false){
 const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);
 m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m;
}
function irregularStone(radius=1,detail=2,seed=3){
 const g=new THREE.IcosahedronGeometry(radius,detail);
 const p=g.attributes.position;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  const grain=.035*Math.sin(x*18+z*24+seed)+.023*Math.cos(y*29-z*17+seed*.5);
  const shear=.018*Math.sin(x*7+y*11+seed);
  const f=1+grain+shear;
  p.setXYZ(i,x*f,y*f*.96,z*f);
 }
 p.needsUpdate=true;g.computeVertexNormals();
 return g;
}
function outerPaving(root,stone,warm,groundHeight,originX,originY,originZ){
 const g=new THREE.BoxGeometry(.82,.085,.72,2,1,2);
 // Geometric chipped corners produce real silhouette variation in close-up.
 const p=g.attributes.position;
 for(let i=0;i<p.count;i++){
  if(p.getY(i)>0){
   const x=p.getX(i),z=p.getZ(i);
   p.setXYZ(i,x*(.97+.025*Math.sin(i*3.1)),p.getY(i)+.009*Math.sin(i*7.5),z*(.96+.03*Math.cos(i*4.1)));
  }
 }
 p.needsUpdate=true;g.computeVertexNormals();
 const o=new THREE.Object3D(),outer=[];
 for(let ring=0;ring<2;ring++){
  const radius=ring===0?3.12:4.42,number=ring===0?24:34;
  const result=new THREE.InstancedMesh(g,ring===0?stone:warm,number);
  let written=0;
  for(let i=0;i<number;i++){
   if((i*7+ring*3)%17===0||(ring===1&&i===8))continue;
   const a=i*TAU/number+ring*.13;
   const x=Math.cos(a)*radius,z=Math.sin(a)*radius;
   // Stone is embedded in soil rather than hovering above it.
   const y=groundHeight(originX+x,originZ+z)-originY-.043;
   o.position.set(x,y,z);
   o.rotation.set(0,a+Math.PI/2+Math.sin(i*2.9)*.04,(stoneNoise(i+ring*100)-.5)*.035);
   o.scale.set(.81+(i%4)*.068,1,.8+(i%3)*.05);
   o.updateMatrix();result.setMatrixAt(written++,o.matrix);
  }
  result.count=written;result.instanceMatrix.needsUpdate=true;
  result.castShadow=false;result.receiveShadow=true;result.name='Buried ring paving '+ring;
  root.add(result);outer.push(result);
 }
 return outer;
}
function innerInlay(root,stone,oxide){
 const surface=new THREE.Group();surface.name='Contact plinth inscriptions';root.add(surface);
 const fragment=new THREE.RingGeometry(1.81,2.22,5,1,0,TAU/32*.84);
 fragment.rotateX(-Math.PI/2);
 const tiles=new THREE.InstancedMesh(fragment,stone,28),o=new THREE.Object3D();
 let count=0;
 for(let i=0;i<32;i++){
  if(i===5||i===17||i===18||i===29)continue;
  o.position.set(0,.385,0);
  o.rotation.set(0,i*TAU/32,0);
  o.scale.set(1,1,1);o.updateMatrix();tiles.setMatrixAt(count++,o.matrix);
 }
 tiles.count=count;tiles.instanceMatrix.needsUpdate=true;
 tiles.name='Fractured inset stone tessellation';surface.add(tiles);
 const glyphs=new THREE.InstancedMesh(new THREE.BoxGeometry(.037,.012,.15),oxide,40);
 count=0;
 for(let i=0;i<40;i++){
  if(i%11===0)continue;
  const a=i*TAU/40;
  const rad=1.31+(i%2)*.14;
  o.position.set(Math.cos(a)*rad,.59,Math.sin(a)*rad);
  o.rotation.set(0,a+Math.PI/2,0);
  o.scale.set(1,1,.68+(i%4)*.16);
  o.updateMatrix();glyphs.setMatrixAt(count++,o.matrix);
 }
 glyphs.count=count;glyphs.instanceMatrix.needsUpdate=true;
 glyphs.name='Original radial intaglio inscriptions';surface.add(glyphs);
 return surface;
}
function structuralWings(root,stone,oxide,groundHeight,x,z,originY,halfWidth){
 const group=new THREE.Group();group.name='Fractured supporting wings';root.add(group);
 const shape=new THREE.Shape();
 shape.moveTo(-1.8,0);shape.lineTo(1.7,0);shape.lineTo(1.38,1.1);
 shape.lineTo(1.12,3.8);shape.lineTo(.68,6.7);shape.lineTo(.89,10.7);
 shape.lineTo(.31,13.3);shape.lineTo(-.54,13.52);
 shape.lineTo(-.79,11.3);shape.lineTo(-1.06,7.8);
 shape.lineTo(-1.35,3.3);shape.lineTo(-1.8,0);
 const geo=new THREE.ExtrudeGeometry(shape,{depth:1.8,bevelEnabled:true,bevelThickness:.085,bevelSize:.095,bevelSegments:2,steps:1});
 // Outside corridor boundary so these actual pillars need no extra collider.
 for(const side of [-1,1]){
  const walkEdge=halfWidth(z),outer=walkEdge+2.6;
  const px=side*outer;
  const py=groundHeight(x+px,z)-originY;
  const main=mesh(group,geo,stone,px,py,1.1,true);
  main.rotation.y=side*.16;main.rotation.z=side*.058;
  const foil=mesh(group,new THREE.BoxGeometry(.095,5.8,.1),oxide,px-side*.78,py+5.8,3.05);
  foil.rotation.z=side*.075;foil.castShadow=false;
  const base=mesh(group,new THREE.CylinderGeometry(2.05,2.35,.34,11),stone,px,py+.11,2.05);
  base.castShadow=true;
  const strut=mesh(group,new THREE.BoxGeometry(.62,3.4,1.05),oxide,px+side*.48,py+2.0,3.06);
  strut.rotation.z=side*.24;
 }
 return group;
}
/**
 * Build a complete, self-contained First Contact moment.
 * `opts.root` is a scene Group; opts.x,z specify collider center.
 */
export function createFirstContactEncounter(parent,opts){
 const {x,z,groundHeight,halfWidth,stone,oxide,warm}=opts;
 if(!Number.isFinite(x)||!Number.isFinite(z))throw new Error('Encounter requires finite world coordinates');
 const root=new THREE.Group();
 root.name='FIRST CONTACT / physically grounded listening plaza';
 const ground=groundHeight(x,z);
 root.position.set(x,ground,z);
 parent.add(root);
 const plinth=mesh(root,new THREE.CylinderGeometry(2.14,CONTACT_SPEC.plinthRadius,.38,32),stone,0,.19,0,true);
 plinth.name='Plinth collision match (radius 2.36 m)';
 const inset=mesh(root,new THREE.CylinderGeometry(1.87,2.04,.23,32),oxide,0,.50,0,true);
 inset.name='Weathered metal seat';
 const shoulders=mesh(root,new THREE.CylinderGeometry(1.45,1.72,1.43,12),stone,0,1.33,0,true);
 shoulders.name='Faceted stone lower vessel';
 const collar=mesh(root,new THREE.TorusGeometry(1.23,.11,8,40),oxide,0,2.08,0);
 collar.rotation.x=Math.PI/2;
 const upper=mesh(root,new THREE.CylinderGeometry(.97,1.24,.21,12),warm,0,2.16,0);
 const ornaments=innerInlay(root,stone,oxide);
 outerPaving(root,stone,warm,groundHeight,x,ground,z);
 structuralWings(root,stone,oxide,groundHeight,x,z,ground,halfWidth);
 // Place the 15cm cassette at an accessible, front-facing archival shelf,
 // not at the inaccessible top of a monumental plinth. Approaching from +Z
 // brings the object within arm's reach of the player's collision capsule.
 const shelfZ=CONTACT_SPEC.cassetteShelfZ,shelfY=CONTACT_SPEC.cassetteShelfY;
 const support=mesh(root,new THREE.BoxGeometry(.5,.22,.84),stone,0,shelfY-.20,1.91,true);
 support.name='Cantilevered stone cassette shelf support';
 const tray=mesh(root,new THREE.BoxGeometry(.43,.055,.33),oxide,0,shelfY-.048,shelfZ,true);
 tray.name='Cassette resting tray / accessible front shelf';
 const lip=mesh(root,new THREE.BoxGeometry(.43,.06,.025),oxide,0,shelfY-.05,shelfZ+.18);
 lip.name='Cassette shelf retaining lip';
 const core=new THREE.Group();core.name='First Contact / inspectable music cassette';
 core.position.set(0,shelfY,shelfZ);root.add(core);
 const tape=createCassetteArt();
 tape.scale.setScalar(CASSETTE_SCALE);
 tape.rotation.x=-.11;
 core.add(tape);
 // Restrained localized reflection: helps discover the object, not neon loot.
 const light=new THREE.PointLight(0xe8a676,.68,4.5,2);
 light.position.set(0,shelfY+.65,shelfZ+.22);root.add(light);
 return {root,core,light,ornaments};
}
