/**
 * The ACTUAL Blender-authored W0 model.
 * Loaded only on ?art-review=inhabitants; the public game never requests its GLB.
 * W0 is unapproved character look-development, not production NPC canon.
 */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import workerAssetUrl from './assets/w0-worker-r3-review.glb?url';
import {WORKER_POS} from './worker-routine.mjs';

function faceToward(a,b,progress){
 const difference=Math.atan2(Math.sin(b-a),Math.cos(b-a));
 return a+difference*progress;
}
export async function loadWorkerGLB(scene,groundHeight){
 const gltf=await new GLTFLoader().loadAsync(workerAssetUrl);
 const model=gltf.scene;
 if(!model||gltf.animations.length!==3)throw Error('W0 rig clips absent from GLB');
 const found=[];
 const meshes=[];
 model.traverse(o=>{
  if(o.name)found.push(o.name);
  if(o.isMesh){
   meshes.push(o);
   o.castShadow=true;o.receiveShadow=true;
  }
 });
 for(const required of ['BODY_elongated_cranium','RIG_L_arm','RIG_R_arm','PROP_mechanical_service_probe']){
  if(!found.includes(required))throw Error('W0 model missing '+required);
 }
 if(meshes.length!==41)throw Error('W0 expected 41 meshes, got '+meshes.length);
 const box=new THREE.Box3().setFromObject(model);
 const height=box.max.y-box.min.y;
 if(!Number.isFinite(height)||height<1.6||height>2.2)throw Error('W0 incorrect physical height: '+height);
 const mount=new THREE.Group();
 mount.name='W0 original GLB / art-review only';
 mount.add(model);
 mount.position.set(WORKER_POS.x,groundHeight(WORKER_POS.x,WORKER_POS.z)-box.min.y,WORKER_POS.z);
 scene.add(mount);
 const mixer=new THREE.AnimationMixer(model);
 const actions=gltf.animations.map(clip=>{
  const a=mixer.clipAction(clip);
  a.setLoop(THREE.LoopRepeat,Infinity);
  a.clampWhenFinished=false;
  a.setEffectiveWeight(1);
  a.play();
  return a;
 });
 let angle=0;
 let disposed=false;
 const ownedGeometries=new Set(),ownedMaterials=new Set();
 for(const mesh of meshes){
  ownedGeometries.add(mesh.geometry);
  if(Array.isArray(mesh.material))mesh.material.forEach(m=>ownedMaterials.add(m));
  else if(mesh.material)ownedMaterials.add(mesh.material);
 }
 return {
  root:mount,
  model,
  diagnostic:{source:'Blender GLB W0 r3',meshes:meshes.length,clips:gltf.animations.map(c=>c.name),heightM:+height.toFixed(3),groundClearance:+(mount.position.y+box.min.y-groundHeight(WORKER_POS.x,WORKER_POS.z)).toFixed(4),bytes:361816},
  update(state,player,dt){
   if(disposed||!(dt>0))return;
   const working=state.phase==='working';
   const desiredWeight=working?1:0;
   for(const action of actions){
    const weight=action.getEffectiveWeight();
    action.setEffectiveWeight(THREE.MathUtils.lerp(weight,desiredWeight,Math.min(1,dt*4)));
   }
   mixer.update(Math.min(dt,.05));
   const attending=state.phase==='noticing'||state.phase==='acknowledging';
   const dx=player.x-WORKER_POS.x,dz=player.z-WORKER_POS.z;
   // The original character faces its workshop (-Z) when not addressing anyone.
   const target=attending?Math.atan2(-dx,-dz):0;
   angle=faceToward(angle,target,Math.min(1,dt*2.3));
   mount.rotation.y=angle;
  },
  dispose(){
   if(disposed)return;
   disposed=true;
   mixer.stopAllAction();
   mount.parent?.remove(mount);
   for(const g of ownedGeometries)g.dispose();
   for(const m of ownedMaterials)m.dispose();
  }
 };
}
