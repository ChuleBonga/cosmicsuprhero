import {unzipSync} from 'fflate';
import {mkdirSync,writeFileSync,existsSync,statSync} from 'node:fs';
import {dirname} from 'node:path';
const required=['public/audio/score_awaken_now_loop.m4a','public/audio/pickup_first_contact.m4a','public/art/aa_album_poster.webp'];
if(required.every(f=>existsSync(f)&&statSync(f).size>1000)){console.log('Approved preview media present');process.exit(0)}
const response=await fetch('https://at.adobe.com/ZTdnn9ebA6WTDCKg');
if(!response.ok)throw new Error('Media source unavailable: '+response.status);
const files=unzipSync(new Uint8Array(await response.arrayBuffer()),{filter:f=>required.includes(f.name)});
for(const name of required){const bytes=files[name];if(!bytes||bytes.length<1000)throw new Error('Missing media: '+name);mkdirSync(dirname(name),{recursive:true});writeFileSync(name,bytes);console.log(name,bytes.length,'bytes')}
