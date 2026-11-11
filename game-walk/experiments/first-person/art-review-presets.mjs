/**
 * Private QA entry poses in the same live 3D world.
 * Never surfaced as additional visitor experiences or navigation links.
 * Used to inspect authored geometry quickly when remote traversal is slow.
 */
import {WORLD,WORLD_OBSTACLES,halfWidth,groundHeight,groundNormal} from './world-logic.mjs';

const POSES=Object.freeze({
  arrival:Object.freeze({id:'arrival',x:WORLD.start.x,z:WORLD.start.z,yaw:0,pitch:-.04,looksAt:'sunward causeway'}),
  contact:Object.freeze({id:'contact',x:1.5,z:WORLD.artifact.z+7,yaw:-.35,pitch:-.10,looksAt:'grounded First Contact find'}),
  waystation:Object.freeze({id:'waystation',x:1.2,z:-74.5,yaw:-.70,pitch:-.08,looksAt:'roadside repair shelter'})
});
export function parseReviewPose(queryString=''){
 const name=new URLSearchParams(queryString).get('art-review');
 return name&&Object.hasOwn(POSES,name)?POSES[name]:null;
}
export function createReviewMotion(pose){
 if(!pose||!Object.hasOwn(POSES,pose.id))throw new Error('Unknown review pose');
 if(Math.abs(pose.x)+WORLD.radius>halfWidth(pose.z))throw new Error('Review pose is outside path bounds');
 for(const obstacle of WORLD_OBSTACLES){
  if(Math.hypot(pose.x-obstacle.x,pose.z-obstacle.z)<=WORLD.radius+obstacle.radius+.1){
   throw new Error('Review pose inside collision: '+obstacle.id);
  }
 }
 const x=pose.x,z=pose.z;
 return {x,z,y:groundHeight(x,z),vx:0,vz:0,distance:0,groundNormal:groundNormal(x,z),grounded:true};
}
export const ART_REVIEW_POSE_IDS=Object.freeze(Object.keys(POSES));
