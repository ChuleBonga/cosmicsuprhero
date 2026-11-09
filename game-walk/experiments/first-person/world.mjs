import * as THREE from 'three';
import {WORLD,groundHeight,groundNormal,initialState,stepMovement,narrativeBeat,atEnd} from './world-logic.mjs';
import {createWorldArt,whenMaterialsPrepared} from './world-art.mjs';
import {AwakenNowScore} from './score.mjs';
import {stickVector,lookDelta} from './control-math.mjs';
import {InspectionMotion} from './inspection-motion.mjs';
import {pickupPose,insertionPose,PICKUP_SECONDS,INSERT_SECONDS} from './interaction-motion.mjs';
import {newJourney,availableAction,doJourneyAction,journeyStatus} from './journey-actions.mjs';
import {makeCheckpoint,readCheckpoint,writeCheckpoint,eraseCheckpoint} from './checkpoint.mjs';

const $=id=>document.getElementById(id);
const canvas=$('world'),intro=$('intro'),hud=$('hud'),hint=$('hint'),inspectButton=$('inspect');
const checkpointStore=(()=>{try{return window.sessionStorage;}catch{return null;}})();
let pendingResume=readCheckpoint(checkpointStore);
let lastCheckpointAt=0;
function saveProgress(){
 if(started&&!finished)writeCheckpoint(checkpointStore,makeCheckpoint(motion,yaw,pitch,journey));
}
const touch=$('touch-controls'),panel=$('inspect-panel'),end=$('end'),perf=$('perf'),pauseOverlay=$('pause-overlay');
const soundbar=$('soundbar'),scoreState=$('score-state'),scoreToggle=$('score-toggle'),scoreVolume=$('score-volume'),scoreRetry=$('score-retry');
const presaveRail=$('presave-rail'),pauseScoreVolume=$('pause-score-volume'),pauseVolumeValue=$('pause-volume-value');
const score=new AwakenNowScore(message=>{
 scoreState.textContent=message;
 $('status').textContent=message;
 if(message.includes('unavailable')||message.includes('could not start'))scoreRetry.hidden=false;
 else scoreRetry.hidden=true;
});
function toggleMusic(){
 score.setMuted(!score.muted);scoreToggle.textContent=score.muted?'Music off':'Music on';
 scoreToggle.setAttribute('aria-pressed',String(!score.muted));
 if(!score.muted&&score.failed)void score.play();
 $('status').textContent=score.muted?'Awaken Now muted':'Awaken Now unmuted';
}
scoreToggle.addEventListener('click',toggleMusic);
function changeScoreVolume(raw){
 const number=Math.max(0,Math.min(100,Number(raw)||0));
 score.setVolume(number/100);
 scoreVolume.value=String(number);
 pauseScoreVolume.value=String(number);
 pauseVolumeValue.textContent=number+'%';
}
scoreVolume.addEventListener('input',()=>changeScoreVolume(scoreVolume.value));
pauseScoreVolume.addEventListener('input',()=>changeScoreVolume(pauseScoreVolume.value));
scoreRetry.addEventListener('click',()=>{void score.play();});
const coarse=matchMedia('(pointer:coarse)').matches;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const showPerf=new URLSearchParams(location.search).has('perf');
const mobile=coarse||innerWidth<720;
const activeKeys=new Set();
const touchAxes={forward:0,right:0};
const stick=$('touch-stick'),stickThumb=$('touch-stick-thumb');
const lookStick=$('look-stick'),lookThumb=$('look-stick-thumb');
const rAction=$('r-action'),rActionLabel=$('r-action-label'),lAction=$('l-action');
const mediaStatus=$('media-status'),takeTape=$('take-tape');
const lookAxes={right:0,up:0};
const sensitivity=$('look-sensitivity'),invertLook=$('invert-look'),steadyCamera=$('steady-camera');
sensitivity.addEventListener('input',()=>{$('sensitivity-value').textContent=Number(sensitivity.value).toFixed(1)+'×';});
steadyCamera.checked=reducedMotion;
const FDT=1/WORLD.hz;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let yaw=0,pitch=-.04,motion=initialState(),priorMotion={...initialState()},walkPhase=0,started=false,paused=true;
let inspecting=false,hasInspected=false,finished=false,pointerLockWasActive=false;
let journey=newJourney(),inspectFromReview=false;
let pickupElapsed=-1,relayElapsed=-1;
let shownStageLabel=null,priorityStage=null,priorityStageUntil=0;
let shownActionId=null;
const stageElement=$('stage');
function setStage(label){if(label===shownStageLabel)return;shownStageLabel=label;stageElement.textContent=label;}
function announceStage(label,now=performance.now()){
 priorityStage=label;priorityStageUntil=now+3400;setStage(label);
}
function updateStage(now){
 if(priorityStage&&now>=priorityStageUntil)priorityStage=null;
 setStage(priorityStage||narrativeBeat(motion.z));
}
let previous=0,accumulator=0,lookPointer=null,lookX=0,lookY=0;
let inspectingPointer=null,inspectX=0,inspectY=0;
const inspectionRig=new InspectionMotion();
let feedbackTimeout=null;
function notifyAction(message){
 const el=$('action-feedback');
 el.textContent=message;el.hidden=false;
 if(feedbackTimeout!==null)clearTimeout(feedbackTimeout);
 feedbackTimeout=setTimeout(()=>{el.hidden=true;feedbackTimeout=null;},2800);
}

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x314362,.0045);
scene.background=new THREE.Color(0x101e40);
const camera=new THREE.PerspectiveCamera(mobile?78:68,1,.075,850);camera.rotation.order='YXZ';
scene.add(camera); // This also allows a physical artifact inspection object attached to the camera.
let renderer;
try{
 renderer=new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha:false,depth:true,powerPreference:'high-performance'});
}catch(err){
 intro.querySelector('h1').textContent='This world needs WebGL.';
 intro.querySelector('.study-label').textContent='A compatible WebGL browser is required for this study. The album and pre-save remain available without playing.';
 $('begin').disabled=true;$('status').textContent=String(err);throw err;
}
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.16;
const quality={
 ratio: mobile?Math.min(1.05,devicePixelRatio):Math.min(1.55,devicePixelRatio),
 max:mobile?Math.min(1.1,devicePixelRatio):Math.min(1.7,devicePixelRatio),
 min:mobile?.68:.85,
 adaptCount:0
};
renderer.setPixelRatio(quality.ratio);
renderer.shadowMap.enabled=!mobile;
renderer.shadowMap.type=THREE.PCFShadowMap;
const ambient=new THREE.HemisphereLight(0x8bb7e1,0x87523d,2.8);scene.add(ambient);
const sun=new THREE.DirectionalLight(0xffa466,3.1);
sun.position.set(-60,42,-145);sun.target.position.set(0,0,-55);scene.add(sun,sun.target);
sun.castShadow=!mobile;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-40,right:40,top:35,bottom:-35,near:1,far:220});
sun.shadow.bias=-.0008;
const bounce=new THREE.DirectionalLight(0x4666b8,.95);bounce.position.set(40,15,10);scene.add(bounce);
const art=createWorldArt(scene);
// Only accept the Enter gesture after the primary material maps have loaded.
// A bounded fallback prevents slow networks from trapping visitors at a gate.
// The pre-save link remains usable throughout preparation.
let worldReady=false;
function unlockEntry(message){
 if(worldReady)return;
 worldReady=true;
 const entry=$('begin');
 entry.disabled=false;
 entry.innerHTML=(pendingResume?'Continue journey':'Enter the world')+' <span aria-hidden="true">→</span>';
 $('start-fresh').hidden=!pendingResume;
 $('preparation').textContent=message;
}
const preparationTimeout=setTimeout(()=>{
 unlockEntry('Material loading is taking longer than expected. You can enter with reduced surface detail.');
},12000);
void whenMaterialsPrepared().then(({total,loaded,failed})=>{
 clearTimeout(preparationTimeout);
 unlockEntry(failed?
  'Some surface detail could not load ('+loaded+'/'+total+' maps). Exploration and the album are still available.':
  'World prepared. '+loaded+' surface maps are ready.');
}).catch(()=>{
 clearTimeout(preparationTimeout);
 unlockEntry('Some materials are unavailable. You can still enter the world.');
});
const lightBefore=scene.fog.color.clone(),lightAfter=new THREE.Color(0x596179);
const baseSunIntensity=sun.intensity;
let revealLevel=0,revealTarget=0;
const inspectedObject=art.artifact.core.clone(true);
inspectedObject.name='Inspection duplicate: same physical geometry and materials';
inspectedObject.position.set(0,-.98,-3.55);
inspectedObject.rotation.set(.14,-.27,0);
// The physical tape is ~15cm wide. Magnify only in the inspection camera.
inspectedObject.scale.setScalar(.48*8);
inspectedObject.visible=false;camera.add(inspectedObject);
const inspectionLight=new THREE.PointLight(0xffd3ae,2.1,6,1.6);
inspectionLight.position.set(1.4,1.1,-.65);inspectionLight.visible=false;camera.add(inspectionLight);

