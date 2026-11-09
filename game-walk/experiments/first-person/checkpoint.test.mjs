import test from 'node:test';
import assert from 'node:assert/strict';
import {CHECKPOINT_KEY,CHECKPOINT_TTL,makeCheckpoint,validateCheckpoint,readCheckpoint,writeCheckpoint,eraseCheckpoint} from './checkpoint.mjs';
const memory=()=>{const m=new Map();return {
 getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k),has:k=>m.has(k)
}};
const sample=()=>makeCheckpoint({x:.3,z:-42},.42,-.1,{inspected:true,collected:true,installed:false},1_000_000);
test('only nonpersonal position and artifact progress are stored',()=>{
 const s=sample();assert.deepEqual(Object.keys(s).sort(),
 ['collected','inspected','installed','pitch','savedAt','version','x','yaw','z'].sort());
 assert.ok(!JSON.stringify(s).includes('Awaken Now'));
});
test('session checkpoint is recoverable but expires after twelve hours',()=>{
 const storage=memory(),record=sample();
 assert.equal(writeCheckpoint(storage,record),true);
 assert.deepEqual(readCheckpoint(storage,1_000_001)?.journey,{inspected:true,collected:true,installed:false});
 assert.equal(readCheckpoint(storage,1_000_000+CHECKPOINT_TTL+1),null);
 assert.equal(eraseCheckpoint(storage),true);assert.equal(storage.has(CHECKPOINT_KEY),false);
});
test('malformed, impossible and contradictory saves cannot restore',()=>{
 const r=sample();
 for(const change of [{x:Infinity},{z:999},{yaw:NaN},{version:2},
 {installed:true,collected:false},{collected:true,inspected:false},
 {savedAt:0},{pitch:8}]){
  assert.equal(validateCheckpoint({...r,...change},1_000_050),null,JSON.stringify(change));
 }
});
test('private mode storage errors and corrupt JSON do not break exploration',()=>{
 const broken={getItem(){throw Error('denied')},setItem(){throw Error('denied')},removeItem(){throw Error('denied')}};
 assert.equal(readCheckpoint(broken),null);
 assert.equal(writeCheckpoint(broken,sample()),false);
 assert.equal(eraseCheckpoint(broken),false);
 const storage=memory();storage.setItem(CHECKPOINT_KEY,'{bad');
 assert.equal(readCheckpoint(storage),null);
});
