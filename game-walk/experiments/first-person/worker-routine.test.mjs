import test from 'node:test';
import assert from 'node:assert/strict';
import {initialWorkerState,workerDistance,canAcknowledgeWorker,stepWorkerRoutine,acknowledgeWorker,WORKER_POS} from './worker-routine.mjs';

function tick(state,seconds,distance){
 for(let i=0;i<Math.round(seconds*60);i++)state=stepWorkerRoutine(state,1/60,distance);
 return state;
}
test('worker has autonomous repair work without the player',()=>{
 const state=tick(initialWorkerState(),13,100);
 assert.equal(state.phase,'working');
 assert.ok(state.workCycles>=2,'should cycle task independently');
 assert.equal(state.acknowledgements,0);
});
test('worker notices visitor then returns to work when visitor leaves',()=>{
 let s=stepWorkerRoutine(initialWorkerState(),1/60,3.5);
 assert.equal(s.phase,'noticing');
 s=tick(s,1.2,6);
 assert.equal(s.phase,'working');
});
test('interaction requires line of attention and distance',()=>{
 const player={x:WORKER_POS.x+2.5,z:WORKER_POS.z};
 assert.ok(workerDistance(player)>2);
 const yaw=-Math.PI/2;
 assert.ok(canAcknowledgeWorker(player,yaw));
 assert.equal(canAcknowledgeWorker(player,Math.PI/2),false);
 assert.equal(canAcknowledgeWorker({x:0,z:30},yaw),false);
 let s=stepWorkerRoutine(initialWorkerState(),1/60,2.5);
 assert.strictEqual(acknowledgeWorker(s,player,Math.PI/2),s);
 s=acknowledgeWorker(s,player,yaw);
 assert.equal(s.phase,'acknowledging');
 assert.equal(s.acknowledgements,1);
 s=tick(s,1.7,2.5);
 assert.equal(s.phase,'returning');
 s=tick(s,1.2,6);
 assert.equal(s.phase,'working');
});
test('cannot repeatedly acknowledge during one response',()=>{
 const p={x:WORKER_POS.x+2,z:WORKER_POS.z},yaw=-Math.PI/2;
 let s=stepWorkerRoutine(initialWorkerState(),1/60,2);
 s=acknowledgeWorker(s,p,yaw);
 assert.strictEqual(acknowledgeWorker(s,p,yaw),s);
 assert.equal(s.acknowledgements,1);
});
test('invalid timestep and distance are rejected',()=>{
 assert.throws(()=>stepWorkerRoutine(initialWorkerState(),0,1),RangeError);
 assert.throws(()=>stepWorkerRoutine(initialWorkerState(),.05,1),RangeError);
 assert.throws(()=>stepWorkerRoutine(initialWorkerState(),1/60,Infinity),RangeError);
});
