import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {inspectNpc} from './assetGate';
import './style.css';
import {
  CLUES, FRAGMENTS, INITIAL, WITNESSES, WITNESS_ORDER, replay, transition
} from './encounter';
import type { Choice, Event, Fragment, State, Witness } from './encounter';

const SAVE_KEY='arcturian.rebuild.encounter.v1';
const root=document.getElementById('content');
const stage=document.getElementById('stage');
if(!root||!stage)throw new Error('Required root nodes are missing');
const content=root;
let log:Event[]=[];
try {
  const stored=localStorage.getItem(SAVE_KEY);
  if(stored){
    const parsed:unknown=JSON.parse(stored);
    if(Array.isArray(parsed)&&parsed.length<=100&&parsed.every(x=>typeof x==='object')){
      log=parsed as Event[];
    }
  }
}catch { /* Storage blocked or corrupt; playable without it. */ }
let state:State=replay(log);
function dispatch(event:Event) {
  const next=transition(state,event);
  if(next===state)return;
  log.push(event);
  state=next;
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(log));}catch{ /* memory-only */ }
  render();
}
function node<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,className?:string):HTMLElementTagNameMap[K] {
  const el=document.createElement(tag);
  if(text!==undefined)el.textContent=text;
  if(className)el.className=className;
  return el;
}
function action(label:string,callback:()=>void,className='action') {
  const b=node('button',label,className);
  b.type='button';
  b.addEventListener('click',callback);
  return b;
}
function heading(title:string,sub:string) {
  content.append(node('p','The arrival quarter / incomplete art','eyebrow'));
  const h=node('h2',title);h.id='encounter-title';content.append(h);
  content.append(node('p',sub,'instruction'));
}
function render() {
  content.replaceChildren();
  if(state.phase==='hear'){
    heading('What happened here?','Listen to each account. The three witnesses remember the same event differently.');
    const grid=node('div',undefined,'witnesses');
    for(const witness of WITNESS_ORDER){
      const info=WITNESSES[witness];
      const card=node('article',undefined,'witness');
      card.append(node('h3',info.role));
      if(state.heard.includes(witness)){
        card.append(node('p',info.statement));
        card.append(node('span','ACCOUNT RECORDED','recorded'));
      }else{
        card.append(node('p','An account you have not heard.'));
        card.append(action('Hear '+info.role,()=>dispatch({type:'HEAR',witness})));
      }
      grid.append(card);
    }
    content.append(grid);
    content.append(node('p',String(state.heard.length)+' / 3 accounts heard','counter'));
  }else if(state.phase==='reconstruct'){
    heading('Reconstruct the night','Choose the order of the three events. Your reading of the evidence determines what you can ask next.');
    content.append(node('p','Select each event in the sequence you believe happened.','instruction'));
    const choices=node('div',undefined,'evidence');
    for(const key of FRAGMENTS) {
      const info=CLUES[key];
      const selected=state.order.includes(key);
      const card=node('article',undefined,'evidence-item');
      card.append(node('h3',info.title),node('p',info.evidence));
      card.append(action(selected?'Selected': 'Add to sequence',()=> {
        const order=selected?state.order.filter(x=>x!==key):[...state.order,key];
        dispatch({type:'ARRANGE',order:order as Fragment[]});
      },selected?'action selected':'action'));
      choices.append(card);
    }
    content.append(choices);
    const path=node('ol',undefined,'order');
    for(const f of state.order)path.append(node('li',CLUES[f].title));
    content.append(path);
    const controls=node('div',undefined,'controls');
    controls.append(action('Clear order',()=>dispatch({type:'ARRANGE',order:[]}),'action subdued'));
    const check=action('Present your reconstruction',()=>dispatch({type:'SUBMIT'}));
    check.disabled=state.order.length!==3;controls.append(check);
    content.append(controls);
    if(state.lastError)content.append(node('p',state.lastError,'error'));
    content.append(node('p','Trust remaining: '+state.trust+' / 2. Attempts: '+state.attempts,'counter'));
  }else if(state.phase==='decide'){
    heading('The choice','The message reached the refuge before the hall failed. The silence was real, but the message was not lost.');
    content.append(node('p','The caretaker asks whether to make the hidden record public now, or preserve its location while the families are consulted.','instruction'));
    const choices=node('div',undefined,'decision-grid');
    choices.append(decision('Protect the location','Give families time to decide together. The caretaker trusts Chule, but the district remains uncertain.','protect'));
    choices.append(decision('Disclose the record','Tell everyone where it was kept. The district knows the truth, but the caretaker questions Chule’s judgment.','disclose'));
    content.append(choices);
  }else{
    const ending=state.choice==='protect'
      ? (state.trust>0
        ? 'Chule protects the families’ confidence. The caretaker agrees to help him reach Credo, while the wider community still needs answers.'
        : 'Chule keeps the record private, but his mistaken accusations have damaged trust. The caretaker will not speak for him to Credo.')
      : (state.trust>0
        ? 'Chule reveals the record. The community can respond openly, while the caretaker questions his judgment.'
        : 'Chule reveals the record after misreading the witnesses. Some welcome the truth, but his credibility has been damaged.');
    heading('A consequence, not a collectible',ending);
    content.append(node('p','The next scene is deliberately locked until the civilization, character performances, and approved script meet the quality gate.','instruction'));
    content.append(node('span','MECHANIC PROTOTYPE COMPLETE / STORY NOT YET APPROVED','recorded'));
  }
}
function decision(label:string,description:string,choice:Choice) {
  const card=node('article',undefined,'decision');
  card.append(node('h3',label),node('p',description));
  card.append(action('Choose: '+label,()=>dispatch({type:'CHOOSE',choice})));
  return card;
}
const reset=document.getElementById('reset');
reset?.addEventListener('click',()=>{
  log=[];state=INITIAL;
  try{localStorage.removeItem(SAVE_KEY);}catch{}
  render();
});
render();

