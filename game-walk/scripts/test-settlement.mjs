import assert from 'node:assert/strict';
import { NEW_SETTLEMENT, restoreSettlement, settlementTransition } from '../src/story/SettlementEncounter.ts';

let state = { ...NEW_SETTLEMENT, met: [] };
const step = event => { state = settlementTransition(state, event); };
step({ type: 'COMPLETE_REPAIR' });
assert.equal(state.repairCompleted, false, 'cannot repair before meeting anyone');
step({ type: 'MEET_RESIDENT', resident: 'caretaker' });
step({ type: 'MEET_RESIDENT', resident: 'caretaker' });
assert.equal(state.met.length, 1, 'meeting is idempotent');
step({ type: 'START_REPAIR' });
assert.equal(state.repairStarted, false, 'must listen/respond and meet repairer');
step({ type: 'RESPOND', tone: 'listen' });
step({ type: 'RESPOND', tone: 'family' });
assert.equal(state.responseTone, 'listen', 'first meaningful choice stays stable');
step({ type: 'MEET_RESIDENT', resident: 'repairer' });
step({ type: 'START_REPAIR' });
assert.equal(state.repairStarted, true);
step({ type: 'ACKNOWLEDGE_REPAIR' });
assert.equal(state.credoLeadUnlocked, false, 'must finish repair');
step({ type: 'ADJUST_FIXTURE' });
step({ type: 'ADJUST_FIXTURE' });
assert.equal(state.repairCompleted, false, 'two adjustments are not enough');
const partial = restoreSettlement(JSON.parse(JSON.stringify(state)));
assert.equal(partial.repairSteps, 2, 'partial repair survives reload');
step({ type: 'COMPLETE_REPAIR' });
assert.equal(state.repairCompleted, false, 'cannot bypass final adjustment');
step({ type: 'ADJUST_FIXTURE' });
step({ type: 'COMPLETE_REPAIR' });
assert.equal(state.repairCompleted, true);
step({ type: 'ACKNOWLEDGE_REPAIR' });
assert.equal(state.credoLeadUnlocked, true);
assert.deepEqual(restoreSettlement(state), state, 'valid save round trips');
assert.equal(restoreSettlement({ ...state, repairCompleted: false }).credoLeadUnlocked, false,
  'tampered incomplete save cannot unlock');
assert.equal(restoreSettlement({ ...state, met: [] }).repairCompleted, false,
  'cannot restore repair without both residents');
assert.equal(restoreSettlement({ ...state, version: 9 }).credoLeadUnlocked, false);
step({ type: 'RESET' });
assert.deepEqual(state, { ...NEW_SETTLEMENT, met: [] });
for (const tone of ['family', 'community', 'listen']) {
  let branch = { ...NEW_SETTLEMENT, met: [] };
  for (const event of [
    {type:'MEET_RESIDENT',resident:'caretaker'},
    {type:'RESPOND',tone},
    {type:'MEET_RESIDENT',resident:'repairer'},
    {type:'START_REPAIR'},
    {type:'ADJUST_FIXTURE'},
    {type:'ADJUST_FIXTURE'},
    {type:'ADJUST_FIXTURE'},
    {type:'COMPLETE_REPAIR'},
    {type:'ACKNOWLEDGE_REPAIR'},
  ]) branch = settlementTransition(branch, event);
  assert.equal(branch.credoLeadUnlocked,true, `branch ${tone} reaches Credo`);
}
console.log('Settlement encounter model checks passed.');
