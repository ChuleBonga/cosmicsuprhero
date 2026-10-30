import Phaser from 'phaser';
import {AudioDirector} from './audio/AudioDirector';
import {ProgressManager} from './progress/ProgressManager';
import {TitleScene} from './scenes/TitleScene';
import {WalkScene} from './scenes/WalkScene';
export interface GameContext{audio:AudioDirector;progress:ProgressManager}
const progress=new ProgressManager();const audio=new AudioDirector(message=>{const status=document.querySelector('#dom-status');if(status)status.textContent=message});const app:GameContext={audio,progress};
class BootScene extends Phaser.Scene{constructor(){super('Boot')}preload(){this.load.image('album-poster','/art/aa_album_poster.webp')}create(){this.registry.set('app',app);this.scene.start('Title')}}
const game=new Phaser.Game({type:Phaser.AUTO,parent:'game',backgroundColor:'#f5f1e7',width:window.innerWidth,height:window.innerHeight,render:{pixelArt:false,antialias:true,transparent:false},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},fps:{target:60,min:30,forceSetTimeOut:false},input:{activePointers:2},scene:[BootScene,TitleScene,WalkScene]});

window.addEventListener('pagehide',()=>{progress.save();audio.pause()});window.addEventListener('pageshow',()=>{if(game.scene.isActive('Walk'))audio.resume()});
