import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const expected=[
 ['normal','rocks_ground_01_nor_gl_512q65.webp','bc803970b2a79357aefc7d7a9b171e4066346eee3cfd0bc7a7d93f9450bda1dd',85450],
 ['rough','rocks_ground_01_rough_256q90.webp','94e7bc5ebabfba222c5ab71fe4578a4c6a43797cc5010582a394181ff22292fa',25842]
];
test('reconstructed CC0 scanned textures have pinned hashes and WebP headers',()=>{
 for(const [kind,name,sha,n] of expected){
  const b=readFileSync(new URL('./assets/scans/'+name,import.meta.url));
  assert.equal(b.length,n,kind+' bytes');
  assert.equal(b.toString('ascii',0,4),'RIFF');
  assert.equal(b.toString('ascii',8,12),'WEBP');
  assert.equal(createHash('sha256').update(b).digest('hex'),sha);
 }
});
