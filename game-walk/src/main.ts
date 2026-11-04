import Phaser from 'phaser';
import { AudioDirector } from './audio/AudioDirector';
import { ProgressManager } from './progress/ProgressManager';
import { TitleScene } from './scenes/TitleScene';
import { PrologueScene } from './scenes/WalkScene';
import { MeditateScene } from './scenes/MeditateScene';
import { CrossingScene } from './scenes/CrossingScene';
import { CredoScene } from './scenes/CredoScene';
import { PauseUIScene } from './scenes/PauseUIScene';
import { SliceCompleteScene } from './scenes/SliceCompleteScene';
import './style.css';

export interface GameContext { audio: AudioDirector; progress: ProgressManager }
const progress = new ProgressManager();
const audio = new AudioDirector(message => {
  const status = document.querySelector('#dom-status');
  if (status) status.textContent = message;
});
const app: GameContext = { audio, progress };

// Exactly one authored 16:9 scene composition. Only its outer frame scales.
// The previous viewport-derived logical dimensions distorted the title.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    this.load.spritesheet('alien','/play/art/character/traveler-atlas.webp',{frameWidth:192,frameHeight:204});
    this.load.spritesheet('keeper','/play/art/keeper_atlas.png',{frameWidth:64,frameHeight:92});
    // High-resolution scenic paintings are decoded by the browser beneath
    // Phaser. Loading old indexed terrain strips here would waste bandwidth.

  }
  create() {
    this.anims.create({key:'alien-idle',frames:this.anims.generateFrameNumbers('alien',{start:0,end:3}),frameRate:4,repeat:-1});
    this.anims.create({key:'alien-walk',frames:this.anims.generateFrameNumbers('alien',{start:4,end:11}),frameRate:10,repeat:-1});
    this.anims.create({key:'alien-walk-left',frames:this.anims.generateFrameNumbers('alien',{start:12,end:19}),frameRate:10,repeat:-1});
    this.anims.create({key:'keeper-idle',frames:this.anims.generateFrameNumbers('keeper',{start:0,end:1}),frameRate:1,repeat:-1});
    this.registry.set('app',app);this.scene.start('Title');
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO, parent: 'game',
  width: GAME_WIDTH, height: GAME_HEIGHT,
  backgroundColor: 'rgba(0,0,0,0)',
  render: { pixelArt: false, antialias: true, roundPixels: false, transparent: true },
  scale: { mode: Phaser.Scale.NONE },
  fps: { target: 60, min: 30 },
  input: { activePointers: 3 },
  scene: [BootScene, TitleScene, MeditateScene, CrossingScene, PrologueScene, CredoScene, PauseUIScene, SliceCompleteScene]
});

const frame = document.getElementById('cinema-frame');
const stage = document.getElementById('cinema-stage');

function resizeFrame(): void {
  if (!stage || !frame) return;
  const stageStyle = getComputedStyle(stage);
  const paddingX = parseFloat(stageStyle.paddingLeft) + parseFloat(stageStyle.paddingRight);
  const paddingY = parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom);
  const maxWidth = Math.max(1,stage.clientWidth - paddingX - 2);
  const maxHeight = Math.max(1,stage.clientHeight - paddingY - 2);
  const ratio = GAME_WIDTH / GAME_HEIGHT;
  const physicalWidth = Math.max(1,Math.floor(Math.min(maxWidth,maxHeight*ratio)));
  const physicalHeight = physicalWidth / ratio;
  frame.style.width = `${physicalWidth}px`;
  frame.style.height = `${physicalHeight}px`;
  const canvas = document.querySelector<HTMLCanvasElement>('#game canvas');
  if (canvas) {
    canvas.style.width = `${physicalWidth}px`;
    canvas.style.height = `${physicalHeight}px`;
  }
}
resizeFrame();
requestAnimationFrame(resizeFrame);
game.events.once(Phaser.Core.Events.READY, resizeFrame);
window.addEventListener('resize', resizeFrame);
window.visualViewport?.addEventListener('resize', resizeFrame);
if (stage && typeof ResizeObserver !== 'undefined') new ResizeObserver(resizeFrame).observe(stage);

