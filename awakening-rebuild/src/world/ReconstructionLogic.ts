/**
 * Source-grounded rehearsal logic for the physical signal chronology bench.
 * The 3D bench and the DOM-accessible equivalent must drive the same reducer.
 * This provisional object is not approved cultural/architectural art.
 */
import { FRAGMENTS } from '../encounter.ts';
import type { Fragment, State } from '../encounter.ts';
import type { Point } from './DistrictSimulation.ts';
import {canInspect} from './PlayerMotor.ts';

export const STATION_POSITION:Point=Object.freeze({x:16.9,z:12.4});
export const STATION_RANGE=2.25;
export const STATION_INPUT=FRAGMENTS;

export function canUseStation(player:Point,state:State):boolean {
 return state.phase==='reconstruct'&&
   canInspect(player,STATION_POSITION,false,STATION_RANGE);
}
export function selectedStationOrder(order:readonly Fragment[],fragment:Fragment):Fragment[]{
 if(!STATION_INPUT.includes(fragment))return [...order];
 if(order.includes(fragment))return order.filter(f=>f!==fragment);
 if(order.length>=STATION_INPUT.length)return [...order];
 return [...order,fragment];
}
export function stationSlot(order:readonly Fragment[],fragment:Fragment):number|null{
 const index=order.indexOf(fragment);
 return index<0?null:index;
}