function resize(){
 const width=Math.max(1,innerWidth),height=Math.max(1,innerHeight);
 camera.aspect=width/height;camera.fov=width/height<.7?81:width/height<1.1?74:68;
 camera.updateProjectionMatrix();renderer.setSize(width,height,false);
}
window.addEventListener('resize',resize);
window.visualViewport?.addEventListener('resize',resize);
resize();
function syncCamera(){
 // Render between fixed 60 Hz physics samples, eliminating positional stutter
 // when the monitor refreshes at 90/120 Hz. Physics collision still uses
 // authoritative fixed-step positions.
 const alpha=started&&!paused?clamp(accumulator/FDT,0,1):1;
 const x=priorMotion.x+(motion.x-priorMotion.x)*alpha;
 const y=priorMotion.y+(motion.y-priorMotion.y)*alpha;
 const z=priorMotion.z+(motion.z-priorMotion.z)*alpha;
 const speed=Math.hypot(motion.vx,motion.vz);
 const bob=steadyCamera.checked||inspecting?0:Math.min(.012,speed*.004)*Math.sin(walkPhase*2.1);
 camera.position.set(x,y+WORLD.eyeHeight+bob,z);
 // Positive yaw looks to the player's right.
 camera.rotation.set(pitch,-yaw,0,'YXZ');
}
function readInput(){
 let f=0,r=0;
 if(activeKeys.has('KeyW')||activeKeys.has('ArrowUp')||activeKeys.has('forward'))f++;
 if(activeKeys.has('KeyS')||activeKeys.has('ArrowDown')||activeKeys.has('backward'))f--;
 if(activeKeys.has('KeyA')||activeKeys.has('ArrowLeft')||activeKeys.has('left'))r--;
 if(activeKeys.has('KeyD')||activeKeys.has('ArrowRight')||activeKeys.has('right'))r++;
 return [clamp(f+touchAxes.forward,-1,1),clamp(r+touchAxes.right,-1,1)];
}
function clearKeys(){
 activeKeys.clear();touchAxes.forward=0;touchAxes.right=0;
 lookAxes.right=0;lookAxes.up=0;
 if(stickPointer!==null){if(stick.hasPointerCapture?.(stickPointer))stick.releasePointerCapture(stickPointer);stickPointer=null;}
 if(lookStickPointer!==null){if(lookStick.hasPointerCapture?.(lookStickPointer))lookStick.releasePointerCapture(lookStickPointer);lookStickPointer=null;}
 if(lookPointer!==null){if(canvas.hasPointerCapture?.(lookPointer))canvas.releasePointerCapture(lookPointer);lookPointer=null;}
 stickThumb.style.transform='translate(-50%,-50%)';
 lookThumb.style.transform='translate(-50%,-50%)';
}
function setPaused(value){
 if(!started||finished||inspecting||pickupElapsed>=0||relayElapsed>=0)return;
 paused=value;clearKeys();pauseOverlay.hidden=!value;presaveRail.hidden=value;
 if(value)score.pause();else void score.play();
 $('pause').textContent=value?'Resume':'Pause';
 hint.hidden=value;inspectButton.hidden=value;
 if(value){if(document.pointerLockElement===canvas)document.exitPointerLock?.();}
 else{
  previous=performance.now();
  // Resume was activated by a real click/tap; restore pointer lock on desktop
  // rather than leaving the camera unresponsive until a second click.
  if(!coarse&&document.pointerLockElement!==canvas)canvas.requestPointerLock?.().catch(()=>{});
 }
 $('status').textContent=value?'Experience paused':'Experience resumed';
}
function begin(){
 if(pendingResume){
  const snap=pendingResume;pendingResume=null;
  motion={...initialState(),x:snap.x,z:snap.z,y:groundHeight(snap.x,snap.z),
   groundNormal:groundNormal(snap.x,snap.z),vx:0,vz:0};
  priorMotion={...motion};yaw=snap.yaw;pitch=snap.pitch;
  journey={...snap.journey};
  revealLevel=journey.installed?1:0;revealTarget=revealLevel;
  art.reveal(revealLevel);
  scene.fog.color.copy(lightBefore).lerp(lightAfter,revealLevel*.24);
  art.sky.material.uniforms.warm.value=journey.installed?.36:0;
 }
 intro.hidden=true;hud.hidden=false;touch.hidden=!coarse;soundbar.hidden=false;presaveRail.hidden=false;
 syncJourneyVisuals();updateStage(performance.now());
 // play() executes synchronously under the player's explicit enter gesture.
 void score.play();
 $('reticle').hidden=false;paused=false;started=true;finished=false;previous=performance.now();
 if(!coarse)canvas.requestPointerLock?.().catch(()=>{});
 canvas.focus();$('status').textContent='World entered. Walk with WASD, look with the mouse, E to examine an object.';
}
function closeInspection(){
 if(!inspecting)return;
 inspecting=false;inspectionRig.close();panel.hidden=true;inspectedObject.visible=false;inspectionLight.visible=false;presaveRail.hidden=false;
 score.setSceneLevel(1);
 revealTarget=journey.installed?1:(journey.collected?.18:0);
 paused=false;previous=performance.now();
 $('reticle').hidden=false;
 if(!coarse)canvas.requestPointerLock?.().catch(()=>{});
 canvas.focus();$('status').textContent='Returned to the world.';
}
function syncJourneyVisuals(){
 art.artifact.core.visible=!journey.collected;
 art.relay.inserted.visible=journey.installed;
 mediaStatus.hidden=!journey.collected;
 mediaStatus.textContent=journeyStatus(journey);
 lAction.disabled=!journey.collected;
 lAction.querySelector('span').textContent=journey.installed?'LOG':'TAPE';
 refreshActionUI();
}
function refreshActionUI(){
 const action=started&&!paused&&!finished&&!inspecting?availableAction(motion,journey,coarse,yaw):null;
 const id=action?.id||null;
 // Avoid needless DOM mutation and live-region chatter every render frame.
 if(id===shownActionId&&hint.hidden===!action&&inspectButton.hidden===!action&&rAction.disabled===!action)return action;
 shownActionId=id;
 rAction.disabled=!action;
 rActionLabel.textContent=id==='install'?'INSERT':id==='examine'?'EXAMINE':'USE';
 hint.hidden=!action;inspectButton.hidden=!action;
 if(action){
  hint.textContent=coarse?action.detail:'E / '+action.label;
  inspectButton.textContent=action.label;
 }
 return action;
}
function openCassetteInspection(review=false){
 if(!started||paused||finished||inspecting)return;
 if(review&&!journey.collected)return;
 if(!review&&availableAction(motion,journey,coarse,yaw)?.id!=='examine')return;
 inspectFromReview=review;
 if(!review)journey=doJourneyAction(journey,'inspect').state;
 clearKeys();inspecting=true;inspectionRig.open();paused=true;hasInspected=true;
 $('reticle').hidden=true;hint.hidden=true;inspectButton.hidden=true;
 panel.hidden=false;inspectedObject.visible=true;inspectionLight.visible=true;presaveRail.hidden=true;
 takeTape.hidden=review||journey.collected;
 score.setSceneLevel(.33);
 revealTarget=Math.max(revealTarget,.2);
 if(document.pointerLockElement===canvas)document.exitPointerLock?.();
 $('artifact-title').textContent='First Contact';
 art.sky.material.uniforms.warm.value=.1;
 (takeTape.hidden?$('leave-inspect'):takeTape).focus();
 $('status').textContent=review?'Reviewing First Contact cassette.':'First Contact cassette examined. Take it or return.';
}
function collectCassette(){
 if(!inspecting||inspectFromReview||journey.collected)return;
 const next=doJourneyAction(journey,'collect');
 if(!next.changed)return;
 journey=next.state;
 closeInspection();syncJourneyVisuals();
 saveProgress();
 // The recovered model visibly transfers toward the player's near-camera
 // viewpoint rather than disappearing on button press.
 pickupElapsed=0;paused=true;inspectedObject.visible=true;
 clearKeys();hint.hidden=true;inspectButton.hidden=true;rAction.disabled=true;
 announceStage('CASSETTE RECOVERED');
 $('status').textContent='First Contact cassette recovered. L1 or Q reviews it. Follow the causeway to the listening relay.';
 notifyAction('FIRST CONTACT · CASSETTE RECOVERED  /  L1 TO REVIEW');
}
function performAction(){
 if(!started||paused||inspecting||finished)return;
 const action=availableAction(motion,journey,coarse,yaw);
 if(action?.id==='examine'){openCassetteInspection(false);return;}
 if(action?.id==='install'){
  const next=doJourneyAction(journey,'install');
  if(!next.changed)return;
  journey=next.state;syncJourneyVisuals();saveProgress();
  relayElapsed=0;paused=true;clearKeys();
  art.relay.inserted.visible=true;
  revealTarget=1;art.sky.material.uniforms.warm.value=.36;
  announceStage('THE SIGNAL RETURNS');
  $('status').textContent='First Contact cassette inserted into the Sunward relay. The ancient lights are responding.';
  notifyAction('FIRST CONTACT · SIGNAL RESTORED');
 }
}
function reviewCassette(){
 if(journey.collected)openCassetteInspection(true);
}
function finish(){
 if(finished)return;
 clearKeys();finished=true;paused=true;end.hidden=false;hud.hidden=true;presaveRail.hidden=true;
 eraseCheckpoint(checkpointStore);
 score.setSceneLevel(.47); // Keep the theme beneath the final pre-save invitation.
 revealTarget=1;
 hint.hidden=true;inspectButton.hidden=true;touch.hidden=true;$('reticle').hidden=true;
 if(document.pointerLockElement===canvas)document.exitPointerLock?.();
 if(journey.installed)$('end-caption').textContent='You returned a lost cassette to the listening relay. Its signal belongs to the music. The complete five-minute journey is still being authored.';
 else if(journey.collected)$('end-caption').textContent='You recovered First Contact, a physical trace of the album. The rest of this story continues in the music.';
 else $('end-caption').textContent='You crossed the causeway. You can return to explore the cassette, or continue to the album.';
 $('status').textContent='You reached the return. Pre-save the album or walk again.';
}
$('begin').addEventListener('click',begin);
$('start-fresh').addEventListener('click',()=>{
 pendingResume=null;eraseCheckpoint(checkpointStore);begin();
});
$('pause').addEventListener('click',()=>setPaused(!paused));
$('resume').addEventListener('click',()=>setPaused(false));
$('inspect').addEventListener('click',performAction);
rAction.addEventListener('click',performAction);
lAction.addEventListener('click',reviewCassette);
takeTape.addEventListener('click',collectCassette);
$('leave-inspect').addEventListener('click',closeInspection);
$('zoom-in').addEventListener('click',()=>inspectionRig.setZoom(inspectionRig.zoomTarget+.18));
$('zoom-out').addEventListener('click',()=>inspectionRig.setZoom(inspectionRig.zoomTarget-.18));
$('restart').addEventListener('click',()=>{
 end.hidden=true;hud.hidden=false;motion=initialState();priorMotion={...motion};yaw=0;pitch=-.04;
 finished=false;started=true;inspecting=false;paused=false;hasInspected=false;presaveRail.hidden=false;
 pickupElapsed=-1;relayElapsed=-1;inspectedObject.visible=false;
 art.relay.inserted.position.y=.78;art.relay.inserted.rotation.x=-.18;
 journey=newJourney();inspectFromReview=false;eraseCheckpoint(checkpointStore);
 priorityStage=null;priorityStageUntil=0;shownStageLabel=null;shownActionId=null;syncJourneyVisuals();
 updateStage(performance.now());
 if(feedbackTimeout!==null){clearTimeout(feedbackTimeout);feedbackTimeout=null;}
 $('action-feedback').hidden=true;
 score.setSceneLevel(1);revealLevel=0;revealTarget=0;art.reveal(0);
 scene.fog.color.copy(lightBefore);
 if(score.audio.paused)void score.play();
 touch.hidden=!coarse;$('reticle').hidden=false;art.sky.material.uniforms.warm.value=0;
 previous=performance.now();canvas.focus();
});
document.addEventListener('keydown',e=>{
 if(inspecting){
  if(e.code==='Escape'){e.preventDefault();closeInspection();return;}
  if(e.code==='Tab'){
   e.preventDefault();
   const order=[takeTape,$('leave-inspect'),$('zoom-out'),$('zoom-in')].filter(el=>!el.hidden);
   const current=order.indexOf(document.activeElement);
   order[(current+(e.shiftKey?-1:1)+order.length)%order.length].focus();
   return;
  }
  if(inspectionRig.key(e.code)){e.preventDefault();return;}
  return;
 }
 if(e.code==='Escape'){e.preventDefault();if(started&&!finished)setPaused(!paused);return;}
 if(e.target instanceof HTMLElement&&e.target.closest('a,button,input,textarea'))return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
 if(e.code==='KeyM'&&started){toggleMusic();return;}
 if(e.code==='KeyE'){performAction();return;}
 if(e.code==='KeyQ'){reviewCassette();return;}
 if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))activeKeys.add(e.code);
});
document.addEventListener('keyup',e=>activeKeys.delete(e.code));
function look(dx,dy){
 if(!started||paused||inspecting||finished)return;
 const delta=lookDelta(dx,dy,Number(sensitivity.value),invertLook.checked);
 yaw+=delta.yaw;
 pitch=clamp(pitch+delta.pitch,-1.05,.93);
}
document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas)look(e.movementX,e.movementY);});
document.addEventListener('pointerlockchange',()=>{
 if(document.pointerLockElement===canvas)pointerLockWasActive=true;
 else if(pointerLockWasActive&&!inspecting&&started&&!finished&&!paused){pointerLockWasActive=false;setPaused(true);}
});
canvas.addEventListener('click',()=>{
 if(started&&!paused&&!coarse&&document.pointerLockElement!==canvas)canvas.requestPointerLock?.().catch(()=>{});
});
canvas.addEventListener('pointerdown',e=>{
 if(!started||paused||finished||inspecting||lookPointer!==null)return;
 if(e.pointerType==='touch'&&e.clientX<innerWidth*.38)return;
 if(document.pointerLockElement===canvas)return;
 lookPointer=e.pointerId;lookX=e.clientX;lookY=e.clientY;canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove',e=>{
 if(lookPointer!==e.pointerId)return;
 look(e.clientX-lookX,e.clientY-lookY);lookX=e.clientX;lookY=e.clientY;
});
for(const name of ['pointerup','pointercancel','lostpointercapture'])
 canvas.addEventListener(name,e=>{if(e.pointerId===lookPointer)lookPointer=null;});
