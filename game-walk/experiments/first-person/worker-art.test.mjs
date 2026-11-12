import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createWorkerProxy} from './worker-art.mjs';
import {initialWorkerState,WORKER_POS} from './worker-routine.mjs';
import {groundHeight} from './world-logic.mjs';
test('review-only NPC has finite geometry and a plausible human-scale silhouette',()=>{
 const scene=new THREE.Scene(),w=createWorkerProxy(scene,groundHeight);
 assert.equal(w.root.position.x,WORKER_POS.x);
 assert.equal(w.root.position.z,WORKER_POS.z);
 const meshes=[];w.root.traverse(o=>{if(o.isMesh)meshes.push(o)});
 assert.ok(meshes.length>15&&meshes.length<80);
 for(const o of meshes){const p=o.geometry.attributes.position;assert.ok(p&&p.count>0,o.name);for(let i=0;i<p.count;i++)assert.ok(Number.isFinite(p.getX(i))&&Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)),o.name);}
 const b=new THREE.Box3().setFromObject(w.root),height=b.max.y-b.min.y;
 assert.ok(height>1.65&&height<2.15,'Ordinary-person scale '+height);
 for(const name of ['Dark eye','Draped field tunic','Handheld service tool'])assert.ok(meshes.some(m=>m.name===name),name);
 w.update(initialWorkerState(),{x:0,z:-77},1/60);
 w.dispose();assert.equal(scene.children.includes(w.root),false);
});
