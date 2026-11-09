import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createCassetteArt,createRelayArt,CASSETTE_SCALE} from './cassette-art.mjs';

test('music medium has physical cassette dimensions and album metadata',()=>{
 const tape=createCassetteArt();
 assert.equal(tape.userData.media,'cassette');
 assert.equal(tape.userData.track,'First Contact');
 assert.equal(tape.userData.album,'Arcturian Awakening');
 assert.equal(tape.userData.playsAudio,false);
 assert.ok(tape.userData.physicalWidthMeters>.13&&tape.userData.physicalWidthMeters<.16);
 assert.equal(CASSETTE_SCALE,.095);
 assert.ok(tape.getObjectByName('FIRST CONTACT / COSMICSUPRHERO label'));
});
test('reel details are instanced for mobile drawing performance',()=>{
 const tape=createCassetteArt();
 assert.equal(tape.getObjectByName('Twelve reel spokes')?.count,12);
 assert.equal(tape.getObjectByName('Shell screws')?.count,4);
 let directMeshes=0,instanced=0;
 tape.traverse(o=>{if(o.isInstancedMesh)instanced++;else if(o.isMesh)directMeshes++;});
 assert.ok(instanced>=5);
 assert.ok(directMeshes<=5,'avoid dozens of individual reel spoke draw calls');
});
test('physical tape has finite, nondegenerate 3D geometry',()=>{
 const tape=createCassetteArt();
 let total=0;
 tape.traverse(o=>{
  if(!o.isMesh)return;
  const pos=o.geometry?.attributes?.position;
  assert.ok(pos&&pos.count>0);
  total+=pos.count;
  for(let i=0;i<pos.count;i++){
   assert.ok(Number.isFinite(pos.getX(i))&&Number.isFinite(pos.getY(i))&&Number.isFinite(pos.getZ(i)));
  }
 });
 assert.ok(total>100);
});
test('relay receives same recognizable cassette model and is initially empty',()=>{
 const parent=new THREE.Group();
 const relay=createRelayArt(parent,2.15,-82,1.2);
 assert.deepEqual([relay.root.position.x,relay.root.position.y,relay.root.position.z],[2.15,1.2,-82]);
 assert.equal(relay.inserted.visible,false);
 assert.equal(relay.inserted.name,'First Contact cassette installed in relay');
 assert.ok(relay.inserted.getObjectByName('FIRST CONTACT / COSMICSUPRHERO label'));
 assert.equal(relay.light.intensity,0);
});
