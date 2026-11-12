import * as THREE from 'three';
import {WORLD,groundHeight,initialState,stepMovement,canInspect,narrativeBeat,atEnd} from './world-logic.mjs';
import {createWorldArt} from './world-art.mjs';
import {artworkReviewEnabled} from './artwork-calibration.mjs';
import {AwakenNowScore} from './score.mjs';
import {stickVector,lookDelta} from './control-math.mjs';
import {InspectionMotion} from './inspection-motion.mjs';
import {parseReviewPose,createReviewMotion} from './art-review-presets.mjs';
// The real GLB loader is imported lazily only by the explicit W0 art-review pose.
import {WORKER_POS,initialWorkerState,stepWorkerRoutine,workerDistance,canAcknowledgeWorker,acknowledgeWorker} from './worker-routine.mjs';

const $=id=>document.getElementById(id);
// Only the root album site omits uncleared game audio. Separate approved reviews can retain it.
const publicAudioRestricted=document.body.dataset.publicAudioRestricted==='true';
const canvas=$('world'),intro=$('intro'),hud=$('hud'),hint=$('hint'),inspectButton=$('inspect');
const touch=$('touch-controls'),panel=$('inspect-panel'),end=$('end'),perf=$('perf'),pauseOverlay=$('pause-overlay');
const soundbar=$('soundbar'),scoreState=$('score-state'),scoreToggle=$('score-toggle'),scoreVolume=$('score-volume'),scoreRetry=$('score-retry');
if(publicAudioRestricted){
  const note=intro.querySelector('.study-label');
  if(note)note.textContent='Explore this early playable 3D world before the album arrives December 4, 2026. The full story and music experience are still in development. This public preview is silent while audio publication approvals are completed.';
  const controls=intro.querySelector('.controls-note');
  if(controls)controls.textContent='Desktop: WASD to walk, mouse to look, E to inspect, Esc to pause. Mobile: left thumbstick to move and drag the right side to look. Pause for camera-comfort settings.';
}
const score=new AwakenNowScore(message=>{
 scoreState.textContent=message;
 $('status').textContent=message;
 if(message.includes('unavailable')||message.includes('could not start'))scoreRetry.hidden=false;
 else scoreRetry.hidden=true;
}, source=>publicAudioRestricted ? new Audio() : new Audio(source));
function toggleMusic(){
 score.setMuted(!score.muted);scoreToggle.textContent=score.muted?'Music off':'Music on';
 scoreToggle.setAttribute('aria-pressed',String(score.muted));
 if(!score.muted&&score.failed&&!publicAudioRestricted)void score.play();
 $('status').textContent=score.muted?'Awaken Now muted':'Awaken Now unmuted';
}
scoreToggle.addEventListener('click',toggleMusic);
scoreVolume.addEventListener('input',()=>{score.setVolume(Number(scoreVolume.value)/100);});
scoreRetry.addEventListener('click',()=>{if(!publicAudioRestricted)void score.play();});
const coarse=matchMedia('(pointer:coarse)').matches;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const showPerf=new URLSearchParams(location.search).has('perf');
const mobile=coarse||innerWidth<720;
const activeKeys=new Set();
const touchAxes={forward:0,right:0};
const stick=$('touch-stick'),stickThumb=$('touch-stick-thumb');
const sensitivity=$('look-sensitivity'),invertLook=$('invert-look'),steadyCamera=$('steady-camera');
sensitivity.addEventListener('input',()=>{$('sensitivity-value').textContent=Number(sensitivity.value).toFixed(1)+'×';});
steadyCamera.checked=reducedMotion;
const FDT=1/WORLD.hz;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// An explicit art-review query changes only the starting viewpoint for scene QA.
// The default public journey and its progression remain unchanged.
const artReviewPose=parseReviewPose(location.search);
const coverLook=artworkReviewEnabled(location.search,artReviewPose);
const workerReviewEnabled=artReviewPose?.id==='inhabitants';
const initialPoseMotion=artReviewPose?createReviewMotion(artReviewPose):initialState();
let yaw=artReviewPose?.yaw??0,pitch=artReviewPose?.pitch??-.04,motion=initialPoseMotion,priorMotion={...initialPoseMotion},walkPhase=0,started=false,paused=true;
let inspecting=false,hasInspected=false,finished=false,pointerLockWasActive=false;
let previous=0,accumulator=0,lookPointer=null,lookX=0,lookY=0;
let contextLost=false;
let inspectingPointer=null,inspectX=0,inspectY=0;
const inspectionRig=new InspectionMotion();

