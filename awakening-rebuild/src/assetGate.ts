import * as THREE from 'three';
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Technical screening before visual review. Passing these conditions DOES NOT
 * mean the character looks good or resembles the approved references.
 */
export interface AssetReview {
  acceptableForArtReview: boolean;
  warnings: string[];
  metrics: { skinnedMeshes: number; bones: number; clips: string[]; height: number };
}
export function inspectNpc(gltf: Pick<GLTF,'scene'|'animations'>):AssetReview {
  const warnings:string[]=[];
  const skinned:THREE.SkinnedMesh[]=[];
  let textured=false;
  gltf.scene.traverse((object)=>{
    if(object instanceof THREE.SkinnedMesh){
      skinned.push(object);
      const materials=Array.isArray(object.material)?object.material:[object.material];
      if(materials.some((m)=>m instanceof THREE.MeshStandardMaterial && m.map!==null))textured=true;
    }
  });
  const bones=skinned.reduce((n,s)=>Math.max(n,s.skeleton?.bones.length??0),0);
  const clips=gltf.animations.map(a=>a.name);
  const normalized=clips.map(c=>c.toLowerCase());
  const bounds=new THREE.Box3().setFromObject(gltf.scene);
  const dimensions=new THREE.Vector3();
  bounds.getSize(dimensions);
  const height=dimensions.y;
  if(skinned.length<1)warnings.push('No skinned humanoid mesh');
  if(bones<18)warnings.push('Insufficient facial/body articulation for production review');
  if(!textured)warnings.push('No mapped PBR material on character');
  if(!normalized.some(c=>c.includes('idle')))warnings.push('Idle performance missing');
  if(!normalized.some(c=>c.includes('walk')))warnings.push('Locomotion performance missing');
  if(!normalized.some(c=>c.includes('talk')||c.includes('speak')||c.includes('gesture')))
    warnings.push('Conversational performance missing');
  if(!Number.isFinite(height)||height<1||height>3.2)
    warnings.push('Character scale not within the calibrated world range');
  return {
    acceptableForArtReview:warnings.length===0,
    warnings,
    metrics:{skinnedMeshes:skinned.length,bones,clips,height}
  };
}
