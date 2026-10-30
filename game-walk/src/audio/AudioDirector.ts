/** User-gesture unlocked, streaming audio. Score is not fetched until start(). */
export class AudioDirector{
  private ctx:AudioContext|null=null;
  private score:HTMLAudioElement|null=null;
  private excerpt:HTMLAudioElement|null=null;
  private lowpass:BiquadFilterNode|null=null;
  private sheen:BiquadFilterNode|null=null;
  private musicGain:GainNode|null=null;
  private pickupGain:GainNode|null=null;
  private split:ChannelSplitterNode|null=null;
  private cross:GainNode[]=[];
  private started=false;
  private muted=false;
  private recovered=false;
  private baseWidth=0.18;
  private progress=0;
  private duckToken=0;
  private onPickupComplete:(()=>void)|null=null;
  get isPlaying(){return Boolean(this.score&&!this.score.paused)}
  get isMuted(){return this.muted}
  get soundStatus(){return this.started?'active':'not-started'}
  constructor(private readonly onStatus:(message:string)=>void){}
  /** Call synchronously inside a physical tap/click/keyboard event. */
  start():void{
    if(this.started){void this.ctx?.resume();return}
    this.started=true;
    const Context=window.AudioContext;
    if(!Context){this.onStatus('Audio is unavailable. Walking still works.');return}
    try{
      this.ctx=new Context({latencyHint:'interactive'});
      const ctx=this.ctx;
      this.score=new Audio('/audio/score_awaken_now_loop.m4a');
      this.score.preload='none';this.score.loop=true;this.score.crossOrigin='anonymous';
      const source=ctx.createMediaElementSource(this.score);
      this.lowpass=ctx.createBiquadFilter();this.lowpass.type='lowpass';this.lowpass.frequency.value=420;this.lowpass.Q.value=.6;
      this.sheen=ctx.createBiquadFilter();this.sheen.type='highshelf';this.sheen.frequency.value=2600;this.sheen.gain.value=-7;
      this.musicGain=ctx.createGain();this.musicGain.gain.value=.32;
      this.pickupGain=ctx.createGain();this.pickupGain.gain.value=.9;
      // Mid/side width via a 2x2 channel matrix; at 0 channels collapse to mono; at 1 native stereo.
      this.split=ctx.createChannelSplitter(2);const merge=ctx.createChannelMerger(2);
      const a=ctx.createGain(),b=ctx.createGain(),c=ctx.createGain(),d=ctx.createGain();this.cross=[a,b,c,d];
      source.connect(this.lowpass).connect(this.sheen).connect(this.split);
      this.split.connect(a,0);this.split.connect(b,1);this.split.connect(c,0);this.split.connect(d,1);
      a.connect(merge,0,0);b.connect(merge,0,0);c.connect(merge,0,1);d.connect(merge,0,1);
      merge.connect(this.musicGain).connect(ctx.destination);
      this.pickupGain.connect(ctx.destination);this.setTravel(0);this.setMuted(this.muted);
      this.score.addEventListener('error',()=>this.onStatus('Score unavailable — walking remains playable.'));
      const play=this.score.play();void ctx.resume();void play.then(()=>this.onStatus('Awaken Now — score awakened')).catch(()=>this.onStatus('Sound blocked by browser; continue walking.'));
    }catch{this.onStatus('Audio unavailable; silent mode enabled.');}
  }
  /** 0..1 from walking distance, reset-free: the music only opens. */
  setTravel(t:number){this.progress=Math.max(this.progress,Math.min(1,Math.max(0,t)));if(!this.ctx||!this.lowpass||!this.sheen||!this.musicGain)return;
    const now=this.ctx.currentTime;const p=this.progress;
    this.lowpass.frequency.setTargetAtTime(420*Math.pow(11000/420,p),now,.12);
    this.sheen.gain.setTargetAtTime(-7+7*p,now,.16);
    this.baseWidth=.18+.82*p;
    const w=this.baseWidth;const [a,b,c,d]=this.cross;
    for(const [node,value] of [[a,(1+w)/2],[b,(1-w)/2],[c,(1-w)/2],[d,(1+w)/2]] as const){node?.gain.setTargetAtTime(value,now,.2)}
    if(!this.recovered)this.musicGain.gain.setTargetAtTime(.29+.41*p,now,.15);
  }
  /** Score ducks to ~-16 dB. First Contact is only fetched when the player reaches its physical pickup. */
  async playPickup(onFinished:()=>void){if(this.recovered)return;this.recovered=true;this.onPickupComplete=onFinished;
    if(!this.ctx||!this.pickupGain||!this.musicGain){this.onStatus('First Contact reached (audio unavailable).');onFinished();return}
    const ctx=this.ctx;const token=++this.duckToken;const now=ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);this.musicGain.gain.setTargetAtTime(.08,now,.10);
    const pickup=new Audio('/audio/pickup_first_contact.m4a');this.excerpt=pickup;pickup.preload='none';pickup.crossOrigin='anonymous';
    const source=ctx.createMediaElementSource(pickup);source.connect(this.pickupGain);
    const restore=()=>{if(token!==this.duckToken)return;const t=ctx.currentTime;this.musicGain?.gain.setTargetAtTime(.29+.41*this.progress,t,.48);this.onPickupComplete?.();this.onPickupComplete=null};
    pickup.addEventListener('ended',restore,{once:true});pickup.addEventListener('error',()=>{this.onStatus('Pickup audio unavailable; discovery recorded.');restore()},{once:true});
    try{await ctx.resume();await pickup.play();this.onStatus('First Contact — memory playing')}catch{this.onStatus('Pickup preview cannot play on this device.');restore()}
  }
  setMuted(muted:boolean){this.muted=muted;if(this.score)this.score.muted=muted;if(this.excerpt)this.excerpt.muted=muted}
  pause(){this.score?.pause();this.excerpt?.pause();void this.ctx?.suspend()}
  resume(){void this.ctx?.resume();if(this.started){void this.score?.play().catch(()=>{})}if(this.excerpt&&!this.excerpt.ended){void this.excerpt.play().catch(()=>{})}}
  destroy(){++this.duckToken;this.score?.pause();this.excerpt?.pause();void this.ctx?.close();this.ctx=null}
}
