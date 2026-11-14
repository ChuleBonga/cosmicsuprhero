import assert from 'node:assert/strict';
import { INITIAL, replay, transition, SOLUTION, FRAGMENTS } from '../src/encounter.ts';
import * as THREE from 'three';
import { inspectNpc } from '../src/assetGate.ts';
assert.notDeepEqual(FRAGMENTS,SOLUTION,'evidence order must not give away solution');
const emptyModel=inspectNpc({scene:new THREE.Group(),animations:[]});
assert.equal(emptyModel.acceptableForArtReview,false,'empty scene is never a valid NPC');
assert.ok(emptyModel.warnings.some(w=>w.includes('No skinned')));
const hear=(state,witness)=>transition(state,{type:'HEAR',witness});
let state=INITIAL;
assert.equal(transition(state,{type:'SUBMIT'}),state,'cannot skip listening');
state=hear(state,'caretaker');
state=hear(state,'courier');
state=hear(state,'courier');
assert.deepEqual(state.heard,['caretaker','courier'],'same conversation counted once');
state=hear(state,'apprentice');
assert.equal(state.phase,'reconstruct');
const wrong=transition(state,{type:'ARRANGE',order:['silence','shelter','departure']});
const failed=transition(wrong,{type:'SUBMIT'});
assert.equal(failed.phase,'reconstruct');
assert.equal(failed.trust,1);
const fixed=transition(failed,{type:'ARRANGE',order:[...SOLUTION]});
const solved=transition(fixed,{type:'SUBMIT'});
assert.equal(solved.phase,'decide');
const privateEnd=transition(solved,{type:'CHOOSE',choice:'protect'});
const publicEnd=transition(solved,{type:'CHOOSE',choice:'disclose'});
assert.equal(privateEnd.phase,'complete');
assert.equal(publicEnd.phase,'complete');
assert.notEqual(privateEnd.choice,publicEnd.choice,'choices create different persistent outcomes');
assert.equal(transition(privateEnd,{type:'HEAR',witness:'caretaker'}),privateEnd);
assert.equal(replay([{type:'CHOOSE',choice:'protect'}]).phase,'hear','invalid choice cannot skip investigation');
assert.equal(replay([{type:'ARRANGE',order:['departure','departure']}]).phase,'hear');
assert.equal(replay([{type:'UNKNOWN'}]),INITIAL);
assert.equal(replay(Array(101).fill({type:'SUBMIT'})),INITIAL);
const history=[
  {type:'HEAR',witness:'caretaker'},
  {type:'HEAR',witness:'courier'},
  {type:'HEAR',witness:'apprentice'},
  {type:'ARRANGE',order:[...SOLUTION]},
  {type:'SUBMIT'},
  {type:'CHOOSE',choice:'disclose'}
];
assert.deepEqual(replay(JSON.parse(JSON.stringify(history))).phase,'complete','save history roundtrip');
assert.equal(replay(history).choice,'disclose');
console.log('Narrative and NPC asset gates passed');
