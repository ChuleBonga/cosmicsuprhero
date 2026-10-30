export type WalkProgress={distance:number;firstContact:boolean;awakening:number};
export class ProgressManager{
 private state:WalkProgress={distance:0,firstContact:false,awakening:0};
 constructor(){try{const raw=localStorage.getItem("arcturian-walk-v1");if(raw){const stored=JSON.parse(raw);if(typeof stored?.distance==="number"&&typeof stored?.firstContact==="boolean")this.state={distance:Math.max(0,Math.min(2400,stored.distance)),firstContact:stored.firstContact,awakening:Math.max(0,Math.min(1,Number(stored.awakening)||0))};}}catch{}}
 get snapshot(){return {...this.state};}
 setDistance(x:number){this.state.distance=Math.max(0,Math.min(2400,x));this.state.awakening=Math.max(this.state.awakening,this.state.distance/2400);this.persist();}
 recoverFirstContact(){this.state.firstContact=true;this.persist();}
 reset(){this.state={distance:0,firstContact:false,awakening:0};this.persist();}
 private persist(){try{localStorage.setItem("arcturian-walk-v1",JSON.stringify(this.state));}catch{}}
}
