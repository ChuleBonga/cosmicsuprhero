import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Color3, Color4 } from '@babylonjs/core/Maths/math';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader';
import type { AssetContainer } from '@babylonjs/core/assetContainer';
import '@babylonjs/loaders/glTF';
import './style.css';

const canvas=document.querySelector<HTMLCanvasElement>('#viewer');
const input=document.querySelector<HTMLInputElement>('#model');
const wire=document.querySelector<HTMLInputElement>('#wireframe');
const autoplay=document.querySelector<HTMLInputElement>('#autoplay');
const reset=document.querySelector<HTMLButtonElement>('#reset-camera');
const metrics=document.querySelector<HTMLElement>('#metrics');
const status=document.querySelector<HTMLElement>('#status');
const fallback=document.querySelector<HTMLElement>('#canvas-fallback');
if(!canvas||!input||!wire||!autoplay||!reset||!metrics||!status||!fallback)
  throw new Error('Asset review controls missing');
const ui={canvas,input,wire,autoplay,reset,metrics,status,fallback};
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
function frameModel() {
  if(!active)return;
  const meshes=active.meshes.filter(m=>m.getTotalVertices()>0);
  if(!meshes.length)return;
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
}
function showMetrics(file:File,asset:AssetContainer) {
  ui.metrics.replaceChildren();
  item('File',file.name);item('Transfer bytes',file.size);
  item('Meshes',asset.meshes.length);item('Skinned skeletons',asset.skeletons.length);
  item('Animation groups',asset.animationGroups.length);
  item('Materials',asset.materials.length);item('Textures',asset.textures.length);
  item('Model cameras',asset.cameras.length);
  item('Draw calls now',scene.getEngine().getFps().toFixed(0)+' fps (render only)');
  const groups=asset.animationGroups.map(g=>g.name||'Unnamed').join(', ')||'None';
  item('Animation clips',groups);
}
async function loadFile(file:File) {
  if(file.size>75*1024*1024){setStatus('File is too large for this review (>75 MB). Optimize and retry.');return;}
  if(!file.name.toLowerCase().endsWith('.glb')){setStatus('Please supply a self-contained GLB, not a folder or loose glTF.');return;}
  const objectURL=URL.createObjectURL(file);
  setStatus('Loading local GLB. No upload is performed.');
  try {
    const incoming=await LoadAssetContainerAsync(objectURL,scene,{pluginExtension:'.glb'});
    if(active){active.removeAllFromScene();active.dispose();}
    active=incoming;active.addAllToScene();
    frameModel();
    showMetrics(file,active);
    if(ui.autoplay.checked)active.animationGroups[0]?.start(true);
    const problems:string[]=[];
    if(!active.meshes.length)problems.push('no meshes');
    if(!active.skeletons.length)problems.push('no rigged skeleton');
    if(!active.animationGroups.length)problems.push('no animation clips');
    if(!active.textures.length)problems.push('no image textures');
    setStatus(problems.length
      ? 'Technical art review issues: '+problems.join(', ')+'. Inspect before any approval.'
      : 'Model loaded. Technical counts present; still requires actual visual reference comparison.');
    updateWireframe();
  }catch(error){setStatus('GLB import failed: '+(error instanceof Error?error.message:String(error)));}
  finally{URL.revokeObjectURL(objectURL);}
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
    hemi.intensity=.72;hemi.diffuse=new Color3(.38,.53,.88);hemi.groundColor=new Color3(.07,.07,.12);
    const key=new DirectionalLight('warm key',new Vector3(-.7,-1,.4),scene);
    key.intensity=1.7;key.diffuse=new Color3(1,.69,.45);
    engine.runRenderLoop(()=>{if(!document.hidden)scene.render();});
    window.addEventListener('resize',()=>engine.resize());
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)engine.resize();});
    window.addEventListener('pagehide',()=>{active?.dispose();scene.dispose();engine.dispose();});
  }catch(error){
    ui.fallback.hidden=false;
    ui.canvas.hidden=true;
    setStatus('WebGL unavailable. You may still review the source and asset criteria.');
    console.warn('Asset QA WebGL unavailable',error);
    return;
  }
  ui.input.addEventListener('change',()=>{const file=ui.input.files?.[0];if(file)void loadFile(file);});
  ui.wire.addEventListener('change',updateWireframe);
  ui.autoplay.addEventListener('change',()=>{
    if(!active)return;
    for(const a of active.animationGroups){if(ui.autoplay.checked)a.start(true);else a.stop();}
  });
  ui.reset.addEventListener('click',frameModel);
}
init();
