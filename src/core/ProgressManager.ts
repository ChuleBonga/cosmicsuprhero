import { TRACK_IDS, type PickupId, type SceneKey } from '../data/tracks';
export interface SaveState {version:1; scene:SceneKey; checkpoint:string; awakening:number; unlocked:PickupId[]; updatedAt:number;}
const KEY='cosmicsuprhero.arcturian.preview.save.v1';
const baseline=():SaveState=>({version:1,scene:'Title',checkpoint:'start',awakening:0,unlocked:[],updatedAt:Date.now()});
const validScene=new Set<SceneKey>(['Boot','Title','Prologue','EncounterName','EncounterVoice','EncounterFaith','Finale','FreeRoam']);
const allowed=new Set<string>(TRACK_IDS);
const clamp=(n:number)=>Math.min(1,Math.max(0,Number.isFinite(n)?n:0));
export class ProgressManager{
 private state:SaveState=baseline();
 private listeners=new Set<(s:SaveState)=>void>();
 readonly storageAvailable:boolean;
 constructor(private storage:Pick<Storage,'getItem'|'setItem'|'removeItem'>|null=typeof localStorage==='undefined'?null:localStorage){
  let available=false;
  try{if(storage){const k=KEY+'.probe';storage.setItem(k,'1');storage.removeItem(k);available=true;}}catch{}
  this.storageAvailable=available;
  this.load();
 }
 get snapshot():SaveState{return {...this.state,unlocked:[...this.state.unlocked]};}
 subscribe(listener:(state:SaveState)=>void):()=>void{this.listeners.add(listener);listener(this.snapshot);return()=>this.listeners.delete(listener);}
 hasPickup(id:PickupId){return this.state.unlocked.includes(id);}
 unlock(id:PickupId){
  if(!allowed.has(id)||this.hasPickup(id))return;
  this.state.unlocked.push(id);
  this.state.awakening=clamp(Math.max(this.state.awakening,this.state.unlocked.length/4));
  this.save();
 }
 setAwakening(value:number){this.state.awakening=clamp(value);this.save();}
 reach(scene:SceneKey,checkpoint:string){if(!validScene.has(scene))return;this.state.scene=scene;this.state.checkpoint=checkpoint.slice(0,80);this.save();}
 reset(){this.state=baseline();this.save();}
 private load(){
  if(!this.storageAvailable||!this.storage)return;
  try{
   const raw=this.storage.getItem(KEY);if(!raw)return;
   const parsed:unknown=JSON.parse(raw);if(!parsed||typeof parsed!=='object')return;
   const data=parsed as Record<string,unknown>;
   if(data.version!==1)return;
   const scene=validScene.has(data.scene as SceneKey)?data.scene as SceneKey:'Title';
   const unlocked=Array.isArray(data.unlocked)?[...new Set(data.unlocked.filter((t):t is PickupId=>typeof t==='string'&&allowed.has(t)))]:[];
   this.state={version:1,scene,checkpoint:typeof data.checkpoint==='string'?data.checkpoint.slice(0,80):'start',awakening:clamp(typeof data.awakening==='number'?data.awakening:0),unlocked,updatedAt:typeof data.updatedAt==='number'?data.updatedAt:Date.now()};
  }catch{this.state=baseline();}
 }
 private save(){
  this.state.updatedAt=Date.now();
  if(this.storageAvailable&&this.storage){try{this.storage.setItem(KEY,JSON.stringify(this.state));}catch{}}
  const copy=this.snapshot;for(const listener of this.listeners){try{listener(copy);}catch{}}
 }
}
