import assert from 'node:assert/strict';
import { residentPose, RESIDENT_ROUTINES } from '../src/story/ResidentRoutine.ts';

for (const [resident, frames] of Object.entries(RESIDENT_ROUTINES)) {
  assert.ok(frames.length >= 3);
  assert.equal(frames[0].time, 0);
  for (let i = 1; i < frames.length; i++) assert.ok(frames[i].time > frames[i - 1].time);
  const period = frames.at(-1).time;
  for (const t of [0, 1, 6.3, 19, 26.1, 99.2]) {
    assert.deepEqual(residentPose(resident, t), residentPose(resident, t + period),
      `${resident} route should loop without drifting`);
    const pose = residentPose(resident, t);
    assert.ok(Number.isFinite(pose.x) && pose.x >= 0 && pose.x <= 570);
  }
  assert.equal(residentPose(resident, Infinity).x, frames[0].x,
    'invalid frame times do not corrupt position');
}
assert.ok(residentPose('market_resident', 8).x > 275,
  'market worker actually crosses between stations');
assert.equal(residentPose('repairer', 0).action, 'work');
assert.equal(residentPose('caretaker', 0, true).action, 'talk');
console.log('Resident routine checks passed.');
