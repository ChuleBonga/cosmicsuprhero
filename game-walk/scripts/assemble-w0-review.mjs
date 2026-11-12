/**
 * Reassemble the artist-owned W0 look-development GLB from source-controlled
 * binary segments before Vite runs. This is a transfer workaround, not a runtime
 * streaming format; production emits ONE hashed .glb file.
 *
 * Unapproved character is only imported behind the art-review route.
 */
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,dirname,resolve} from 'node:path';
import {createHash} from 'node:crypto';
const cwd=fileURLToPath(new URL('..',import.meta.url));
const source=join(cwd,'source-assets','w0-r3-review');
const output=join(cwd,'experiments','first-person','assets','w0-worker-r3-review.glb');
export const EXPECTED_BYTES=361816;
export const EXPECTED_SHA256='72ebfb14d96210fa318e4ec0afd95accd531abc9d30fe79cc71859664440a4e9';
export const EXPECTED_PART_SIZES=Object.freeze([...Array(15).fill(23040),16216]);
function inspectGLB(buffer){
 if(buffer.length<20||buffer.toString('ascii',0,4)!=='glTF'||buffer.readUInt32LE(4)!==2||buffer.readUInt32LE(8)!==buffer.length)throw Error('W0 is not a complete glTF 2 binary');
 const len=buffer.readUInt32LE(12);
 if(buffer.readUInt32LE(16)!==0x4e4f534a||20+len>buffer.length)throw Error('W0 JSON chunk malformed');
 const j=JSON.parse(buffer.toString('utf8',20,20+len));
 if((j.meshes?.length)!==41||(j.animations?.length)!==3||(j.scenes?.length)!==1)throw Error('W0 geometry or animation structure changed');
 if(j.cameras?.length||j.extensionsUsed?.includes('KHR_lights_punctual'))throw Error('W0 still embeds its presentation camera or lights');
 if(j.scenes[0].nodes.length!==1)throw Error('W0 must have one character root');
 const names=j.nodes.map(n=>n.name);
 for(const required of ['NPC_W0_ROOT_exploratory_not_canon','RIG_L_arm','RIG_R_arm','BODY_elongated_cranium','PROP_mechanical_service_probe'])if(!names.includes(required))throw Error('W0 missing '+required);
 if(names.some(n=>/^(CAM_|LGT_|STUDIO_)/.test(n||'')))throw Error('Staging objects inside W0 runtime model');
 const mapped=new Set(j.animations.flatMap(a=>a.channels||[]).map(c=>c.target?.node));
 if(mapped.size<3)throw Error('W0 does not retain three animated rig targets');
 return {meshes:j.meshes.length,animations:j.animations.map(a=>a.name),nodes:names.length};
}
export function assembleW0(){
 const pieces=EXPECTED_PART_SIZES.map((size,i)=>{
  const p=join(source,'part-'+String(i).padStart(2,'0')+'.bin');
  const b=readFileSync(p);
  if(b.length!==size)throw Error('Wrong W0 source-part length '+i+': '+b.length);
  return b;
 });
 const buffer=Buffer.concat(pieces);
 const sha=createHash('sha256').update(buffer).digest('hex');
 if(buffer.length!==EXPECTED_BYTES||sha!==EXPECTED_SHA256)throw Error('W0 source checksum mismatch; no asset is published');
 const stats=inspectGLB(buffer);
 mkdirSync(dirname(output),{recursive:true});
 writeFileSync(output,buffer);
 return {path:output,bytes:buffer.length,sha256:sha,...stats};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 const result=assembleW0();
 console.log('W0 review asset assembled and verified:',JSON.stringify(result));
}
