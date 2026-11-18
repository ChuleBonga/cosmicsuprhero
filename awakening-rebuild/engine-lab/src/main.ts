import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Color3, Color4 } from '@babylonjs/core/Maths/math';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader';
import type { AssetContainer } from '@babylonjs/core/assetContainer';
import '@babylonjs/loaders/glTF';
import { inspectAsset } from './assetReview';
import type { AssetRole } from './assetReview';
import './style.css';

const canvas=document.querySelector<HTMLCanvasElement>('#viewer');
const stageContainer=document.querySelector<HTMLElement>('.stage');
const stageEmpty=document.querySelector<HTMLElement>('#stage-empty');
const input=document.querySelector<HTMLInputElement>('#model');
const roleInput=document.querySelector<HTMLSelectElement>('#asset-role');
const wire=document.querySelector<HTMLInputElement>('#wireframe');
const autoplay=document.querySelector<HTMLInputElement>('#autoplay');
const reset=document.querySelector<HTMLButtonElement>('#reset-camera');
const builtInButton=document.querySelector<HTMLButtonElement>('#load-civic-receiver');
const metrics=document.querySelector<HTMLElement>('#metrics');
const status=document.querySelector<HTMLElement>('#status');
const fallback=document.querySelector<HTMLElement>('#canvas-fallback');
if(!canvas||!stageContainer||!stageEmpty||!input||!roleInput||!wire||!autoplay||!reset||!builtInButton||!metrics||!status||!fallback)
  throw new Error('Asset review controls missing');
const ui={canvas,stageContainer,stageEmpty,input,roleInput,wire,autoplay,reset,builtInButton,metrics,status,fallback};
let activeFile: File|null=null;
let fileRequestVersion=0;
let lastHeight=0;
let engine:Engine;
let scene:Scene;
let camera:ArcRotateCamera;
let active:AssetContainer|null=null;
function setStatus(s:string){ui.status.textContent=s;}
function item(k:string,v:string|number) {
  const dt=document.createElement('dt');dt.textContent=k;
  const dd=document.createElement('dd');dd.textContent=String(v);
  ui.metrics.append(dt,dd);
}
function frameModel(): number {
  if(!active)return 0;
  const meshes=active.meshes.filter(m=>m.getTotalVertices()>0);
  if(!meshes.length)return 0;
  let min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);
  for(const m of meshes){
    m.computeWorldMatrix(true);
    const box=m.getBoundingInfo().boundingBox;
    min=Vector3.Minimize(min,box.minimumWorld);
    max=Vector3.Maximize(max,box.maximumWorld);
  }
  const center=min.add(max).scale(.5);
  const ext=max.subtract(min);
  if(Number.isFinite(ext.length())&&ext.length()>0){
    camera.setTarget(center);
    camera.radius=Math.max(1.3,ext.length()*1.5);
    camera.lowerRadiusLimit=Math.max(.1,ext.length()*.35);
    camera.upperRadiusLimit=Math.max(4,ext.length()*5);
  }
  lastHeight=ext.y;
  return ext.y;
}
function showMetrics(file:File,asset:AssetContainer) {
  ui.metrics.replaceChildren();
  item('File',file.name);item('Transfer bytes',file.size);
  item('Meshes',asset.meshes.length);item('Skinned skeletons',asset.skeletons.length);
  item('Animation groups',asset.animationGroups.length);
  item('Materials',asset.materials.length);item('Textures',asset.textures.length);
  item('Model cameras',asset.cameras.length);
  const triangles=asset.meshes.reduce((n,m)=>n + Math.round(m.getTotalIndices()/3),0);
  item('Triangles',triangles.toLocaleString());
  item('Height (m)',lastHeight.toFixed(2));
  item('Frame rate (diagnostic)',scene.getEngine().getFps().toFixed(0)+' fps (render only, not benchmark)');
  const groups=asset.animationGroups.map(g=>g.name||'Unnamed').join(', ')||'None';
  item('Animation clips',groups);
  const review=inspectAsset({
    meshes:asset.meshes.filter(m=>m.getTotalVertices()>0).length,
    skeletons:asset.skeletons.length,
    animationNames:asset.animationGroups.map(g=>g.name),
    textureCount:asset.textures.length,
    materialCount:asset.materials.length,
    triangles,
    fileBytes:file.size,
    heightMetres:lastHeight
  },ui.roleInput.value as AssetRole);
  setStatus(review.verdict==='reject'
    ? 'Technical intake FAILED: '+review.reasons.join('; ')+'. NOT APPROVED.'
    : 'Technical intake passed for this asset role. Visual reference, provenance, performance and animation QA still required. NOT APPROVED.');
}
async function loadFile(file:File) {
  const requestVersion=++fileRequestVersion;
  if(file.size>75*1024*1024){setStatus('File is too large for this review (>75 MB). Optimize and retry.');return;}
  if(!file.name.toLowerCase().endsWith('.glb')){setStatus('Please supply a self-contained GLB, not a folder or loose glTF.');return;}
  const objectURL=URL.createObjectURL(file);
  setStatus('Loading local GLB. No upload is performed.');
  try {
    const incoming=await LoadAssetContainerAsync(objectURL,scene,{pluginExtension:'.glb'});
    if(requestVersion!==fileRequestVersion){incoming.dispose();return;}
    if(active){active.removeAllFromScene();active.dispose();}
    active=incoming;activeFile=file;active.addAllToScene();
    ui.stageEmpty.hidden=true;
    ui.stageContainer.classList.remove('is-empty');
    // The initial empty-state stage is much shorter on mobile. Its height
    // changes when the model loads, without a window resize event.
    engine.resize();
    requestAnimationFrame(()=>engine.resize());
    frameModel();
    showMetrics(file,active);
    if(ui.autoplay.checked)active.animationGroups[0]?.start(true);
    updateWireframe();
  }catch(error){
    if(requestVersion===fileRequestVersion)setStatus('GLB import failed: '+(error instanceof Error?error.message:String(error)));
  }
  finally{URL.revokeObjectURL(objectURL);}
}

