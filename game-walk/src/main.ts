import Phaser from 'phaser';
import { AudioDirector } from './audio/AudioDirector';
import { ProgressManager } from './progress/ProgressManager';
import { TitleScene } from './scenes/TitleScene';
import { PrologueScene, EncounterNameScene } from './scenes/WalkScene';
import { PauseUIScene } from './scenes/PauseUIScene';
import { SliceCompleteScene } from './scenes/SliceCompleteScene';
import './style.css';

export interface GameContext { audio: AudioDirector; progress: ProgressManager }
const progress = new ProgressManager();
const audio = new AudioDirector(message => {
  const status = document.querySelector('#dom-status');
  if (status) status.textContent = message;
});
const app: GameContext = { audio, progress };
const portrait = innerHeight > innerWidth;
const W = portrait ? 270 : 480;
const H = portrait ? 480 : 270;

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  create() { this.registry.set('app', app); this.scene.start('Title'); }
}

const game = new Phaser.Game({
  type: Phaser.AUTO, parent: 'game', width: W, height: H,
  backgroundColor: '#101c3c',
  render: { pixelArt: true, antialias: false, roundPixels: true, transparent: false },
  scale: { mode: Phaser.Scale.NONE },
  fps: { target: 60, min: 30 },
  input: { activePointers: 3 },
  scene: [BootScene, TitleScene, PrologueScene, EncounterNameScene, PauseUIScene, SliceCompleteScene]
});
// Whole-number CSS scaling: no fractional pixel scaling.
function resize() {
  const factor = Math.max(1, Math.floor(Math.min(innerWidth / W, innerHeight / H)));
  const canvas = document.querySelector('#game canvas') as HTMLCanvasElement | null;
  if (canvas) {
    canvas.style.width = String(W * factor) + 'px';
    canvas.style.height = String(H * factor) + 'px';
  }
}
resize();
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => location.reload());
game.events.once(Phaser.Core.Events.READY, resize);
window.addEventListener('pagehide', () => { progress.save(); audio.pause(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { progress.save(); audio.pause(); game.loop.sleep(); }
  else { game.loop.wake(); }
});
