import assert from 'node:assert/strict';
import { INITIAL, SOLUTION, transition } from '../src/encounter.ts';
import {canInteract,DISTRICT_RULES,residentPose,worldFrame} from '../src/world/DistrictSimulation.ts';

function ending(choice,wrong=0){
  let s=INITIAL;
  for(const witness of ['caretaker','courier','apprentice'])
    s=transition(s,{type:'HEAR',witness});
  for(let n=0;n<wrong;n++){
    s=transition(s,{type:'ARRANGE',order:['silence','shelter','departure']});
    s=transition(s,{type:'SUBMIT'});
  }
  s=transition(s,{type:'ARRANGE',order:[...SOLUTION]});
  s=transition(s,{type:'SUBMIT'});
  return transition(s,{type:'CHOOSE',choice});
}
const protect=ending('protect'), disclose=ending('disclose'), lowTrust=ending('protect',2);
const before=worldFrame(INITIAL,15);
assert.equal(before.residents.length,3);
assert.equal(before.objects.length,3);
assert.deepEqual(before.accessibleLocations,[]);
assert.equal(before.objects[0].state,'damaged');
const privateWorld=worldFrame(protect,15);
const publicWorld=worldFrame(disclose,15);
assert.ok(privateWorld.accessibleLocations.includes('hall'));
assert.ok(!privateWorld.accessibleLocations.includes('refuge'));
assert.ok(publicWorld.accessibleLocations.includes('refuge'));
assert.ok(!publicWorld.accessibleLocations.includes('hall'));
const caretakerPrivate=residentPose('caretaker',protect,15);
const caretakerPublic=residentPose('caretaker',disclose,15);
assert.equal(caretakerPrivate.action,'offer_help');
assert.equal(caretakerPublic.action,'refuse_help');
assert.ok(Math.hypot(caretakerPrivate.x-caretakerPublic.x,caretakerPrivate.z-caretakerPublic.z)>3);
assert.equal(publicWorld.objects[0].state,'public');
assert.equal(privateWorld.objects[1].state,'private');
assert.equal(publicWorld.objects[1].state,'public');
assert.equal(residentPose('courier',disclose,15).action,'greet');
assert.equal(residentPose('apprentice',disclose,16).action,'public_listening');
assert.equal(residentPose('apprentice',protect,16).action,'inspect');
assert.equal(canInteract({x:caretakerPrivate.x,z:caretakerPrivate.z},caretakerPrivate),true);
assert.equal(canInteract({x:29,z:19},caretakerPrivate),false);
assert.equal(canInteract({x:NaN,z:0},caretakerPrivate),false);
assert.equal(canInteract({x:caretakerPublic.x,z:caretakerPublic.z},residentPose('caretaker',ending('disclose',2),15)),false);
const lower=worldFrame(lowTrust,15);
assert.ok(!lower.accessibleLocations.includes('hall'),'unearned trust removes the physical hall route');
assert.equal(lower.residents[0].action,'refuse_help');
for(const state of [INITIAL,protect,disclose,lowTrust]){
  for(const id of ['caretaker','courier','apprentice']){
    for(const t of [0,4.25,9,15,22,27.1,31.9,93.7]){
      const a=residentPose(id,state,t),b=residentPose(id,state,t+32);
      assert.ok(Math.abs(a.x-b.x)<1e-9 && Math.abs(a.z-b.z)<1e-9,
        'authored routines must cycle without accumulating drift');
      assert.ok(a.x>=DISTRICT_RULES.minX && a.x<=DISTRICT_RULES.maxX);
      assert.ok(a.z>=DISTRICT_RULES.minZ && a.z<=DISTRICT_RULES.maxZ);
    }
  }
  for(let t=0;t<32;t+=.5){
    const actors=worldFrame(state,t).residents;
    for(let i=0;i<actors.length;i++)for(let j=i+1;j<actors.length;j++){
      const separation=Math.hypot(actors[i].x-actors[j].x,actors[i].z-actors[j].z);
      assert.ok(separation>1.2,'residents overlap at '+t+'s: '+actors[i].actor+' / '+actors[j].actor);
    }
  }
}
assert.equal(worldFrame(disclose,Infinity).elapsedSeconds,0);
console.log('District behavior: real space, schedules, outcomes and interaction gates passed');
