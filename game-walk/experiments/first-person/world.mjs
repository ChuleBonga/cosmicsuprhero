import * as THREE from 'three';
import {WORLD,groundHeight,initialState,stepMovement,canInspect,narrativeBeat,atEnd} from './world-logic.mjs';
import {createWorldArt} from './world-art.mjs';
import {AwakenNowScore} from './score.mjs';

const $=id=>document.getElementById(id);
const canvas=$('world'),intro=$('intro'),hud=$('hud'),hint=$('hint'),inspectButton=$('inspect');
const touch=$('touch-controls'),panel=$('inspect-panel'),end=$('end'),perf=$('perf'),pauseOverlay=$('pause-overlay');
const soundbar=$('soundbar'),scoreState=$('score-state'),scoreToggle=$('score-toggle'),scoreVolume=$('score-volume'),scoreRetry=$('score-retry');
const score=new AwakenNowScore(message=>{
 scoreState.textContent=message;
 $('status').textContent=message;
 if(message.includes('unavailable')||message.includes('could not start'))scoreRetry.hidden=false;
 else scoreRetry.hidden=true;
});
function toggleMusic(){
 score.setMuted(!score.muted);scoreToggle.textContent=score.muted?'Music off':'Music on';
 scoreToggle.setAttribute('aria-pressed',String(score.muted));
 if(!score.muted&&score.failed)void score.play();
 $('status').textContent=score.muted?'Awaken Now muted':'Awaken Now unmuted';
}
scoreToggle.addEventListener('click',toggleMusic);
scoreVolume.addEventListener('input',()=>{score.setVolume(Number(scoreVolume.value)/100);});
scoreRetry.addEventListener('click',()=>{void score.play();});
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
let yaw=0,pitch=-.04,motion=initialState(),priorMotion={...initialState()},walkPhase=0,started=false,paused=true;
let inspecting=false,hasInspected=false,finished=false,pointerLockWasActive=false;
let previous=0,accumulator=0,lookPointer=null,lookX=0,lookY=0;
let inspectingPointer=null,inspectX=0,inspectY=0;

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
const inspectedObject=art.artifact.core.clone(true);
inspectedObject.name='Inspection duplicate: same physical geometry and materials';
inspectedObject.position.set(0,-.31,-2.1);
inspectedObject.rotation.set(.12,-.38,0);
inspectedObject.scale.setScalar(.83);
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
 if(value)score.pause();else void score.play();
 $('pause').textContent=value?'Resume':'Pause';
 hint.hidden=value;inspectButton.hidden=value;
 if(value){if(document.pointerLockElement===canvas)document.exitPointerLock?.();}
 else previous=performance.now();
 $('status').textContent=value?'Experience paused':'Experience resumed';
}
function begin(){
 intro.hidden=true;hud.hidden=false;touch.hidden=!coarse;soundbar.hidden=false;
 // play() executes synchronously under the player's explicit enter gesture.
 void score.play();
 $('reticle').hidden=false;paused=false;started=true;finished=false;previous=performance.now();
 if(!coarse)canvas.requestPointerLock?.().catch(()=>{});
 canvas.focus();$('status').textContent='World entered. Walk with WASD, look with the mouse, E to examine an object.';
}
function closeInspection(){
 if(!inspecting)return;
 inspecting=false;panel.hidden=true;inspectedObject.visible=false;inspectionLight.visible=false;
 score.setSceneLevel(1);
 paused=false;previous=performance.now();
 $('reticle').hidden=false;
 if(!coarse)canvas.requestPointerLock?.().catch(()=>{});
 canvas.focus();$('status').textContent='Returned to the world.';
}
function inspect(){
 if(!started||paused||finished||inspecting||!canInspect(motion,yaw))return;
 clearKeys();inspecting=true;paused=true;hasInspected=true;
 $('reticle').hidden=true;hint.hidden=true;inspectButton.hidden=true;
 panel.hidden=false;inspectedObject.visible=true;inspectionLight.visible=true;
 score.setSceneLevel(.33);
 if(document.pointerLockElement===canvas)document.exitPointerLock?.();
 art.sky.material.uniforms.warm.value=.26;
 $('leave-inspect').focus();$('status').textContent='First Contact examined. Drag the model to rotate, then return to the world.';
}
function finish(){
 if(finished)return;
 clearKeys();finished=true;paused=true;end.hidden=false;hud.hidden=true;
 score.setSceneLevel(.47); // Keep the theme beneath the final pre-save invitation.
 hint.hidden=true;inspectButton.hidden=true;touch.hidden=true;$('reticle').hidden=true;
 if(document.pointerLockElement===canvas)document.exitPointerLock?.();
 if(hasInspected)$('end-caption').textContent='You paused to look more closely. This is still the first part of a world being built; the rest of the journey continues in the album.';
 $('status').textContent='You reached the return. Pre-save the album or walk again.';
}
$('begin').addEventListener('click',begin);
$('pause').addEventListener('click',()=>setPaused(!paused));
$('resume').addEventListener('click',()=>setPaused(false));
$('inspect').addEventListener('click',inspect);
$('leave-inspect').addEventListener('click',closeInspection);
$('restart').addEventListener('click',()=>{
 end.hidden=true;hud.hidden=false;motion=initialState();priorMotion={...motion};yaw=0;pitch=-.04;
 finished=false;started=true;inspecting=false;paused=false;hasInspected=false;
 score.setSceneLevel(1);if(score.audio.paused)void score.play();
 touch.hidden=!coarse;$('reticle').hidden=false;art.sky.material.uniforms.warm.value=0;
 previous=performance.now();canvas.focus();
});
document.addEventListener('keydown',e=>{
 if(inspecting){if(e.code==='Escape'){e.preventDefault();closeInspection();}return;}
 if(e.code==='Escape'){e.preventDefault();if(started&&!finished)setPaused(!paused);return;}
 if(e.target instanceof HTMLElement&&e.target.closest('a,button,input,textarea'))return;
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
 if(e.code==='KeyM'&&started){toggleMusic();return;}
 if(e.code==='KeyE'){inspect();return;}
 if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))activeKeys.add(e.code);
});
document.addEventListener('keyup',e=>activeKeys.delete(e.code));
function look(dx,dy){
 if(!started||paused||inspecting||finished)return;
 const scale=Number(sensitivity.value)||1;
 yaw+=dx*.00215*scale;
 pitch=clamp(pitch-dy*.0017*scale*(invertLook.checked?-1:1),-1.05,.93);
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
 const maxRadius=39;
 const dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy);
 const factor=len>maxRadius?maxRadius/len:1;
 const x=dx*factor,y=dy*factor;
 const magnitude=Math.hypot(x,y)/maxRadius;
 const active=Math.max(0,(magnitude-.11)/.89);
 touchAxes.right=magnitude>0?x/maxRadius/magnitude*active:0;
 touchAxes.forward=magnitude>0?-y/maxRadius/magnitude*active:0;
 stickThumb.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
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
area.addEventListener('pointerdown',e=>{
 if(!inspecting)return;inspectingPointer=e.pointerId;inspectX=e.clientX;inspectY=e.clientY;area.setPointerCapture(e.pointerId);
});
area.addEventListener('pointermove',e=>{
 if(inspectingPointer!==e.pointerId||!inspecting)return;
 const dx=e.clientX-inspectX,dy=e.clientY-inspectY;inspectX=e.clientX;inspectY=e.clientY;
 inspectedObject.rotation.y+=dx*.008;inspectedObject.rotation.x=clamp(inspectedObject.rotation.x+dy*.005,-.8,.8);
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
 if(started&&!paused&&!finished){
  accumulator+=delta;let steps=0;
  while(accumulator>=FDT&&steps<4){
   const [f,r]=readInput();
   priorMotion={...motion};
   motion=stepMovement(motion,f,r,yaw);
   walkPhase+=Math.hypot(motion.vx,motion.vz)*FDT;
   accumulator-=FDT;steps++;
  }
  if(steps===4)accumulator=0;
  const nearby=canInspect(motion,yaw);hint.hidden=!nearby;inspectButton.hidden=!nearby;
  if(nearby)hint.textContent=coarse?'AN OBJECT HAS BEEN FOUND':'E / EXAMINE THE FRAGMENT';
  $('stage').textContent=narrativeBeat(motion.z);
  if(atEnd(motion))finish();
 }
 syncCamera();
 art.sky.sphere.position.copy(camera.position);
 if(started&&!reducedMotion&&!paused){
  art.artifact.core.rotation.y+=delta*.075;
  art.artifact.light.intensity=1.25+Math.sin(timestamp*.0015)*.17;
 }
 renderer.render(scene,camera);
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
window.addEventListener('pagehide',()=>{clearKeys();score.destroy();art.dispose();renderer.dispose()});