// Continuous left-thumb analog stick. A single pointer owns the joystick;
 // releasing it, pausing or losing focus always resets all movement.
let stickPointer=null;
function moveStick(e){
 const rect=stick.getBoundingClientRect();
 const cx=rect.left+rect.width*.5,cy=rect.top+rect.height*.44;
 const v=stickVector(e.clientX-cx,e.clientY-cy);
 touchAxes.right=v.right;touchAxes.forward=v.forward;
 stickThumb.style.transform=`translate(calc(-50% + ${v.visualX}px),calc(-50% + ${v.visualY}px))`;
}
stick.addEventListener('pointerdown',e=>{
 if(!started||paused||finished||inspecting||stickPointer!==null)return;
 e.preventDefault();stickPointer=e.pointerId;
 stick.setPointerCapture(e.pointerId);moveStick(e);
});
stick.addEventListener('pointermove',e=>{if(stickPointer===e.pointerId)moveStick(e);});
for(const kind of ['pointerup','pointercancel','lostpointercapture'])
 stick.addEventListener(kind,e=>{
  if(stickPointer!==e.pointerId)return;
  stickPointer=null;touchAxes.forward=0;touchAxes.right=0;
  stickThumb.style.transform='translate(-50%,-50%)';
 });
// The right analog camera stick is independent of the left movement pointer.
let lookStickPointer=null;
function moveRightStick(e){
 const rect=lookStick.getBoundingClientRect();
 const dx=e.clientX-(rect.left+rect.width*.5);
 const dy=e.clientY-(rect.top+rect.height*.44);
 const v=stickVector(dx,dy,39,.12);
 lookAxes.right=v.right;lookAxes.up=v.forward;
 lookThumb.style.transform=`translate(calc(-50% + ${v.visualX}px),calc(-50% + ${v.visualY}px))`;
}
lookStick.addEventListener('pointerdown',e=>{
 if(!started||paused||finished||inspecting||lookStickPointer!==null)return;
 e.preventDefault();lookStickPointer=e.pointerId;
 lookStick.setPointerCapture(e.pointerId);moveRightStick(e);
});
lookStick.addEventListener('pointermove',e=>{if(lookStickPointer===e.pointerId)moveRightStick(e);});
for(const kind of ['pointerup','pointercancel','lostpointercapture'])
 lookStick.addEventListener(kind,e=>{
  if(lookStickPointer!==e.pointerId)return;
  lookStickPointer=null;lookAxes.right=0;lookAxes.up=0;
  lookThumb.style.transform='translate(-50%,-50%)';
 });
