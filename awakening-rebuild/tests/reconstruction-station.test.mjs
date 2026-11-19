import assert from 'node:assert/strict';
import {INITIAL,transition,SOLUTION,FRAGMENTS} from '../src/encounter.ts';
import {STATION_POSITION,STATION_RANGE,canUseStation,selectedStationOrder,stationSlot} from '../src/world/ReconstructionLogic.ts';
const heard=['caretaker','courier','apprentice'].reduce((state,witness)=>
 transition(state,{type:'HEAR',witness}),INITIAL);
assert.equal(heard.phase,'reconstruct');
assert.equal(canUseStation({x:16.9,z:13.5},heard),true);
assert.equal(canUseStation({x:10,z:13.5},heard),false);
assert.equal(canUseStation({x:16.9,z:13.5},INITIAL),false);
assert.equal(STATION_RANGE,2.25);
assert.deepEqual(STATION_POSITION,{x:16.9,z:12.4});
let order=[];
for(const input of [FRAGMENTS[1],FRAGMENTS[2],FRAGMENTS[0]]){
 order=selectedStationOrder(order,input);
}
assert.deepEqual(order,SOLUTION);
assert.equal(stationSlot(order,FRAGMENTS[1]),0);
assert.equal(stationSlot(order,FRAGMENTS[0]),2);
assert.deepEqual(selectedStationOrder(order,FRAGMENTS[1]),[FRAGMENTS[2],FRAGMENTS[0]]);
assert.deepEqual(selectedStationOrder(order,FRAGMENTS[1]),[FRAGMENTS[2],FRAGMENTS[0]]);
assert.deepEqual(selectedStationOrder([],FRAGMENTS[0]),[FRAGMENTS[0]]);
let state=transition(heard,{type:'ARRANGE',order});
assert.equal(state.phase,'reconstruct');
state=transition(state,{type:'SUBMIT'});
assert.equal(state.phase,'decide');
assert.deepEqual(state.order,SOLUTION);
console.log('Physical chronology instrument: station access, keyboard/touch order, remove, slot and reducer agreement passed');
