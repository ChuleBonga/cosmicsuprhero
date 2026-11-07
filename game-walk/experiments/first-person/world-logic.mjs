/**
 * Arcturian Awakening: isolated first-person vertical slice.
 * Deterministic kinematic controller. Units: metres, +Y up, -Z forward.
 * Design contract: one continuous story-to-presave path, not 16 chapters.
 */
export const WORLD = Object.freeze({
  hz:60, eyeHeight:1.7, radius:0.34, walkSpeed:2.85,
  acceleration:10.5, brake:14.5, maxSlopeDegrees:35,
  start:Object.freeze({x:0,z:23.5}), endZ:-110,
  artifact:Object.freeze({x:-0.9,z:-35}),
  inspectDistance:3.25
});
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const mix=(a,b,t)=>a+(b-a)*t;
const fract=v=>v-Math.floor(v);
const hash=(x,z)=>fract(Math.sin(x*127.1+z*311.7)*43758.5453);
function valueNoise(x,z){
  const ix=Math.floor(x),iz=Math.floor(z),u=x-ix,v=z-iz;
  const s=u*u*(3-2*u),t=v*v*(3-2*v);
  return mix(mix(hash(ix,iz),hash(ix+1,iz),s),mix(hash(ix,iz+1),hash(ix+1,iz+1),s),t)*2-1;
}
export function groundHeight(x,z){
  const basin=Math.max(0,Math.abs(x)-4.5);
  const bank=Math.min(19,Math.pow(basin*.22,1.32));
  const pathFactor=1-Math.exp(-Math.abs(x)*.4);
  const undulation=.8*valueNoise(x*.065,z*.063)+.24*valueNoise(x*.24,z*.23)+.07*valueNoise(x*.95,z*1.02);
  const rise=clamp((-z-76)/25,0,1)*.48;
  return bank+undulation*.5*pathFactor+rise+.04*Math.sin(z*.16)*Math.min(1,Math.abs(x)/4);
}
export function groundNormal(x,z){
  const e=.17,dx=(groundHeight(x+e,z)-groundHeight(x-e,z))/(2*e),
        dz=(groundHeight(x,z+e)-groundHeight(x,z-e))/(2*e),len=Math.hypot(dx,1,dz);
  return {x:-dx/len,y:1/len,z:-dz/len};
}
export function halfWidth(z){return z>-12?7.5:z>-64?6.1:8.1}
export function initialState(){
  const {x,z}=WORLD.start;
  return {x,z,y:groundHeight(x,z),vx:0,vz:0,distance:0};
}
function approach(current,target,delta){return current<target?Math.min(current+delta,target):Math.max(current-delta,target);}
export function stepMovement(state,forward=0,right=0,yaw=0,dt=1/WORLD.hz){
  if(!(dt>0&&dt<=1/30))throw new RangeError('Use fixed physics timestep');
  const s={...state};
  const len=Math.max(1,Math.hypot(forward,right));
  const f=clamp(forward/len,-1,1),r=clamp(right/len,-1,1);
  const goalX=(Math.sin(yaw)*f+Math.cos(yaw)*r)*WORLD.walkSpeed;
  const goalZ=(-Math.cos(yaw)*f+Math.sin(yaw)*r)*WORLD.walkSpeed;
  // Vector-space acceleration is independent of strafe angle. Per-axis easing
  // incorrectly accelerated diagonals by sqrt(2), causing a speed advantage.
  const dv=(f||r?WORLD.acceleration:WORLD.brake)*dt;
  const offsetX=goalX-s.vx,offsetZ=goalZ-s.vz;
  const remaining=Math.hypot(offsetX,offsetZ);
  const fraction=remaining>0?Math.min(1,dv/remaining):0;
  s.vx+=offsetX*fraction;s.vz+=offsetZ*fraction;
  const intendedX=s.x+s.vx*dt,intendedZ=s.z+s.vz*dt;
  let nextZ=clamp(intendedZ,WORLD.endZ-1.8,26);
  let nextX=clamp(intendedX,-halfWidth(nextZ)+WORLD.radius,halfWidth(nextZ)-WORLD.radius);
  // Material relic and its base have a genuine circular collision proxy.
  const obstacleRadius=1.82+WORLD.radius;
  let dx=nextX-WORLD.artifact.x,dz=nextZ-WORLD.artifact.z,dist=Math.hypot(dx,dz);
  if(dist<obstacleRadius){
    const scale=obstacleRadius/Math.max(dist,1e-5);
    if(dist<1e-5){dx=1;dz=0;}
    nextX=clamp(WORLD.artifact.x+dx*scale,-halfWidth(nextZ)+WORLD.radius,halfWidth(nextZ)-WORLD.radius);
    nextZ=WORLD.artifact.z+dz*scale;
  }
  const nextY=groundHeight(nextX,nextZ);
  const angle=Math.acos(clamp(groundNormal(nextX,nextZ).y,-1,1))*180/Math.PI;
  if(angle>WORLD.maxSlopeDegrees||nextY-s.y>.26){
    s.vx=0;s.vz=0;return s;
  }
  const deltaX=nextX-s.x,deltaZ=nextZ-s.z;
  s.x=nextX;s.z=nextZ;s.y=nextY;s.distance+=Math.hypot(deltaX,deltaZ);
  if(Math.abs(deltaX-(intendedX-state.x))>.02)s.vx=0;
  if(Math.abs(deltaZ-(intendedZ-state.z))>.02)s.vz=0;
  return s;
}
export function inspectDistance(s){return Math.hypot(s.x-WORLD.artifact.x,s.z-WORLD.artifact.z)}
export function canInspect(s,yaw=0){
  if(inspectDistance(s)>WORLD.inspectDistance)return false;
  const dx=WORLD.artifact.x-s.x,dz=WORLD.artifact.z-s.z;
  const dir=(Math.sin(yaw)*dx-Math.cos(yaw)*dz)/Math.max(.001,Math.hypot(dx,dz));
  return dir>.24;
}
export function narrativeBeat(z){
  return z>3?'THE ARRIVAL':z>-31?'THE PASSAGE':z>-71?'THE ENCOUNTER':'THE RETURN';
}
export function atEnd(s){return s.z<=WORLD.endZ+1.25}