const area=$('inspect-interaction');
area.addEventListener('wheel',e=>{
 if(!inspecting)return;
 e.preventDefault();inspectionRig.wheel(e.deltaY);
},{passive:false});
area.addEventListener('pointerdown',e=>{
 if(!inspecting)return;inspectingPointer=e.pointerId;inspectX=e.clientX;inspectY=e.clientY;area.setPointerCapture(e.pointerId);
});
area.addEventListener('pointermove',e=>{
 if(inspectingPointer!==e.pointerId||!inspecting)return;
 const dx=e.clientX-inspectX,dy=e.clientY-inspectY;inspectX=e.clientX;inspectY=e.clientY;
 inspectionRig.drag(dx,dy);
});
for(const name of ['pointerup','pointercancel','lostpointercapture'])
 area.addEventListener(name,e=>{if(e.pointerId===inspectingPointer)inspectingPointer=null;});
window.addEventListener('blur',()=>{clearKeys();if(started&&!inspecting&&!finished)setPaused(true)});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearKeys();if(started&&!inspecting&&!finished)setPaused(true);}});
canvas.addEventListener('webglcontextlost',e=>{
 e.preventDefault();setPaused(true);pauseOverlay.hidden=false;
 pauseOverlay.querySelector('p').textContent='THE GRAPHICS CONTEXT WAS LOST';
 $('resume').textContent='Reload experience';
 $('resume').onclick=()=>location.reload();
 $('status').textContent='The graphics context was lost. Reload to continue or use the pre-save link.';
});

