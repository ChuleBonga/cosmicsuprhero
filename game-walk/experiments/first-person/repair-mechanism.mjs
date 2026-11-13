/**
 * Original physical repair study: exposed magnetic transport / mechanical spindle.
 * Review-only. W0's hands do not yet physically grip this mechanism.
 * The work cycle changes the mechanism's motion, making occupation visible.
 */
import * as THREE from 'three';
import {WORKBENCH} from './waystation-layout.mjs';

export function createRepairMechanism(station,materials){
 const {oxide,warm,stone}=materials;
 const root=new THREE.Group();
 root.name='W0 mechanical workpiece (not approved game canon)';
 root.position.set(WORKBENCH.localX,WORKBENCH.centerY+.16,WORKBENCH.localZ);
 station.add(root);
 const add=(geometry,material,name,x,y,z)=>{
  const obj=new THREE.Mesh(geometry,material);
  obj.name=name;obj.position.set(x,y,z);obj.receiveShadow=true;root.add(obj);return obj;
 };
 // Open physical workpiece on a real bench, rather than a hovering artifact.
 add(new THREE.BoxGeometry(.54,.045,.31),oxide,'Heavy transport chassis',0,.014,0);
 const spin=new THREE.Group();spin.name='Visible mechanical drive shafts';spin.position.y=.069;root.add(spin);
 for(const [i,x] of [-.155,.155].entries()){
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.022,.022,.062,14),stone);
  shaft.name='Mechanical drive shaft '+i;shaft.position.set(x,.008,0);spin.add(shaft);
  const reel=new THREE.Mesh(new THREE.TorusGeometry(.099,.014,8,24),warm);
  reel.name='Spool rim '+i;reel.rotation.x=Math.PI/2;reel.position.set(x,.047,0);spin.add(reel);
  for(let spoke=0;spoke<4;spoke++){
   const bar=new THREE.Mesh(new THREE.BoxGeometry(.17,.009,.013),stone);
   bar.name='Radial reel spoke';
   bar.position.set(x,.047,0);bar.rotation.y=spoke*Math.PI/4;spin.add(bar);
  }
 }
 const axle=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.47,10),stone);
 axle.rotation.z=Math.PI/2;axle.position.set(0,.057,0);root.add(axle);
 // Needle / idler physically travels when a work cycle is interrupted.
 const lever=add(new THREE.BoxGeometry(.016,.016,.13),warm,'Analog idler lever',.03,.105,.112);
 lever.rotation.y=.28;
 const state={rpm:0,rotations:0,updates:0,interrupted:false};
 let disposed=false;
 return {
  root,
  getState(){return {...state};},
  update(worker,dt){
   if(disposed)return;
   if(!(dt>0&&Number.isFinite(dt)))return;
   const active=worker.phase==='working';
   const target=active?1.8:0;
   state.rpm=THREE.MathUtils.lerp(state.rpm,target,Math.min(1,dt*(active?1.9:6)));
   const turn=state.rpm*Math.min(dt,.05);
   // Each spool has a physically separate axis; rotation reflects drive engagement.
   spin.children.forEach((child,i)=>{
    if(child.name.startsWith('Spool rim'))child.rotation.y+=turn*(i%2?-.9:1);
    else if(child.name.startsWith('Radial'))child.rotation.y+=turn;
   });
   state.rotations+=Math.abs(turn);
   state.interrupted=!active;
   state.updates++;
   lever.rotation.y=THREE.MathUtils.lerp(lever.rotation.y,active?.24:-.5,Math.min(1,dt*5));
  },
  dispose(){
   if(disposed)return;
   disposed=true;
   root.traverse(o=>{if(o.geometry)o.geometry.dispose()});
   root.parent?.remove(root);
  }
 };
}
