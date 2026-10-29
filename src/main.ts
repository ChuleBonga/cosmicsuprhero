import {AudioDirector} from './core/AudioDirector';
import {ProgressManager} from './core/ProgressManager';
import {TRACKS,type PickupId} from './data/tracks';
const audio=new AudioDirector(),progress=new ProgressManager();
const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const splash=$('splash'),begin=$<HTMLButtonElement>('begin'),pause=$('pause');
const status=$('status'),info=$('performance'),diag=$('diagnostics');
let game:import('phaser').Game|null=null;
let paused=false,interval:ReturnType<typeof setInterval>|null=null;
audio.onStatus=message=>{status.textContent=message;diag.textContent=message;};
function updateSave(){
 const s=progress.snapshot;
 $('save-info').textContent=progress.storageAvailable?'Saved on this device.':'Storage unavailable: progress will last for this visit only.';
 $('jukebox').replaceChildren();
 const list=$('jukebox');
 for(const id of s.unlocked){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=TRACKS[id].title;button.addEventListener('click',()=>{void audio.playPickup(id).catch(err=>audio.onStatus(String(err)));});li.append(button);list.append(li);}
 if(!s.unlocked.length)list.textContent='Memories will appear here after discovery.';
}
progress.subscribe(updateSave);
async function enter(){
 begin.disabled=true;
 // AudioContext creation is synchronous within this gesture; the async score download follows it.
 const scoreStart=audio.startScore().catch(err=>{audio.onStatus('Audio unavailable: '+(err instanceof Error?err.message:String(err))+' — silent play is still possible.');});
 try{
  const {createGame}=await import('./game/createGame');
  game=createGame({audio,progress});
  splash.hidden=true;$('scene-hud').hidden=false;
  status.textContent='Game scaffold running · Phaser Title scene';
  interval=setInterval(()=>{if(game){const fps=game.loop.actualFps;info.textContent='Engine frame estimate: '+(Number.isFinite(fps)?fps.toFixed(0):'—')+' fps · physical phone gate still pending';}},2000);
 }catch(err){status.textContent='Could not initialize Phaser: '+String(err);begin.disabled=false;}
 await scoreStart;
}
begin.addEventListener('click',()=>{void enter();});
function showPause(open:boolean){
 paused=open;pause.hidden=!open;$('sound').textContent=audio.isMuted?'Sound off':'Sound on';
 $('motion').textContent=progress.snapshot.awakening>=0?'Reduced motion '+(sessionStorage.getItem('aa-reduced-motion')==='1'?'on':'off'):'Reduced motion off';
 if(open){game?.scene.pause('Title');void audio.suspend();$('resume').focus();}
 else{game?.scene.resume('Title');void audio.resume();$('pause-button').focus();}
}
$('pause-button').addEventListener('click',()=>showPause(true));
$('resume').addEventListener('click',()=>showPause(false));
$('sound').addEventListener('click',()=>{audio.setMuted(!audio.isMuted);$('sound').textContent=audio.isMuted?'Sound off':'Sound on';});
$('motion').addEventListener('click',()=>{
 const current=sessionStorage.getItem('aa-reduced-motion')==='1';const next=!current;
 try{sessionStorage.setItem('aa-reduced-motion',next?'1':'0');}catch{}
 document.documentElement.classList.toggle('reduce-motion',next);
 $('motion').textContent='Reduced motion '+(next?'on':'off');
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&game){e.preventDefault();showPause(!paused);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)void audio.suspend();else if(!paused&&game)void audio.resume();});
function testPickup(id:PickupId){if(!game){diag.textContent='Enter the world before testing pickups.';return;}void audio.playPickup(id).then(()=>{progress.unlock(id);audio.setAwakening(progress.snapshot.awakening);}).catch(err=>{diag.textContent=String(err);});}
$('test-first').addEventListener('click',()=>testPickup('pickup_first_contact'));
$('test-xaba').addEventListener('click',()=>testPickup('pickup_xaba'));
$('restore-score').addEventListener('click',()=>audio.setAwakening(progress.snapshot.awakening));
window.addEventListener('pagehide',()=>{if(interval)clearInterval(interval);void audio.suspend();});
