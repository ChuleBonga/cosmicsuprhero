import './style.css';
import {audioDirector} from './systems/AudioDirector';
import {progress} from './systems/ProgressManager';
import {pickups,PRE_SAVE,type TrackId} from './config/tracks';
import {announce,type UIMessage} from './ui/events';
const $=<T extends Element>(sel:string):T=>document.querySelector<T>(sel)!;
const hero=$<HTMLElement>('#title-screen');const phase=$<HTMLElement>('#phase');const help=$<HTMLElement>('#hint');
const action=$<HTMLButtonElement>('#action');const narrative=$<HTMLElement>('#narrative');const menu=$<HTMLDialogElement>('#menu');
const ready=$<HTMLElement>('#ready-status'),audioState=$<HTMLElement>('#audio-status');
const begin=$<HTMLButtonElement>('#begin');
let gameReady=false;let gameBooting=false;let showJournalTimer=0;
const send=(name:string)=>window.dispatchEvent(new CustomEvent('aa:action',{detail:{name}}));
function openMenu(){send('pause');drawJukebox();if(!menu.open)menu.showModal()}
function closeMenu(){if(menu.open)menu.close();send('resume')}
$('#pause').addEventListener('click',openMenu);
$('#close-menu').addEventListener('click',closeMenu);
menu.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});
$('#resume').addEventListener('click',closeMenu);
$('#audio-toggle').addEventListener('click',()=>{const muted=audioDirector.toggleMute();$('#audio-toggle').textContent=muted?'Turn sound on':'Mute audio';});
$('#action').addEventListener('click',()=>send(action.dataset.action||'interact'));
$('#restart').addEventListener('click',()=>{progress.reset();location.reload()});
$('#presave-title').setAttribute('href',PRE_SAVE);
$('#presave-menu').setAttribute('href',PRE_SAVE);
$('#presave-checkpoint').setAttribute('href',PRE_SAVE);
function drawJukebox(){
 const target=$<HTMLElement>('#jukebox');target.replaceChildren();
 for(const id of ['first-contact','xaba','mama','songs-to-god'] as TrackId[]){const item=pickups[id];const found=progress.data.found.includes(id);const row=document.createElement('div');row.className='jukebox-item';
 const title=document.createElement('span');title.textContent=item.title;const status=document.createElement('span');status.textContent=found?(item.approved?'Unlocked':'Recovered · preview pending'):'Not discovered';row.append(title,status);
 if(found&&item.approved){const play=document.createElement('button');play.type='button';play.textContent='Listen';play.addEventListener('click',()=>{void audioDirector.playPickup(id)});row.append(play);}
 target.append(row);
 }
}
window.addEventListener('aa:ui',(event:Event)=>{const detail=(event as CustomEvent<UIMessage>).detail;
 if(detail.phase)phase.textContent=detail.phase;
 if(detail.instruction)help.textContent=detail.instruction;
 if(detail.action){action.hidden=false;action.dataset.action=detail.action;action.textContent=detail.actionLabel||'Interact';}else if(detail.action===null){action.hidden=true;}
 if(detail.journal){narrative.textContent=detail.journal;narrative.hidden=false;clearTimeout(showJournalTimer);showJournalTimer=window.setTimeout(()=>narrative.hidden=true,4900)}
 if(detail.completed){$('#checkpoint').removeAttribute('hidden');drawJukebox();}
 if(typeof detail.awake==='number')document.documentElement.style.setProperty('--awake',String(detail.awake));
});
audioDirector.onState=status=>{audioState.textContent=status==='playing'?'Awaken Now / playing':status==='pickup'?'Recovered memory / playing':status==='unavailable'?'Score preview unavailable / silent mode':status==='paused'?'Audio paused':'Sound optional'};
async function beginJourney(){if(gameBooting||gameReady)return;gameBooting=true;begin.disabled=true;ready.textContent='Entering the landscape…';
 // Author-approved audio starts on the same user gesture. The game is separately code-split.
 void audioDirector.startFromGesture();
 try{const module=await import('./game');module.startGame();}
 catch(error){gameBooting=false;begin.disabled=false;ready.textContent='Game graphics unavailable. Pre-save and album information remain accessible.';console.error('Game failed',error)}
}
begin.addEventListener('click',()=>void beginJourney());
window.addEventListener('aa:game-ready',()=>{gameReady=true;hero.hidden=true;ready.textContent='Game ready. Hold right to walk; release to stop.';document.querySelector<HTMLCanvasElement>('#game-root canvas')?.focus();});
$('#no-motion').addEventListener('change',e=>{document.documentElement.classList.toggle('reduced-motion',(e.target as HTMLInputElement).checked)});
// Keep visitors in control. Never auto-play audio, auto-show the pre-save, or log personal data.
if(progress.data.encounter!=='prologue')ready.textContent='A saved walk is available. Enter to continue.';
