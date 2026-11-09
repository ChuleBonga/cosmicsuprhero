/** Brief scripted physical media transitions, evaluated independent of frames.
 * No invisible timer mutation or animation state hidden inside the art model.
 */
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
const ease=x=>{const t=clamp(x);return t*t*(3-2*t)};
const mix=(a,b,t)=>a+(b-a)*t;
export const PICKUP_SECONDS=.68;
export const INSERT_SECONDS=.82;
export function pickupPose(progress){
 const t=ease(progress);
 return {x:mix(.11,-.49,t),y:mix(-.31,-.7,t),
   z:mix(-2.1,-.85,t),scale:mix(5.1,.58,t),
   pitch:mix(.14,.55,t),yaw:mix(-.27,.25,t)};
}
export function insertionPose(progress){
 const t=ease(progress);
 return {y:mix(1.19,.78,t),pitch:mix(.12,-.18,t),
   glow:mix(.08,1.0,t)};
}
