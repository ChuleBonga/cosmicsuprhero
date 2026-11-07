/**
 * Audio transport for the already-present artist-supplied
 * score_awaken_now_loop.m4a preview asset.
 *
 * Starts ONLY after an explicit visitor gesture. This is NOT an album master
 * or a streaming player; no other tracks are loaded.
 * Public production embedding remains unchanged until explicit approval.
 */
export const AWAKEN_NOW_PREVIEW_URL='/play/audio/score_awaken_now_loop.m4a';
export function clampAudio(value){return Math.max(0,Math.min(1,Number.isFinite(value)?value:0));}
export function easeGain(current,target,dt,seconds=.28){
  if(dt<=0)return clampAudio(current);
  return clampAudio(current+(clampAudio(target)-current)*(1-Math.exp(-dt/seconds)));
}
export class AwakenNowScore{
  constructor(onStatus=()=>{},createAudio=(src)=>new Audio(src)){
    this.audio=createAudio(AWAKEN_NOW_PREVIEW_URL);
    this.audio.preload='none';
    this.audio.loop=true;
    this.audio.volume=0;
    this.onStatus=onStatus;
    this.userVolume=.68;
    this.muted=false;
    this.gain=0;
    this.sceneLevel=1;
    this.started=false;
    this.playing=false;
    this.failed=false;
    this.paused=true;
    this.audio.addEventListener?.('error',()=>{
      this.failed=true;this.playing=false;
      this.onStatus('Awaken Now preview audio is unavailable. The world remains playable.');
    });
  }
  async play(){
    this.started=true;this.paused=false;
    this.failed=false;
    try{
      const pending=this.audio.play();
      if(pending && typeof pending.then==='function')await pending;
      if(this.paused){this.audio.pause();return false;}
      this.playing=true;
      this.onStatus('Now playing: Awaken Now, the Arcturian Awakening game theme.');
      return true;
    }catch{
      this.playing=false;this.failed=true;
      this.onStatus('Awaken Now could not start. Use Enable music to retry; the experience still works silently.');
      return false;
    }
  }
  pause(){this.paused=true;this.audio.pause();this.playing=false;}
  setVolume(value){this.userVolume=clampAudio(value);}
  setMuted(value){this.muted=Boolean(value);}
  setSceneLevel(value){this.sceneLevel=clampAudio(value);}
  tick(dt){
    const desired=this.paused||this.muted||!this.playing?0:this.sceneLevel*this.userVolume;
    this.gain=easeGain(this.gain,desired,Math.min(.1,Math.max(0,dt)));
    this.audio.volume=this.gain;
  }
  stop(){
    this.pause();
    this.audio.currentTime=0;
    this.gain=0;this.audio.volume=0;
  }
  destroy(){this.pause();this.audio.removeAttribute?.('src');this.audio.load?.();}
}
