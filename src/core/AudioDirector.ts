import { AUDIO_BASE, type AudioId, type PickupId } from '../data/tracks';

/** Music as gameplay. No audio is downloaded until the first explicit user gesture. */
export class AudioDirector {
 private ctx: AudioContext | null=null;
 private master:GainNode | null=null;
 private scoreFilter:BiquadFilterNode | null=null;
 private scoreLevel:GainNode | null=null;
 private scoreDuck:GainNode | null=null;
 private sideWidth:GainNode[]=[];
 private scoreBuffer:AudioBuffer | null=null;
 private pickupBuffers=new Map<PickupId,AudioBuffer>();
 private liveScore=new Set<AudioBufferSourceNode>();
 private nextLoop=0;
 private loopTimer:ReturnType<typeof setInterval>|null=null;
 private scoreRunning=false;
 private pickupActive=false;
 private reducedMotion=false;
 private muted=false;
 private progress=0;
 onStatus:(message:string)=>void=()=>{};
 get isUnlocked(){return !!this.ctx&&this.ctx.state==='running';}
 get isPlaying(){return this.scoreRunning&&!!this.ctx&&this.ctx.state==='running';}
 get awakening(){return this.progress;}
 get isMuted(){return this.muted;}
 private async load(id:AudioId):Promise<AudioBuffer>{
  const ctx=this.ctx;if(!ctx)throw new Error('Start audio from a user gesture first.');
  const preferred=typeof Audio!=='undefined'&&new Audio().canPlayType('audio/mp4; codecs="mp4a.40.2"')?'m4a':'ogg';
  let last:Error|null=null;
  for(const format of [preferred,preferred==='m4a'?'ogg':'m4a']){
   try{
    const response=await fetch(`${AUDIO_BASE}/${id}.${format}`,{cache:'force-cache'});
    if(!response.ok)throw new Error('Media unavailable ('+response.status+')');
    return await ctx.decodeAudioData(await response.arrayBuffer());
   }catch(err){last=err instanceof Error?err:new Error(String(err));}
  }
  throw last??new Error('Unable to decode supplied audio.');
 }
 /** Call synchronously during a click/touch to satisfy iOS Safari audio unlock. */
 async unlockOnGesture(){
  if(!this.ctx){
   const ctx=new AudioContext({latencyHint:'interactive'});this.ctx=ctx;
   this.buildGraph(ctx);
   ctx.onstatechange=()=>{if(ctx.state==='running'&&this.scoreRunning)this.scheduleScore();};
  }
  if(this.ctx.state!=='running')await this.ctx.resume();
  if(this.ctx.state!=='running')throw new Error('Tap again to enable audio.');
 }
 private buildGraph(ctx:AudioContext){
  const master=ctx.createGain();master.gain.value=1;master.connect(ctx.destination);this.master=master;
  const scoreLevel=ctx.createGain();scoreLevel.gain.value=.78;this.scoreLevel=scoreLevel;
  const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=430;filter.Q.value=.5;this.scoreFilter=filter;
  const duck=ctx.createGain();duck.gain.value=1;duck.connect(scoreLevel);scoreLevel.connect(master);this.scoreDuck=duck;
  const split=ctx.createChannelSplitter(2);const merge=ctx.createChannelMerger(2);filter.connect(split);
  // Real mid/side-width matrix: at 0 both speakers receive (L+R)/2; at 1 original stereo is restored.
  const a=ctx.createGain(),b=ctx.createGain(),c=ctx.createGain(),d=ctx.createGain();
  split.connect(a,0);a.connect(merge,0,0);
  split.connect(b,1);b.connect(merge,0,0);
  split.connect(c,0);c.connect(merge,0,1);
  split.connect(d,1);d.connect(merge,0,1);
  this.sideWidth=[a,b,c,d];merge.connect(duck);
  this.setAwakening(0);
 }
 setAwakening(value:number){
  this.progress=Math.min(1,Math.max(0,Number.isFinite(value)?value:0));
  const ctx=this.ctx;if(!ctx||!this.scoreFilter||!this.scoreLevel)return;
  const now=ctx.currentTime,p=this.progress;
  const cutoff=390*Math.pow(16500/390,p);
  this.scoreFilter.frequency.setTargetAtTime(cutoff,now,.35);
  this.scoreLevel.gain.setTargetAtTime(.58+p*.34,now,.4);
  const w=.13+.87*p;
  const [a,b,c,d]=this.sideWidth;
  a?.gain.setTargetAtTime(.5+.5*w,now,.3);
  b?.gain.setTargetAtTime(.5-.5*w,now,.3);
  c?.gain.setTargetAtTime(.5-.5*w,now,.3);
  d?.gain.setTargetAtTime(.5+.5*w,now,.3);
 }
 setMuted(muted:boolean){this.muted=muted;if(this.ctx&&this.master)this.master.gain.setTargetAtTime(muted?0:1,this.ctx.currentTime,.04);}
 setReducedMotion(enabled:boolean){this.reducedMotion=enabled;}
 async startScore(){
  await this.unlockOnGesture();
  if(this.scoreRunning)return;
  this.onStatus('Loading the approved score…');
  if(!this.scoreBuffer)this.scoreBuffer=await this.load('score_awaken_now_loop');
  this.scoreRunning=true;
  this.nextLoop=this.ctx!.currentTime+.08;
  this.scheduleScore();
  this.loopTimer=setInterval(()=>this.scheduleScore(),1800);
  this.onStatus('Awaken Now is playing.');
 }
 private scheduleScore(){
  if(!this.ctx||!this.scoreRunning||!this.scoreFilter||!this.scoreBuffer)return;
  const ctx=this.ctx,buffer=this.scoreBuffer;
  const seam=3,step=Math.max(1,buffer.duration-seam);
  // Schedule ahead on the audio clock. setInterval may be delayed; audio automation will not be.
  let count=0;
  while(this.nextLoop<ctx.currentTime+step+4&&count++<4){
   const when=Math.max(this.nextLoop,ctx.currentTime+.04);
   const src=ctx.createBufferSource();src.buffer=buffer;
   const gain=ctx.createGain();src.connect(gain);gain.connect(this.scoreFilter);
   const startFade=when+step,end=when+buffer.duration;
   const fadeIn=new Float32Array(32).map((_,i)=>Math.sin((i/31)*Math.PI/2));
   const fadeOut=new Float32Array(32).map((_,i)=>Math.cos((i/31)*Math.PI/2));
   gain.gain.setValueAtTime(this.liveScore.size===0?1:0,when);
   if(this.liveScore.size)gain.gain.setValueCurveAtTime(fadeIn,when,seam);
   gain.gain.setValueCurveAtTime(fadeOut,startFade,seam);
   src.start(when);src.stop(end+.02);this.liveScore.add(src);
   src.onended=()=>{this.liveScore.delete(src);try{src.disconnect();gain.disconnect();}catch{}};
   this.nextLoop=(this.nextLoop<ctx.currentTime?when:this.nextLoop)+step;
  }
 }
 async playPickup(id:PickupId):Promise<void>{
  await this.unlockOnGesture();
  if(this.pickupActive)throw new Error('Another memory is playing.');
  this.pickupActive=true;
  try{
   this.onStatus('Preparing '+id.replaceAll('_',' ')+'…');
   let buffer=this.pickupBuffers.get(id);
   if(!buffer){buffer=await this.load(id);this.pickupBuffers.clear();this.pickupBuffers.set(id,buffer);}
   const ctx=this.ctx!,master=this.master!,duck=this.scoreDuck!;
   const when=ctx.currentTime+.09;
   duck.gain.cancelScheduledValues(when);duck.gain.setTargetAtTime(.19,when,.23);
   const src=ctx.createBufferSource(),gain=ctx.createGain();
   src.buffer=buffer;src.connect(gain);gain.connect(master);
   gain.gain.setValueAtTime(0,when);
   gain.gain.linearRampToValueAtTime(.9,when+Math.min(.65,buffer.duration/3));
   gain.gain.setValueAtTime(.9,when+Math.max(.7,buffer.duration-2.5));
   gain.gain.linearRampToValueAtTime(0,when+buffer.duration);
   this.onStatus('Now playing '+id.replace('pickup_','').replaceAll('_',' ')+'.');
   await new Promise<void>((resolve)=>{
    src.onended=()=>{try{src.disconnect();gain.disconnect();}catch{} duck.gain.setTargetAtTime(1,ctx.currentTime,.55);resolve();};
    src.start(when);src.stop(when+buffer.duration+.01);
   });
  }finally{this.pickupActive=false;this.onStatus('Returning to Awaken Now.');}
 }
 async suspend(){try{await this.ctx?.suspend();}catch{}}
 async resume(){try{await this.ctx?.resume();}catch{}}
 dispose(){
  this.scoreRunning=false;if(this.loopTimer)clearInterval(this.loopTimer);this.loopTimer=null;
  for(const src of this.liveScore){try{src.stop();}catch{}}
  this.liveScore.clear();this.pickupBuffers.clear();
  void this.ctx?.close();this.ctx=null;
 }
}
