import test from 'node:test';
import assert from 'node:assert/strict';
import {WAYSTATION} from './world-logic.mjs';
import {WORKBENCH,WORKER_POS,WORKER_TO_BENCH} from './waystation-layout.mjs';

test('worker approaches the actual front edge of the working bench',()=>{
 assert.equal(WORKBENCH.worldX,WAYSTATION.x+WORKBENCH.localX);
 assert.equal(WORKBENCH.worldZ,WAYSTATION.z+WORKBENCH.localZ);
 assert.ok(WORKER_TO_BENCH.forwardClearance>=.16&&WORKER_TO_BENCH.forwardClearance<=.35);
 assert.ok(WORKER_TO_BENCH.lateralOffset<.12);
 assert.ok(WORKER_POS.z>WORKBENCH.worldZ,'worker stands in front of bench');
});
test('workbench remains plausible person/work surface scale',()=>{
 assert.ok(WORKBENCH.width>=1.2&&WORKBENCH.width<=2.2);
 assert.ok(WORKBENCH.depth>=.6&&WORKBENCH.depth<=.9);
 assert.ok(WORKBENCH.topY>=.85&&WORKBENCH.topY<=1.2);
});
