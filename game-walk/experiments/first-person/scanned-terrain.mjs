// Opt-in physical surface material for original 3D world review.
// Source: Poly Haven / Rob Tuytel, rocks_ground_01, CC0 (see production manifest).
import * as THREE from 'three';
import normalUrl from './assets/scans/rocks_ground_01_nor_gl_512q65.webp?url';
import roughUrl from './assets/scans/rocks_ground_01_rough_256q90.webp?url';
function configure(tex){
 tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
 tex.repeat.set(48,80); // about 4.3m across each repeat on the 205x350m world mesh
 tex.anisotropy=4;
 tex.colorSpace=THREE.NoColorSpace; // OpenGL normal vectors + scalar roughness
 tex.needsUpdate=true;
 return tex;
}
/** Keep the existing procedural map if any one photographic scan cannot load. */
export async function applyScannedTerrain(material,state,register){
 const loader=new THREE.TextureLoader();
 async function apply(name,url,slot){
  try{
   const texture=configure(await loader.loadAsync(url));
   register(texture);
   material[slot]=texture;
   if(slot==='normalMap')material.normalScale.set(.34,.34);
   material.needsUpdate=true;
   state[name]='ready';
  }catch(error){
   state[name]='failed';
   console.warn('CC0 rock scan unavailable; preserving original procedural fallback:',name,error);
  }
 }
 await Promise.all([apply('normal',normalUrl,'normalMap'),apply('rough',roughUrl,'roughnessMap')]);
}
