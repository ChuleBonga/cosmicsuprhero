/**
 * Small meaningful action loop: discover a physical music cassette, take it,
 * then optionally place it into an ancient listening relay. No quest locks.
 * First Contact is an album-associated *artifact*, not a second music track.
 */
export const RELAY=Object.freeze({x:0,z:-82,radius:2.9});
export const TAPE=Object.freeze({x:-.9,z:-35,radius:4.65});
export function newJourney(){return {collected:false,installed:false,inspected:false};}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function availableAction(player,journey,touch=false){
 if(!journey.collected&&distance(player,TAPE)<=(touch?4.65:4.1))
  return {id:'examine',label:'EXAMINE TAPE',detail:'FIRST CONTACT / CASSETTE'};
 if(journey.collected&&!journey.installed&&distance(player,RELAY)<=RELAY.radius)
  return {id:'install',label:'INSERT TAPE',detail:'SUNWARD SIGNAL RELAY'};
 return null;
}
export function doJourneyAction(journey,action){
 const s={...journey};
 if(action==='inspect'&&!s.collected){s.inspected=true;return {state:s,changed:true};}
 if(action==='collect'&&!s.collected&&s.inspected){s.collected=true;return {state:s,changed:true};}
 if(action==='install'&&s.collected&&!s.installed){s.installed=true;return {state:s,changed:true};}
 return {state:s,changed:false};
}
export function journeyStatus(journey){
 if(journey.installed)return 'FIRST CONTACT / SIGNAL RESTORED';
 if(journey.collected)return 'FIRST CONTACT / CASSETTE RECOVERED';
 if(journey.inspected)return 'FIRST CONTACT / EXAMINED';
 return 'NO MEDIA RECOVERED';
}
