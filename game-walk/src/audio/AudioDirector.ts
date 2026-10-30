export type PickupId='first_contact'|'xaba';
export class AudioDirector {
  private ctx:AudioContext|null=null;
  private score:HTMLAudioElement|null=null;
  private lowpass:BiquadFilterNode|null=null;
  private sheen:BiquadFilterNode|null=null;
  private musicGain:GainNode|null=null;
  private pickupGain:GainNode|null=null;
  private widthMatrix:GainNode[]=[];
  private buffers=new Map<PickupId,Promise<AudioBuffer|null>>();
  private started=false;
  private muted=false;
  private pickupActive=false;
  private maxTravel=0;
  private queuedPickup=0;
  constructor(private readonly onStatus:(message:string)=>void){}
  get isPlaying(){return Boolean(this.score&&!this.score.paused)}
  get isMuted(){return this.muted}
  start():void{
    if(this.started){void this.ctx?.resume();return}
    this.started=true;
    try{
      const ctx=new AudioContext({latencyHint:'interactive'});this.ctx=ctx;
      const score=new Audio('/audio/score_awaken_now_loop.m4a');this.score=score;
      score.loop=true;score.preload='none';score.crossOrigin='anonymous';
      const source=ctx.createMediaElementSource(score);
      const low=ctx.createBiquadFilter();this.lowpass=low;low.type='lowpass';low.frequency.value=420;low.Q.value=.65;
      const high=ctx.createBiquadFilter();this.sheen=high;high.type='highshelf';high.frequency.value=2700;high.gain.value=-7;
      const musicGain=ctx.createGain();this.musicGain=musicGain;musicGain.gain.value=.29;
      const pickupGain=ctx.createGain();this.pickupGain=pickupGain;pickupGain.gain.value=.92;
      const split=ctx.createChannelSplitter(2),merge=ctx.createChannelMerger(2);
      const a=ctx.createGain(),b=ctx.createGain(),c=ctx.createGain(),d=ctx.createGain();
      this.widthMatrix=[a,b,c,d];
      source.connect(low).connect(high).connect(split);
      split.connect(a,0);split.connect(b,1);split.connect(c,0);split.connect(d,1);
      a.connect(merge,0,0);b.connect(merge,0,0);c.connect(merge,0,1);d.connect(merge,0,1);
      merge.connect(musicGain).connect(ctx.destination);
      pickupGain.connect(ctx.destination);
      this.setTravel(0);this.setMuted(this.muted);
      for(const key of ['first_contact','xaba'] as PickupId[]){
        this.buffers.set(key,fetch('/audio/pickup_'+key+'.m4a')
          .then(r=>{if(!r.ok)throw new Error('audio not found');return r.arrayBuffer()})
          .then(data=>ctx.decodeAudioData(data)).catch(()=>null));
      }
      score.addEventListener('error',()=>this.onStatus('Score unavailable. You can continue silently.'));
      void ctx.resume();
      void score.play().then(()=>this.onStatus('Awaken Now — awakening')).catch(()=>this.onStatus('Tap again to enable audio. Walking remains available.'));
    }catch{this.onStatus('Audio unavailable. Walking remains available.')}
  }
  setTravel(value:number):void{
    this.maxTravel=Math.max(this.maxTravel,Math.min(1,Math.max(0,value)));
    const ctx=this.ctx,low=this.lowpass,high=this.sheen,gain=this.musicGain;
    if(!ctx||!low||!high||!gain)return;
    const now=ctx.currentTime,p=this.maxTravel;
    low.frequency.setTargetAtTime(420*Math.pow(13500/420,p),now,.18);
    high.gain.setTargetAtTime(-7+7.5*p,now,.23);
    const w=.12+.88*p,[a,b,c,d]=this.widthMatrix;
    for(const [node,value] of [[a,(1+w)/2],[b,(1-w)/2],[c,(1-w)/2],[d,(1+w)/2]] as const)
      node?.gain.setTargetAtTime(value,now,.16);
    if(!this.pickupActive)gain.gain.setTargetAtTime(.28+.43*p,now,.22);
  }
  async playPickup(key:PickupId,onFinished:()=>void):Promise<void>{
    if(!this.ctx||!this.musicGain||!this.pickupGain){this.onStatus('Memory recovered, but sound is unavailable.');onFinished();return}
    const ctx=this.ctx,token=++this.queuedPickup;this.pickupActive=true;
    const now=ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setTargetAtTime(.075,now,.16);
    const finish=()=>{
      if(this.queuedPickup!==token)return;
      this.pickupActive=false;
      this.musicGain?.gain.setTargetAtTime(.28+.43*this.maxTravel,ctx.currentTime,.65);
      onFinished();
    };
    const buffer=await this.buffers.get(key);
    if(buffer){try{
      void ctx.resume();const voice=ctx.createBufferSource();voice.buffer=buffer;
      voice.connect(this.pickupGain);voice.addEventListener('ended',finish,{once:true});voice.start();
      this.onStatus(key==='xaba'?'Xaba — memory playing':'First Contact — memory playing');return;
    }catch{finish();return}}
    try{
      const el=new Audio('/audio/pickup_'+key+'.m4a');el.preload='none';el.crossOrigin='anonymous';
      ctx.createMediaElementSource(el).connect(this.pickupGain);
      el.addEventListener('ended',finish,{once:true});el.addEventListener('error',finish,{once:true});
      void ctx.resume();await el.play();
    }catch{this.onStatus('Memory audio unavailable.');finish()}
  }
  setMuted(value:boolean){this.muted=value;if(this.ctx){const target=value?0:1;this.ctx.destination.channelCount=2;/* output gating via mute below */void target}if(this.score)this.score.muted=value;
    if(this.musicGain)this.musicGain.gain.setTargetAtTime(value?0:this.pickupActive?.075:.28+.43*this.maxTravel,this.ctx!.currentTime,.12);
    if(this.pickupGain)this.pickupGain.gain.setTargetAtTime(value?0:.92,this.ctx!.currentTime,.12)}
  pause(){this.score?.pause();void this.ctx?.suspend()}
  resume(){void this.ctx?.resume();if(this.started)void this.score?.play().catch(()=>{})}
  destroy(){++this.queuedPickup;this.score?.pause();void this.ctx?.close();this.ctx=null}
}
