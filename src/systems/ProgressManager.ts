import type { TrackId } from '../config/tracks';
export interface GameSave { version:2; position:number; encounter:'prologue'|'name'|'complete'; found:TrackId[]; motes:number; awake:number }
const STORE='aa-game-vertical-slice-v2';
const initial:GameSave={version:2,position:160,encounter:'prologue',found:[],motes:0,awake:0};
export class ProgressManager {
  data:GameSave={...initial,found:[]};
  constructor(){try{const saved=JSON.parse(localStorage.getItem(STORE)||'null') as Partial<GameSave>|null;
    if(saved?.version===2){this.data={...initial,...saved,found:Array.isArray(saved.found)?saved.found.filter(id=>['first-contact','xaba','mama','songs-to-god'].includes(id)):[]};}}
    catch{/* Browsers can deny storage; gameplay must continue. */}}
  update(patch:Partial<GameSave>){this.data={...this.data,...patch};this.flush();}
  add(id:TrackId){if(!this.data.found.includes(id))this.update({found:[...this.data.found,id]});}
  reset(){this.data={...initial,found:[]};this.flush();}
  private flush(){try{localStorage.setItem(STORE,JSON.stringify(this.data))}catch{/* Private browsing must remain playable. */}}
}
export const progress=new ProgressManager();
