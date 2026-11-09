import test from 'node:test';
import assert from 'node:assert/strict';
import {RELAY,TAPE,newJourney,availableAction,doJourneyAction,journeyStatus} from './journey-actions.mjs';
test('journey begins without possessions and is not gate-locked',()=>{
 assert.deepEqual(newJourney(),{collected:false,installed:false,inspected:false});
 assert.equal(availableAction({x:0,z:23.5},newJourney()),null);
});
test('First Contact is a discoverable cassette in world space',()=>{
 const p={x:TAPE.x+3.8,z:TAPE.z};
 assert.equal(availableAction(p,newJourney(),true)?.id,'examine');
 assert.equal(availableAction(p,newJourney(),false)?.id,'examine');
 assert.equal(availableAction({x:TAPE.x+8,z:TAPE.z},newJourney(),true),null);
});
test('cannot pocket tape before examining, or install before taking it',()=>{
 let s=newJourney();
 assert.equal(doJourneyAction(s,'collect').changed,false);
 assert.equal(doJourneyAction(s,'install').changed,false);
 const a=doJourneyAction(s,'inspect');assert.equal(a.changed,true);
 assert.equal(a.state.inspected,true);
 const b=doJourneyAction(a.state,'collect');assert.equal(b.changed,true);
 assert.equal(b.state.collected,true);
});
test('relay installation is a player-triggered musical-artefact action',()=>{
 let s=doJourneyAction(newJourney(),'inspect').state;
 s=doJourneyAction(s,'collect').state;
 assert.equal(availableAction({x:RELAY.x,z:RELAY.z},s)?.id,'install');
 assert.equal(availableAction({x:RELAY.x,z:RELAY.z-9},s),null);
 s=doJourneyAction(s,'install').state;
 assert.equal(s.installed,true);
 assert.equal(availableAction({x:RELAY.x,z:RELAY.z},s),null);
 assert.match(journeyStatus(s),/SIGNAL RESTORED/);
});
test('actions are idempotent and do not mutate prior state',()=>{
 const original=newJourney();
 const inspected=doJourneyAction(original,'inspect').state;
 assert.equal(original.inspected,false);
 const collected=doJourneyAction(inspected,'collect').state;
 assert.equal(doJourneyAction(collected,'collect').changed,false);
 assert.equal(doJourneyAction(collected,'inspect').changed,false);
});
test('there are no forced audio tracks besides the theme',()=>{
 assert.equal(journeyStatus(newJourney()),'NO MEDIA RECOVERED');
 assert.equal('First Contact'!=='Awaken Now',true);
});
