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

export const CONTACT_SPEC=Object.freeze({
  plinthRadius:2.36, plinthTopY:.37, vesselHeight:2.65,
  innerPavingRadius:2.28, outerPavingRadius:4.8
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
function buildVessel(core){
 const cobalt=new THREE.MeshStandardMaterial({name:'Cobalt mineral shell',color:0x253d61,metalness:.09,roughness:.78});
 const mineral=new THREE.MeshPhysicalMaterial({name:'Deep blue crystalline memory',color:0x53779c,metalness:.14,roughness:.24,clearcoat:.48,clearcoatRoughness:.31});
 const agedGold=new THREE.MeshStandardMaterial({name:'Oxidized warm metal',color:0x8f6b54,metalness:.48,roughness:.53});
 const blackIron=new THREE.MeshStandardMaterial({name:'Buried iron ligatures',color:0x293347,metalness:.48,roughness:.66});
 // Relic body: fractured mineral, not a generic glowing collectible.
 const body=mesh(core,irregularStone(.74,3,14),cobalt,0,.41,0,true);
 body.name='Fractured cobalt carapace';
 const memory=mesh(core,irregularStone(.46,2,81),mineral,0,.52,.38);
 memory.name='Exposed crystalline interior';
 // Twin interrupted metal bindings surround the blue stone.
 const ringGeom=new THREE.TorusGeometry(.845,.061,7,15,TAU/9*.77);
 ringGeom.rotateX(Math.PI/2);
 const ringSegments=new THREE.InstancedMesh(ringGeom,agedGold,16);
 const o=new THREE.Object3D();let nr=0;
 for(let layer=0;layer<2;layer++)for(let i=0;i<9;i++){
  if((i===3&&layer===0)||(i===6&&layer===1))continue;
  const a=i*TAU/9+layer*.14;
  o.position.set(0,.19+layer*.57,0);
  o.rotation.set(0,a,0);o.scale.set(layer?.92:1,1,layer?.92:1);o.updateMatrix();
  ringSegments.setMatrixAt(nr++,o.matrix);
 }
 ringSegments.count=nr;ringSegments.instanceMatrix.needsUpdate=true;
 ringSegments.name='Two fractured hand-worked bindings';core.add(ringSegments);
 // Four non-symmetrical metal anchors establish an identifiable silhouette.
 const silhouette=new THREE.Shape();
 silhouette.moveTo(-.14,-.48);silhouette.lineTo(-.23,-.11);
 silhouette.lineTo(-.17,.18);silhouette.lineTo(-.26,.51);
 silhouette.lineTo(.03,.66);silhouette.lineTo(.18,.43);
 silhouette.lineTo(.13,-.04);silhouette.lineTo(.21,-.43);
 silhouette.lineTo(-.14,-.48);
 const plate=new THREE.ExtrudeGeometry(silhouette,{depth:.07,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:1});
 for(let i=0;i<4;i++){
  const a=i*TAU/4+.16+(i%2)*.07;
  const fin=mesh(core,plate,blackIron,Math.sin(a)*.73,.42,Math.cos(a)*.73,true);
  fin.rotation.y=a;fin.rotation.z=(i%2?.05:-.07);fin.name='Original binding fin '+(i+1);
 }
 const studGeom=new THREE.IcosahedronGeometry(.047,0);
 const studs=new THREE.InstancedMesh(studGeom,agedGold,28);
 for(let i=0;i<28;i++){
  const a=i*TAU/28;
  o.position.set(Math.sin(a)*.785,.41+Math.sin(a*3)*.07,Math.cos(a)*.785);
  o.rotation.set(0,a,0);o.scale.set(1,1,.5);o.updateMatrix();studs.setMatrixAt(i,o.matrix);
 }
 studs.instanceMatrix.needsUpdate=true;studs.name='Hand-worked metal pin heads';core.add(studs);
 const cuts=new THREE.InstancedMesh(new THREE.BoxGeometry(.028,.18,.018),agedGold,16);
 for(let i=0;i<16;i++){
  const a=i*TAU/16;
  o.position.set(Math.sin(a)*.63,.39+Math.sin(a*2)*.16,Math.cos(a)*.63);
  o.rotation.set(0,a,Math.sin(a*3)*.19);o.scale.set(1,1,1);o.updateMatrix();
  cuts.setMatrixAt(i,o.matrix);
 }
 cuts.instanceMatrix.needsUpdate=true;cuts.name='Gold repairs to fractured shell';core.add(cuts);
 return {body,memory};
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
 const core=new THREE.Group();core.name='First Contact / inspectable original artifact';
 core.position.set(0,2.39,0);root.add(core);
 buildVessel(core);
 // Small light bounce. No bloom or neon. Architectural silhouette remains primary.
 const light=new THREE.PointLight(0xe8a676,.8,7,2);
 light.position.set(0,3.17,.1);root.add(light);
 return {root,core,light,ornaments};
}
