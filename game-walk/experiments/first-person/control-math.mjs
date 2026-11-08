/** Pure input transforms for physically consistent desktop and touch motion. */
export const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
export function stickVector(dx,dy,radius=39,deadZone=.11){
 if(!Number.isFinite(dx)||!Number.isFinite(dy)||!(radius>0))return {right:0,forward:0,visualX:0,visualY:0};
 const length=Math.hypot(dx,dy);
 if(length<1e-9)return {right:0,forward:0,visualX:0,visualY:0};
 const visualRadius=Math.min(length,radius);
 const ux=dx/length,uy=dy/length;
 const magnitude=visualRadius/radius;
 const activity=clamp((magnitude-deadZone)/(1-deadZone),0,1);
 return {right:ux*activity,forward:-uy*activity,visualX:ux*visualRadius,visualY:uy*visualRadius};
}
export function lookDelta(dx,dy,sensitivity=1,inverted=false){
 const s=clamp(Number.isFinite(sensitivity)?sensitivity:1,.5,1.7);
 return {yaw:dx*.00215*s,pitch:dy*.0017*s*(inverted?1:-1)};
}