const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(coverLook?0x384e81:0x314362,coverLook?.0042:.0045);
scene.background=new THREE.Color(coverLook?0x384e81:0x101e40);
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
renderer.toneMappingExposure=coverLook?1.01:1.16;
const quality={
 ratio: mobile?Math.min(1.05,devicePixelRatio):Math.min(1.55,devicePixelRatio),
 max:mobile?Math.min(1.1,devicePixelRatio):Math.min(1.7,devicePixelRatio),
 min:mobile?.68:.85,
 adaptCount:0
};
renderer.setPixelRatio(quality.ratio);
renderer.shadowMap.enabled=!mobile;
renderer.shadowMap.type=THREE.PCFShadowMap;
const ambient=new THREE.HemisphereLight(0x8bb7e1,0x87523d,coverLook?1.45:2.8);scene.add(ambient);
const sun=new THREE.DirectionalLight(0xffa466,coverLook?3.25:3.1);
sun.position.set(-60,42,-145);sun.target.position.set(0,0,-55);scene.add(sun,sun.target);
sun.castShadow=!mobile;sun.shadow.mapSize.set(1024,1024);
Object.assign(sun.shadow.camera,{left:-40,right:40,top:35,bottom:-35,near:1,far:220});
sun.shadow.bias=-.0008;
const bounce=new THREE.DirectionalLight(0x4666b8,.95);bounce.position.set(40,15,10);scene.add(bounce);
const art=createWorldArt(scene,{coverLook});
// Explicit review route only; ordinary visitors never see this unapproved character.
let worker=null;
let workerState=initialWorkerState();
let workerLoadStatus=workerReviewEnabled?'loading':'not-requested';
let workerLoadError=null,workerDiagnostics=null,workerDisposed=false;
// Never load unfinished character art for ordinary players. In review mode,
// a missing/broken source shows an honest failure, NOT a low-quality stand-in.
if(workerReviewEnabled){
 import('./worker-gltf.mjs')
  .then(({loadWorkerGLB})=>loadWorkerGLB(scene,groundHeight))
  .then(instance=>{
   if(workerDisposed){instance.dispose();return;}
   worker=instance;workerLoadStatus='ready';workerDiagnostics=instance.diagnostic;
   if(started&&!finished)$('status').textContent='Original W0 model loaded for art review. Character and workshop performance remain unapproved.';
  })
  .catch(error=>{
   workerLoadStatus='failed';workerLoadError=String(error?.message??error);
   $('status').textContent='W0 asset failed to load. This review character is unavailable; the world remains playable.';
   console.error('W0 art-review GLB failed:',error);
  });
}
const lightBefore=scene.fog.color.clone(),lightAfter=new THREE.Color(0x596179);
const baseSunIntensity=sun.intensity;
let revealLevel=0,revealTarget=0;
const inspectedObject=art.artifact.core.clone(true);
inspectedObject.name='Inspection duplicate: same physical geometry and materials';
inspectedObject.position.set(0,-.98,-3.55);
inspectedObject.rotation.set(.14,-.27,0);
inspectedObject.scale.setScalar(.48);
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
 stickThumb.style.transform='translate(-50%,-50%)';
}
function setPaused(value){
 if(!started||finished||inspecting)return;
 paused=value;clearKeys();pauseOverlay.hidden=!value;
 if(value)score.pause();else if(!publicAudioRestricted)void score.play();
 $('pause').textContent=value?'Resume':'Pause';
 hint.hidden=value;inspectButton.hidden=value;
 if(value){if(document.pointerLockElement===canvas)document.exitPointerLock?.();}
 else {
  previous=performance.now();
  // Desktop controls need mouse look immediately after pressing Resume.
  // Without a new lock, the character can walk but camera look is inert.
  if(!coarse&&document.pointerLockElement!==canvas){
   const pending=canvas.requestPointerLock?.();
   pending?.catch?.(()=>{$('status').textContent='Click the world to restore mouse look.';});
  }
  canvas.focus();
 }
 $('status').textContent=value?'Experience paused':'Experience resumed';
}
function begin(){
 intro.hidden=true;hud.hidden=false;touch.hidden=!coarse;soundbar.hidden=publicAudioRestricted;
 // play() executes synchronously under the player's explicit enter gesture.
 if(!publicAudioRestricted)void score.play();
 $('reticle').hidden=false;paused=false;started=true;finished=false;previous=performance.now();
 if(!coarse)canvas.requestPointerLock?.().catch(()=>{});
 canvas.focus();$('status').textContent='World entered. Walk with WASD, look with the mouse, E to examine an object.';
}
function closeInspection(){
 if(!inspecting)return;
 inspecting=false;inspectionRig.close();panel.hidden=true;inspectedObject.visible=false;inspectionLight.visible=false;
 score.setSceneLevel(1);
 revealTarget=1;
 paused=false;previous=performance.now();
 // A return from inspection is a user gesture: retry music if the tab
 // backgrounded during inspection and paused the audio transport.
 if(score.paused&&!publicAudioRestricted)void score.play();
 $('reticle').hidden=false;
 if(!coarse)canvas.requestPointerLock?.().catch(()=>{});
 canvas.focus();$('status').textContent='Returned to the world.';
}
function interact(){
 if(worker&&started&&!paused&&!finished&&!inspecting&&workerState.phase==='noticing'&&canAcknowledgeWorker(motion,yaw)){
  workerState=acknowledgeWorker(workerState,motion,yaw);
  $('status').textContent='The worker acknowledges you and returns to the repair task. Non-canonical behavior test.';
  return;
 }
 inspect();
}
function inspect(){
 if(!started||paused||finished||inspecting||!canInspect(motion,yaw))return;
 clearKeys();inspecting=true;inspectionRig.open();paused=true;hasInspected=true;
 $('reticle').hidden=true;hint.hidden=true;inspectButton.hidden=true;
 panel.hidden=false;inspectedObject.visible=true;inspectionLight.visible=true;
 score.setSceneLevel(.33);
 revealTarget=Math.max(revealTarget,.54);
 if(document.pointerLockElement===canvas)document.exitPointerLock?.();
 art.sky.material.uniforms.warm.value=.26;
 $('leave-inspect').focus();$('status').textContent='First Contact examined. Drag the model to rotate, then return to the world.';
}
function finish(){
 if(finished)return;
 clearKeys();finished=true;paused=true;end.hidden=false;hud.hidden=true;
 score.setSceneLevel(.47); // Keep the theme beneath the final pre-save invitation.
 revealTarget=1;
 hint.hidden=true;inspectButton.hidden=true;touch.hidden=true;$('reticle').hidden=true;
 if(document.pointerLockElement===canvas)document.exitPointerLock?.();
 if(hasInspected)$('end-caption').textContent='You paused to look more closely. This is still the first part of a world being built; the rest of the journey continues in the album.';
 $('status').textContent='You reached the return. Pre-save the album or walk again.';
}
$('begin').addEventListener('click',begin);
$('pause').addEventListener('click',()=>setPaused(!paused));
$('resume').addEventListener('click',()=>setPaused(false));
$('inspect').addEventListener('click',interact);
$('leave-inspect').addEventListener('click',closeInspection);
$('restart').addEventListener('click',()=>{
 end.hidden=true;hud.hidden=false;motion=artReviewPose?createReviewMotion(artReviewPose):initialState();priorMotion={...motion};yaw=artReviewPose?.yaw??0;pitch=artReviewPose?.pitch??-.04;
  workerState=initialWorkerState();
 finished=false;started=true;inspecting=false;paused=false;hasInspected=false;
 score.setSceneLevel(1);revealLevel=0;revealTarget=0;art.reveal(0);
 scene.fog.color.copy(lightBefore);
 if(score.audio.paused&&!publicAudioRestricted)void score.play();
 touch.hidden=!coarse;$('reticle').hidden=false;art.sky.material.uniforms.warm.value=0;
 previous=performance.now();canvas.focus();
});
document.addEventListener('keydown',e=>{
 if(inspecting){
  if(e.code==='Escape'){e.preventDefault();closeInspection();return;}
  if(e.code==='Tab'){e.preventDefault();$('leave-inspect').focus();return;}
  if(inspectionRig.key(e.code)){e.preventDefault();return;}
  return;
 }
 if(e.code==='Escape'){e.preventDefault();if(started&&!finished)setPaused(!paused);return;}
 if(e.target instanceof HTMLElement&&e.target.closest('a,button,input,textarea'))return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
 if(e.code==='KeyM'&&started&&!publicAudioRestricted){toggleMusic();return;}
 if(e.code==='KeyE'){interact();return;}
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
 if(!started||paused||inspecting)return;
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
 if(!started||paused||finished||inspecting)return;
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
function interruptForBackground(){
 clearKeys();
 if(!started||finished)return;
 // Inspection already pauses world movement. Stop its music explicitly
 // until the player leaves the artifact using a fresh interaction.
 if(inspecting){score.pause();return;}
 setPaused(true);
}
window.addEventListener('blur',interruptForBackground);
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)interruptForBackground();
});
canvas.addEventListener('webglcontextlost',e=>{
 e.preventDefault();contextLost=true;paused=true;clearKeys();score.pause();pauseOverlay.hidden=false;
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
  inspectedObject.scale.setScalar(frame.scale);
 }
 if(revealLevel!==revealTarget){
  revealLevel+= (revealTarget-revealLevel)*Math.min(1,delta*.88);
  if(Math.abs(revealLevel-revealTarget)<.0001)revealLevel=revealTarget;
  art.reveal(revealLevel);
  scene.fog.color.copy(lightBefore).lerp(lightAfter,revealLevel*.24);
  sun.intensity=baseSunIntensity+revealLevel*.28;
 }
 if(started&&!paused&&!finished){
  accumulator+=delta;let steps=0;
  while(accumulator>=FDT&&steps<4){
   const [f,r]=readInput();
   priorMotion={...motion};
   motion=stepMovement(motion,f,r,yaw);
   if(worker)workerState=stepWorkerRoutine(workerState,FDT,workerDistance(motion));
   walkPhase+=Math.hypot(motion.vx,motion.vz)*FDT;
   accumulator-=FDT;steps++;
  }
  if(steps===4)accumulator=0;
  const nearby=canInspect(motion,yaw);
  const nearWorker=Boolean(worker&&workerState.phase==='noticing'&&canAcknowledgeWorker(motion,yaw));
  hint.hidden=!(nearby||nearWorker);inspectButton.hidden=!(nearby||nearWorker);
  if(nearWorker){hint.textContent=coarse?'GREET THE WORKER':'E / ACKNOWLEDGE THE WORKER';inspectButton.textContent='Acknowledge';}
  else if(nearby){hint.textContent=coarse?'AN OBJECT LIES IN THE DUST':'E / EXAMINE THE FOUND OBJECT';inspectButton.textContent='Examine';}
  $('stage').textContent=narrativeBeat(motion.z);
  if(atEnd(motion))finish();
 }
 syncCamera();
 if(worker&&started&&!paused&&!finished)worker.update(workerState,motion,delta);
 art.sky.sphere.position.copy(camera.position);
 // The relic is a heavy material object discovered on the ground. It does
 // not float or rotate as a generic collectible. Inspection is the player's
 // deliberate action; atmospheric light responds only to that discovery.
 art.artifact.light.intensity=.18+revealLevel*.11;
 // Preserve the last world frame behind static overlays; avoid unnecessary GPU draws.
 // Inspection and the ending light transition still animate until they settle.
 if(!contextLost&&started&&(!paused||inspecting||revealLevel!==revealTarget))renderer.render(scene,camera);
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
window.__AA_DEV__={getState:()=>({...motion,yaw,pitch,paused,inspecting,finished,artReviewPose:artReviewPose?.id??null,coverLook,worker:worker?{...workerState,x:WORKER_POS.x,z:WORKER_POS.z}:null,workerLoadStatus,workerLoadError,workerDiagnostics}),goToArtifact:()=>{
 motion={...motion,x:1.95,z:WORLD.artifact.z+1.7};motion.y=groundHeight(motion.x,motion.z);
 priorMotion={...motion};yaw=-.85;
},goToEnd:()=>{motion={...motion,x:0,z:WORLD.endZ+.95};motion.y=groundHeight(motion.x,motion.z);priorMotion={...motion};}};
window.addEventListener('pagehide',()=>{workerDisposed=true;clearKeys();score.destroy();art.dispose();worker?.dispose();renderer.dispose()});
