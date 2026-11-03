/** Testable opening progression; cannot jump forward or unlock missing audio. */
export type JourneyStage = 'meditate' | 'crossing' | 'first_contact' | 'credo' | 'campfire';
export type JourneyEvent =
  | 'OPEN_PORTAL' | 'CROSSING_COMPLETE' | 'FIRST_CONTACT_RECOVERED'
  | 'ARRIVED_AT_CREDO' | 'CONTINUE_FROM_CREDO' | 'RESET';

export interface JourneyState {
  version: 3;
  stage: JourneyStage;
  portalOpen: boolean;
  discovered: string[];
  distance: number;
  muted: boolean;
}
export const INITIAL_JOURNEY: JourneyState = {
  version: 3, stage: 'meditate', portalOpen: false,
  discovered: [], distance: 0, muted: false
};
export function transition(state: JourneyState, event: JourneyEvent): JourneyState {
  if (event === 'RESET') return { ...INITIAL_JOURNEY, discovered: [] };
  switch (event) {
    case 'OPEN_PORTAL':
      return state.stage==='meditate' ? {...state,portalOpen:true,stage:'crossing'} : state;
    case 'CROSSING_COMPLETE':
      return state.stage==='crossing' ? {...state,stage:'first_contact'} : state;
    case 'FIRST_CONTACT_RECOVERED':
      return state.stage==='first_contact' ?
        {...state,discovered:Array.from(new Set([...state.discovered,'first_contact']))} : state;
    case 'ARRIVED_AT_CREDO':
      return state.stage==='first_contact' && state.discovered.includes('first_contact') ?
        {...state,stage:'credo'} : state;
    case 'CONTINUE_FROM_CREDO':
      return state.stage==='credo' && state.discovered.includes('first_contact') ?
        {...state,stage:'campfire'} : state;
    default: return state;
  }
}
export function restoreJourney(raw: unknown): JourneyState {
  if (!raw || typeof raw!=='object') return {...INITIAL_JOURNEY,discovered:[]};
  const d=raw as Partial<JourneyState>;
  const stages:JourneyStage[]=['meditate','crossing','first_contact','credo','campfire'];
  if(d.version!==3||!stages.includes(d.stage as JourneyStage))return {...INITIAL_JOURNEY,discovered:[]};
  const discovered=Array.isArray(d.discovered)?d.discovered.filter((x):x is string=>x==='first_contact'):[];
  const first=discovered.includes('first_contact');
  // A corrupt or tampered save never bypasses the first discovery.
  let stage=d.stage!;
  if((stage==='credo'||stage==='campfire')&&!first)stage='first_contact';
  return {
    version:3,stage,portalOpen:d.portalOpen===true||stage!=='meditate',
    discovered,muted:d.muted===true,
    distance:Math.max(0,Math.min(120000,Number.isFinite(d.distance)?d.distance!:0))
  };
}
