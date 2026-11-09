/**
 * Arcturian Awakening / material bake v1
 * Original, seamless, deterministic PBR material maps. Offline Node-only.
 * This process never runs on a visitor device. No third-party textures.
 *
 * Output: RGBA PNG basecolor (sRGB), normal (linear), ORM (linear):
 *   ORM R=approx. occlusion, G=roughness, B=metalness
 * Production glTF/KTX2 compression is a distinct, future conversion gate.
 */
import {writeFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {deflateSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

export const SIZE=512;
export const FAMILIES=Object.freeze({
 basalt:{seed:137,base:[51,74,113],warp:.18,layer:15,rough:.87,metal:.015,normal:2.4,streak:.33},
 ochre:{seed:631,base:[153,109,73],warp:.32,layer:22,rough:.9,metal:0,normal:2.3,streak:.48},
 oxide:{seed:286,base:[74,72,84],warp:.17,layer:10,rough:.73,metal:.36,normal:1.9,streak:.16},
 mineral:{seed:1499,base:[42,73,120],warp:.11,layer:7,rough:.37,metal:.12,normal:2.2,streak:.1}
});
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const smooth=x=>x*x*(3-2*x);
const mix=(a,b,t)=>a+(b-a)*t;
function hash(x,y,seed){
 let h=Math.imul(x+Math.imul(y,374761393),668265263)^Math.imul(seed,2246822519);
 h=Math.imul(h^(h>>>13),1274126177);
 return ((h^(h>>>16))>>>0)/4294967295;
}
function n2(u,v,period,seed){
 const x=u*period,y=v*period,ix=Math.floor(x),iy=Math.floor(y);
 const wx=smooth(x-ix),wy=smooth(y-iy);
 const wrap=(a)=>((a%period)+period)%period;
 const a=hash(wrap(ix),wrap(iy),seed),b=hash(wrap(ix+1),wrap(iy),seed);
 const c=hash(wrap(ix),wrap(iy+1),seed),d=hash(wrap(ix+1),wrap(iy+1),seed);
 return mix(mix(a,b,wx),mix(c,d,wx),wy)*2-1;
}
function noise(u,v,seed){
 return n2(u,v,4,seed)*.46+n2(u,v,11,seed+3)*.26+
   n2(u,v,27,seed+7)*.16+n2(u,v,72,seed+11)*.08+
   n2(u,v,136,seed+19)*.04;
}
const fract=x=>x-Math.floor(x);
function sample(u,v,f){
 const n=noise(u,v,f.seed),regional=noise(u,v,f.seed+73);
 // Seamless warp: all frequencies and phases are periodic in both axes.
 const warp=f.warp*(n2(u,v,3,f.seed+101)*.26+n2(u,v,7,f.seed+112)*.2);
 const strata=Math.sin(Math.PI*2*(v*f.layer+warp+Math.sin(Math.PI*2*u*3)*.08));
 const strata2=Math.sin(Math.PI*2*(v*f.layer*.5+warp*.7));
 const ridge=1-Math.abs(Math.sin(Math.PI*2*(u*7+v*9+regional*.28)));
 const crack=Math.pow(clamp(ridge),21);
 const pores=Math.pow(clamp((n2(u,v,132,f.seed+48)+.45)*.6),6);
 const salt=n2(u,v,56,f.seed+29);
 const fine=n2(u,v,136,f.seed+8);
 const height=clamp(.5+n*.47+strata*f.streak*.13+
  strata2*f.streak*.054-crack*.29-pores*.065+fine*.035);
 const erosion=clamp(.5+n*.45+strata*f.streak*.23+salt*.15-crack*.55);
 const patina=clamp(.53+regional*.5+salt*.12+(1-erosion)*.14);
 return {height,erosion,patina,crack,grain:fine};
}
function pixel(f,s,u,v){
 const p=sample(u,v,f);
 const l=(p.erosion-.5)*126+(p.patina-.5)*35;
 const highlight=Math.pow(clamp(p.erosion),5)*23;
 const deep=p.crack*47;
 let tone=[f.base[0]+l+highlight-deep,f.base[1]+l*.82+highlight*.82-deep*.89,f.base[2]+l*.7+highlight*.58-deep*.78];
 if(s==='mineral'){
  const cold=p.erosion*.32+clamp(p.grain)*.15;
  tone=[tone[0]-13*cold,tone[1]+17*cold,tone[2]+32*cold];
 }
 if(s==='oxide'){
  const rust=clamp((p.patina-.5)*2.4);
  tone=[tone[0]+83*rust,tone[1]+16*rust,tone[2]-13*rust];
 }
 return {p,tone:tone.map(v=>clamp(Math.round(v),6,249))};
}
function crc32(bytes){
 let crc=0xffffffff;
 for(const b of bytes){
  crc^=b;for(let i=0;i<8;i++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1;
 }
 return (crc^0xffffffff)>>>0;
}
function pngChunk(tag,data){
 const t=Buffer.from(tag,'ascii'),len=Buffer.alloc(4),sum=Buffer.alloc(4);
 len.writeUInt32BE(data.length,0);
 sum.writeUInt32BE(crc32(Buffer.concat([t,data])),0);
 return Buffer.concat([len,t,data,sum]);
}
export function encodePNG(bytes,width,height){
 if(bytes.length!==width*height*4)throw new Error('RGBA buffer length mismatch');
 const raw=Buffer.alloc(height*(1+width*4));
 for(let y=0;y<height;y++){
  raw[y*(1+width*4)]=0;
  bytes.copy(raw,y*(1+width*4)+1,y*width*4,(y+1)*width*4);
 }
 const hdr=Buffer.alloc(13);hdr.writeUInt32BE(width,0);hdr.writeUInt32BE(height,4);
 hdr[8]=8;hdr[9]=6; // RGBA8
 return Buffer.concat([
  Buffer.from([137,80,78,71,13,10,26,10]),
  pngChunk('IHDR',hdr),
  pngChunk('IDAT',deflateSync(raw,{level:8})),
  pngChunk('IEND',Buffer.alloc(0))
 ]);
}
export function generateFamily(name,size=SIZE){
 const f=FAMILIES[name];if(!f)throw new Error('Unknown material '+name);
 if(!Number.isInteger(size)||size<32||size>1024||(size&(size-1)))throw new Error('Size must be power-of-two, 32-1024');
 const base=Buffer.alloc(size*size*4),normal=Buffer.alloc(size*size*4),orm=Buffer.alloc(size*size*4);
 const h=new Float32Array(size*size),colors=Buffer.alloc(size*size*3),aux=new Float32Array(size*size*3);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/(size-1),v=y/(size-1),j=y*size+x;
  const {p,tone}=pixel(f,name,u,v);
  h[j]=p.height;colors[3*j]=tone[0];colors[3*j+1]=tone[1];colors[3*j+2]=tone[2];
  aux[j*3]=p.patina;aux[j*3+1]=p.crack;aux[j*3+2]=p.erosion;
 }
 const channel=(array,i,a,b,c)=>{array[i]=a;array[i+1]=b;array[i+2]=c;array[i+3]=255;};
 let variance=0,mean=0,normalZ=0,roughMean=0;
 // Duplicate UV border pixels for truly continuous mipmap edges.
 const wrap=t=>(t+size-1)%(size-1);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const i=y*size+x,k=i*4;
  const deltaX=h[y*size+wrap(x+1)]-h[y*size+wrap(x-1)];
  const deltaY=h[wrap(y+1)*size+x]-h[wrap(y-1)*size+x];
  const nx=-deltaX*f.normal,ny=-deltaY*f.normal,nz=1/Math.hypot(nx,ny,1);
  const patina=aux[i*3],crack=aux[i*3+1],erosion=aux[i*3+2];
  const rough=clamp(f.rough+(patina-.5)*.18+crack*.1+(erosion-.5)*.1,.19,.98);
  const metal=clamp(f.metal+(name==='oxide'?patina*.14:0),0,.7);
  const ao=clamp(.93-crack*.46+(erosion-.5)*.13,.37,1);
  const albedo=[colors[i*3],colors[i*3+1],colors[i*3+2]];
  channel(base,k,...albedo);
  channel(normal,k,Math.round((nx*nz*.5+.5)*255),Math.round((ny*nz*.5+.5)*255),Math.round((nz*.5+.5)*255));
  channel(orm,k,Math.round(ao*255),Math.round(rough*255),Math.round(metal*255));
  mean+=albedo[0];variance+=albedo[0]*albedo[0];normalZ+=nz;roughMean+=rough;
 }
 const len=size*size;mean/=len;
 return {name,size,
  maps:{basecolor:encodePNG(base,size,size),normal:encodePNG(normal,size,size),orm:encodePNG(orm,size,size)},
  stats:{variance:Number((variance/len-mean*mean).toFixed(2)),normalZ:Number((normalZ/len).toFixed(3)),roughness:Number((roughMean/len).toFixed(3))},
  raw:{base,normal,orm}
 };
}
export async function bake(outDir=resolve('public/first-person-materials'),size=SIZE){
 await mkdir(outDir,{recursive:true});
 const manifest={generator:'original Arcturian Awakening Node PBR bake v1',license:'Original project artwork; not sourced from external material libraries',
  dimensions:[size,size],channels:{basecolor:'sRGB',normal:'linear tangent space',orm:'R=AO,G=roughness,B=metalness'},families:{}};
 for(const name of Object.keys(FAMILIES)){
  const result=generateFamily(name,size),files={};
  if(result.stats.variance<18)throw new Error(name+' lost its surface detail');
  for(const [type,data] of Object.entries(result.maps)){
   const filename=name+'_'+type+'.png',sha256=createHash('sha256').update(data).digest('hex');
   await writeFile(join(outDir,filename),data);
   files[type]={file:filename,bytes:data.length,sha256};
  }
  manifest.families[name]={...result.stats,files};
 }
 await writeFile(join(outDir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 return manifest;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const out=resolve(process.argv[2]||'public/first-person-materials');
 const manifest=await bake(out);
 console.log(JSON.stringify({output:out,dimensions:manifest.dimensions,files:Object.values(manifest.families).flatMap(f=>Object.values(f.files)).length,bytes:Object.values(manifest.families).flatMap(f=>Object.values(f.files)).reduce((s,f)=>s+f.bytes,0)},null,2));
}
