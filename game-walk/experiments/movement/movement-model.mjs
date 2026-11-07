/**
 * Arcturian Awakening: isolated fixed-step locomotion experiment.
 * No Phaser changes, no asset dependencies, and no claims of final physics.
 * Coordinates: positive X right, positive Y down, character position at feet.
 */
export const MOTION = Object.freeze({
  hz: 60,
  maxSpeed: 165,       // logical pixels / second: TUNING CANDIDATE
  groundAccel: 330,
  airAccel: 155,
  brake: 440,
  gravity: 650,
  jumpImpulse: 240,
  terminalFall: 580,
  maxWalkableSlopeDeg: 34,
  groundSnap: 8,
  coyoteSeconds: 0.10,
  jumpBufferSeconds: 0.12,
});

export function createState(x, groundFn) {
  const floor = groundFn(x);
  return {
    x, y: floor?.y ?? 0, vx: 0, vy: 0,
    grounded: floor !== null,
    coyote: 0, jumpBuffer: 0,
    facing: 1, travelled: 0,
    groundNormal: floor?.normal ?? { x: 0, y: -1 },
    phase: 'idle'
  };
}

const approach = (value, target, amount) =>
  value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);

function surfaceSlopeDegrees(a, b) {
  if (!a || !b) return 0;
  return Math.abs(Math.atan2(b.y - a.y, b.x - a.x)) * 180 / Math.PI;
}

export function stepMotion(state, input, groundFn, dt = 1 / MOTION.hz) {
  if (!(dt > 0 && dt <= 1 / 30)) throw new RangeError('Fixed step required (<= 1/30 s)');
  const s = { ...state };
  const axis = Math.max(-1, Math.min(1, Math.sign(input.axis || 0)));
  if (input.jumpPressed) s.jumpBuffer = MOTION.jumpBufferSeconds;
  else s.jumpBuffer = Math.max(0, s.jumpBuffer - dt);

  if (s.grounded) s.coyote = MOTION.coyoteSeconds;
  else s.coyote = Math.max(0, s.coyote - dt);

  const accel = axis ? (s.grounded ? MOTION.groundAccel : MOTION.airAccel) : MOTION.brake;
  s.vx = approach(s.vx, axis * MOTION.maxSpeed, accel * dt);
  if (Math.abs(s.vx) < 0.001) s.vx = 0;
  if (axis) s.facing = axis;

  if (s.jumpBuffer > 0 && s.coyote > 0) {
    s.vy = -MOTION.jumpImpulse;
    s.grounded = false;
    s.coyote = 0;
    s.jumpBuffer = 0;
  }

  const currentFloor = groundFn(s.x);
  let proposedX = s.x + s.vx * dt;
  let nextFloor = groundFn(proposedX);
  const slope = surfaceSlopeDegrees(currentFloor && { ...currentFloor, x: s.x },
    nextFloor && { ...nextFloor, x: proposedX });

  if (s.grounded && currentFloor && nextFloor && slope > MOTION.maxWalkableSlopeDeg) {
    // No invisible climbing: a steep surface blocks motion until a
    // proper collider-based stepping/climbing system is implemented.
    proposedX = s.x;
    s.vx = 0;
    nextFloor = currentFloor;
  }
  s.travelled += Math.abs(proposedX - s.x);
  s.x = proposedX;

  if (s.grounded && nextFloor && nextFloor.y - s.y <= MOTION.groundSnap) {
    s.y = nextFloor.y;
    s.vy = 0;
  } else {
    s.grounded = false;
    const oldY = s.y;
    s.vy = Math.min(MOTION.terminalFall, s.vy + MOTION.gravity * dt);
    s.y += s.vy * dt;
    if (nextFloor && s.vy >= 0 && oldY <= nextFloor.y && s.y >= nextFloor.y) {
      s.y = nextFloor.y;
      s.vy = 0;
      s.grounded = true;
    }
  }

  s.groundNormal = s.grounded && nextFloor
    ? nextFloor.normal ?? { x: 0, y: -1 }
    : { x: 0, y: -1 };
  s.phase = !s.grounded ? (s.vy < 0 ? 'rise' : 'fall')
    : Math.abs(s.vx) < 2 ? 'idle'
    : Math.sign(s.vx) === s.facing ? 'walk' : 'brake';
  return s;
}

/**
 * Renderer FPS is decoupled from the fixed simulation step.
 * Inputs are sampled at simulation-time boundaries, not variable render frames.
 */
export function simulate({ fps, seconds, state, groundFn, inputAt }) {
  let accumulator = 0;
  let simTime = 0;
  let current = { ...state };
  const frameCount = Math.round(fps * seconds);
  for (let frame = 0; frame < frameCount; frame++) {
    accumulator += 1 / fps;
    while (accumulator + 1e-12 >= 1 / MOTION.hz) {
      current = stepMotion(current, inputAt(simTime), groundFn);
      accumulator -= 1 / MOTION.hz;
      simTime += 1 / MOTION.hz;
    }
  }
  return { ...current, simulationSeconds: simTime };
}
