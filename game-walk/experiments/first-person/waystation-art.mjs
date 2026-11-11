// Arcturian Awakening: a human-scale repair shelter along the old causeway.
// Material evidence of a lived-in world, not a named site or approved narrative.
import * as THREE from 'three';
import {WAYSTATION} from './world-logic.mjs';
const add=(root,g,material,name,x,y,z)=>{
 const mesh=new THREE.Mesh(g,material);
 mesh.name=name;mesh.position.set(x,y,z);
 mesh.castShadow=false;mesh.receiveShadow=true;root.add(mesh);return mesh;
};
const brokenBox=(w,h,d,seed)=>{
 const g=new THREE.BoxGeometry(w,h,d,3,1,3),p=g.attributes.position;
 for(let i=0;i<p.count;i++){
  const n=(Math.sin(i*2.17+seed)+Math.cos(i*.83-seed))*.013;
  p.setXYZ(i,p.getX(i)+(p.getX(i)>=0?n:-n),p.getY(i)+(p.getY(i)>0?n*.5:0),p.getZ(i)+(p.getZ(i)>=0?n:-n));
 }
 p.needsUpdate=true;g.computeVertexNormals();return g;
};
export function createWaystation(parent,{groundHeight,stone,warm,oxide}){
 const {x,z,radius}=WAYSTATION,y=groundHeight(x,z);
 if(!Number.isFinite(y))throw Error('Waystation must stand on finite terrain');
 const root=new THREE.Group();root.name='Weathered roadside listening and repair shelter';
 root.position.set(x,y,z);parent.add(root);
 // Rectangular construction, ordinary scale and asymmetrical storm damage.
 add(root,brokenBox(3.5,.12,3.7,1),stone,'Buried working floor',0,-.04,0);
 const wall=add(root,brokenBox(.28,2.9,3.55,2),stone,'Weathered rear wall',-1.58,1.38,0);
 wall.rotation.z=-.023;
 add(root,brokenBox(.35,3.05,.35,3),stone,'Remaining canopy support',1.26,1.48,-1.25);
 const fallen=add(root,brokenBox(.39,.95,.42,4),stone,'Collapsed canopy support',1.18,.43,1.18);
 fallen.rotation.z=.14;
 const roof=add(root,brokenBox(2.86,.23,1.62,5),stone,'Sheltering roof fragment',-.19,3.02,-.93);
 roof.rotation.z=-.065;
 const canopy=add(root,brokenBox(2.01,.18,.92,6),warm,'Damaged canopy repair',-.58,2.96,1.1);
 canopy.rotation.x=.07;canopy.rotation.z=-.08;
 // A bench, repaired audio chassis, folds of fabric and storage vessels.
 add(root,brokenBox(1.67,.16,.78,7),warm,'Listening workbench',-.35,1.02,.34);
 for(const side of [-1,1])add(root,brokenBox(.14,.88,.52,8+side),stone,'Workbench leg',-.35+side*.64,.53,.34);
 add(root,brokenBox(.93,.29,.48,11),oxide,'Unpowered repairable listening shell',-.38,1.29,.31);
 add(root,new THREE.BoxGeometry(.48,.024,.05),warm,'Scratched chassis contact rail',-.4,1.49,.59);
 const slots=new THREE.InstancedMesh(new THREE.BoxGeometry(.077,.014,.022),stone,6);
 slots.name='Physical ventilation slots';
 const d=new THREE.Object3D();
 for(let i=0;i<6;i++){
  d.position.set(-.67+i*.12,1.37,.574);d.rotation.set(0,0,.01*(i%2?1:-1));
  d.updateMatrix();slots.setMatrixAt(i,d.matrix);
 }
 slots.instanceMatrix.needsUpdate=true;root.add(slots);
 const fabric=new THREE.MeshStandardMaterial({color:0x684354,roughness:1,side:THREE.DoubleSide});
 const folded=add(root,brokenBox(.69,.028,.83,12),fabric,'Folded weathered cloth',.18,1.18,.29);
 folded.rotation.y=-.1;
 add(root,new THREE.CylinderGeometry(.18,.24,.59,10),oxide,'Everyday storage vessel',.57,.28,1.27);
 const tipped=add(root,new THREE.CylinderGeometry(.15,.19,.47,10),warm,'Tipped storage vessel',-.82,.17,1.37);
 tipped.rotation.z=1.21;
 // Flush irregular stone repairs show traffic between the old road and station.
 const tiles=new THREE.InstancedMesh(brokenBox(.75,.06,.54,15),warm,10);
 tiles.name='Roadside walking repairs';
 for(let i=0;i<10;i++){
  const lx=2.27+.08*Math.sin(i*.9),lz=-3.52+i*.78;
  d.position.set(lx,groundHeight(x+lx,z+lz)-y-.037,lz);
  d.rotation.set(0,.1*Math.sin(i*.8),0);
  d.scale.set(.8+(i%3)*.12,1,.82+(i%2)*.15);
  d.updateMatrix();tiles.setMatrixAt(i,d.matrix);
 }
 tiles.instanceMatrix.needsUpdate=true;tiles.castShadow=false;tiles.receiveShadow=true;root.add(tiles);
 return {root,footprintRadius:radius,dispose(){fabric.dispose()}};
}
