/**
 * Reconstruct the existing, original Blender W0 study for the isolated
 * Arrival Quarter QA scene. W0 is NOT an approved character or canonical NPC.
 *
 * Fail closed on unexpected part count, hash, or glTF scene structure.
 * Never fetch remote assets or silently replace missing models.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here=dirname(fileURLToPath(import.meta.url));
const source=resolve(here,'../../game-walk/source-assets/w0-r3-review');
const output=resolve(here,'../public/models/W0-original-unapproved-review.glb');
const SIZES=Object.freeze([...Array(15).fill(23040),16216]);
export const SHA256='72ebfb14d96210fa318e4ec0afd95accd531abc9d30fe79cc71859664440a4e9';
export const BYTES=361816;

export function inspectResidentGLB(buffer){
 if(buffer.length!==BYTES||buffer.toString('ascii',0,4)!=='glTF'||
   buffer.readUInt32LE(4)!==2||buffer.readUInt32LE(8)!==buffer.length)
  throw new Error('W0: invalid glTF 2 container');
 const jsonLength=buffer.readUInt32LE(12);
 if(buffer.readUInt32LE(16)!==0x4e4f534a||20+jsonLength>buffer.length)
  throw new Error('W0: malformed JSON chunk');
 const gltf=JSON.parse(buffer.toString('utf8',20,20+jsonLength));
 if(gltf.meshes?.length!==41||gltf.animations?.length!==3||gltf.scenes?.length!==1)
  throw new Error('W0: expected original 41 meshes and 3 animation clips');
 const nodes=gltf.nodes.map(n=>n.name);
 for(const name of ['BODY_elongated_cranium','RIG_L_arm','RIG_R_arm','PROP_mechanical_service_probe'])
  if(!nodes.includes(name))throw new Error('W0: missing '+name);
 const mapped=new Set(gltf.animations.flatMap(a=>a.channels||[]).map(c=>c.target?.node));
 if(mapped.size<3)throw new Error('W0: no independently animated rig targets');
 return {meshes:41,clips:gltf.animations.map(a=>a.name),nodes:nodes.length};
}
export function stageW0(){
 const buffers=SIZES.map((size,i)=>{
  const path=join(source,'part-'+String(i).padStart(2,'0')+'.bin');
  const b=readFileSync(path);
  if(b.length!==size)throw new Error('W0: source segment wrong length '+i);
  return b;
 });
 const data=Buffer.concat(buffers);
 const sha=createHash('sha256').update(data).digest('hex');
 if(sha!==SHA256)throw new Error('W0: source hash mismatch, refusing to publish');
 const stats=inspectResidentGLB(data);
 mkdirSync(dirname(output),{recursive:true});
 writeFileSync(output,data);
 return {path:output,bytes:data.length,sha256:sha,approval:'unapproved-review-only',...stats};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log('W0 review asset staged:',JSON.stringify(stageW0()));
}
