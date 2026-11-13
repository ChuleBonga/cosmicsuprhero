import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createRepairMechanism} from './repair-mechanism.mjs';
import {WORKBENCH} from './waystation-layout.mjs';
test('mechanical workpiece is physical, workbench sized and not a floating discovery',()=>{
 const station=new THREE.Group(),m=new THREE.MeshStandardMaterial(),g=createRepairMechanism(station,{oxide:m,warm:m,stone:m});
 assert.equal(g.root.parent,station);
 assert.equal(g.root.position.x,WORKBENCH.localX);
 assert.equal(g.root.position.z,WORKBENCH.localZ);
 assert.ok(g.root.position.y>WORKBENCH.centerY);
 const box=new THREE.Box3().setFromObject(g.root),size=box.getSize(new THREE.Vector3());
 assert.ok(size.x<WORKBENCH.width && size.z<WORKBENCH.depth);
 assert.ok(g.root.getObjectByName('Analog idler lever'));
 g.dispose();assert.equal(g.root.parent,null);
});
test('worker independently drives mechanism, visitor interruption stops it and return resumes it',()=>{
 const g=createRepairMechanism(new THREE.Group(),{oxide:new THREE.MeshStandardMaterial(),warm:new THREE.MeshStandardMaterial(),stone:new THREE.MeshStandardMaterial()});
 let s={phase:'working'};
 for(let i=0;i<180;i++)g.update(s,1/60);
 let a=g.getState();assert.ok(a.rpm>1.6&&a.rotations>0);
 s={phase:'noticing'};
 for(let i=0;i<180;i++)g.update(s,1/60);
 const b=g.getState();assert.ok(b.rpm<.001);assert.equal(b.interrupted,true);
 s={phase:'working'};
 for(let i=0;i<180;i++)g.update(s,1/60);
 const c=g.getState();assert.ok(c.rpm>1.6&&c.rotations>b.rotations);
 g.dispose();
});
