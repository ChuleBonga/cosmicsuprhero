import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {inflateSync} from 'node:zlib';
import {SIZE,FAMILIES,generateFamily} from './bake-first-person-materials.mjs';
const dir='public/first-person-materials';
const signature=Buffer.from([137,80,78,71,13,10,26,10]);
const px=(buf,size,x,y,channel)=>buf[(y*size+x)*4+channel];
test('generator yields all four physically differentiated original materials',()=>{
 assert.deepEqual(Object.keys(FAMILIES),['basalt','ochre','oxide','mineral']);
 for(const name of Object.keys(FAMILIES)){
  const f=generateFamily(name,64);
  assert.equal(f.size,64);
  assert.ok(f.stats.variance>18,name+' lacks visual detail');
  assert.ok(f.stats.normalZ>.5,name+' normals too steep');
  assert.ok(f.stats.roughness>.2&&f.stats.roughness<.98,name+' roughness invalid');
  for(const file of Object.values(f.maps))assert.ok(file.subarray(0,8).equals(signature));
 }
});
test('baked file manifest matches exact checksums and power of two texture dimensions',async()=>{
 const manifest=JSON.parse(await readFile(join(dir,'manifest.json'),'utf8'));
 assert.deepEqual(manifest.dimensions,[SIZE,SIZE]);
 let total=0;
 for(const [name,record] of Object.entries(manifest.families)){
  assert.ok(FAMILIES[name]);
  for(const [key,info] of Object.entries(record.files)){
   assert.ok(['basecolor','normal','orm'].includes(key));
   const image=await readFile(join(dir,info.file));
   assert.ok(image.subarray(0,8).equals(signature));
   assert.equal(image.readUInt32BE(16),SIZE);
   assert.equal(image.readUInt32BE(20),SIZE);
   assert.equal(image.length,info.bytes);
   assert.equal(createHash('sha256').update(image).digest('hex'),info.sha256);
   assert.ok(image.length<1500000,'single PNG exceeds provisional bandwidth guardrail: '+info.file);
   total+=image.length;
  }
 }
 assert.ok(total<11000000,'Material preview pack exceeds 11 MB upper guardrail: '+total);
});
test('every base and ORM texture is seamless at tile boundaries',()=>{
 for(const name of Object.keys(FAMILIES)){
  const {raw,size}=generateFamily(name,64);
  for(const key of ['base','orm']){
   const data=raw[key];let seam=0,n=0;
   for(let j=0;j<size;j++)for(let c=0;c<3;c++){
    seam+=Math.abs(px(data,size,0,j,c)-px(data,size,size-1,j,c));
    seam+=Math.abs(px(data,size,j,0,c)-px(data,size,j,size-1,c));
    n+=2;
   }
   assert.ok(seam/n<=2.1,name+' '+key+' UV seam too visible: '+(seam/n).toFixed(2));
  }
 }
});
test('normal Z points outward and packed ORM keeps blue-slate nonmetallic',()=>{
 for(const name of Object.keys(FAMILIES)){
  const {raw}=generateFamily(name,64);
  const normal=raw.normal,orm=raw.orm;
  let meanMetal=0;
  for(let i=0;i<normal.length;i+=4){
   assert.ok(normal[i+2]>=128,name+' has invalid backwards normal');
   assert.ok(orm[i+1]>45&&orm[i+1]<=255,name+' roughness out of range');
   meanMetal+=orm[i+2];
  }
  meanMetal/=(normal.length/4);
  if(name==='oxide')assert.ok(meanMetal>75,'oxidized metal lost metalness');
  else assert.ok(meanMetal<45,name+' should not act metallic');
 }
});
test('same inputs produce bit-identical output',()=>{
 const a=generateFamily('basalt',64),b=generateFamily('basalt',64);
 for(const type of Object.keys(a.maps))assert.equal(Buffer.compare(a.maps[type],b.maps[type]),0);
});
