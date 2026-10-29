import { pickups,score,type TrackId } from '../config/tracks';
type AudioState = 'silent'|'playing'|'pickup'|'paused'|'unavailable';
/** One user-unlocked Web Audio graph. No stem sync or unapproved assets. */
export class AudioDirector {
  private ctx:AudioContext|null=null;
  private bed=new Audio();
  private featured=new Audio();
  private filter:BiquadFilterNode|null=null;
  private master:GainNode|null=null;
  private bedGain:GainNode|null=null;
  private pickupGain:GainNode|null=null;
  private contextWired=false;
  private open=0;
  private userMuted=false;
  private permission=false;
  private pickupTimer:number|undefined;
  private ducking=false;
  status:AudioState='silent';
  onState:(status:AudioState)=>void=()=>{};
  constructor(){this.bed.preload='none';this.bed.loop=true;this.bed.src=score.url;
    this.featured.preload='none';this.bed.addEventListener('error',()=>this.setStatus('unavailable'));
    this.bed.addEventListener('ended',()=>{if(this.permission&&!this.userMuted)this.setStatus('playing')});
  }
  private setStatus(value:AudioState){if(this.status!==value){this.status=value;this.onState(value)}}
  private setup(){if(this.contextWired)return;this.contextWired=true;
    const Ctx=window.AudioContext;
    if(!Ctx){this.setStatus('unavailable');return;}
    try{
      const ctx=new Ctx();this.ctx=ctx;
      this.filter=ctx.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=430;this.filter.Q.value=.65;
      this.master=ctx.createGain();this.master.gain.value=.72;
      this.bedGain=ctx.createGain();this.bedGain.gain.value=.27;
      this.pickupGain=ctx.createGain();this.pickupGain.gain.value=0;
      const bedSource=ctx.createMediaElementSource(this.bed);
      const pickupSource=ctx.createMediaElementSource(this.featured);
      bedSource.connect(this.filter);this.filter.connect(this.bedGain);this.bedGain.connect(this.master);
      pickupSource.connect(this.pickupGain);this.pickupGain.connect(this.master);
      this.master.connect(ctx.destination);
    }catch{this.setStatus('unavailable')}
  }
  async startFromGesture(){this.permission=true;this.setup();if(this.userMuted)return;
    try{await this.ctx?.resume(); await this.bed.play();this.setStatus('playing');this.setAwakening(this.open);}catch{this.setStatus('unavailable');}
  }
  setAwakening(amount:number){this.open=Math.min(1,Math.max(0,amount));if(!this.ctx)return;
    const now=this.ctx.currentTime;
    const frequency=440*Math.pow(11000/440,this.open);
    this.filter?.frequency.setTargetAtTime(frequency,now,.45);
    if(this.bedGain){this.bedGain.gain.setTargetAtTime(this.ducking?.06:.22+this.open*.24,now,.25);}
  }
  async playPickup(id:TrackId):Promise<'played'|'pending'> {
    const clip=pickups[id];if(!clip.approved||!clip.src)return 'pending';
    if(!this.permission||this.userMuted)return 'pending';
    this.featured.pause();clearTimeout(this.pickupTimer);
    this.featured.src=clip.src;this.featured.currentTime=0;this.featured.preload='auto';
    try{await this.ctx?.resume();this.ducking=true;
      const now=this.ctx?.currentTime??0;
      this.bedGain?.gain.setTargetAtTime(.045,now,.12);
      this.pickupGain?.gain.setTargetAtTime(.72,now,.2);
      await this.featured.play();this.setStatus('pickup');
      const finish=()=>this.endPickup();this.featured.onended=finish;
      this.pickupTimer=window.setTimeout(finish,Math.min(clip.durationSec,30)*1000);
      return 'played';
    }catch{this.endPickup();return 'pending'}
  }
  private endPickup(){if(!this.ducking)return;this.ducking=false;clearTimeout(this.pickupTimer);
    const now=this.ctx?.currentTime??0;this.pickupGain?.gain.setTargetAtTime(0,now,.17);
    this.featured.pause();this.setAwakening(this.open);this.setStatus(this.bed.paused?'paused':'playing');}
  pause(){this.bed.pause();this.featured.pause();this.ctx?.suspend();this.setStatus('paused');}
  async resume(){if(!this.permission||this.userMuted)return;await this.ctx?.resume();await this.bed.play().catch(()=>{});this.setStatus('playing');}
  toggleMute(){this.userMuted=!this.userMuted;if(this.master&&this.ctx)this.master.gain.setTargetAtTime(this.userMuted?0:.72,this.ctx.currentTime,.09);
    if(!this.userMuted&&this.permission){void this.resume()}return this.userMuted;
  }
  get isMuted(){return this.userMuted}
  get currentAwakening(){return this.open}
  get isAvailable(){return this.status!=='unavailable'}
}
export const audioDirector=new AudioDirector();
