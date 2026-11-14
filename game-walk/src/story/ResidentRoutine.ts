/** Authored repeatable civilian schedules. Pure functions enable deterministic testing
 * and scene-level pause/recovery without relying on Phaser or randomness.
 * Positions are temporary blockout coordinates (not final environment geography).
 */
import type { ResidentId } from './SettlementEncounter';

export interface RoutineKeyframe {
  time: number;
  x: number;
  action: 'walk' | 'work' | 'talk' | 'rest';
}
export interface RoutinePose {
  x: number;
  action: RoutineKeyframe['action'];
  facing: -1 | 1;
}

export const RESIDENT_ROUTINES: Readonly<Record<ResidentId, readonly RoutineKeyframe[]>> = {
  caretaker: [
    { time: 0, x: 130, action: 'rest' },
    { time: 3, x: 130, action: 'walk' },
    { time: 7, x: 155, action: 'work' },
    { time: 15, x: 155, action: 'walk' },
    { time: 19, x: 130, action: 'rest' },
    { time: 25, x: 130, action: 'rest' },
  ],
  repairer: [
    { time: 0, x: 385, action: 'work' },
    { time: 8, x: 385, action: 'walk' },
    { time: 12, x: 418, action: 'work' },
    { time: 20, x: 418, action: 'walk' },
    { time: 24, x: 385, action: 'rest' },
    { time: 30, x: 385, action: 'work' },
  ],
  market_resident: [
    { time: 0, x: 275, action: 'work' },
    { time: 5, x: 275, action: 'walk' },
    { time: 10, x: 326, action: 'talk' },
    { time: 15, x: 326, action: 'walk' },
    { time: 20, x: 275, action: 'work' },
    { time: 28, x: 275, action: 'work' },
  ],
};
export function residentPose(id: ResidentId, elapsedSeconds: number, frozen = false): RoutinePose {
  const frames = RESIDENT_ROUTINES[id];
  if (frozen) return { x: frames[0].x, action: 'talk', facing: 1 };
  const period = frames[frames.length - 1].time;
  const t = Number.isFinite(elapsedSeconds) ? Math.max(0, elapsedSeconds) % period : 0;
  let i = 0;
  while (i + 1 < frames.length && frames[i + 1].time <= t) i++;
  const current = frames[i];
  const next = frames[Math.min(i + 1, frames.length - 1)];
  const moving = current.action === 'walk' && next.time > current.time;
  const u = moving ? (t - current.time) / (next.time - current.time) : 0;
  return {
    x: current.x + (next.x - current.x) * u,
    action: current.action,
    facing: next.x < current.x ? -1 : 1,
  };
}
