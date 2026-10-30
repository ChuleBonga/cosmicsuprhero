/** Audio unlock is initiated only from a user gesture. No full master is shipped. */
export class AudioDirector {
 private context:AudioContext|null=null; private source:MediaElementAudioSourceNode|null=null;
 private lowpass:BiquadFilterNode|null=null;private gain:GainNode|null=null;private stereo:StereoPannerNode|null=null;
 private audio=new Audio();private pickup=new Audio();private pickupGain:GainNode|null=null;private pickupSource:MediaElementAudioSourceNode|null=null;
 private muted=false;private progress=0;
 constructor(){this.audio.loop=true;this.audio.preload="none";this.audio.src="/media/score_awaken_now_loop.m4a";this.pickup.preload="none";this.pickup.src="/media/pickup_first_contact.m4a";}
 async start():Promise<void>{
  if(!this.context){const C=window.AudioContext;this.context=new C();const ctx=this.context;this.lowpass=ctx.createBiquadFilter();this.lowpass.type="lowpass";this.lowpass.Q.value=.5;this.lowpass.frequency.value=360;
  this.gain=ctx.createGain();this.gain.gain.value=.7;this.stereo=ctx.createStereoPanner();
  this.source=ctx.createMediaElementSource(this.audio);this.source.connect(this.lowpass).connect(this.stereo).connect(this.gain).connect(ctx.destination);
  this.pickupGain=ctx.createGain();this.pickupSource=ctx.createMediaElementSource(this.pickup);this.pickupSource.connect(this.pickupGain).connect(ctx.destination);
  this.pickup.onended=()=>this.restoreScore();this.pickup.onerror=()=>this.restoreScore();}
  await this.context.resume(); try{await this.audio.play();}catch(e){console.warn("Score unavailable; walk remains playable",e);}
  this.update(this.progress);
 }
 update(distanceFraction:number):void{
  this.progress=Math.max(0,Math.min(1,distanceFraction));if(!this.context||!this.lowpass||!this.gain||!this.stereo)return;
  const t=this.context.currentTime;const freq=360*Math.pow(17000/360,this.progress);this.lowpass.frequency.setTargetAtTime(freq,t,.15);
  this.stereo.pan.setTargetAtTime(Math.sin(this.progress*Math.PI*2)*.12,t,.3);
  const target=this.muted?0:this.pickup.paused?.77:.15;this.gain.gain.setTargetAtTime(target,t,.18);
 }
 async playPickup():Promise<void>{
  if(!this.context||!this.pickupGain||!this.gain)return;
  const t=this.context.currentTime;this.gain.gain.setTargetAtTime(this.muted?0:.12,t,.16);
  this.pickupGain.gain.setValueAtTime(this.muted?0:.0,t);this.pickupGain.gain.setTargetAtTime(this.muted?0:.98,t,.16);
  this.pickup.currentTime=0;try{await this.pickup.play();}catch(e){this.restoreScore();console.warn("Pickup unavailable",e);}
 }
 private restoreScore(){if(!this.context||!this.gain||!this.pickupGain)return;const t=this.context.currentTime;
  this.pickupGain.gain.setTargetAtTime(0,t,.2);this.gain.gain.setTargetAtTime(this.muted?0:.77,t,.45);}
 toggleMute():boolean{this.muted=!this.muted;if(this.context){const t=this.context.currentTime;this.gain?.gain.setTargetAtTime(this.muted?0:this.pickup.paused?.77:.12,t,.08);this.pickupGain?.gain.setTargetAtTime(this.muted?0:.98,t,.08);}return this.muted;}
 isMuted(){return this.muted;}dispose(){this.audio.pause();this.pickup.pause();void this.context?.close();}
}
