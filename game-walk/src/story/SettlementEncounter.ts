/** Deterministic narrative model for a proposed inhabited-settlement encounter.
 * No Phaser dependency; prose, NPC names and visual content require approval.
 * Kept separate from v3 JourneyMachine so existing saves keep their meaning.
 */
export type ResponseTone = 'family' | 'community' | 'listen';
export type ResidentId = 'caretaker' | 'repairer' | 'market_resident';
export type SettlementEvent =
  | { type: 'MEET_RESIDENT'; resident: ResidentId }
  | { type: 'RESPOND'; tone: ResponseTone }
  | { type: 'START_REPAIR' }
  | { type: 'ADJUST_FIXTURE' }
  | { type: 'COMPLETE_REPAIR' }
  | { type: 'ACKNOWLEDGE_REPAIR' }
  | { type: 'RESET' };

export interface SettlementState {
  version: 1;
  met: ResidentId[];
  responseTone: ResponseTone | null;
  repairStarted: boolean;
  repairSteps: number;
  repairCompleted: boolean;
  residentsReacted: boolean;
  credoLeadUnlocked: boolean;
}

export const NEW_SETTLEMENT: Readonly<SettlementState> = Object.freeze({
  version: 1,
  met: [],
  responseTone: null,
  repairStarted: false,
  repairSteps: 0,
  repairCompleted: false,
  residentsReacted: false,
  credoLeadUnlocked: false,
});

export function settlementTransition(state: SettlementState, event: SettlementEvent): SettlementState {
  switch (event.type) {
    case 'RESET':
      return { ...NEW_SETTLEMENT, met: [] };
    case 'MEET_RESIDENT':
      return state.met.includes(event.resident) ? state :
        { ...state, met: [...state.met, event.resident] };
    case 'RESPOND':
      if (!state.met.includes('caretaker') || state.responseTone !== null) return state;
      return { ...state, responseTone: event.tone };
    case 'START_REPAIR':
      if (!state.met.includes('repairer') || state.responseTone === null || state.repairStarted)
        return state;
      return { ...state, repairStarted: true, repairSteps: 0 };
    case 'ADJUST_FIXTURE':
      if (!state.repairStarted || state.repairCompleted) return state;
      return { ...state, repairSteps: Math.min(3, state.repairSteps + 1) };
    case 'COMPLETE_REPAIR':
      if (!state.repairStarted || state.repairSteps < 3 || state.repairCompleted) return state;
      return { ...state, repairCompleted: true };
    case 'ACKNOWLEDGE_REPAIR':
      if (!state.repairCompleted || !state.met.includes('caretaker') || state.residentsReacted)
        return state;
      return { ...state, residentsReacted: true, credoLeadUnlocked: true };
  }
}
const RESIDENT_IDS: readonly ResidentId[] = ['caretaker', 'repairer', 'market_resident'];
const TONES: readonly ResponseTone[] = ['family', 'community', 'listen'];
/** Defensive restore: never infer quest completion from untrusted local storage. */
export function restoreSettlement(raw: unknown): SettlementState {
  if (!raw || typeof raw !== 'object') return { ...NEW_SETTLEMENT, met: [] };
  const v = raw as Partial<SettlementState>;
  if (v.version !== 1) return { ...NEW_SETTLEMENT, met: [] };
  const met: ResidentId[] = Array.isArray(v.met) ?
    [...new Set(v.met.filter((x): x is ResidentId => RESIDENT_IDS.includes(x)))] : [];
  const responseTone = v.responseTone && TONES.includes(v.responseTone) && met.includes('caretaker')
    ? v.responseTone : null;
  const repairStarted = responseTone !== null && met.includes('repairer') && v.repairStarted === true;
  const repairSteps = repairStarted && Number.isInteger(v.repairSteps)
    ? Math.min(3, Math.max(0, v.repairSteps!)) : 0;
  const repairCompleted = repairStarted && repairSteps === 3 && v.repairCompleted === true;
  const residentsReacted = repairCompleted && met.includes('caretaker') && v.residentsReacted === true;
  return {
    version: 1, met, responseTone, repairStarted, repairSteps, repairCompleted, residentsReacted,
    credoLeadUnlocked: residentsReacted,
  };
}