const samples=[];let metricsElapsed=0,adaptiveElapsed=0;
function tick(timestamp){
 requestAnimationFrame(tick);
 const delta=previous?clamp((timestamp-previous)/1000,0,.05):0;
 previous=timestamp;
 score.tick(delta);
 if(inspecting){
  const frame=inspectionRig.tick(delta);
  inspectedObject.position.set(frame.x,frame.y,frame.z);
  inspectedObject.rotation.set(frame.pitch,frame.yaw,0);
  inspectedObject.scale.setScalar(frame.scale*8);
 }
 if(pickupElapsed>=0){
  pickupElapsed+=delta;
  const progress=clamp(pickupElapsed/PICKUP_SECONDS,0,1);
  const pose=pickupPose(progress);
  inspectedObject.position.set(pose.x,pose.y,pose.z);
  inspectedObject.rotation.set(pose.pitch,pose.yaw,0);
  inspectedObject.scale.setScalar(pose.scale);
  if(progress>=1){pickupElapsed=-1;inspectedObject.visible=false;paused=false;refreshActionUI();}
 }
 if(relayElapsed>=0){
  relayElapsed+=delta;
  const progress=clamp(relayElapsed/INSERT_SECONDS,0,1);
  const pose=insertionPose(progress);
  art.relay.inserted.position.y=pose.y;
  art.relay.inserted.rotation.x=pose.pitch;
  art.relay.light.intensity=.2+pose.glow*1.3;
  if(progress>=1){relayElapsed=-1;paused=false;refreshActionUI();}
 }
 if(revealLevel!==revealTarget){
  revealLevel+= (revealTarget-revealLevel)*Math.min(1,delta*.88);
  if(Math.abs(revealLevel-revealTarget)<.0001)revealLevel=revealTarget;
  art.reveal(revealLevel);
  scene.fog.color.copy(lightBefore).lerp(lightAfter,revealLevel*.24);
  sun.intensity=baseSunIntensity+revealLevel*.28;
 }
 if(started&&!paused&&!finished){
  // Right thumbstick drives camera angular velocity, independent of render FPS.
  if(Math.abs(lookAxes.right)+Math.abs(lookAxes.up)>.001)
   look(lookAxes.right*700*delta,-lookAxes.up*700*delta);
  accumulator+=delta;let steps=0;
  while(accumulator>=FDT&&steps<4){
   const [f,r]=readInput();
   priorMotion={...motion};
   motion=stepMovement(motion,f,r,yaw);
   walkPhase+=Math.hypot(motion.vx,motion.vz)*FDT;
   accumulator-=FDT;steps++;
  }
  if(steps===4)accumulator=0;
  refreshActionUI();
  updateStage(timestamp);
  if(timestamp-lastCheckpointAt>6000){saveProgress();lastCheckpointAt=timestamp;}
  if(atEnd(motion))finish();
 }
 syncCamera();
 art.sky.sphere.position.copy(camera.position);
 // The relic is a heavy material object anchored to its plinth. It does
 // not float or rotate as a generic collectible. Inspection is the player's
 // deliberate action; atmospheric light responds only to that discovery.
 art.artifact.light.intensity=.8+revealLevel*.22;
 if(relayElapsed<0)art.relay.light.intensity=journey.installed?1.4+revealLevel*.4:0;
 // The intro, idle pause and stationary end screens do not require
 // continuous expensive GPU rendering. Inspect/transition frames still draw.
 if(started&&(!paused||inspecting||pickupElapsed>=0||relayElapsed>=0||
   (finished&&revealLevel!==revealTarget)))renderer.render(scene,camera);
 if(!started||paused||delta<=0)return;
 const ms=delta*1000;samples.push(ms);if(samples.length>180)samples.shift();
 metricsElapsed+=delta;adaptiveElapsed+=delta;
 if(metricsElapsed>=1&&samples.length>=25){
  const sorted=[...samples].sort((a,b)=>a-b);
  const mean=samples.reduce((a,b)=>a+b,0)/samples.length;
  const p95=sorted[Math.floor((sorted.length-1)*.95)];
  const data={meanMs:+mean.toFixed(2),p95Ms:+p95.toFixed(2),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,pixelRatio:quality.ratio,x:motion.x,z:motion.z};
  window.__AA_METRICS__=data;
  if(showPerf){
   perf.hidden=false;perf.textContent=`FRAME avg ${mean.toFixed(1)}ms   p95 ${p95.toFixed(1)}ms
FPS observed ${(1000/mean).toFixed(0)} (target 60)
Draw calls ${data.drawCalls}   Triangles ${data.triangles}
Pixel ratio ${quality.ratio.toFixed(2)}   World Z ${motion.z.toFixed(1)}
Main-thread cadence; GPU timings not measured`;
  }
  // Reduce resolution only after sustained evidence, never label as validated 60 fps.
  if(adaptiveElapsed>8&&p95>20.5&&quality.ratio>quality.min){
   quality.ratio=Math.max(quality.min,quality.ratio*.87);
   renderer.setPixelRatio(quality.ratio);resize();quality.adaptCount++;adaptiveElapsed=0;
  }else if(adaptiveElapsed>22&&p95<15&&quality.ratio<quality.max){
   quality.ratio=Math.min(quality.max,quality.ratio*1.05);
   renderer.setPixelRatio(quality.ratio);resize();adaptiveElapsed=0;
  }
  metricsElapsed=0;
 }
}
syncCamera();renderer.render(scene,camera);requestAnimationFrame(tick);
window.__AA_DEV__={getState:()=>({...motion,yaw,pitch,paused,inspecting,finished}),goToArtifact:()=>{
 motion={...motion,x:1.95,z:WORLD.artifact.z+1.7};motion.y=groundHeight(motion.x,motion.z);
 priorMotion={...motion};yaw=-.85;
},goToEnd:()=>{motion={...motion,x:0,z:WORLD.endZ+.95};motion.y=groundHeight(motion.x,motion.z);priorMotion={...motion};}};
window.addEventListener('pagehide',()=>{saveProgress();clearKeys();score.destroy();art.dispose();renderer.dispose()});