// Three.js r187: an intentionally nonrepresentational lighting calibration.
// It is NOT an Arcturian location or a placeholder NPC/world asset.
const scene=new THREE.Scene();
scene.background=new THREE.Color('#07122b');
const camera=new THREE.PerspectiveCamera(40,1,.1,250);
camera.position.set(0,0,28);
const renderer=new THREE.WebGLRenderer({alpha:false,antialias:true,powerPreference:'low-power'});
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));
stage.append(renderer.domElement);
const light=new THREE.HemisphereLight(0x25447f,0x111021,1.4);scene.add(light);
const rim=new THREE.DirectionalLight(0xff914e,2.0);rim.position.set(-5,8,4);scene.add(rim);
const sun=new THREE.Mesh(
  new THREE.SphereGeometry(5.4,64,32),
  new THREE.MeshBasicMaterial({color:0xdd381d,depthWrite:false})
);
sun.position.set(5,0,-25);
scene.add(sun);
const halo=new THREE.Mesh(
  new THREE.RingGeometry(5.55,6.02,96),
  new THREE.MeshBasicMaterial({color:0x9e382b,transparent:true,opacity:.25,side:THREE.DoubleSide})
);
halo.position.copy(sun.position);scene.add(halo);

// Asset gate: no invented procedural humanoids. Renderer only loads approved GLB.
const APPROVED_WORLD: string|null=null;
const APPROVED_NPCS: readonly {id:Witness;url:string;position:[number,number,number];approved:boolean;rights:string;reference:string}[]=[];
const characterMixers:THREE.AnimationMixer[]=[];
async function loadApprovedAssets() {
  const loader=new GLTFLoader();
  if(APPROVED_WORLD){
    try{const asset=await loader.loadAsync(APPROVED_WORLD);scene.add(asset.scene);}
    catch(error){console.warn('Approved world asset failed to load',error);}
  }
  for(const npc of APPROVED_NPCS){
    if(!npc.approved||!npc.rights||!npc.reference){
      console.warn('Unapproved or undocumented character skipped',npc.id);continue;
    }
    try{
      const asset=await loader.loadAsync(npc.url);
      const assessment=inspectNpc(asset);
      if(!assessment.acceptableForArtReview){
        console.warn('Character failed technical art gate',npc.id,assessment.warnings);continue;
      }
      asset.scene.position.set(...npc.position);
      scene.add(asset.scene);
      const idle=asset.animations.find(clip=>clip.name.toLowerCase().includes('idle'));
      if(idle){
        const mixer=new THREE.AnimationMixer(asset.scene);
        mixer.clipAction(idle).play();characterMixers.push(mixer);
      }
    }catch(error){console.warn('Approved character asset failed to load',npc.id,error);}
  }
}
void loadApprovedAssets();
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const size=()=>{
  const w=Math.max(1,stage.clientWidth),h=Math.max(1,stage.clientHeight);
  camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
};
const observer=new ResizeObserver(size);observer.observe(stage);
size();
let raf=0;
const clock=new THREE.Clock();
function frame(){
  raf=requestAnimationFrame(frame);
  const delta=clock.getDelta();
  if(document.hidden)return;
  for(const mixer of characterMixers)mixer.update(delta);
  if(!reduced.matches)halo.rotation.z+=.00018;
  renderer.render(scene,camera);
}
frame();
window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);observer.disconnect();});
