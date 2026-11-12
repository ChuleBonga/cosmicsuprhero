import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const source=new URL('./assets/w0-worker-r3-review.glb',import.meta.url);
const bytes=readFileSync(source);
const buffer=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
const gltf=await new Promise((resolve,reject)=>{
 const loader=new GLTFLoader();
 loader.parse(buffer,'',resolve,reject);
});
test('authored W0 GLB parses with the same Three.js loader used by the browser',()=>{
 assert.ok(gltf.scene);
 const meshes=[];
 gltf.scene.traverse(o=>{if(o.isMesh)meshes.push(o)});
 assert.equal(meshes.length,41);
 for(const name of ['BODY_elongated_cranium','RIG_L_arm','RIG_R_arm','PROP_mechanical_service_probe'])assert.ok(gltf.scene.getObjectByName(name),name);
 assert.ok(!gltf.scene.getObjectByName('STUDIO_only_ground'));
 const bounds=new THREE.Box3().setFromObject(gltf.scene);
 const height=bounds.max.y-bounds.min.y;
 assert.ok(Number.isFinite(height)&&height>1.60&&height<2.20,'W0 physical height '+height);
});
test('Blender-authored animation clips survive the complete glTF parse',()=>{
 assert.equal(gltf.animations.length,3);
 const rig=gltf.scene.getObjectByName('RIG_R_arm');
 const before=rig.quaternion.clone();
 const mixer=new THREE.AnimationMixer(gltf.scene);
 for(const clip of gltf.animations){
  assert.ok(clip.tracks.length>0,clip.name);
  assert.ok(clip.duration>1&&clip.duration<6,clip.name+' duration '+clip.duration);
  mixer.clipAction(clip).play();
 }
 mixer.update(.9);
 assert.ok(rig.quaternion.angleTo(before)>.01,'the authored working arm must actually move');
 mixer.stopAllAction();
});
test('each glTF character mesh has a usable physical material and finite bounds',()=>{
 const box=new THREE.Box3();
 gltf.scene.updateWorldMatrix(true,true);
 gltf.scene.traverse(o=>{
  if(!o.isMesh)return;
  assert.ok(o.material, o.name+' missing material');
  box.setFromObject(o);
  for(const n of [...box.min.toArray(),...box.max.toArray()])assert.ok(Number.isFinite(n),o.name);
 });
});
