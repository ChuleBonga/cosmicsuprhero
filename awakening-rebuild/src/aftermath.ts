import type { State, Witness } from './encounter';

/** Tested consequence data is independent of the rendering engine.
 * It is provisional story design, not approved album canon.
 */
export type Location = 'hall' | 'workshop' | 'refuge';
export interface Consequence {
  witness: Witness;
  available: boolean;
  response: string;
  access: readonly Location[];
}
export function consequence(state: State, witness: Witness): Consequence {
  if (state.phase !== 'complete') return {witness,available:false,response:'Conclude the investigation first.',access:[]};
  const choice=state.choice;
  const trusted=state.trust>0;
  if (witness==='caretaker') {
    if (choice==='protect') return {
      witness,available:true,
      response:trusted
        ? 'Caretaker: You protected our confidence. I will introduce you to Credo.'
        : 'Caretaker: You kept the recording private, but you have not earned my recommendation.',
      access: trusted ? ['hall'] : []
    };
    return {
      witness, available:trusted,
      response:trusted
        ? 'Caretaker: You told the district. I will speak with you, but I cannot endorse that decision.'
        : 'Caretaker is keeping her distance. The people no longer treat your account as reliable.',
      access:[]
    };
  }
  if(witness==='courier') {
    return choice==='disclose'
      ? {witness,available:true,response:'Courier: The refuge is open to you now. People are asking where the record came from.',access:['refuge']}
      : {witness,available:true,response:'Courier: We will keep the refuge route private while families decide.',access:[]};
  }
  return {
    witness,available:true,
    response:choice==='protect'
      ? 'Apprentice: If the record stays private, I will keep repairing the workshop equipment.'
      : 'Apprentice: Now that everyone knows, the workshop has become a public listening point.',
    access:['workshop']
  };
}
export function availableLocations(state: State): Location[] {
  if(state.phase!=='complete')return [];
  const all=(['caretaker','courier','apprentice'] as Witness[]).flatMap(w=>consequence(state,w).access);
  return [...new Set(all)];
}
