/**
 * W0 original Blender resident: isolated art/animation QA, NOT approved canon.
 * This is one visually inspectable actor only; it does not substitute for
 * three authored civilians, convincing facial acting, or a finished settlement.
 */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import type {Point} from './DistrictSimulation.ts';
import type {State} from '../encounter.ts';

export const W0_SITE:Readonly<Point>=Object.freeze({x:16.1,z:14.5});
export const W0_INTERACTION_RANGE=2.25;
export type ResidentReviewAction='working'|'noticing'|'acknowledging'|'returning'|'public_listening';
export type ResidentReview={
 readonly root:THREE.Group;
 readonly diagnostics:{readonly meshes:number;readonly clips:readonly string[];readonly heightM:number;readonly approval:'unapproved'};
 readonly action:()=>ResidentReviewAction;
 readonly cycles:()=>number;
 readonly canApproach:(player:Point)=>boolean;
 readonly acknowledge:(player:Point)=>boolean;
 readonly update:(story:State,player:Point,dt:number)=>void;
 readonly dispose:()=>void;
};

export function residentReviewDistance(player:Point):number {
 return Number.isFinite(player.x)&&Number.isFinite(player.z)
  ? Math.hypot(player.x-W0_SITE.x,player.z-W0_SITE.z):Infinity;
}
export function residentReviewCanApproach(player:Point):boolean {
 return residentReviewDistance(player)<=W0_INTERACTION_RANGE;
}
function turnToward(current:number,target:number,amount:number):number {
 const turn=Math.atan2(Math.sin(target-current),Math.cos(target-current));
 return current+turn*Math.min(1,Math.max(0,amount));
}

export async function loadW0Resident(scene:THREE.Scene):Promise<ResidentReview>{
 const gltf=await new GLTFLoader().loadAsync('/models/W0-original-unapproved-review.glb');
 if(!gltf.scene||gltf.animations.length!==3)throw new Error('W0 original animation clips not found');
 const root=new THREE.Group();
 root.name='W0 unapproved, one original resident for review';
 const model=gltf.scene;
 const names=new Set<string>();
 const meshes:THREE.Mesh[]=[];
 model.traverse(obj=>{
  if(obj.name)names.add(obj.name);
  if(obj instanceof THREE.Mesh){
   meshes.push(obj);obj.castShadow=true;obj.receiveShadow=true;
  }
 });
 for(const name of ['BODY_elongated_cranium','RIG_L_arm','RIG_R_arm','PROP_mechanical_service_probe']){
  if(!names.has(name))throw new Error('W0 original rig missing '+name);
 }
 if(meshes.length!==41)throw new Error('W0 unexpected mesh count: '+meshes.length);
 const bounds=new THREE.Box3().setFromObject(model);
 const height=bounds.max.y-bounds.min.y;
 if(!Number.isFinite(height)||height<1.6||height>2.2)throw new Error('W0 scale invalid: '+height);
 root.add(model);
 root.position.set(W0_SITE.x,-bounds.min.y,W0_SITE.z);
 scene.add(root);

 const mixer=new THREE.AnimationMixer(model);
 const clips=gltf.animations.map(clip=>{
  const action=mixer.clipAction(clip);
  action.setLoop(THREE.LoopRepeat,Infinity);
  action.setEffectiveWeight(1);
  action.play();
  return action;
 });
 let action:ResidentReviewAction='working';
 let elapsed=0,cycles=0,heading=0,disposed=false;
 const ownedGeometries=new Set<THREE.BufferGeometry>();
 const ownedMaterials=new Set<THREE.Material>();
 for(const mesh of meshes){
  ownedGeometries.add(mesh.geometry);
  if(Array.isArray(mesh.material))mesh.material.forEach(m=>ownedMaterials.add(m));
  else ownedMaterials.add(mesh.material);
 }
 return {
  root,
  diagnostics:{meshes:meshes.length,clips:gltf.animations.map(a=>a.name),heightM:+height.toFixed(3),approval:'unapproved'},
  action:()=>action,
  cycles:()=>cycles,
  canApproach:residentReviewCanApproach,
  acknowledge(player){
   if(disposed||!residentReviewCanApproach(player))return false;
   action='acknowledging';elapsed=0;return true;
  },
  update(story,player,dt){
   if(disposed||!Number.isFinite(dt)||dt<=0)return;
   // Life continues without input: the worker makes repeatable work cycles.
   // Moving the unapproved rig without a valid walk clip would cause foot slide.
   elapsed+=Math.min(.05,dt);
   const near=residentReviewDistance(player)<3.25;
   const publicRecord=story.phase==='complete'&&story.choice==='disclose';
   // Later world-state is visible as work stopping: no invented walk cycle.
   if(publicRecord&&action==='working'){action='public_listening';elapsed=0;}
   else if(!publicRecord&&action==='public_listening'){action='working';elapsed=0;}
   if(action==='working'){
    if(elapsed>=6){cycles+=Math.floor(elapsed/6);elapsed%=6;}
    if(near){action='noticing';elapsed=0;}
   }else if(action==='public_listening'){
    if(near){action='noticing';elapsed=0;}
   }else if(action==='noticing'){
    if(!near){action='returning';elapsed=0;}
   }else if(action==='acknowledging'){
    if(elapsed>=1.5){action='returning';elapsed=0;}
   }else if(elapsed>=1){
    action=near?'noticing':publicRecord?'public_listening':'working';elapsed=0;
   }
   const active=action==='working';
   for(const clip of clips){
    const weight=clip.getEffectiveWeight();
    clip.setEffectiveWeight(THREE.MathUtils.lerp(weight,active?1:0,Math.min(1,dt*4)));
   }
   mixer.update(Math.min(.05,dt));
   // The original actor faces its task by default. Attending turns it toward
   // Chule, rather than producing stock dialogue or duplicated NPC proxies.
   const target=(near||action==='acknowledging')
    ? Math.atan2(-(player.x-W0_SITE.x),-(player.z-W0_SITE.z))
    : action==='public_listening'
      ? Math.atan2(W0_SITE.x-15,W0_SITE.z-8):0;
   heading=turnToward(heading,target,dt*2.2);
   root.rotation.y=heading;
   // The role of this actor and its final performances remain undecided.
   root.userData.storyPhase=story.phase;
   root.userData.recordIsPublic=publicRecord;
   root.userData.reviewAction=action;
  },
  dispose(){
   if(disposed)return;disposed=true;mixer.stopAllAction();
   root.parent?.remove(root);
   for(const geometry of ownedGeometries)geometry.dispose();
   for(const material of ownedMaterials)material.dispose();
  }
 };
}
