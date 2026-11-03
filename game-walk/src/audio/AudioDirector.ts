/**
 * Browser audio is owned by one director, unlocked only within an intentional
 * player gesture. No inferred/AI music, no unapproved master tracks.
 *
 * Meditate and Credo's Words are pending cleared preview files.
 */
export type PickupId='first_contact';
export class AudioDirector {
  private ctx:AudioContext|null=null;
  private output:GainNode|null=null;
  private active:AudioBufferSourceNode|null=null;
  private cache:Promise<AudioBuffer|null>|null=null;
  private muted=false;
  private token=0;
  private started=false;
  private playing=false;
  constructor(private readonly onStatus:(message:string)=>void){}
  get isMuted(){return this.muted;}
  get isPlaying(){return this.playing;}
  start():void {
    if(this.started){this.resume();return;}
    try{
      this.ctx=new AudioContext({latencyHint:'interactive'});
      const output=this.ctx.createGain();
      output.gain.value=this.muted?0:0.88;
      output.connect(this.ctx.destination);
      this.output=output;this.started=true;
      void this.ctx.resume();
      this.onStatus('Meditate preview audio pending. The entrance is currently silent.');
    }catch{
      this.onStatus('Audio is unavailable. The game remains playable.');
    }
  }
  setTravel(_value:number):void {
    // Later music-driven scenes will implement artist-approved filtering.
    // No fake score is substituted while Meditate is pending.
  }
  async playPickup(id:PickupId,finished:()=>void):Promise<void> {
    if(id!=='first_contact'){finished();return;}
    if(!this.ctx || !this.output){
      this.onStatus('First Contact preview could not start; continuing silently.');
      finished();return;
    }
    const token=++this.token;
    const context=this.ctx;
    try{
      if(!this.cache) {
        this.cache=fetch('/audio/pickup_first_contact.m4a')
          .then(async r=>{
            if(!r.ok)throw new Error('Preview audio missing');
            return await context.decodeAudioData(await r.arrayBuffer());
          }).catch(()=>null);
      }
      const buffer=await this.cache;
      if(token!==this.token)return;
      if(!buffer)throw new Error('Preview audio could not be decoded');
      await context.resume();
      const source=context.createBufferSource();
      source.buffer=buffer;
      source.connect(this.output);
      if(this.active)try{this.active.stop();}catch{}
      this.active=source;this.playing=true;
      let done=false;
      const finish=()=>{
        if(done||token!==this.token)return;
        done=true;this.playing=false;this.active=null;
        this.onStatus('First Contact preview finished');finished();
      };
      source.addEventListener('ended',finish,{once:true});
      source.start();
      this.onStatus('First Contact preview playing');
    }catch{
      this.onStatus('First Contact preview unavailable; continuing silently.');
      this.playing=false;finished();
    }
  }
  setMuted(value:boolean):void {
    this.muted=value;
    if(this.ctx && this.output)
      this.output.gain.setTargetAtTime(value?0:.88,this.ctx.currentTime,.08);
  }
  soften():void {
    if(this.ctx&&this.output)
      this.output.gain.setTargetAtTime(this.muted?0:.33,this.ctx.currentTime,.35);
  }
  pause():void{void this.ctx?.suspend();}
  resume():void{if(this.started)void this.ctx?.resume().catch(()=>{});}
  destroy():void{
    ++this.token;this.playing=false;
    if(this.active)try{this.active.stop();}catch{}
    this.active=null;void this.ctx?.close();this.ctx=null;
  }
}
