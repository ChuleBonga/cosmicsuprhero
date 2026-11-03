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
const portrait=innerHeight>innerWidth;
// Responsive logical camera with integer scaling: an iPhone viewport
// becomes a native 195×422 scene at 2×, not a 270×480 island in empty space.
// All sprites remain exactly one native art pixel per logical canvas pixel.
const integerScale=portrait?2:Math.max(2,Math.round(innerWidth/480));
const W=Math.max(160,Math.floor(innerWidth/integerScale));
const H=Math.max(190,Math.floor(innerHeight/integerScale));

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    this.load.spritesheet('alien','/art/protagonist_atlas.png',{frameWidth:32,frameHeight:52});
    this.load.spritesheet('keeper','/art/keeper_atlas.png',{frameWidth:64,frameHeight:92});
    this.load.image('far-tile','/art/far_tile.png');
    this.load.image('middle-tile','/art/middle_tile.png');
    this.load.image('near-tile','/art/near_tile.png');
  }
  create() {
    this.anims.create({key:'alien-idle',frames:this.anims.generateFrameNumbers('alien',{start:0,end:3}),frameRate:4,repeat:-1});
    this.anims.create({key:'alien-walk',frames:this.anims.generateFrameNumbers('alien',{start:4,end:11}),frameRate:12,repeat:-1});
    this.anims.create({key:'keeper-idle',frames:this.anims.generateFrameNumbers('keeper',{start:0,end:1}),frameRate:1,repeat:-1});
    this.registry.set('app',app);this.scene.start('Title');
  }
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
  const factor=integerScale;
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
