/**
 * Arrival Quarter district-behavior specification.
 * This is an implementation-ready, renderer-independent simulation contract.
 * The world geometry, actual rigged actors and location art are NOT yet made.
 * Positions are a *provisional* 30 x 20 metre rehearsal stage, not canonical map art.
 */
import { availableLocations, consequence } from '../aftermath';
import type { Location } from '../aftermath';
import type { State, Witness } from '../encounter';

export type ActorAction =
  | 'idle_work' | 'walk' | 'inspect' | 'greet'
  | 'offer_help' | 'refuse_help' | 'public_listening';
export interface Point { readonly x: number; readonly z: number; }
export interface ActorPose {
  readonly actor: Witness;
  readonly x: number;
  readonly z: number;
  readonly headingRadians: number;
  readonly action: ActorAction;
  readonly available: boolean;
  readonly destination: string;
}
export interface CivicObject {
  readonly id: 'communal_receiver' | 'courier_case' | 'household_ledger';
  readonly position: Point;
  readonly owner: Witness;
  readonly purpose: string;
  readonly state: 'private' | 'public' | 'damaged' | 'under_review';
}
export interface WorldFrame {
  readonly elapsedSeconds: number;
  readonly residents: readonly ActorPose[];
  readonly objects: readonly CivicObject[];
  readonly accessibleLocations: readonly Location[];
}
export interface WorldRules {
  readonly minX: number; readonly maxX: number;
  readonly minZ: number; readonly maxZ: number;
  readonly interactionDistance: number;
}
export const DISTRICT_RULES: WorldRules = Object.freeze({
  minX:0, maxX:30, minZ:0, maxZ:20, interactionDistance:2.25
});
export const SITES = {
  caretakerHome: { x:4, z:5 },
  hall: { x:10, z:7 },
  courierStall: { x:22, z:5 },
  refuge: { x:27, z:9 },
  workshop: { x:17, z:14 },
  apprenticeWork: { x:12, z:15 },
  publicListening: { x:15, z:8 },
  ledger: { x:4.4, z:5.2 }
} as const satisfies Record<string, Point>;

type Stop = { readonly at: number; readonly site: Point; readonly action: ActorAction };
type Plan = readonly Stop[];
const ROUTINE_SECONDS=32;

