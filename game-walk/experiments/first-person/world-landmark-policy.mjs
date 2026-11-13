/**
 * One collision volume can be represented by an authored structure OR a
 * generic landmark, never both in the same location. Pure art policy:
 * physical collision definitions in world-logic remain unchanged.
 */
export function shouldRenderLandmark(id,{workerReviewEnabled=false}={}){
 if(id==='first-contact-find')return false; // already represented by encounter
 if(id==='waystation'&&workerReviewEnabled)return false; // authored shelter exists
 return true;
}
