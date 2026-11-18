import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const registry=JSON.parse(readFileSync(new URL('../production/ASSET_REGISTER.json',import.meta.url),'utf8'));
const anchors=JSON.parse(readFileSync(new URL('../production/REFERENCE_PALETTE.json',import.meta.url),'utf8'));
const assets=registry.assets;
assert.equal(assets.length,102,'all planned assets must remain inventoried');
assert.equal(assets.filter(x=>x.priority==='P0').length,83);
assert.equal(new Set(assets.map(x=>x.id)).size,102,'asset IDs must be unique');
for(const asset of assets){
  assert.match(asset.id,/^(CHR|RIG|ENV|PRP|MAT|VFX|UI|AUD)-\d{3}$/);
  assert.ok(asset.name && asset.purpose && asset.category);
  assert.notEqual(asset.visual_approval,'Approved','no artifact has been visually accepted');
  assert.notEqual(asset.runtime_test,'Game integrated','no artifact may be marked deployed without evidence');
}
const receiver=assets.find(x=>x.id==='PRP-001');
assert.ok(receiver.candidate?.textureCount===3);
assert.match(receiver.visual_approval,/not approved/i);
assert.equal(anchors.anchors.length,8);
assert.deepEqual(anchors.composition_checks.slice(0,2).map(c=>c.expected),[1,2]);
assert.ok(anchors.anchors.every(a=>/^#[A-F0-9]{6}$/.test(a.srgb)));
console.log('Source-locked asset registry consistency gate passed');
