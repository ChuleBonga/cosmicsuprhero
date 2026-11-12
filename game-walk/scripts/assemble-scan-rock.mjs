// Build-time reconstruction of two small, original CC0 rock-scan derivatives.
// The source fragments exist only to transfer the verified WebP files into Git.
// Browsers receive two normal WebP assets, never a pile of binary fragments.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('..',import.meta.url));
const input=join(root,'source-assets','polyhaven-rocks-ground-01');
const target=join(root,'experiments','first-person','assets','scans');
const images=[
 {name:'normal',parts:[23040,23040,23040,16330],sha256:'bc803970b2a79357aefc7d7a9b171e4066346eee3cfd0bc7a7d93f9450bda1dd',out:'rocks_ground_01_nor_gl_512q65.webp'},
 {name:'rough',parts:[23040,2802],sha256:'94e7bc5ebabfba222c5ab71fe4578a4c6a43797cc5010582a394181ff22292fa',out:'rocks_ground_01_rough_256q90.webp'}
];
export function assembleScans(){
 mkdirSync(target,{recursive:true});
 const created=[];
 for(const entry of images){
  const files=entry.parts.map((expected,i)=>{
   const p=join(input,entry.name+'-part-'+String(i).padStart(2,'0')+'.bin');
   const b=readFileSync(p);
   if(b.length!==expected)throw Error('Scan fragment has wrong size: '+p);
   return b;
  });
  const buffer=Buffer.concat(files);
  const digest=createHash('sha256').update(buffer).digest('hex');
  if(digest!==entry.sha256)throw Error('Scanned rock asset checksum mismatch: '+entry.name);
  if(buffer.toString('ascii',0,4)!=='RIFF'||buffer.toString('ascii',8,12)!=='WEBP')throw Error('Not a valid WebP source: '+entry.name);
  const out=join(target,entry.out);
  writeFileSync(out,buffer);
  created.push({out,bytes:buffer.length,sha256:digest});
 }
 return created;
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 console.log('CC0 scanned rock derivatives verified:',JSON.stringify(assembleScans()));
}
