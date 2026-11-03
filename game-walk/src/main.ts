import Phaser from 'phaser';
import { AudioDirector } from './audio/AudioDirector';
import { ProgressManager } from './progress/ProgressManager';
import { TitleScene } from './scenes/TitleScene';
import { PrologueScene } from './scenes/WalkScene';
import { MeditateScene } from './scenes/MeditateScene';
import { CrossingScene } from './scenes/CrossingScene';
import { CredoScene } from './scenes/CredoScene';
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

// Exactly one authored 16:9 scene composition. Only its outer frame scales.
// The previous viewport-derived logical dimensions distorted the title.
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 270;

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    this.load.spritesheet('alien','/play/art/protagonist_atlas.png',{frameWidth:32,frameHeight:52});
    this.load.spritesheet('keeper','/play/art/keeper_atlas.png',{frameWidth:64,frameHeight:92});
    this.load.image('far-tile','/play/art/far_tile.png');
    this.load.image('middle-tile','/play/art/middle_tile.png');
    this.load.image('near-tile','/play/art/near_tile.png');
  }
  create() {
    this.anims.create({key:'alien-idle',frames:this.anims.generateFrameNumbers('alien',{start:0,end:3}),frameRate:4,repeat:-1});
    this.anims.create({key:'alien-walk',frames:this.anims.generateFrameNumbers('alien',{start:4,end:11}),frameRate:12,repeat:-1});
    this.anims.create({key:'keeper-idle',frames:this.anims.generateFrameNumbers('keeper',{start:0,end:1}),frameRate:1,repeat:-1});
    this.registry.set('app',app);this.scene.start('Title');
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO, parent: 'game',
  width: GAME_WIDTH, height: GAME_HEIGHT,
  backgroundColor: '#06132d',
  render: { pixelArt: true, antialias: false, roundPixels: true, transparent: false },
  scale: { mode: Phaser.Scale.NONE },
  fps: { target: 60, min: 30 },
  input: { activePointers: 3 },
  scene: [BootScene, TitleScene, MeditateScene, CrossingScene, PrologueScene, CredoScene, PauseUIScene, SliceCompleteScene]
});

const frame = document.getElementById('cinema-frame');
const stage = document.getElementById('cinema-stage');

function resizeFrame(): void {
  if (!stage || !frame) return;
  const stageStyle = getComputedStyle(stage);
  const paddingX = parseFloat(stageStyle.paddingLeft) + parseFloat(stageStyle.paddingRight);
  const paddingY = parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom);
  const maxWidth = Math.max(1,stage.clientWidth - paddingX - 2);
  const maxHeight = Math.max(1,stage.clientHeight - paddingY - 2);
  const ratio = GAME_WIDTH / GAME_HEIGHT;
  const physicalWidth = Math.max(1,Math.floor(Math.min(maxWidth,maxHeight*ratio)));
  const physicalHeight = physicalWidth / ratio;
  frame.style.width = `${physicalWidth}px`;
  frame.style.height = `${physicalHeight}px`;
  const canvas = document.querySelector<HTMLCanvasElement>('#game canvas');
  if (canvas) {
    canvas.style.width = `${physicalWidth}px`;
    canvas.style.height = `${physicalHeight}px`;
  }
}
resizeFrame();
requestAnimationFrame(resizeFrame);
game.events.once(Phaser.Core.Events.READY, resizeFrame);
window.addEventListener('resize', resizeFrame);
window.visualViewport?.addEventListener('resize', resizeFrame);
if (stage && typeof ResizeObserver !== 'undefined') new ResizeObserver(resizeFrame).observe(stage);

window.addEventListener('pagehide', () => { progress.save(); audio.pause(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { progress.save(); audio.pause(); game.loop.sleep(); }
  else { game.loop.wake(); }
});
