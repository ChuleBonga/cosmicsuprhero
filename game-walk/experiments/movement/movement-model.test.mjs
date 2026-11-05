import assert from 'node:assert/strict';
import { createState, stepMotion, simulate, MOTION } from './movement-model.mjs';

const flat = (_x) => ({ y: 100, normal: { x: 0, y: -1 } });
const slope = (x) => {
  const y = x < 50 ? 100 : x <= 250 ? 100 - (x - 50) * .10 : 80;
  const m = x > 50 && x <= 250 ? -.10 : 0;
  const len = Math.hypot(m, 1);
  return { y, normal: { x: m / len, y: -1 / len } };
};

function drive(fps, groundFn = flat) {
  return simulate({
    fps, seconds: 3, state: createState(0, groundFn), groundFn,
    inputAt: t => ({ axis: t < 1.5 ? 1 : t < 2 ? 0 : -1, jumpPressed: false })
  });
}

const run = (name, check) => { check(); console.log('PASS', name); };

run('Render rates 30/60/120 Hz produce same 60 Hz simulation result', () => {
  const a = drive(30), b = drive(60), c = drive(120);
  for (const key of ['x', 'y', 'vx', 'vy', 'travelled']) {
    assert.ok(Math.abs(a[key] - b[key]) < 1e-7, key + ': 30 vs 60');
    assert.ok(Math.abs(c[key] - b[key]) < 1e-7, key + ': 120 vs 60');
  }
});

run('Grounded feet follow a shallow slope', () => {
  let s = createState(40, slope);
  for(let i = 0; i < 120; i++) {
    s = stepMotion(s, { axis: 1 }, slope);
    assert.equal(s.grounded, true);
    assert.ok(Math.abs(s.y - slope(s.x).y) < .0001);
  }
});

run('Releasing directional input decelerates without reversing', () => {
  let s = createState(0, flat);
  for(let i=0;i<50;i++) s=stepMotion(s,{axis:1},flat);
  const peak=s.vx;
  for(let i=0;i<60;i++) s=stepMotion(s,{axis:0},flat);
  assert.ok(peak > 0);
  assert.equal(s.vx, 0);
  assert.equal(s.phase, 'idle');
});

run('Jump produces an arc and lands on the floor', () => {
  let s = createState(0, flat);
  s=stepMotion(s,{axis:0,jumpPressed:true},flat);
  assert.equal(s.grounded, false);
  let apex=s.y;
  for(let i=0;i<120;i++){s=stepMotion(s,{axis:0},flat);apex=Math.min(apex,s.y);}
  assert.ok(apex<90);
  assert.equal(s.grounded,true);
  assert.ok(Math.abs(s.y-100)<.00001);
});

run('Vertical drop leaves the character airborne', () => {
  const ledge = (x) => x <= 40 ? { y:100,normal:{x:0,y:-1} } : null;
  let s=createState(32,ledge);
  for(let i=0;i<55;i++)s=stepMotion(s,{axis:1},ledge);
  assert.equal(s.grounded,false);
});

console.log('5 isolated motion tests passed. Not integrated with Phaser.');
