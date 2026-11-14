/**
 * First non-walking gameplay experiment: social investigation + deduction.
 * Entire scenario is provisional, not canon dialogue or an album recording.
 * Pure deterministic state; no browser or rendering dependencies.
 */
export type Witness = 'caretaker' | 'courier' | 'apprentice';
export type Fragment = 'departure' | 'shelter' | 'silence';
export type Choice = 'protect' | 'disclose';
export type Phase = 'hear' | 'reconstruct' | 'decide' | 'complete';
export type Event =
  | { type: 'HEAR'; witness: Witness }
  | { type: 'ARRANGE'; order: Fragment[] }
  | { type: 'SUBMIT' }
  | { type: 'CHOOSE'; choice: Choice };
export interface State {
  readonly phase: Phase;
  readonly heard: readonly Witness[];
  readonly order: readonly Fragment[];
  readonly attempts: number;
  readonly trust: number;
  readonly choice: Choice | null;
  readonly lastError: string | null;
}
export const WITNESSES: Readonly<Record<Witness, { role: string; statement: string }>> = {
  caretaker: {
    role: 'Caretaker',
    statement: 'We sent the household message before the storm arrived. Your family was part of that decision.'
  },
  courier: {
    role: 'Courier',
    statement: 'I carried the recording to the refuge. The listening hall had not gone dark yet.'
  },
  apprentice: {
    role: 'Apprentice',
    statement: 'The public hall fell silent only afterward. Someone kept the recording safe, but not everyone knew.'
  }
};
export const CLUES: Readonly<Record<Fragment, { title: string; evidence: string }>> = {
  departure: { title: '01 — Dispatch', evidence: 'The household message left the district before the storm.' },
  shelter: { title: '02 — Refuge', evidence: 'A copy was received at the shelter while the hall was still active.' },
  silence: { title: '03 — Silence', evidence: 'Only later did the public listening hall go dark.' }
};
export const WITNESS_ORDER: readonly Witness[] = ['caretaker','courier','apprentice'];
export const FRAGMENTS: readonly Fragment[] = ['departure','shelter','silence'];
export const SOLUTION: readonly Fragment[] = ['departure','shelter','silence'];
export const INITIAL: State = {
  phase:'hear',heard:[],order:[],attempts:0,trust:2,choice:null,lastError:null
};
const validOrder=(order:readonly Fragment[]) =>
  order.length<=3 && order.every((f,i)=>FRAGMENTS.includes(f)&&order.indexOf(f)===i);

export function transition(state:State,event:Event):State {
  if(state.phase==='complete') return state;
  switch(event.type) {
    case 'HEAR': {
      if(state.phase!=='hear'||!WITNESS_ORDER.includes(event.witness)||state.heard.includes(event.witness))return state;
      const heard=[...state.heard,event.witness];
      return {...state,heard,phase:heard.length===3?'reconstruct':'hear',lastError:null};
    }
    case 'ARRANGE':
      if(state.phase!=='reconstruct'||!validOrder(event.order))return state;
      return {...state,order:[...event.order],lastError:null};
    case 'SUBMIT':
      if(state.phase!=='reconstruct'||state.order.length!==3)return state;
      if(SOLUTION.every((f,i)=>state.order[i]===f))
        return {...state,phase:'decide',lastError:null};
      return {...state,attempts:state.attempts+1,trust:Math.max(0,state.trust-1),
        lastError:'That order contradicts the witnesses. Reconsider what happened before the hall went silent.'};
    case 'CHOOSE':
      if(state.phase!=='decide'||(event.choice!=='protect'&&event.choice!=='disclose'))return state;
      return {...state,phase:'complete',choice:event.choice,lastError:null};
  }
}

export const validEvent=(v:unknown):v is Event=>{
  if(!v||typeof v!=='object')return false;
  const e=v as Record<string,unknown>;
  if(e.type==='HEAR')return WITNESS_ORDER.includes(e.witness as Witness);
  if(e.type==='ARRANGE')return Array.isArray(e.order)&&validOrder(e.order as Fragment[]);
  if(e.type==='SUBMIT')return true;
  if(e.type==='CHOOSE')return e.choice==='protect'||e.choice==='disclose';
  return false;
};

export function replay(raw:unknown):State {
  if(!Array.isArray(raw)||raw.length>100)return INITIAL;
  let state:State=INITIAL;
  for(const item of raw){
    if(!validEvent(item))return INITIAL;
    state=transition(state,item);
  }
  return state;
}
