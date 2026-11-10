/**
 * Arcturian Awakening / First Contact — an original grounded found object. Built from reusable THREE geometries and instances.
 *
 * Contract: origin at the existing encounter collider (world-logic.mjs),
 * +Y up, 1 unit = 1 metre. The relic rests in eroded ground with roadway
 * fragments; taller ruined structures remain outside the walking corridor.
 * No downloaded scans, third-party models, or unrelated game iconography.
 */
import * as THREE from 'three';

export const CONTACT_SPEC=Object.freeze({
  findRadius:1.06, coreScale:.76, coreRestHeight:.45,
  debrisRadius:4.8
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
/** Fragmented old footpath, not a ceremonial ring announcing the find.
 * Near-flush pieces intentionally keep the physical ground walkable. */
function outerPaving(root,stone,warm,groundHeight,originX,originY,originZ){
 const geom=new THREE.BoxGeometry(.88,.085,.72,2,1,2),dummy=new THREE.Object3D();
 const groups=[];
 for(let lane=0;lane<2;lane++){
  const group=new THREE.InstancedMesh(geom,lane===0?stone:warm,32);let written=0;
  for(let i=0;i<34;i++){
   if((i*11+lane*7)%13<3)continue;
   const drift=Math.sin(i*2.3+lane*1.17);
   const x=(lane===0?-1:1)*(1.6+.23*drift),z=-5.5+i*.33+.11*Math.sin(i*.87+lane);
   const y=groundHeight(originX+x,originZ+z)-originY-.043;
   dummy.position.set(x,y,z);
   dummy.rotation.set(0,.11*Math.sin(i*.79+lane),0);
   dummy.scale.set(.73+(i%4)*.09,1,.72+(i%3)*.09);dummy.updateMatrix();
   group.setMatrixAt(written++,dummy.matrix);
  }
  group.count=written;group.instanceMatrix.needsUpdate=true;
  group.receiveShadow=true;group.castShadow=false;
  group.name='Partly buried roadway fragments '+lane;
  root.add(group);groups.push(group);
 }
 return groups;
}
/** Eroded fragments around the fallen object: physically short stones rather
 * than a perfect circular shrine or newly invented glyph marks. */
function groundWear(root,stone,warm,groundHeight,originX,originY,originZ){
 const group=new THREE.Group();group.name='Ground-level fall and erosion';root.add(group);
 const geometry=new THREE.DodecahedronGeometry(.22,0),dummy=new THREE.Object3D();
 for(let kind=0;kind<2;kind++){
  const scatter=new THREE.InstancedMesh(geometry,kind?warm:stone,30);
  for(let i=0;i<30;i++){
   const a=i*2.39996+kind*.74,r=.95+(i%7)*.39;
   const x=Math.cos(a)*r,z=Math.sin(a)*r*.85;
   const y=groundHeight(originX+x,originZ+z)-originY-.025;
   dummy.position.set(x,y,z);
   dummy.rotation.set(i*.31,i*1.13,i*.29);
   dummy.scale.set(.46+(i%4)*.18,.1+(i%3)*.04,.48+(i%5)*.13);
   dummy.updateMatrix();scatter.setMatrixAt(i,dummy.matrix);
  }
  scatter.instanceMatrix.needsUpdate=true;
  scatter.receiveShadow=true;scatter.castShadow=false;
  scatter.name='Low fragmented stone and dust '+kind;group.add(scatter);
 }
 return group;
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
  // The ruin is damaged and asymmetrical, not a paired altar stage.
  main.scale.setScalar(side===-1?.37:.57);
  main.rotation.y=side*.24;
  main.rotation.z=side===-1?-.22:.27;
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
 // Floor discovery: no giant stand, raised metal seat or stone crown.
 const ornaments=groundWear(root,stone,warm,groundHeight,x,ground,z);
 outerPaving(root,stone,warm,groundHeight,x,ground,z);
 structuralWings(root,stone,oxide,groundHeight,x,z,ground,halfWidth);
 const core=new THREE.Group();core.name='First Contact / fallen inspectable artifact';
 core.position.set(.15,CONTACT_SPEC.coreRestHeight,.15);
 core.rotation.set(.04,.13,1.05);
 core.scale.setScalar(CONTACT_SPEC.coreScale);
 root.add(core);
 buildVessel(core);
 const light=new THREE.PointLight(0xe8a676,.18,3.5,2);
 light.position.set(0,.65,.1);root.add(light);
 return {root,core,light,ornaments};
}
