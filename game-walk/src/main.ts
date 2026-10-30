import Phaser from 'phaser';
import {AudioDirector} from './audio/AudioDirector';
import {ProgressManager} from './progress/ProgressManager';
import {TitleScene} from './scenes/TitleScene';
import {PrologueScene,EncounterNameScene} from './scenes/WalkScene';
import {PauseUIScene} from './scenes/PauseUIScene';
export interface GameContext {audio:AudioDirector;progress:ProgressManager}
const progress=new ProgressManager();
const audio=new AudioDirector(message=>{const status=document.querySelector('#dom-status');if(status)status.textContent=message});
const app:GameContext={audio,progress};
class BootScene extends Phaser.Scene{
  constructor(){super('Boot')}
  preload(){
    this.load.image('cover-figure','/art/aa_cover_figure.webp');
    this.load.image('mountain-repeat','/art/aa_mountain_repeat.webp');
  }
  create(){this.registry.set('app',app);this.scene.start('Title')}
}
const game=new Phaser.Game({
  type:Phaser.AUTO,parent:'game',backgroundColor:'#f5f1e7',
  width:Math.min(window.innerWidth,1400),height:window.innerHeight,
  render:{pixelArt:false,antialias:true,transparent:false},
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
  fps:{target:60,min:30,forceSetTimeOut:false},input:{activePointers:3},
  scene:[BootScene,TitleScene,PrologueScene,EncounterNameScene,PauseUIScene]
});
window.addEventListener('pagehide',()=>{progress.save();audio.pause()});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){audio.pause();game.loop.sleep()}
  else game.loop.wake();
});
