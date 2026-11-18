/**
 * The Arrival Quarter: playable spatial integration slice.
 * This uses the original hall and receiver GLBs, real metre-scale collision,
 * evidence sites, stateful access, keyboard/touch and the existing story reducer.
 * It does NOT present an approved NPC or an inhabited civilization. The scene
 * is restricted to development review until genuine character art is accepted.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { availableLocations } from '../aftermath.ts';
import { CLUES, FRAGMENTS, WITNESSES } from '../encounter.ts';
import type { Choice, Event, Fragment, State, Witness } from '../encounter.ts';
import { SITES, worldFrame } from './DistrictSimulation.ts';
import type { Point } from './DistrictSimulation.ts';
import { canInspect, distance, movePlayer, WALK_SPEED } from './PlayerMotor.ts';

const PLAYER_SAVE='arcturian.rebuild.spatial-player.v1';
const EVIDENCE:Readonly<Record<string,{label:string;witness:Witness;site:Point;detail:string}>>={
 household_ledger:{
  label:'Household ledger',witness:'caretaker',site:SITES.ledger,
  detail:'A private record kept at the caretaker household. Its dates matter, and its owner has a stake in disclosure.'
 },
 courier_case:{
  label:'Courier case',witness:'courier',site:{x:22,z:5.6},
  detail:'The case once moved between the district and the refuge. Its custody marks bear on the sequence.'
 },
 communal_receiver:{
  label:'Communal receiver',witness:'apprentice',site:{x:15,z:7.5},
  detail:'Service access and damaged components establish when the public communications hall went silent.'
 }
};
const DIRECTION:Readonly<Record<string,{x:number;z:number}>>={
 KeyW:{x:0,z:-1},ArrowUp:{x:0,z:-1},
 KeyS:{x:0,z:1},ArrowDown:{x:0,z:1},
 KeyA:{x:-1,z:0},ArrowLeft:{x:-1,z:0},
 KeyD:{x:1,z:0},ArrowRight:{x:1,z:0}
};
type WorldOptions={
 readonly getState:()=>State;
 readonly dispatch:(event:Event)=>void;
 readonly onExit:()=>void;
};
export type FieldWorld={
 open:()=>void;
 close:()=>void;
 refresh:()=>void;
};
function requireElement<T extends HTMLElement>(id:string):T{
 const element=document.getElementById(id);
 if(!element)throw new Error('Missing spatial-rehearsal control '+id);
 return element as T;
}
function addBox(scene:THREE.Scene,name:string,w:number,h:number,d:number,color:number,x:number,y:number,z:number):THREE.Mesh{
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshStandardMaterial({color,roughness:.92,metalness:0}));
 mesh.name=name;mesh.position.set(x,y,z);mesh.receiveShadow=true;scene.add(mesh);return mesh;
}
function addMarker(scene:THREE.Scene,position:Point,color:number,radius=.5){
 const material=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.65,depthWrite:false});
 const marker=new THREE.Mesh(new THREE.RingGeometry(radius-.055,radius,36),material);
 marker.rotation.x=-Math.PI/2;marker.position.set(position.x,.055,position.z);
 scene.add(marker);return marker;
}
function safeInitialPosition():Point{
 try{
  const raw=JSON.parse(localStorage.getItem(PLAYER_SAVE)||'null') as unknown;
  if(raw && typeof raw==='object'){
   const pos=raw as Record<string,unknown>;
   if(typeof pos.x==='number' && typeof pos.z==='number' &&
     Number.isFinite(pos.x)&&Number.isFinite(pos.z)&&
     pos.x>=.65&&pos.x<=29.35&&pos.z>=.65&&pos.z<=19.35){
    return {x:pos.x,z:pos.z};
   }
  }
 }catch { /* Browser storage might be unavailable; never block gameplay. */ }
 return {x:14,z:18};
}
function makeButton(label:string,callback:()=>void,disabled=false):HTMLButtonElement{
 const b=document.createElement('button');b.type='button';b.textContent=label;
 b.disabled=disabled;b.addEventListener('click',callback);
 return b;
}
export function createFieldWorld(opts:WorldOptions):FieldWorld{
 const root=requireElement<HTMLElement>('world-rehearsal');
 const canvas=requireElement<HTMLCanvasElement>('world-canvas');
 const status=requireElement<HTMLElement>('world-status');
 const prompt=requireElement<HTMLElement>('world-prompt');
 const position=requireElement<HTMLElement>('world-position');
 const inspectBtn=requireElement<HTMLButtonElement>('world-interact');
 const panel=requireElement<HTMLElement>('world-chronology');
 const closeBtn=requireElement<HTMLButtonElement>('world-exit');
 const touchControls=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-world-move]'));
 let scene:THREE.Scene|null=null;
 let renderer:THREE.WebGLRenderer|null=null;
 let camera:THREE.PerspectiveCamera|null=null;
 let playerMarker:THREE.Group|null=null;
 let receiverLight:THREE.MeshBasicMaterial|null=null;
 let refugeMarker:THREE.MeshBasicMaterial|null=null;
 let doorPanels:THREE.Mesh[]=[];
 let raf=0;
 let last=0;
 let worldTime=0;
 let lastUIUpdate=-999;
 let current:Point=safeInitialPosition();
 let active=false;
 let loading=false;
 let assetErrors:string[]=[];
 let lastPhase='';
 const keys=new Set<string>();
 const touch=new Set<string>();
 let nearestId:string|null=null;
 const sceneObjects:THREE.Object3D[]=[];
 const focusBefore=document.getElementById('enter-quarter');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function gateClosed(){
  const state=opts.getState();
  if(state.phase!=='complete'||availableLocations(state).includes('hall'))return false;
  // Never trap a player already within the building when a story decision
  // changes public access. The panels lock only after safe egress.
  const inside=current.x>4.7&&current.x<15.3&&current.z>.3&&current.z<8.25;
  return !inside;
 }
 function persist(){
  try{localStorage.setItem(PLAYER_SAVE,JSON.stringify(current));}catch{ /* optional */ }
 }
 function message(text:string){
  status.textContent=text;
 }
 function createScene(){
  if(scene||loading)return;
  loading=true;
  try{
   scene=new THREE.Scene();
   scene.background=new THREE.Color('#09172f');
   scene.fog=new THREE.Fog('#111e3c',34,115);
   camera=new THREE.PerspectiveCamera(57,1,.12,220);
   camera.position.set(current.x+4,5,current.z+7.5);
   renderer=new THREE.WebGLRenderer({
    canvas,alpha:false,antialias:true,powerPreference:'high-performance'
   });
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   renderer.toneMapping=THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure=1.22;
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.4));
   renderer.shadowMap.enabled=true;
   renderer.shadowMap.type=THREE.PCFSoftShadowMap;
   const ambient=new THREE.HemisphereLight(0x7892ca,0x0c1120,1.45);scene.add(ambient);
   const sunKey=new THREE.DirectionalLight(0xf08c50,2.65);
   sunKey.position.set(-20,34,-25);
   sunKey.castShadow=true;sunKey.shadow.mapSize.set(1024,1024);
   sunKey.shadow.camera.left=-38;sunKey.shadow.camera.right=38;
   sunKey.shadow.camera.top=35;sunKey.shadow.camera.bottom=-35;
   sunKey.shadow.normalBias=.025;scene.add(sunKey);
   const sun=new THREE.Mesh(new THREE.SphereGeometry(7,40,24),
    new THREE.MeshBasicMaterial({color:0xe3471b,toneMapped:false}));
   sun.position.set(-34,32,-100);scene.add(sun);
   const ground=new THREE.Mesh(new THREE.PlaneGeometry(44,38),
    new THREE.MeshStandardMaterial({color:0x1b3666,roughness:1}));
   ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;
   ground.position.set(15,-.07,10);scene.add(ground);
   // Paths here are navigation surfaces, not falsely completed architecture.
   addBox(scene,'public approach',2.7,.045,10.7,0x5b5870,10,.0,13.9);
   addBox(scene,'courier service route',11,.04,1.5,0x3e4566,20,.005,12.2);
   addBox(scene,'workshop walkway',1.6,.04,7.0,0x55506b,16.9,.003,15.4);
   addBox(scene,'record stand',.7,.8,.5,0x504260,4.4,.4,5.2);
   addBox(scene,'household ledger',.55,.07,.36,0x674961,4.4,.84,5.2);
   addBox(scene,'courier case',.82,.36,.54,0x725645,22,.23,5.6);
   addBox(scene,'case handle',.27,.09,.08,0x47314a,22,.47,5.6);
   for(const obj of Object.values(EVIDENCE))addMarker(scene,obj.site,0xc99d66,.62);
   const refugeRing=addMarker(scene,SITES.refuge,0x6776b0,.9);
   refugeMarker=refugeRing.material as THREE.MeshBasicMaterial;
   playerMarker=new THREE.Group();
   const ring=new THREE.Mesh(new THREE.RingGeometry(.26,.38,32),
    new THREE.MeshBasicMaterial({color:0xc9b897,side:THREE.DoubleSide}));
   ring.rotation.x=-Math.PI/2;ring.position.y=.075;
   playerMarker.add(ring);
   const needle=new THREE.Mesh(new THREE.ConeGeometry(.11,.34,3),
    new THREE.MeshBasicMaterial({color:0xe6a37a}));
   needle.rotation.x=-Math.PI/2;needle.position.set(0,.08,-.46);
   playerMarker.add(needle);
   playerMarker.position.set(current.x,0,current.z);
   scene.add(playerMarker);
   for(const side of [-1,1]){
    const panelMesh=addBox(scene,'hall access panel',1.24,2.83,.10,0x50324d,
      10+side*.63,1.54,8.36);
    panelMesh.castShadow=true;doorPanels.push(panelMesh);
   }
   const indicator=new THREE.Mesh(new THREE.TorusGeometry(.46,.045,8,40),
    new THREE.MeshBasicMaterial({color:0x5b668f}));
   indicator.rotation.x=-Math.PI/2;
   indicator.position.set(15,1.2,7.5);
   scene.add(indicator);
   receiverLight=indicator.material as THREE.MeshBasicMaterial;
   for(const object of [ground,refugeRing,indicator,...doorPanels])sceneObjects.push(object);
   loading=false;
   void loadAuthoredModels(scene).then(warnings=>{
    assetErrors=warnings;
    root.dataset.assets=warnings.length?'partial':'ready';
    if(warnings.length)message('Spatial study partly available: '+warnings.join(' '));
    else message('Hall and receiver loaded. Investigate their physical locations.');
   });
  }catch(error){
   loading=false;
   message('3D rendering unavailable: '+(error instanceof Error?error.message:String(error))+
    '. The investigation remains accessible below the scene.');
   canvas.hidden=true;
  }
 }
 async function loadAuthoredModels(world:THREE.Scene):Promise<string[]>{
  const loader=new GLTFLoader();
  const specs=[
   {path:'/models/ENV-003-working-listening-hall-blockout-v01.glb',name:'Working hall blockout',x:10,z:8.4,rotation:Math.PI},
   {path:'/models/PRP-001-civic-receiver-v04.glb',name:'Communal receiver prototype',x:15,z:7.5,rotation:0}
  ];
  const results=await Promise.allSettled(specs.map(s=>loader.loadAsync(s.path)));
  const warnings:string[]=[];
  results.forEach((result,i)=>{
   const spec=specs[i];
   if(result.status==='rejected'){
    warnings.push(spec.name+' failed to load.');
    return;
   }
   const model=result.value.scene;
   model.position.set(spec.x,0,spec.z);
   model.rotation.y=spec.rotation;
   model.traverse(obj=>{
    if(obj instanceof THREE.Mesh){
     obj.castShadow=true;obj.receiveShadow=true;
    }
   });
   model.name=spec.name;
   world.add(model);
   sceneObjects.push(model);
  });
  return warnings;
 }
 function stageSize(){
  if(!renderer||!camera)return;
  const width=Math.max(1,root.clientWidth),height=Math.max(1,root.clientHeight);
  camera.aspect=width/height;camera.updateProjectionMatrix();
  renderer.setSize(width,height,false);
 }
 function updateVisualState(dt:number){
  if(!receiverLight||!refugeMarker)return;
  const story=opts.getState();
  const disclose=story.phase==='complete'&&story.choice==='disclose';
  const hallAllowed=story.phase!=='complete'||availableLocations(story).includes('hall');
  receiverLight.color.setHex(disclose?0x9bd8d5:0x8e7375);
  refugeMarker.color.setHex(disclose?0xd1b082:0x6476a6);
  doorPanels.forEach((p,index)=>{
   const targetX=hallAllowed?(index===0?8.15:11.85):(index===0?9.37:10.63);
   const factor=reduced.matches?1:Math.min(1,dt*5);
   p.position.x+=(targetX-p.position.x)*factor;
  });
 }
 function currentEvidence(){
  let id:string|null=null,near=Infinity;
  const gate=gateClosed();
  for(const [item,data] of Object.entries(EVIDENCE)){
   const d=distance(current,data.site);
   if(d<near&&canInspect(current,data.site,gate)){near=d;id=item;}
  }
  return id;
 }
 function interact(){
  const item=nearestId?EVIDENCE[nearestId]:null;
  if(!item){
   message('Move closer to a record site. Walls and closed doors block inspection.');
   return;
  }
  prompt.textContent=item.label+': '+item.detail;
  const story=opts.getState();
  if(story.phase==='hear'&&!story.heard.includes(item.witness)){
   opts.dispatch({type:'HEAR',witness:item.witness});
   prompt.textContent=item.label+': '+item.detail+
    ' Provisional '+WITNESSES[item.witness].role+' account: '+WITNESSES[item.witness].statement+
    ' No resident performance or voice is represented in this build.';
   message('Account connected to evidence at '+item.label+'.');
  }else{
   message('Physical '+item.label+' inspected. Recorded story state unchanged.');
  }
  refresh();
 }
 function addChronologyButton(text:string,callback:()=>void,selected=false){
  const b=makeButton(text,callback);
  if(selected){b.setAttribute('aria-pressed','true');b.className='chosen';}
  panel.append(b);
 }
 function refresh(){
  const story=opts.getState();
  const fingerprint=JSON.stringify({
   phase:story.phase,heard:story.heard,order:story.order,trust:story.trust,
   choice:story.choice,attempts:story.attempts,lastError:story.lastError
  });
  if(fingerprint===lastPhase)return;
  lastPhase=fingerprint;
  panel.replaceChildren();
  if(story.phase==='hear'){
   const paragraph=document.createElement('p');
   paragraph.textContent='Record sites surveyed: '+story.heard.length+'/3. Locate the ledger, courier case and public receiver. Their owners are NOT modeled yet.';
   panel.append(paragraph);
  }else if(story.phase==='reconstruct'){
   const h=document.createElement('h3');h.textContent='Reconstruct the dispatch';panel.append(h);
   const p=document.createElement('p');
   p.textContent='Order the three events using evidence recovered from the district. This accessible reasoning panel is provisional.';
   panel.append(p);
   for(const clue of FRAGMENTS){
    const selected=story.order.includes(clue);
    addChronologyButton(CLUES[clue].title,()=>{
     const order=selected?story.order.filter(x=>x!==clue):[...story.order,clue];
     opts.dispatch({type:'ARRANGE',order:order as Fragment[]});refresh();
    },selected);
   }
   const path=document.createElement('p');
   path.textContent='Sequence: '+(story.order.map(x=>CLUES[x].title).join(' → ')||'none');
   panel.append(path);
   addChronologyButton('Clear',()=>{opts.dispatch({type:'ARRANGE',order:[]});refresh();});
   const submit=makeButton('Check sequence',()=>{opts.dispatch({type:'SUBMIT'});refresh();},story.order.length!==3);
   panel.append(submit);
   if(story.lastError){
    const warning=document.createElement('p');warning.textContent=story.lastError;
    warning.className='world-warning';panel.append(warning);
   }
   const t=document.createElement('p');t.textContent='Trust: '+story.trust+'/2';panel.append(t);
  }else if(story.phase==='decide'){
   const h=document.createElement('h3');h.textContent='Who should control the record?';panel.append(h);
   const p=document.createElement('p');
   p.textContent='A provisional community decision. It changes entrance access and listening activity in this spatial study.';
   panel.append(p);
   for(const [choice,label] of [
    ['protect','Protect families’ confidence'],['disclose','Disclose the record']
   ] as const satisfies readonly [Choice,string][]){
    addChronologyButton(label,()=>{opts.dispatch({type:'CHOOSE',choice});refresh();});
   }
  }else{
   const h=document.createElement('h3');h.textContent='Consequences in the district';panel.append(h);
   const access=availableLocations(story);
   const p=document.createElement('p');
   p.textContent='Accessible: '+(access.join(', ')||'none')+
    '. The hall doorway and receiver light now respond to saved narrative state. NPC art and performances remain unbuilt.';
   panel.append(p);
  }
 }
 function movementVector(){
  let x=0,z=0;
  for(const code of [...keys,...touch]){
   const d=DIRECTION[code];if(d){x+=d.x;z+=d.z;}
  }
  const length=Math.hypot(x,z);
  return length?{x:x/length,z:z/length}:{x:0,z:0};
 }
 function animate(time:number){
  if(!active)return;
  raf=requestAnimationFrame(animate);
  const dt=Math.min(.05,Math.max(0,last?(time-last)/1000:0));
  last=time;worldTime+=dt;
  const v=movementVector();
  if(v.x||v.z)current=movePlayer(current,v.x*WALK_SPEED*dt,v.z*WALK_SPEED*dt,gateClosed());
  if(playerMarker)playerMarker.position.set(current.x,0,current.z);
  if(camera&&scene&&renderer){
   const target=new THREE.Vector3(current.x,1.25,current.z);
   const desired=new THREE.Vector3(current.x+4.1,4.7,current.z+7.1);
   const ratio=reduced.matches?1:1-Math.exp(-dt*7.5);
   camera.position.lerp(desired,ratio);
   camera.lookAt(target);
   updateVisualState(dt);
   renderer.render(scene,camera);
  }
  if(worldTime-lastUIUpdate>.13){
   lastUIUpdate=worldTime;
   nearestId=currentEvidence();
   root.dataset.playerX=current.x.toFixed(2);
   root.dataset.playerZ=current.z.toFixed(2);
   position.textContent='Survey coordinates: '+current.x.toFixed(1)+'m E / '+current.z.toFixed(1)+'m S';
   const object=nearestId?EVIDENCE[nearestId]:null;
   inspectBtn.disabled=!object;
   inspectBtn.textContent=object?'Inspect '+object.label:'Inspect nearby evidence';
   const frame=worldFrame(opts.getState(),worldTime);
   const state=opts.getState();
   const access=frame.accessibleLocations;
   const zone=access.length?access.join(', '):'no earned locations';
   if(!assetErrors.length)status.textContent='Spatial rehearsal / '+state.phase+' / access: '+zone+
    ' / 3 residents not yet modeled';
   refresh();
  }
 }
 function keydown(event:KeyboardEvent){
  if(!active)return;
  if(event.code==='Escape'){event.preventDefault();close();return;}
  if(event.code==='KeyE'){
   if(!event.repeat){event.preventDefault();interact();}
   return;
  }
  if(DIRECTION[event.code]){
   event.preventDefault();keys.add(event.code);
  }
 }
 function keyup(event:KeyboardEvent){keys.delete(event.code);}
 function blur(){keys.clear();touch.clear();persist();}
 function open(){
  if(active)return;
  active=true;root.hidden=false;document.body.classList.add('field-open');
  document.querySelector<HTMLElement>('main#play')?.setAttribute('inert','');
  createScene();
  stageSize();last=0;refresh();
  closeBtn.focus({preventScroll:true});
  window.addEventListener('keydown',keydown);
  window.addEventListener('keyup',keyup);
  window.addEventListener('blur',blur);
  window.addEventListener('resize',stageSize);
  raf=requestAnimationFrame(animate);
 }
 function close(){
  if(!active)return;
  active=false;cancelAnimationFrame(raf);
  keys.clear();touch.clear();persist();
  root.hidden=true;document.body.classList.remove('field-open');
  document.querySelector<HTMLElement>('main#play')?.removeAttribute('inert');
  window.removeEventListener('keydown',keydown);
  window.removeEventListener('keyup',keyup);
  window.removeEventListener('blur',blur);
  window.removeEventListener('resize',stageSize);
  opts.onExit();focusBefore?.focus({preventScroll:true});
 }
 inspectBtn.addEventListener('click',interact);
 closeBtn.addEventListener('click',close);
 for(const button of touchControls){
  const code=button.dataset.worldMove;
  if(!code||!DIRECTION[code])continue;
  button.addEventListener('pointerdown',e=>{
   e.preventDefault();touch.add(code);
   button.setPointerCapture(e.pointerId);
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture']){
   button.addEventListener(name,()=>touch.delete(code));
  }
 }
 return {open,close,refresh};
}
