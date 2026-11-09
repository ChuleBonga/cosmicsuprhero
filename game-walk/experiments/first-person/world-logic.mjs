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
  inspectDistance:4.1
});
// All obstacle colliders share coordinates with the authored 3D meshes.
 // Radius excludes the player's own horizontal capsule footprint.
export const WORLD_OBSTACLES = Object.freeze([
  Object.freeze({id:'first-contact-plinth',x:WORLD.artifact.x,z:WORLD.artifact.z,radius:2.36}),
  Object.freeze({id:'fallen-spire',x:3.65,z:-54,radius:2.05}),
  Object.freeze({id:'west-waystone',x:-4.1,z:-73,radius:1.25}),
  Object.freeze({id:'east-waystone',x:4.1,z:-91,radius:1.25}),
  Object.freeze({id:'cassette-relay',x:2.15,z:-82,radius:.82})
]);
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
const smoothStep01=v=>{const t=clamp(v,0,1);return t*t*(3-2*t)};
export function halfWidth(z){
  // A tapered rock corridor, not a sudden invisible wall. The walking
  // envelope narrows gently into the encounter then widens for the return.
  if(z>=-6)return 7.5;
  if(z>-20)return mix(6.1,7.5,smoothStep01((z+20)/14));
  if(z>=-58)return 6.1;
  if(z>-73)return mix(8.1,6.1,smoothStep01((z+73)/15));
  return 8.1;
}
export function initialState(){
  const {x,z}=WORLD.start;
  return {x,z,y:groundHeight(x,z),vx:0,vz:0,distance:0,groundNormal:groundNormal(x,z),grounded:true};
}
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
  // Horizontal capsule-vs-cylinder contacts. Iterative projection supplies
  // a simple but grounded sliding contact response for close-set architecture.
  // Every collider is reflected by a visible mesh authored in world-art.mjs.
  for(let pass=0;pass<3;pass++){
    let touched=false;
    for(const obstacle of WORLD_OBSTACLES){
      const dx=nextX-obstacle.x,dz=nextZ-obstacle.z;
      const radius=obstacle.radius+WORLD.radius;
      const distance=Math.hypot(dx,dz);
      if(distance>=radius)continue;
      const nx=distance>1e-6?dx/distance:(state.x-obstacle.x>=0?1:-1);
      const nz=distance>1e-6?dz/distance:0;
      nextX=obstacle.x+nx*radius;
      nextZ=obstacle.z+nz*radius;
      // Remove velocity directed into the obstacle, preserving tangential slide.
      const into=s.vx*nx+s.vz*nz;
      if(into<0){s.vx-=into*nx;s.vz-=into*nz;}
      nextX=clamp(nextX,-halfWidth(nextZ)+WORLD.radius,halfWidth(nextZ)-WORLD.radius);
      touched=true;
    }
    if(!touched)break;
  }
  const nextY=groundHeight(nextX,nextZ);
  const angle=Math.acos(clamp(groundNormal(nextX,nextZ).y,-1,1))*180/Math.PI;
  if(angle>WORLD.maxSlopeDegrees||nextY-s.y>.26){
    s.vx=0;s.vz=0;return s;
  }
  const deltaX=nextX-s.x,deltaZ=nextZ-s.z;
  s.x=nextX;s.z=nextZ;s.y=nextY;s.distance+=Math.hypot(deltaX,deltaZ);
  s.groundNormal=groundNormal(nextX,nextZ);
  s.grounded=true;
  if(Math.abs(deltaX-(intendedX-state.x))>.02)s.vx=0;
  if(Math.abs(deltaZ-(intendedZ-state.z))>.02)s.vz=0;
  return s;
}
export function inspectDistance(s){return Math.hypot(s.x-WORLD.artifact.x,s.z-WORLD.artifact.z)}
export function canInspect(s,yaw=0,range=WORLD.inspectDistance,facingThreshold=.24){
  // Wider proximity detection is available on touch input, where precise
  // pointer-locked camera aiming is impractical.
  if(inspectDistance(s)>range)return false;
  const dx=WORLD.artifact.x-s.x,dz=WORLD.artifact.z-s.z;
  const dir=(Math.sin(yaw)*dx-Math.cos(yaw)*dz)/Math.max(.001,Math.hypot(dx,dz));
  return dir>facingThreshold;
}
export function narrativeBeat(z){
  return z>3?'THE ARRIVAL':z>-31?'THE PASSAGE':z>-71?'THE ENCOUNTER':'THE RETURN';
}
export function atEnd(s){return s.z<=WORLD.endZ+1.25}
