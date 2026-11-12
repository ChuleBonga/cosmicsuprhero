/**
 * W0 non-canonical NPC silhouette, deliberately isolated to art review.
 * Original mesh construction, no external image/texture or borrowed symbols.
 * This PROXY is not the authored final GLB and must not be promoted without G1/G2.
 */
import * as THREE from 'three';
import {WORKER_POS} from './worker-routine.mjs';
const PI=Math.PI;
const mat=(color,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
function add(group,geometry,material,name,x=0,y=0,z=0,scale=null){
 const m=new THREE.Mesh(geometry,material);m.name=name;m.position.set(x,y,z);
 if(scale)m.scale.set(...scale);
 m.castShadow=true;m.receiveShadow=true;group.add(m);return m;
}
function ellipsoid(group,name,mat,x,y,z,sx,sy,sz,segments=20){
 return add(group,new THREE.SphereGeometry(1,segments,12),mat,name,x,y,z,[sx,sy,sz]);
}
function lathe(group,name,material,stops){
 return add(group,new THREE.LatheGeometry(stops.map(([r,y])=>new THREE.Vector2(r,y)),24),material,name);
}
function fabricPanel(group,material,name){
 // Asymmetrical work wrap with an actually hanging hem, not ceremonial marks.
 const verts=[],inds=[];
 const rows=7,cols=8;
 for(let i=0;i<rows;i++){
  const t=i/(rows-1);
  for(let j=0;j<cols;j++){
   const u=j/(cols-1);
   const x=-.20+u*(.31+.045*t)+.018*Math.sin(u*11+t*7);
   const y=1.36-t*.57+.012*Math.sin(u*19+t*10);
   const z=.065+t*.11+.035*Math.sin(u*4+t*3);
   verts.push(x,y,z);
  }
 }
 for(let i=0;i<rows-1;i++)for(let j=0;j<cols-1;j++){
  const a=i*cols+j,b=a+1,c=a+cols,d=c+1;
  inds.push(a,c,b,b,c,d);
 }
 const geo=new THREE.BufferGeometry();
 geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
 geo.setIndex(inds);geo.computeVertexNormals();
 return add(group,geo,material,name);
}
export function createWorkerProxy(scene,groundHeight){
 const garment=mat(0x263653),faded=mat(0x3b4a68),apron=mat(0x9b7b58);
 const cloth=mat(0x66374f),skin=mat(0x3c6d81,.84),cheek=mat(0x59849a,.88);
 const shadow=mat(0x1d3656),eye=mat(0x101a2b,.38),sole=mat(0x222437),metal=mat(0x927554,.6);
 const soft=cloth.clone();soft.side=THREE.DoubleSide;
 const root=new THREE.Group();root.name='W0 resident — review proxy, not approved';
 root.position.set(WORKER_POS.x,groundHeight(WORKER_POS.x,WORKER_POS.z),WORKER_POS.z);
 scene.add(root);
 for(const side of [-1,1]){
  const leg=lathe(root,'Utility trouser leg',[garment,faded][side<0?0:1],[[.078,.13],[.080,.29],[.085,.57],[.096,.81]]);
  leg.position.x=side*.102;
  ellipsoid(root,'Weathered footwear',sole,side*.102,.084,-.042,.093,.078,.149);
 }
 lathe(root,'Draped field tunic',garment,[[.172,.80],[.185,.94],[.170,1.12],[.217,1.34],[.17,1.43]]);
 lathe(root,'Utility apron',apron,[[.160,.74],[.165,.84],[.161,.99],[.145,1.04]]).scale.z=.35;
 add(root,new THREE.BoxGeometry(.34,.056,.045),cloth,'Stitched work belt',0,.98,-.12);
 fabricPanel(root,soft,'Weathered shoulder wrap');
 ellipsoid(root,'Neck',skin,0,1.425,-.01,.063,.092,.058);
 const head=new THREE.Group();head.position.set(0,1.631,-.01);root.add(head);
 ellipsoid(head,'Elongated blue-green cranium',skin,0,.014,0,.120,.193,.103,32);
 for(const side of [-1,1]){
  ellipsoid(head,'Cheekbone volume',cheek,side*.069,-.015,-.071,.051,.046,.036);
  ellipsoid(head,'Brow ridge',shadow,side*.05,.057,-.092,.049,.012,.018);
  ellipsoid(head,'Dark eye',eye,side*.050,.036,-.107,.028,.015,.009);
  ellipsoid(head,'Ear structure',skin,side*.115,-.024,.002,.018,.039,.02);
 }
 ellipsoid(head,'Nasal bridge',cheek,0,-.016,-.10,.025,.053,.019);
 ellipsoid(head,'Nose',skin,0,-.058,-.113,.029,.020,.02);
 ellipsoid(head,'Lower lip',cheek,0,-.101,-.103,.036,.009,.012);
 const armGroups=[];
 for(const side of [-1,1]){
  const arm=new THREE.Group();arm.position.set(side*.197,1.321,0);root.add(arm);
  arm.name=side<0?'RIG_worker_arm_left':'RIG_worker_arm_right';
  ellipsoid(arm,'Worn sleeve',garment,side*.025,-.135,0,.073,.183,.072);
  ellipsoid(arm,'Blue hand',skin,side*.048,-.340,-.014,.047,.076,.044);
  add(arm,new THREE.BoxGeometry(.1,.04,.098),cloth,'Wrist cuff',side*.048,-.288,-.012);
  armGroups.push(arm);
 }
 const right=armGroups[1],left=armGroups[0];
 add(right,new THREE.CylinderGeometry(.012,.015,.21,10),metal,'Handheld service tool',.065,-.43,-.032).rotation.x=.31;
 const idleAngle=Math.atan2(1.13,.45);
 root.rotation.y=idleAngle;
 let currentAngle=idleAngle;
 return {
  root,
  update(state,player,dt){
   const looking=state.phase==='noticing'||state.phase==='acknowledging';
   const target=looking?Math.atan2(player.x-WORKER_POS.x,player.z-WORKER_POS.z)+PI:idleAngle;
   // Root faces -Z in local coordinates: choose yaw without sudden flips.
   const diff=Math.atan2(Math.sin(target-currentAngle),Math.cos(target-currentAngle));
   currentAngle+=diff*Math.min(1,dt*2.2);
   root.rotation.y=currentAngle;
   const motion=state.phase==='working'?.12+.14*Math.sin(state.elapsed*3.5):state.phase==='acknowledging'?.48:.07;
   right.rotation.x=motion;right.rotation.z=-.06;
   left.rotation.x=state.phase==='acknowledging'?.20:.02;
   head.rotation.y=looking?.06*Math.sin(state.elapsed*2):.025*Math.sin(state.elapsed*.6);
  },
  dispose(){
   const geometries=new Set();
   root.traverse(o=>{if(o.isMesh)geometries.add(o.geometry)});
   for(const g of geometries)g.dispose();
   for(const m of [garment,faded,apron,cloth,skin,cheek,shadow,eye,sole,metal,soft])m.dispose();
   root.parent?.remove(root);
  }
 };
}