window.addEventListener('pagehide', () => { progress.save(); audio.pause(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { progress.save(); audio.pause(); game.loop.sleep(); }
  else { enforceOrientation(); }
});

// The accessible direct-access form lives outside Phaser so it works with
// keyboard, voice control, autofill, and native mobile email keyboards.
const accessDialog=document.getElementById('access-dialog') as HTMLDialogElement|null;
const accessForm=document.getElementById('access-form') as HTMLFormElement|null;
const accessStatus=document.getElementById('access-status');
const accessResult=document.getElementById('access-result') as HTMLAnchorElement|null;
const accessSuccess=document.getElementById('access-success');
const submit=accessForm?.querySelector<HTMLButtonElement>('button[type=submit]');
let ready=false;
function showAccess():void {
  if(!accessDialog)return;
  if(!accessDialog.open)accessDialog.showModal();
  enforceOrientation();
  audio.pause();
  void probeAccess();
}
async function probeAccess():Promise<void>{
  try{
    const response=await fetch('/api/presave-access',{cache:'no-store'});
    const result=await response.json();
    ready=response.ok && result.ready===true;
    if(submit)submit.disabled=!ready;
    if(accessStatus)accessStatus.textContent=ready?'Enter your details for direct access.':'Direct access is not yet accepting registrations. Your details have not been collected.';
  }catch{
    ready=false;
    if(submit)submit.disabled=true;
    if(accessStatus)accessStatus.textContent='The direct gateway is currently unavailable. No information has been sent.';
  }
}
document.querySelectorAll('[data-open-access]').forEach(btn=>btn.addEventListener('click',showAccess));
window.addEventListener('arcturian:open-access',showAccess);
document.querySelectorAll('[data-close-access]').forEach(btn=>btn.addEventListener('click',()=>accessDialog?.close()));
accessDialog?.addEventListener('click',event=>{
  if(event.target===accessDialog)accessDialog.close();
});
accessForm?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!ready||!accessForm.reportValidity())return;
  const data=new FormData(accessForm);
  submit!.disabled=true;
  if(accessStatus)accessStatus.textContent='Registering direct access…';
  try{
    const response=await fetch('/api/presave-access',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        name:String(data.get('name')||'').trim(),
        email:String(data.get('email')||'').trim(),
        updates:data.get('updates')==='on',
        company:String(data.get('company')||'')
      })
    });
    const result=await response.json();
    if(!response.ok || result.access!=='granted' ||
       typeof result.destination!=='string' ||
       !result.destination.startsWith('https://share.amuse.io/'))throw new Error('registration');
    if(accessResult){accessResult.href=result.destination;accessResult.hidden=false;}
    if(accessStatus)accessStatus.textContent='Album access successfully registered.';
    accessForm.hidden=true;
    if(accessSuccess)accessSuccess.hidden=false;
    // No lead data is kept in localStorage. The backend is the sole recorder.
  }catch{
    if(accessStatus)accessStatus.textContent='We could not complete your request. Your details were not confirmed as saved.';
    submit!.disabled=false;
  }
});
if(new URLSearchParams(location.search).get('access')==='direct'){
  requestAnimationFrame(showAccess);
}


/**
 * Landscape-only play:
 * iOS Safari does not expose a dependable orientation lock, so the page
 * presents an authored portrait gate and pauses the renderer/input until
 * the device is physically rotated. The lead-access dialog remains usable.
 */
const observatoryShell=document.getElementById('observatory-shell');
const primaryAction=document.getElementById('journey-primary') as HTMLButtonElement|null;
const topPause=document.getElementById('observatory-pause') as HTMLButtonElement|null;
const stageSubtitle=document.getElementById('observatory-subtitle');
const portraitMedia=matchMedia('(orientation: portrait)');

function enforceOrientation():void {
  const unavailable=portraitMedia.matches||Boolean(accessDialog?.open);
  if(game.input){
    game.input.enabled=!unavailable;
    if(game.input.keyboard)game.input.keyboard.enabled=!unavailable;
  }
  if(!game.loop)return;
  if(unavailable || document.hidden){
    audio.pause();
    game.loop.sleep();
    window.dispatchEvent(new Event('arcturian:release-controls'));
  }else{
    game.loop.wake();
    audio.resume();
    resizeFrame();
  }
}
function enterJourney():void {
  if(portraitMedia.matches || accessDialog?.open)return;
  window.dispatchEvent(new Event('arcturian:begin'));
}
primaryAction?.addEventListener('click',enterJourney);
document.getElementById('master-title-enter')?.addEventListener('click',enterJourney);
window.addEventListener('arcturian:entered',()=>{
  if(observatoryShell)observatoryShell.dataset.scene='playing';
  if(primaryAction)primaryAction.hidden=true;
  if(topPause)topPause.hidden=false;
  if(stageSubtitle)stageSubtitle.textContent='Hold left or right to walk. Tap to jump.';
});
topPause?.addEventListener('click',()=>{
  if(portraitMedia.matches)return;
  if(game.scene.isActive('PauseUI'))return;
  const sceneId=['Meditate','Crossing','Prologue','Credo']
    .find(id=>game.scene.isActive(id));
  if(!sceneId)return;
  const current=game.scene.getScene(sceneId);
  current.scene.launch('PauseUI',{returnScene:sceneId});
  current.scene.pause();
  audio.pause();
});
portraitMedia.addEventListener('change',enforceOrientation);
window.addEventListener('orientationchange',enforceOrientation);
window.addEventListener('resize',enforceOrientation);
accessDialog?.addEventListener('close',()=>{
  enforceOrientation();
  if(!portraitMedia.matches)audio.resume();
});
game.events.once(Phaser.Core.Events.READY,enforceOrientation);
requestAnimationFrame(enforceOrientation);
