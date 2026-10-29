import {readdirSync,statSync,readFileSync} from 'node:fs';
import {join,relative} from 'node:path';import {gzipSync} from 'node:zlib';
const root=new URL('../dist/',import.meta.url).pathname;
const files=[];function scan(dir){for(const name of readdirSync(dir)){const p=join(dir,name);if(statSync(p).isDirectory())scan(p);else files.push(p)}}scan(root);
let startup=0;let total=0;
for(const file of files){const rel=relative(root,file);const raw=readFileSync(file);
  const transmitted=/\.(js|css|html|svg|json|txt)$/.test(rel)?gzipSync(raw,{level:9}).length:raw.length;
  total+=transmitted;
  const deferredAudio=/^audio\//.test(rel);
  if(!deferredAudio)startup+=transmitted;
  console.log(`${String(transmitted).padStart(9)} B  ${rel}${deferredAudio?' (after gesture)':''}`);
}
console.log(`TOTAL estimate ${total} B / STARTUP compressed estimate ${startup} B`);
if(startup>=3_000_000)process.exitCode=1;
