/** Best-effort, session-local continuation for short mobile WebGL visits.
 * No identifiers, audio, analytics, cookies or album listening history.
 */
export const CHECKPOINT_KEY='arcturian-awakening:preview-checkpoint:v1';
export const CHECKPOINT_TTL=12*60*60*1000;
const validNumber=(x,a,b)=>typeof x==='number'&&Number.isFinite(x)&&x>=a&&x<=b;
export function makeCheckpoint(state,yaw,pitch,journey,now=Date.now()){
 return {
  version:1,savedAt:now,
  x:state.x,z:state.z,yaw,pitch,
  inspected:Boolean(journey.inspected),
  collected:Boolean(journey.collected),
  installed:Boolean(journey.installed)
 };
}
export function validateCheckpoint(data,now=Date.now()){
 if(!data||data.version!==1||
   !validNumber(data.savedAt,0,now+60_000)||now-data.savedAt>CHECKPOINT_TTL||
   !validNumber(data.x,-8,8)||!validNumber(data.z,-112,26)||
   !validNumber(data.yaw,-1e6,1e6)||!validNumber(data.pitch,-1.05,.93)||
   typeof data.inspected!=='boolean'||typeof data.collected!=='boolean'||
   typeof data.installed!=='boolean'||data.installed&&!data.collected||
   data.collected&&!data.inspected)return null;
 return {x:data.x,z:data.z,yaw:data.yaw,pitch:data.pitch,
  journey:{inspected:data.inspected,collected:data.collected,installed:data.installed}};
}
export function readCheckpoint(storage,now=Date.now()){
 try{const raw=storage?.getItem(CHECKPOINT_KEY);return raw?validateCheckpoint(JSON.parse(raw),now):null;}
 catch{return null;}
}
export function writeCheckpoint(storage,data){
 try{storage?.setItem(CHECKPOINT_KEY,JSON.stringify(data));return Boolean(storage);}catch{return false;}
}
export function eraseCheckpoint(storage){
 try{storage?.removeItem(CHECKPOINT_KEY);return true;}catch{return false;}
}
