/**
 * Small meaningful action loop: discover a physical music cassette, take it,
 * then optionally place it into an ancient listening relay. No quest locks.
 * First Contact is an album-associated *artifact*, not a second music track.
 */
// Physical points of contact, not the centres of their monumental colliders.
export const RELAY=Object.freeze({x:2.15,z:-82,radius:1.95});
export const TAPE=Object.freeze({x:-.9,z:-32.72,radius:1.85});
export function newJourney(){return {collected:false,installed:false,inspected:false};}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function targetInReach(player,target,range,yaw,touch){
 const d=distance(player,target);
 if(!Number.isFinite(d)||d>range)return false;
 // Avoid a "press R1 anywhere within four metres" interaction. A touch
 // player gets a wide cone and no precision raycast requirement.
 if(!Number.isFinite(yaw)||d<.25)return true;
 const dot=(Math.sin(yaw)*(target.x-player.x)-Math.cos(yaw)*(target.z-player.z))/d;
 return dot>=(touch?-.1:.2);
}
export function availableAction(player,journey,touch=false,yaw=null){
 if(!journey.collected&&targetInReach(player,TAPE,touch?TAPE.radius:1.5,yaw,touch))
  return {id:'examine',label:'EXAMINE TAPE',detail:'FIRST CONTACT / CASSETTE'};
 if(journey.collected&&!journey.installed&&targetInReach(player,RELAY,RELAY.radius,yaw,touch))
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
