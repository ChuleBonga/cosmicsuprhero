import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const a=fs.readFileSync('private-media/score_awaken_now_loop.m4a.part1.b64','utf8').trim();
const b=fs.readFileSync('private-media/score_awaken_now_loop.m4a.part2.b64','utf8').trim();
const payload=Buffer.from(a+b,'base64');
fs.mkdirSync('public/media',{recursive:true});
fs.writeFileSync('public/media/score_awaken_now_loop.m4a',payload);
const expected={
  "score_awaken_now_loop.m4a": "fdc459c9d087aa0c3a874dd1a649625e055f11b27269e8d445a6fa490e88a3a7",
  "score_awaken_now_loop.ogg": "76ca957f77ac1cae42accf6b9151c8f477d223b570e0d3a374e0d46ad44fac5b",
  "pickup_first_contact.m4a": "23d6f441a943273cbbd88dc0aa3206babe314a0cd258265ca3b619327d1ae823",
  "pickup_first_contact.ogg": "55ed2ea993be2bfd04ebeae5c2a9903b4bc83260620a1544f457eb7790ab1964",
  "pickup_xaba.m4a": "8d286a1d350dec06ce332d7a8645d4b4926e98aeb366c011d1b43122c00c232c",
  "pickup_xaba.ogg": "da9b19644796ad7f0648b3ca02be29885f45c90de66717d10c258b37ec4cc6cb",
  "pickup_mama_calls_me_chule.m4a": "63093159d0f59b10ec4c9cc35557900ca1a53e56050daf48919af6d64ae58648",
  "pickup_mama_calls_me_chule.ogg": "85764a6bfd33e3fa1dd699a4ddc4f9ff64331fa83466c770368e50aaca1c822f",
  "pickup_songs_sent_to_god.m4a": "51ea62f73e4e1425e85226733690fd0217074aaa3bddbe1cf7e8f285f162ab16",
  "pickup_songs_sent_to_god.ogg": "8f827524a018da36dd0b0469a3dd131b35d417746abb2f08e28bcef22548ed34"
};
for(const [filename,hash] of Object.entries(expected)){
 const p=path.join('public/media',filename);
 if(!fs.existsSync(p))throw new Error('Missing audio: '+filename);
 const content=fs.readFileSync(p);
 const digest=createHash('sha256').update(content).digest('hex');
 if(digest!==hash)throw new Error('Audio integrity failure: '+filename);
}
console.log('Audio manifest: 10 files verified against original uploaded ZIP SHA256 hashes.');