/** Routes are explicit authored work goals, not arbitrary sinusoidal wandering. */
function planFor(id: Witness, story: State): Plan {
  const resolved=story.phase==='complete';
  const protect=resolved && story.choice==='protect';
  const disclose=resolved && story.choice==='disclose';
  const reliable=story.trust>0;
  if(id==='caretaker') {
    if(protect && reliable) return [
      {at:0,site:SITES.caretakerHome,action:'idle_work'},
      {at:7,site:SITES.caretakerHome,action:'walk'},
      {at:15,site:SITES.hall,action:'offer_help'},
      {at:23,site:SITES.hall,action:'walk'},
      {at:31,site:SITES.caretakerHome,action:'idle_work'},
      {at:32,site:SITES.caretakerHome,action:'idle_work'}
    ];
    if(protect || disclose) return [
      {at:0,site:SITES.caretakerHome,action:'idle_work'},
      {at:8,site:SITES.caretakerHome,action:'walk'},
      {at:12,site:{x:6,z:5},action:'refuse_help'},
      {at:22,site:{x:6,z:5},action:'walk'},
      {at:26,site:SITES.caretakerHome,action:'idle_work'},
      {at:32,site:SITES.caretakerHome,action:'idle_work'}
    ];
    return [
      {at:0,site:SITES.caretakerHome,action:'idle_work'},
      {at:8,site:SITES.caretakerHome,action:'walk'},
      {at:13,site:{x:6,z:6},action:'inspect'},
      {at:22,site:{x:6,z:6},action:'walk'},
      {at:28,site:SITES.caretakerHome,action:'idle_work'},
      {at:32,site:SITES.caretakerHome,action:'idle_work'}
    ];
  }
  if(id==='courier') {
    if(disclose) return [
      {at:0,site:SITES.courierStall,action:'idle_work'},
      {at:6,site:SITES.courierStall,action:'walk'},
      {at:15,site:SITES.refuge,action:'greet'},
      {at:23,site:SITES.refuge,action:'walk'},
      {at:31,site:SITES.courierStall,action:'idle_work'},
      {at:32,site:SITES.courierStall,action:'idle_work'}
    ];
    return [
      {at:0,site:SITES.courierStall,action:'idle_work'},
      {at:6,site:SITES.courierStall,action:'walk'},
      {at:12,site:{x:24,z:5},action:'inspect'},
      {at:21,site:{x:24,z:5},action:'walk'},
      {at:27,site:SITES.courierStall,action:'idle_work'},
      {at:32,site:SITES.courierStall,action:'idle_work'}
    ];
  }
  if(disclose) return [
    {at:0,site:SITES.apprenticeWork,action:'idle_work'},
    {at:6,site:SITES.apprenticeWork,action:'walk'},
    {at:16,site:SITES.publicListening,action:'public_listening'},
    {at:23,site:SITES.publicListening,action:'walk'},
    {at:31,site:SITES.apprenticeWork,action:'idle_work'},
    {at:32,site:SITES.apprenticeWork,action:'idle_work'}
  ];
  return [
    {at:0,site:SITES.apprenticeWork,action:'idle_work'},
    {at:8,site:SITES.apprenticeWork,action:'walk'},
    {at:13,site:SITES.workshop,action:'inspect'},
    {at:23,site:SITES.workshop,action:'walk'},
    {at:28,site:SITES.apprenticeWork,action:'idle_work'},
    {at:32,site:SITES.apprenticeWork,action:'idle_work'}
  ];
}
export function residentPose(id:Witness, story:State, elapsedSeconds:number):ActorPose {
  const route=planFor(id,story);
  const t=Number.isFinite(elapsedSeconds) ? ((elapsedSeconds % ROUTINE_SECONDS)+ROUTINE_SECONDS)%ROUTINE_SECONDS : 0;
  let index=0;
  while(index+1<route.length && route[index+1].at<=t)index++;
  const current=route[index];
  const next=route[Math.min(index+1,route.length-1)];
  const walking=current.action==='walk' && next.at>current.at;
  const interpolation=walking ? (t-current.at)/(next.at-current.at) : 0;
  const x=current.site.x+(next.site.x-current.site.x)*interpolation;
  const z=current.site.z+(next.site.z-current.site.z)*interpolation;
  const headingRadians=walking ? Math.atan2(next.site.x-current.site.x,next.site.z-current.site.z) : 0;
  return {
    actor:id,x,z,headingRadians,
    action:current.action,
    available:story.phase==='complete' ? consequence(story,id).available : true,
    destination:walking?'en route':(id==='caretaker'?'household and hall':id==='courier'?'supply and refuge':'workshop')
  };
}
export function canInteract(player:Point,actor:ActorPose):boolean {
  if(!Number.isFinite(player.x)||!Number.isFinite(player.z)||!actor.available)return false;
  const dx=player.x-actor.x,dz=player.z-actor.z;
  return dx*dx+dz*dz<=DISTRICT_RULES.interactionDistance**2;
}
export function worldFrame(story:State,elapsedSeconds:number):WorldFrame {
  const elapsed=Number.isFinite(elapsedSeconds)?Math.max(0,elapsedSeconds):0;
  const disclose=story.phase==='complete'&&story.choice==='disclose';
  return {
    elapsedSeconds:elapsed,
    residents:(['caretaker','courier','apprentice'] as const).map(id=>residentPose(id,story,elapsed)),
    accessibleLocations:availableLocations(story),
    objects:[
      {id:'communal_receiver',position:{x:15,z:7.5},owner:'apprentice',
        purpose:'Household-to-hall communication device, not a collectible',
        state:disclose?'public':'damaged'},
      {id:'courier_case',position:{x:22,z:5.6},owner:'courier',
        purpose:'Physical transport of the disputed recording',
        state:disclose?'public':'private'},
      {id:'household_ledger',position:SITES.ledger,owner:'caretaker',
        purpose:'Household messages and dates used for evidence reconstruction',
        state:story.phase==='complete'?'under_review':'private'}
    ]
  };
}
