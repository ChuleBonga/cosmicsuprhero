// World-space placement agreed between the waystation mesh, worker and tests.
// No invented character name, ritual arrangement or cultural symbol.
import {WAYSTATION} from './world-logic.mjs';
export const WORKBENCH=Object.freeze({
 localX:-.35, localZ:.34, centerY:1.02, width:1.67, depth:.78, topY:1.10,
 worldX:WAYSTATION.x-.35, worldZ:WAYSTATION.z+.34
});
export const WORKER_POS=Object.freeze({
 x:WORKBENCH.worldX+.04,
 z:WORKBENCH.worldZ+WORKBENCH.depth/2+.20
});
export const WORKER_TO_BENCH=Object.freeze({
 forwardClearance:WORKER_POS.z-(WORKBENCH.worldZ+WORKBENCH.depth/2),
 lateralOffset:Math.abs(WORKER_POS.x-WORKBENCH.worldX)
});
