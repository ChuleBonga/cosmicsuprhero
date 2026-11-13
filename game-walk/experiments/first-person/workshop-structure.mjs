/**
 * Arcturian Awakening — original workshop architectural look-development.
 * Opt-in ONLY with W0 art review. No named civilization, sacred ornament,
 * unexplained glowing props or third-party architectural copies.
 *
 * Aim: an inhabited repair shelter with plausible load paths, attachment
 * points, service wiring and a physically grounded task surface.
 */
import * as THREE from 'three';
import {WORKBENCH} from './waystation-layout.mjs';

const indigo=0x27334d, burgundy=0x503146, oxide=0x75634c;
const makeMaterial=(color,roughness=0.93,extra={})=>
 new THREE.MeshStandardMaterial({color,roughness,...extra});

function mesh(group,geometry,material,name,xyz,rot=null){
 const m=new THREE.Mesh(geometry,material);
 m.name=name;m.position.set(...xyz);
 if(rot)m.rotation.set(...rot);
 m.castShadow=true;m.receiveShadow=true;
 group.add(m);return m;
}
function wire(group,points,radius,material,name){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
 return mesh(group,new THREE.TubeGeometry(curve,Math.max(12,points.length*7),radius,5,false),material,name,[0,0,0]);
}
function brokenStone(name,position,radius,thickness,material,group,seed){
 // Vertices are cut from an original irregular outline rather than a
 // perfectly hexagonal primitive, with shallow bevel rings and honest thickness.
 const n=9,verts=[],indices=[];
 const twopi=Math.PI*2;
 const outline=[];
 for(let j=0;j<n;j++){
  const theta=j*twopi/n;
  const r=radius*(.82+.12*Math.sin(j*2.4+seed)+.07*Math.cos(j*4.1-seed));
  outline.push([Math.cos(theta)*r,Math.sin(theta)*r*.75]);
 }
 for(const [ring,y,scale] of [[0,thickness/2,.93],[1,thickness*.36,1],[2,-thickness/2,1]]){
  for(const [x,z] of outline)verts.push(x*scale,y,z*scale);
 }
 for(let ring=0;ring<2;ring++)for(let j=0;j<n;j++){
  const a=ring*n+j,b=ring*n+(j+1)%n,c=(ring+1)*n+j,d=(ring+1)*n+(j+1)%n;
  indices.push(a,c,b,b,c,d);
 }
 // Caps.
 for(let j=1;j<n-1;j++){indices.push(0,j,j+1);indices.push(2*n,2*n+j+1,2*n+j);}
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(indices);
 g.computeVertexNormals();
 const o=mesh(group,g,material,name,position);
 o.rotation.y=seed*.23;return o;
}
function pier(group,x,z,materials,name){
 const {stone,metal}=materials;
 // Small stone footings bury the base rather than leaving columns on a slab.
 brokenStone(name+' / embedded footing',[x,-.08,z],.33,.18,stone,group,x+z+7);
 const g=new THREE.CylinderGeometry(.115,.19,2.59,9,6,false);
 const a=g.attributes.position;
 for(let i=0;i<a.count;i++){
  const y=a.getY(i),angle=Math.atan2(a.getZ(i),a.getX(i));
  const organic=1+.025*Math.sin(angle*7+y*8+x*2);
  a.setX(i,a.getX(i)*organic);
  a.setZ(i,a.getZ(i)*(1+.023*Math.cos(angle*5+y*4)));
 }
 g.computeVertexNormals();
 mesh(group,g,stone,name+' / taper-cut upright',[x,1.28,z]);
 // Fastener and metal shoe act as an explicit connection to the cross-beam.
 const shoe=mesh(group,new THREE.CylinderGeometry(.155,.158,.135,12),metal,name+' / base shoe',[x,.18,z]);
 shoe.castShadow=false;
 mesh(group,new THREE.BoxGeometry(.25,.13,.33),metal,name+' / pegged head joint',[x,2.57,z]);
}
function canopy(group,material,seam){
 const cols=18,rows=14,points=[],uv=[],faces=[];
 for(let r=0;r<=rows;r++){
  const v=r/rows;
  for(let c=0;c<=cols;c++){
   const u=c/cols;
   const x=-1.36+u*2.72,z=-1.45+v*2.55;
   const sag=.24*Math.sin(Math.PI*u)*Math.sin(Math.PI*v);
   const wrinkle=.022*Math.sin(u*25+v*9)*Math.sin(Math.PI*v);
   const y=2.81-.10*v-sag+wrinkle;
   points.push(x,y,z);uv.push(u,v);
  }
 }
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  const a=r*(cols+1)+c,b=a+1,d=a+cols+1,e=d+1;
  faces.push(a,d,b,b,d,e);
 }
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
 g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
 g.setIndex(faces);g.computeVertexNormals();
 const fabric=mesh(group,g,material,'Tensioned weathered canopy with physical catenary sag',[0,0,0]);
 fabric.castShadow=false;fabric.receiveShadow=true;
 // Actual edge welt, lacing and reinforced corners; no fake alien glyphs.
 for(const end of [-1.45,1.1]){
  const pts=[];
  for(let i=0;i<=15;i++){
   const u=i/15,x=-1.36+u*2.72;
   const v=(end+1.45)/2.55;
   pts.push([x,2.81-.10*v-.24*Math.sin(Math.PI*u)*Math.sin(Math.PI*v),end]);
  }
  wire(group,pts,.012,seam,'Stitched tensile edge welt');
 }
 for(const x of [-1.35,1.35]){
  const pts=[];
  for(let i=0;i<=12;i++){
   const v=i/12,z=-1.45+v*2.55;
   pts.push([x,2.81-.10*v+.01*Math.sin(v*16),z]);
  }
  wire(group,pts,.012,seam,'Canopy edge binding');
 }
 return fabric;
}
export function createWorkshopStructure(parent,{stone,warm,oxide:sharedOxide}){
 const group=new THREE.Group();group.name='Original grounded repair shelter / architecture R1';parent.add(group);
 const cloth=makeMaterial(burgundy,.99,{side:THREE.DoubleSide});
 const seam=makeMaterial(0x493d4e,.95);
 const dark=makeMaterial(indigo,.90);
 const metal=makeMaterial(oxide,.58,{metalness:.23});
 const ceramic=makeMaterial(0x48516a,.86);
 const lightMaterial=makeMaterial(0xdea06a,.35,{emissive:0x9c4e29,emissiveIntensity:.5});
 const owned=[cloth,seam,dark,metal,ceramic,lightMaterial];
 // Separate embedded flags; avoids the elevated toy-podium silhouette.
 const flags=new THREE.Group();flags.name='Ground-embedded salvaged flagstones';group.add(flags);
 for(let i=0;i<13;i++){
  const x=-1.42+(i%4)*.85+.12*Math.sin(i*1.3);
  const z=-1.27+Math.floor(i/4)*.82+.11*Math.cos(i*2.9);
  brokenStone('Traffic-worn paving '+i,[x,-.075,z],.47,.095,i%3===0?warm:stone,flags,i+2);
 }
 const struct={stone,metal};
 // The front remains genuinely open for a person to work and be seen.
 for(const [x,z,name] of [[-1.38,-1.43,'west rear'],[1.36,-1.43,'east rear'],[1.36,.99,'east front'],[-1.38,.99,'west front']]){
  pier(group,x,z,struct,name);
 }
 // Continuous compression beams above four column heads, with joinery.
 mesh(group,new THREE.BoxGeometry(2.92,.17,.24),dark,'Rear load beam',[0,2.72,-1.43]);
 mesh(group,new THREE.BoxGeometry(2.92,.17,.24),dark,'Front load beam',[0,2.62,.99]);
 for(const x of [-1.36,1.36])mesh(group,new THREE.BoxGeometry(.16,.15,2.6),dark,'Longitudinal timber cap',[x,2.68,-.21]);
 // Two actually connected braces oppose canopy shear.
 for(const x of [-1.35,1.35]){
  const brace=mesh(group,new THREE.BoxGeometry(.09,.92,.12),dark,'Diagonal lateral brace',[x,2.16,-1.12]);
  brace.rotation.x=-.69;
 }
 canopy(group,cloth,seam);
 // Lower back wall: course-laid stone instead of an implausible giant panel.
 for(let row=0;row<3;row++){
  const height=.28+row*.34;
  for(let col=0;col<5;col++){
   const width=.52+(col%2)*.06;
   const x=-1.15+col*.55+(row%2)*.09;
   brokenStone('Laid rear wall stone '+row+'-'+col,[x,height,-1.48],width*.58,.25,stone,group,10+row*5+col);
  }
 }
 // Correct-height workbench. Replaces the thick orange placeholder slab only
 // in review mode; the original bench remains in the default visitor world.
 const top=mesh(group,new THREE.BoxGeometry(WORKBENCH.width,.09,WORKBENCH.depth),
   dark,'Service bench / stone-inset top',
   [WORKBENCH.localX,WORKBENCH.topY-.045,WORKBENCH.localZ]);
 top.castShadow=true;
 for(const side of [-1,1]){
  const x=WORKBENCH.localX+side*.69;
  mesh(group,new THREE.BoxGeometry(.09,.85,.10),dark,'Service bench support',[x,.60,WORKBENCH.localZ-.19]);
  mesh(group,new THREE.BoxGeometry(.09,.85,.10),dark,'Service bench support',[x,.60,WORKBENCH.localZ+.19]);
 }
 mesh(group,new THREE.BoxGeometry(1.35,.065,.075),metal,'Bench underside tie',
  [WORKBENCH.localX,.66,WORKBENCH.localZ+.27]);
 // Grounded service cable connects machine to a visible wall run and lamp.
 wire(group,[[-.38,1.24,.33],[-.56,1.20,-.04],[-1.18,1.25,-.69],[-1.3,1.69,-1.25],[-1.31,2.24,-1.38]],.009,metal,'Wired listening transport supply');
 const shade=mesh(group,new THREE.ConeGeometry(.16,.18,10),metal,
  'Hanging practical service lamp',[-.96,2.20,.22],[Math.PI,0,0]);
 shade.castShadow=false;
 mesh(group,new THREE.SphereGeometry(.055,10,8),lightMaterial,'Shielded service lamp bulb',[-.96,2.11,.22]);
 wire(group,[[-.96,2.29,.22],[-1.18,2.55,.11],[-1.35,2.55,-.6]],.009,metal,'Lamp power cable');
 const bounce=new THREE.PointLight(0xf2b588,.8,3.3,2);
 bounce.position.set(-.96,2.12,.22);
 bounce.name='Actual suspended task lamp / local illumination';
 group.add(bounce);
 // Toolbox and manually accessible components with comprehensible uses.
 const kit=mesh(group,new THREE.BoxGeometry(.49,.21,.27),metal,'Service case next to worker',
 [1.03,.18,1.40]);kit.rotation.y=-.10;
 mesh(group,new THREE.BoxGeometry(.32,.035,.22),dark,'Service case lid',[1.03,.297,1.40]);
 // Unused tool(s) in the workstation, independent of the W0 held probe.
 for(let k=0;k<3;k++){
  const x=.65+k*.14;
  mesh(group,new THREE.CylinderGeometry(.009,.018,.20,8),metal,'Physical hand tool',[
   x,1.16,WORKBENCH.localZ+.22],[Math.PI/2,.14*k,0]);
 }
 let disposed=false;
 return {
  root:group,
  dispose(){
   if(disposed)return;disposed=true;
   for(const m of owned)m.dispose();
   group.parent?.remove(group);
  }
 };
}
