/**
 * Waystation resident W0: reversible, non-canonical NPC-behavior prototype.
 * No named character, invented dialogue, cultural symbols, or game progression.
 * Model integration remains gated by ?art-review=inhabitants until visual approval.
 */
import {WORKER_POS} from './waystation-layout.mjs';
export {WORKER_POS};
export function initialWorkerState(){
 return {phase:'working',elapsed:0,workCycles:0,acknowledgements:0};
}
export function workerDistance(player){
 return Math.hypot(player.x-WORKER_POS.x,player.z-WORKER_POS.z);
}
export function canAcknowledgeWorker(player,yaw=0){
 const dx=WORKER_POS.x-player.x,dz=WORKER_POS.z-player.z,distance=Math.hypot(dx,dz);
 if(distance<.55||distance>3.2)return false;
 const facing=(Math.sin(yaw)*dx-Math.cos(yaw)*dz)/distance;
 return facing>.25;
}
export function stepWorkerRoutine(input,dt,distance){
 if(!(dt>0&&dt<=1/30)||!Number.isFinite(distance))throw new RangeError('Worker routine needs fixed dt and finite player distance');
 const s={...input,elapsed:input.elapsed+dt};
 switch(s.phase){
  case 'working':
   // The worker remains occupied even when the player never approaches.
   if(s.elapsed>=6){s.workCycles+=Math.floor(s.elapsed/6);s.elapsed%=6;}
   if(distance<=3.7){s.phase='noticing';s.elapsed=0;}
   break;
  case 'noticing':
   if(distance>4.5){s.phase='returning';s.elapsed=0;}
   break;
  case 'acknowledging':
   if(s.elapsed>=1.65){s.phase='returning';s.elapsed=0;}
   break;
  case 'returning':
   if(s.elapsed>=1.10){s.phase=distance<=3.7?'noticing':'working';s.elapsed=0;}
   break;
  default:throw new Error('Unknown worker phase: '+s.phase);
 }
 return s;
}
export function acknowledgeWorker(state,player,yaw){
 if(state.phase!=='noticing'||!canAcknowledgeWorker(player,yaw))return state;
 return {...state,phase:'acknowledging',elapsed:0,acknowledgements:state.acknowledgements+1};
}
