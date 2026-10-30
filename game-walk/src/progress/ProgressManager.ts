export type MemoryId='first_contact'|'xaba'|'mama_calls_me_chule'|'songs_sent_to_god';
export interface SaveData{version:1;distance:number;discovered:MemoryId[];muted:boolean}
const KEY='arcturian.walkeval.v1';
export class ProgressManager{
  private state:SaveData={version:1,distance:0,discovered:[],muted:false};
  constructor(){try{const raw=localStorage.getItem(KEY);if(raw){const d=JSON.parse(raw) as Partial<SaveData>;if(d.version===1){this.state={version:1,distance:Math.min(3000,Math.max(0,Number(d.distance)||0)),discovered:Array.isArray(d.discovered)?d.discovered.filter(x=>['first_contact','xaba','mama_calls_me_chule','songs_sent_to_god'].includes(x)):[],muted:d.muted===true}}}}catch{ /* Browsers may block storage. Session play still works. */ }}
  get distance(){return this.state.distance}
  get muted(){return this.state.muted}
  has(id:MemoryId){return this.state.discovered.includes(id)}
  setDistance(value:number){this.state.distance=Math.max(this.state.distance,Math.min(3000,Math.max(0,value)))}
  discover(id:MemoryId){if(this.has(id))return false;this.state.discovered.push(id);this.save();return true}
  setMuted(value:boolean){this.state.muted=value;this.save()}
  reset(){this.state={version:1,distance:0,discovered:[],muted:false};this.save()}
  save(){try{localStorage.setItem(KEY,JSON.stringify(this.state))}catch{ /* Keep in-memory state. */ }}
}
