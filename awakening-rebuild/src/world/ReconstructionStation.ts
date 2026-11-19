/**
 * Physically operable, hand-authored chronology instrument.
 * In the rehearsal, the player can use the 3D slugs with pointer/touch,
 * or the same reducer through keyboard and accessible text controls.
 * Not approved civilization art; no fake resident is introduced.
 */
import * as THREE from 'three';
import {FRAGMENTS,CLUES} from '../encounter.ts';
import type {Fragment,State} from '../encounter.ts';
import {STATION_POSITION,stationSlot} from './ReconstructionLogic.ts';

type Slug={fragment:Fragment;mesh:THREE.Mesh;label:THREE.Mesh;source:number};
export interface ChronologyInstrument{
 readonly group:THREE.Group;
 update:(state:State,dt:number)=>void;
 chooseAt:(event:PointerEvent,canvas:HTMLCanvasElement,camera:THREE.Camera)=>Fragment|null;
}

function solid(w:number,h:number,d:number,color:number):THREE.Mesh{
 const mesh=new THREE.Mesh(
  new THREE.BoxGeometry(w,h,d),
  new THREE.MeshStandardMaterial({color,roughness:.82,metalness:.12})
 );
 mesh.castShadow=false;mesh.receiveShadow=true;return mesh;
}
function labelTexture(text:string):THREE.CanvasTexture{
 const canvas=document.createElement('canvas');
 canvas.width=512;canvas.height=128;
 const ctx=canvas.getContext('2d');
 if(!ctx)throw new Error('2D canvas unavailable for chronology instrument');
 ctx.clearRect(0,0,512,128);
 ctx.fillStyle='#e3c6a1';
 ctx.font='600 58px Georgia,serif';
 ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillText(text.toUpperCase(),256,65,492);
 const texture=new THREE.CanvasTexture(canvas);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.anisotropy=2;
 return texture;
}
export function createChronologyInstrument(scene:THREE.Scene):ChronologyInstrument{
 const group=new THREE.Group();
 group.name='PRP-PROVISIONAL signal chronology workbench';
 group.position.set(STATION_POSITION.x,0,STATION_POSITION.z);
 scene.add(group);
 const table=solid(3.15,.15,1.85,0x323b54);
 table.name='Repairable chronology worktop';
 table.position.set(0,.79,0);
 group.add(table);
 for(const x of [-1.25,1.25]){
  const leg=solid(.17,.78,.17,0x3b4050);
  leg.position.set(x,.37,0);
  leg.name='Workbench support';group.add(leg);
 }
 const deck=solid(3.00,.04,1.70,0x5b5261);
 deck.position.set(0,.885,0);group.add(deck);
 const rail=solid(2.65,.035,.12,0x937352);
 rail.position.set(0,.93,-.32);rail.name='Timeline receiving rail';
 group.add(rail);
 const sockets:number[]=[-.87,0,.87];
 for(let i=0;i<3;i++){
  const ring=new THREE.Mesh(
   new THREE.RingGeometry(.29,.34,32),
   new THREE.MeshStandardMaterial({color:0xb49b76,roughness:.74,side:THREE.DoubleSide})
  );
  ring.name='Timeline socket '+String(i+1);
  ring.rotation.x=-Math.PI/2;
  ring.position.set(sockets[i],.927,-.34);
  group.add(ring);
 }
 const slugs:Slug[]=FRAGMENTS.map((fragment,i)=>{
  const x=sockets[i];
  const mesh=solid(.75,.075,.38,0x64465e);
  mesh.name='Movable chronology slug '+fragment;
  mesh.position.set(x,.965,.46);
  mesh.userData.fragment=fragment;
  group.add(mesh);
  const label=new THREE.Mesh(
   new THREE.PlaneGeometry(.7,.22),
   new THREE.MeshBasicMaterial({map:labelTexture(CLUES[fragment].title),
    transparent:true,side:THREE.DoubleSide,depthWrite:false})
  );
  label.rotation.x=-Math.PI/2;
  label.position.set(0,.046,0);
  label.name='Engraved '+fragment;
  mesh.add(label);
  return {fragment,mesh,label,source:x};
 });
 const status=solid(1.05,.055,.10,0x766a5a);
 status.name='Manual interpretation status';
 status.position.set(0,.936,.815);group.add(status);
 const raycaster=new THREE.Raycaster();
 const pointer=new THREE.Vector2();
 return {
  group,
  update(story,dt){
   const resolved=story.phase==='decide'||story.phase==='complete';
   for(const slug of slugs){
    const slot=stationSlot(story.order,slug.fragment);
    const x=slot===null?slug.source:sockets[slot];
    const z=slot===null?.46:-.34;
    const target=new THREE.Vector3(x,.965,z);
    slug.mesh.position.lerp(target,Math.min(1,Math.max(0,dt*7)));
    const mat=slug.mesh.material as THREE.MeshStandardMaterial;
    mat.color.setHex(slot===null?0x65475e:0x977455);
   }
   const mat=status.material as THREE.MeshStandardMaterial;
   mat.color.setHex(story.lastError?0x9a554a:resolved?0x829a93:0x756956);
   status.userData.state=story.phase;
   group.userData.order=story.order.join(',');
  },
  chooseAt(event,canvas,camera){
   const bounds=canvas.getBoundingClientRect();
   if(bounds.width===0||bounds.height===0)return null;
   pointer.set(((event.clientX-bounds.left)/bounds.width)*2-1,
    -((event.clientY-bounds.top)/bounds.height)*2+1);
   raycaster.setFromCamera(pointer,camera);
   const hits=raycaster.intersectObjects(slugs.map(s=>s.mesh),false);
   return (hits[0]?.object.userData.fragment as Fragment|undefined)??null;
  }
 };
}
