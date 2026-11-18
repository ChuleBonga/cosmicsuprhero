/**
 * Source-linked Arrival Quarter traversal: physical collision envelope for
 * the authored ENV-003 GLB. Coordinates in metres, +x east / +z south.
 * These are rehearsal geometry constraints, not final architectural approval.
 */
import type { Point } from './DistrictSimulation.ts';

export const FIELD_BOUNDS=Object.freeze({minX:.65,maxX:29.35,minZ:.65,maxZ:19.35});
export const PLAYER_RADIUS=.32;
export const WALK_SPEED=3.15;
export const HALL_ENTRANCE=Object.freeze({x:10,z:8.4});
export const HALL_INTERIOR=Object.freeze({minX:4.4,maxX:15.6,minZ:0,maxZ:8.4});

type Barrier=Readonly<{id:string; minX:number;maxX:number;minZ:number;maxZ:number}>;
export const HALL_WALLS:readonly Barrier[]=Object.freeze([
 {id:'west-wall',minX:4.24,maxX:4.73,minZ:0,maxZ:8.45},
 {id:'east-wall',minX:15.29,maxX:15.75,minZ:0,maxZ:8.45},
 {id:'north-wall',minX:4.3,maxX:15.7,minZ:-.27,maxZ:.27},
 {id:'front-west',minX:4.3,maxX:8.72,minZ:8.20,maxZ:8.60},
 {id:'front-east',minX:11.28,maxX:15.7,minZ:8.20,maxZ:8.60}
]);
export const HALL_DOOR:Barrier=Object.freeze({
 id:'restricted-entrance',minX:8.72,maxX:11.28,minZ:8.31,maxZ:8.54
});
const finite=(n:number)=>Number.isFinite(n);
export function clampedPoint(p:Point):Point {
 return {
  x:Math.min(FIELD_BOUNDS.maxX,Math.max(FIELD_BOUNDS.minX,finite(p.x)?p.x:14)),
  z:Math.min(FIELD_BOUNDS.maxZ,Math.max(FIELD_BOUNDS.minZ,finite(p.z)?p.z:18))
 };
}
/** Circle vs axis-aligned wall: physically walkable doorway, no through-wall interactions. */
export function obstructed(p:Point,gateClosed=false,radius=PLAYER_RADIUS):boolean {
 if(!finite(p.x)||!finite(p.z))return true;
 const barriers=gateClosed?[...HALL_WALLS,HALL_DOOR]:HALL_WALLS;
 return barriers.some(b=>{
  const px=Math.max(b.minX,Math.min(p.x,b.maxX));
  const pz=Math.max(b.minZ,Math.min(p.z,b.maxZ));
  return (p.x-px)**2+(p.z-pz)**2<radius*radius;
 });
}
/** Incremental axis resolution permits sliding along walls instead of tunneling. */
export function movePlayer(from:Point,dx:number,dz:number,gateClosed=false):Point {
 const p=clampedPoint(from);
 if(!finite(dx)||!finite(dz))return p;
 const magnitude=Math.hypot(dx,dz);
 if(!magnitude)return p;
 const cap=1.2;
 const vx=Math.max(-cap,Math.min(cap,dx));
 const vz=Math.max(-cap,Math.min(cap,dz));
 const count=Math.max(1,Math.ceil(Math.hypot(vx,vz)/.14));
 let x=p.x,z=p.z;
 for(let i=0;i<count;i++){
  const nx=clampedPoint({x:x+vx/count,z}).x;
  if(!obstructed({x:nx,z},gateClosed))x=nx;
  const nz=clampedPoint({x,z:z+vz/count}).z;
  if(!obstructed({x,z:nz},gateClosed))z=nz;
 }
 return {x,z};
}
export function distance(a:Point,b:Point):number {
 return Math.hypot(a.x-b.x,a.z-b.z);
}
/** A direct physical line-of-sight probe for wall-bounded interaction. */
export function canInspect(from:Point,object:Point,gateClosed=false,range=2.25):boolean {
 if(!finite(from.x)||!finite(from.z)||!finite(object.x)||!finite(object.z))return false;
 const separation=distance(from,object);
 if(separation>range)return false;
 const barriers=gateClosed?[...HALL_WALLS,HALL_DOOR]:HALL_WALLS;
 const intervals=Math.max(1,Math.ceil(separation/.07));
 // A small near-object margin avoids rejecting an object flush against a wall.
 for(let i=1;i<intervals-1;i++){
  const t=i/intervals;
  const pt={x:from.x+(object.x-from.x)*t,z:from.z+(object.z-from.z)*t};
  if(barriers.some(b=>pt.x>=b.minX&&pt.x<=b.maxX&&pt.z>=b.minZ&&pt.z<=b.maxZ))return false;
 }
 return true;
}
