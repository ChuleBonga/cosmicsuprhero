import { INITIAL_JOURNEY, restoreJourney, transition } from '../story/JourneyMachine';
import type { JourneyState, JourneyStage, JourneyEvent } from '../story/JourneyMachine';
export type MemoryId = 'first_contact';
const KEY='arcturian.opening.preview.v3';
export class ProgressManager {
  private state: JourneyState={...INITIAL_JOURNEY,discovered:[]};
  constructor(){
    try{const raw=localStorage.getItem(KEY);if(raw)this.state=restoreJourney(JSON.parse(raw));}
    catch{ /* Play remains available without storage. */ }
  }
  get stage():JourneyStage{return this.state.stage;}
  get distance(){return this.state.distance;}
  get muted(){return this.state.muted;}
  get portalOpen(){return this.state.portalOpen;}
  has(id:MemoryId){return this.state.discovered.includes(id);}
  advance(event:JourneyEvent){this.state=transition(this.state,event);this.save();}
  discover(id:MemoryId){if(this.has(id))return false;this.advance('FIRST_CONTACT_RECOVERED');return this.has(id);}
  setDistance(d:number){
    if(Number.isFinite(d))this.state.distance=Math.max(this.state.distance,Math.min(120000,Math.max(0,d)));
  }
  setMuted(v:boolean){this.state.muted=v;this.save();}
  reset(){this.advance('RESET');}
  save(){try{localStorage.setItem(KEY,JSON.stringify(this.state));}catch{/*memory-only*/}}
}