async function loadBuiltInCivicReceiver(){
  const startVersion=fileRequestVersion;
  try{
    const response=await fetch('/models/PRP-001-civic-receiver-v04.glb');
    if(!response.ok)throw new Error('Reference model HTTP '+response.status);
    const bytes=await response.arrayBuffer();
    if(fileRequestVersion!==startVersion)return;
    ui.roleInput.value='prop';
    await loadFile(new File([bytes],'PRP-001-civic-receiver-v04.glb',{type:'model/gltf-binary'}));
  }catch(error){
    if(fileRequestVersion===startVersion)setStatus('Original project receiver could not load: '+(error instanceof Error?error.message:String(error)));
  }
}
function updateWireframe(){
  if(!active)return;
  for(const material of active.materials)material.wireframe=ui.wire.checked;
}
function init(){
  try{
    engine=new Engine(ui.canvas,true,{preserveDrawingBuffer:false,stencil:true},true);
    scene=new Scene(engine);scene.clearColor=new Color4(.026,.045,.1,1);
    scene.useRightHandedSystem=true;
    camera=new ArcRotateCamera('QA orbit',Math.PI/3,Math.PI/2.6,5,new Vector3(0,.9,0),scene);
    camera.attachControl(ui.canvas,true);
    camera.lowerBetaLimit=.1;camera.upperBetaLimit=Math.PI-.1;
    camera.wheelDeltaPercentage=.04;
    const hemi=new HemisphericLight('cool bounce',new Vector3(0,1,0),scene);
    // Studio look-development light is physically restrained but readable:
    // a warm key and diffuse cobalt fill, without cosmetic bloom/glow.
    hemi.intensity=1.32;
    hemi.diffuse=new Color3(.53,.62,.90);
    hemi.groundColor=new Color3(.13,.15,.25);
    const key=new DirectionalLight('warm key',new Vector3(-.7,-1,.4),scene);
    key.intensity=2.35;key.diffuse=new Color3(1,.73,.51);
    const rim=new DirectionalLight('cool edge',new Vector3(.8,-.5,-.7),scene);
    rim.intensity=.86;rim.diffuse=new Color3(.48,.61,1);
    scene.imageProcessingConfiguration.exposure=1.18;
    scene.imageProcessingConfiguration.contrast=1.06;
    engine.runRenderLoop(()=>{if(!document.hidden)scene.render();});
    const containerObserver=new ResizeObserver(()=>engine.resize());
    containerObserver.observe(ui.stageContainer);
    window.addEventListener('resize',()=>engine.resize());
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)engine.resize();});
    window.addEventListener('pagehide',()=>{
      containerObserver.disconnect();
      active?.dispose();
      scene.dispose();
      engine.dispose();
    });
  }catch(error){
    ui.fallback.hidden=false;
    ui.canvas.hidden=true;
    setStatus('WebGL unavailable. You may still review the source and asset criteria.');
    console.warn('Asset QA WebGL unavailable',error);
    return;
  }
  ui.input.addEventListener('change',()=>{const file=ui.input.files?.[0];if(file)void loadFile(file);});
  ui.stageContainer.addEventListener('dragover',event=>{
    if(event.dataTransfer?.types.includes('Files'))event.preventDefault();
  });
  ui.stageContainer.addEventListener('drop',event=>{
    event.preventDefault();
    const file=event.dataTransfer?.files[0];
    if(file)void loadFile(file);
  });
  ui.wire.addEventListener('change',updateWireframe);
  ui.roleInput.addEventListener('change',()=>{
    if(active&&activeFile) showMetrics(activeFile,active);
  });
  ui.autoplay.addEventListener('change',()=>{
    if(!active)return;
    for(const a of active.animationGroups){if(ui.autoplay.checked)a.start(true);else a.stop();}
  });
  ui.reset.addEventListener('click',frameModel);
  ui.builtInButton.addEventListener('click',()=>{void loadBuiltInCivicReceiver();});
  void loadBuiltInCivicReceiver();
}
init();
