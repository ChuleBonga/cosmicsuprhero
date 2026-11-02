export type MemoryId = 'first_contact' | 'xaba' | 'mama_calls_me_chule' | 'songs_sent_to_god';
export interface SaveData {
  version: 2;
  distance: number;
  discovered: MemoryId[];
  muted: boolean;
  stage: 'prologue' | 'name' | 'campfire';
  nameCalls: number;
}
const KEY = 'arcturian.build1.preview.v2';
const EMPTY: SaveData = { version: 2, distance: 0, discovered: [], muted: false, stage: 'prologue', nameCalls: 0 };
const IDS: MemoryId[] = ['first_contact','xaba','mama_calls_me_chule','songs_sent_to_god'];
export class ProgressManager {
  private state: SaveData = { ...EMPTY, discovered: [] };
  constructor() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Partial<SaveData>;
      if (d.version !== 2) return;
      this.state = {
        version: 2, distance: Math.max(0, Math.min(120000, Number(d.distance) || 0)),
        discovered: Array.isArray(d.discovered) ? d.discovered.filter((id): id is MemoryId => IDS.includes(id as MemoryId)) : [],
        muted: d.muted === true,
        stage: d.stage === 'campfire' || d.stage === 'name' ? d.stage : 'prologue',
        nameCalls: Math.min(3, Math.max(0, Number(d.nameCalls) || 0)),
      };
    } catch { /* Storage can be unavailable; play remains possible. */ }
  }
  get distance(){ return this.state.distance; }
  get muted(){ return this.state.muted; }
  get stage(){ return this.state.stage; }
  get nameCalls(){ return this.state.nameCalls; }
  has(id: MemoryId){ return this.state.discovered.includes(id); }
  setDistance(v: number){ this.state.distance = Math.max(this.state.distance, Math.max(0, v)); }
  setStage(stage: SaveData['stage']){ this.state.stage = stage; this.save(); }
  setNameCalls(v: number){ this.state.nameCalls = Math.max(this.state.nameCalls, Math.min(3, v)); this.save(); }
  discover(id: MemoryId){ if (this.has(id)) return false; this.state.discovered.push(id); this.save(); return true; }
  setMuted(v: boolean){ this.state.muted = v; this.save(); }
  reset(){ this.state = { ...EMPTY, discovered: [] }; this.save(); }
  save(){ try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch { /* memory-only progress */ } }
}
